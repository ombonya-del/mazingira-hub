-- Partner directory with contact emails + focus tags, used to match opportunities to
-- the right organisations and email them. Contains contact emails, so it is ADMIN-ONLY
-- (never public, never member-readable). Requires is_admin() (from fix-admin-rls.sql).
-- Run once in Supabase -> SQL Editor. Safe to re-run.

create table if not exists public.partners (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,                       -- contact / info email
  focus      text,                       -- keywords for matching, e.g. "coal, land, gold, nuclear, water, legal, gender, youth, media"
  region     text,                       -- e.g. "Nyanza", "Lamu", "National"
  category   text,                       -- Community / Legal / Research / Funder / Coalition
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.partners enable row level security;

-- Admin-only: partner contacts are private.
drop policy if exists partners_admin_all on public.partners;
create policy partners_admin_all on public.partners
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select, insert, update, delete on public.partners to authenticated;
