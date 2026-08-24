-- ============================================================
-- Extensión de esquema: subniveles 0/0.5/1/2/2.5/3/4 (Tema 19 y siguientes)
-- ============================================================

-- ─── PROFILES: ccaa + grupo (Nivel 4 solo visible para grupo 2) ─────────────
alter table public.profiles add column if not exists ccaa text;
alter table public.profiles add column if not exists grupo smallint check (grupo in (1, 2));

-- ─── TOPIC_LEVELS: level admite decimales (0, 0.5, 1, 2, 2.5, 3, 4) ─────────
alter table public.topic_levels drop constraint if exists topic_levels_level_check;
alter table public.topic_levels alter column level type numeric(3,1) using level::numeric(3,1);
alter table public.topic_levels add constraint topic_levels_level_check check (level >= 0 and level <= 4);
alter table public.topic_levels add column if not exists content_json jsonb;

-- ─── EXERCISES / TOPIC_PROGRESS: mismo cambio de tipo por consistencia ──────
alter table public.exercises drop constraint if exists exercises_level_check;
alter table public.exercises alter column level type numeric(3,1) using level::numeric(3,1);
alter table public.exercises add constraint exercises_level_check check (level >= 0 and level <= 4);

alter table public.topic_progress alter column current_level type numeric(3,1) using current_level::numeric(3,1);

-- ============================================================
-- NIVEL 0.5 — Infografías (galería de imágenes por tema)
-- ============================================================
create table public.topic_infografias (
  id            uuid primary key default gen_random_uuid(),
  topic_id      uuid references public.topics(id) on delete cascade not null,
  label         text,
  storage_path  text not null,        -- ruta dentro del bucket 'topic-media'
  order_index   integer not null default 0,
  created_at    timestamptz default now() not null,
  unique (topic_id, order_index)
);

-- ============================================================
-- NIVEL 3 — Figuras intercaladas por ancla de texto
-- ============================================================
create table public.topic_n3_images (
  id            uuid primary key default gen_random_uuid(),
  topic_id      uuid references public.topics(id) on delete cascade not null,
  anchor_text   text not null,        -- fragmento del texto tras el cual se inserta la imagen
  caption       text,
  dibujar_hint  text,                 -- instrucción de qué dibujar el día del examen
  storage_path  text not null,
  order_index   integer not null default 0,
  created_at    timestamptz default now() not null,
  unique (topic_id, order_index)
);

-- ============================================================
-- NIVEL 4 — Legislación específica por CCAA (solo grupo 2)
-- ============================================================
create table public.topic_level4_legislacion (
  id            uuid primary key default gen_random_uuid(),
  topic_id      uuid references public.topics(id) on delete cascade not null,
  ccaa          text not null,
  content_md    text,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  unique (topic_id, ccaa)
);

create trigger topic_level4_legislacion_updated_at
  before update on public.topic_level4_legislacion
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- RÚBRICAS PARAMETRIZADAS POR CCAA (estructura; pesos pendientes)
-- ============================================================
create table public.topic_rubricas (
  id            uuid primary key default gen_random_uuid(),
  topic_id      uuid references public.topics(id) on delete cascade not null,
  ccaa          text not null,
  criterios     jsonb,
  pesos         jsonb,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  unique (topic_id, ccaa)
);

create trigger topic_rubricas_updated_at
  before update on public.topic_rubricas
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- LEVEL_ATTEMPTS — finalización de subniveles interactivos
-- (distinto de exercise_attempts, que es por pregunta suelta)
-- ============================================================
create table public.level_attempts (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid references public.profiles(id) on delete cascade not null,
  topic_id      uuid references public.topics(id) on delete cascade not null,
  level         numeric(3,1) not null check (level >= 0 and level <= 4),
  score_pct     integer not null default 100 check (score_pct between 0 and 100),
  completed_at  timestamptz default now() not null
);

create index level_attempts_student_idx on public.level_attempts(student_id);
create index level_attempts_topic_idx   on public.level_attempts(topic_id);

-- ============================================================
-- RLS
-- ============================================================
alter table public.topic_infografias        enable row level security;
alter table public.topic_n3_images          enable row level security;
alter table public.topic_level4_legislacion enable row level security;
alter table public.topic_rubricas           enable row level security;
alter table public.level_attempts           enable row level security;

create policy "topic_infografias_select_all" on public.topic_infografias
  for select using (true);
create policy "topic_infografias_write_teacher" on public.topic_infografias
  for all using (public.get_user_role() in ('teacher', 'admin'));

create policy "topic_n3_images_select_all" on public.topic_n3_images
  for select using (true);
create policy "topic_n3_images_write_teacher" on public.topic_n3_images
  for all using (public.get_user_role() in ('teacher', 'admin'));

-- Legislación: solo visible para el propio grupo 2 + su CCAA (o teacher/admin)
create policy "topic_level4_select_grupo2" on public.topic_level4_legislacion
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.grupo = 2 and p.ccaa = topic_level4_legislacion.ccaa
    )
    or public.get_user_role() in ('teacher', 'admin')
  );
create policy "topic_level4_write_teacher" on public.topic_level4_legislacion
  for all using (public.get_user_role() in ('teacher', 'admin'));

-- Rúbricas: uso interno (evaluación), no expuestas directamente al alumno
create policy "topic_rubricas_teacher" on public.topic_rubricas
  for all using (public.get_user_role() in ('teacher', 'admin'));

create policy "level_attempts_own" on public.level_attempts
  for all using (student_id = auth.uid());
create policy "level_attempts_teacher" on public.level_attempts
  for select using (public.get_user_role() in ('teacher', 'admin'));

-- ============================================================
-- STORAGE — bucket público de lectura para imágenes de temario
-- ============================================================
insert into storage.buckets (id, name, public) values
  ('topic-media', 'topic-media', true)
on conflict (id) do nothing;

create policy "topic_media_read" on storage.objects
  for select using (bucket_id = 'topic-media');

create policy "topic_media_write_teacher" on storage.objects
  for insert with check (
    bucket_id = 'topic-media'
    and auth.uid() is not null
    and public.get_user_role() in ('teacher', 'admin')
  );
