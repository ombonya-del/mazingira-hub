-- Coalition calendar events (hub "What's coming up"): members add via the hub;
-- admins manage in the console. Uses a DEDICATED table name (calendar_events) to
-- avoid clashing with the pre-existing raia `events` table in migrations/0001_init.sql.
-- Requires is_admin() (from fix-admin-rls.sql). Run once in Supabase -> SQL Editor. Safe to re-run.

create table if not exists public.calendar_events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  start_date   date,
  time         text,           -- free text, e.g. "10:00" or "10am–1pm"
  location     text,
  mode         text,           -- In person / Virtual / Hybrid
  description  text,
  org          text,           -- organiser
  link         text,           -- registration / info URL
  published    boolean not null default true,
  created_by   uuid default auth.uid() references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists calendar_events_start_idx on public.calendar_events(start_date);

alter table public.calendar_events enable row level security;

-- members read published events + add new ones
drop policy if exists calevents_member_read   on public.calendar_events;
drop policy if exists calevents_member_insert on public.calendar_events;
drop policy if exists calevents_admin_all     on public.calendar_events;
create policy calevents_member_read   on public.calendar_events for select to authenticated using (published = true);
create policy calevents_member_insert on public.calendar_events for insert to authenticated with check (published = true);
-- admins read everything + edit / delete
create policy calevents_admin_all on public.calendar_events for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select, insert, update, delete on public.calendar_events to authenticated;
