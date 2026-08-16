-- MazingiraKenya — petitions & memoranda
-- Members (authenticated) create petitions in the hub; anyone (anon) can sign
-- from raia. Signatures stay private (insert-only, no public read of names/emails);
-- the public signature tally lives in petitions.sign_count, kept current by a trigger.
-- Run this once in the Supabase SQL editor.

-- ---------- tables ----------
create table if not exists public.petitions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  target      text not null,          -- who it's addressed to
  summary     text not null,          -- the short ask
  body        text,                   -- full memorandum text (optional)
  goal        integer default 0,      -- signature goal (0 = no goal)
  doc_url     text,                   -- link to the memorandum (optional)
  sign_count  integer not null default 0,
  published   boolean not null default true,
  created_by  uuid default auth.uid() references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table if not exists public.petition_signatures (
  id           uuid primary key default gen_random_uuid(),
  petition_id  uuid not null references public.petitions(id) on delete cascade,
  name         text not null,
  org          text,
  email        text,
  created_at   timestamptz not null default now()
);
create index if not exists petition_signatures_pid_idx on public.petition_signatures(petition_id);

-- ---------- keep sign_count current ----------
create or replace function public.bump_petition_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.petitions
     set sign_count = sign_count + 1
   where id = new.petition_id;
  return new;
end;
$$;

drop trigger if exists trg_bump_petition_count on public.petition_signatures;
create trigger trg_bump_petition_count
  after insert on public.petition_signatures
  for each row execute function public.bump_petition_count();

-- ---------- row-level security ----------
alter table public.petitions            enable row level security;
alter table public.petition_signatures  enable row level security;

-- petitions: everyone can read the published ones (hub members + public raia);
-- only signed-in members can create them.
drop policy if exists petitions_read       on public.petitions;
drop policy if exists petitions_insert      on public.petitions;
create policy petitions_read   on public.petitions
  for select to anon, authenticated using (published = true);
create policy petitions_insert on public.petitions
  for insert to authenticated with check (true);

-- signatures: anyone can add their name (public support from raia);
-- nobody reads the raw rows through the API (names/emails stay private).
-- The count is exposed only through petitions.sign_count.
drop policy if exists petition_sign_insert  on public.petition_signatures;
create policy petition_sign_insert on public.petition_signatures
  for insert to anon, authenticated with check (true);

-- (No select policy on petition_signatures = no public read. Admins read via the
--  service-role key in the Supabase dashboard when they need the signatory list.)
