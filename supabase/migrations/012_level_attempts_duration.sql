-- Tiempo dedicado por intento de nivel — necesario para las métricas del
-- panel del profesor ("tiempo dedicado" por alumno).
alter table public.level_attempts add column if not exists duration_seconds integer;
