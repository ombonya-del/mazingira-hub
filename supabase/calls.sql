-- MazingiraKenya — virtual space (scheduled video calls)
-- Members (authenticated) schedule calls in the hub; every member sees the
-- upcoming list with a join link. This is internal coordination — NOT public,
-- so both read and insert are limited to authenticated users.
-- Run this once in the Supabase SQL editor.

create table if not exists public.calls (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  start_at      timestamptz not null,
  duration_min  integer not null default 60,
  host          text,
  note          text,
  room          text not null,               -- Jitsi room slug
  created_by    uuid default auth.uid() references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);
create index if not exists calls_start_idx on public.calls(start_at);

alter table public.calls enable row level security;

-- members read the upcoming calls; members schedule them. Nothing here is public.
drop policy if exists calls_read   on public.calls;
drop policy if exists calls_insert on public.calls;
create policy calls_read   on public.calls
  for select to authenticated using (true);
create policy calls_insert on public.calls
  for insert to authenticated with check (true);
