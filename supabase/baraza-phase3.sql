-- MazingiraKenya — Baraza phase 3: partner petitions & calls to action
-- The Baraza seeder can now draft partners' petitions and calls to action into the
-- Petitions section. They arrive unpublished; an admin reviews them in
-- admin -> Review -> Petitions & actions. Run once in the Supabase SQL Editor. Safe to re-run.

alter table public.petitions add column if not exists kind        text not null default 'petition'; -- petition | action
alter table public.petitions add column if not exists action_url  text;  -- external page to sign / act on (partner-hosted)
alter table public.petitions add column if not exists deadline    date;
alter table public.petitions add column if not exists source      text;  -- 'baraza' when seeded
alter table public.petitions add column if not exists source_name text;  -- partner that posted it

-- Admins can see, edit, publish and delete every petition (drafts included).
drop policy if exists petitions_admin_all on public.petitions;
create policy petitions_admin_all on public.petitions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select, insert, update, delete on public.petitions to authenticated;
