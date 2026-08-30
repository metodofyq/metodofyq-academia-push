-- ============================================================
-- Panel de administración: permitir que teacher/admin gestionen
-- perfiles de alumnos (grupo, ccaa, nombre, rol)
-- ============================================================

create policy "profiles_update_teacher" on public.profiles
  for update using (public.get_user_role() in ('teacher', 'admin'));

-- ============================================================
-- email_verified_at — espejo de auth.users.email_confirmed_at
-- Permite mostrar "Pendiente"/"Activo" en la tabla de alumnos sin
-- llamar a la Admin API en cada render.
-- ============================================================
alter table public.profiles add column if not exists email_verified_at timestamptz;

create or replace function public.handle_email_verified()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is distinct from old.email_confirmed_at then
    update public.profiles set email_verified_at = new.email_confirmed_at where id = new.id;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_email_confirmed
  after update on auth.users
  for each row execute procedure public.handle_email_verified();

-- Backfill para usuarios ya existentes
update public.profiles p
set email_verified_at = u.email_confirmed_at
from auth.users u
where p.id = u.id and p.email_verified_at is null;
