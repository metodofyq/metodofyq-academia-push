-- ============================================================
-- MEDALLAS — otorgadas manualmente por el equipo docente
-- ============================================================
create table public.medallas (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid references public.profiles(id) on delete cascade not null,
  nombre        text not null,
  emoji         text not null default '🏅',
  otorgada_por  uuid references public.profiles(id) on delete set null,
  created_at    timestamptz default now() not null
);

create index medallas_student_idx on public.medallas(student_id);

alter table public.medallas enable row level security;

create policy "medallas_select_own" on public.medallas
  for select using (student_id = auth.uid());

create policy "medallas_select_teacher" on public.medallas
  for select using (public.get_user_role() in ('teacher', 'admin'));

create policy "medallas_write_teacher" on public.medallas
  for all using (public.get_user_role() in ('teacher', 'admin'));
