-- MazingiraKenya — manual-upload backend for Community Pulse + Narrative Disinfo
-- Run this in Supabase → SQL Editor (project uueemckdoozsuowcqkhl). Safe to re-run.
-- Security model: anyone may READ published rows (the public hub); only an
-- allow-listed, signed-in admin may INSERT/UPDATE/DELETE.

-- 1) Allow-list of editors --------------------------------------------------
create table if not exists public.admins ( email text primary key );

-- 2) Content tables ---------------------------------------------------------
create table if not exists public.pulse_items (
  id          bigint generated always as identity primary key,
  name        text,                         -- display name e.g. "Nyakundi Report"
  handle      text not null,                -- "@handle"
  posted_at   text,                         -- "31 Jul 2026" (shown as-is)
  body        text not null,                -- verbatim post text
  eng         text,                         -- "↻ 78 · ♥ 135 · 👁 8.4k"
  tag         text,                         -- "Bondo · Nuclear" / "Waste" / "Energy" / …
  tag_class   text,                         -- "bondo" | "waste" | "energy" | "" (colour)
  tweet_url   text not null,                -- https://twitter.com/HANDLE/status/ID
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.disinfo_items (
  id           bigint generated always as identity primary key,
  name         text,
  handle       text,
  posted_at    text,
  body         text not null,               -- the flagged claim (verbatim)
  eng          text,
  verdict      text not null,               -- "Bait-and-switch" / "False dilemma" / …
  verdict_class text not null default 'vf', -- vf(red) vm(amber) vc(blue) vp(orange)
  tweet_url    text,                        -- https://twitter.com/HANDLE/status/ID (optional)
  rebuttal     text not null,               -- coalition rebuttal
  published    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- 3) Admin check (security definer → avoids RLS recursion on admins) ---------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email'));
$$;

-- 4) Row-level security -----------------------------------------------------
alter table public.pulse_items   enable row level security;
alter table public.disinfo_items enable row level security;
alter table public.admins        enable row level security;

drop policy if exists pulse_public_read on public.pulse_items;
create policy pulse_public_read   on public.pulse_items   for select using ( published );
drop policy if exists disinfo_public_read on public.disinfo_items;
create policy disinfo_public_read on public.disinfo_items for select using ( published );

drop policy if exists pulse_admin_write on public.pulse_items;
create policy pulse_admin_write   on public.pulse_items   for all
  using ( public.is_admin() ) with check ( public.is_admin() );
drop policy if exists disinfo_admin_write on public.disinfo_items;
create policy disinfo_admin_write on public.disinfo_items for all
  using ( public.is_admin() ) with check ( public.is_admin() );

drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins for select using ( public.is_admin() );

-- 5) >>> ADD YOUR EDITOR EMAILS HERE <<< ------------------------------------
insert into public.admins (email) values
  ('ombonya@gmail.com')
on conflict do nothing;
