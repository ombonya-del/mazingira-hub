-- FIX: member resource uploads not persisting ("saved but vanishes on reload")
--
-- Cause: the resources table's earlier policies reference is_admin(). If that
-- function doesn't exist, the policy setup aborts before a working INSERT policy
-- is created — leaving RLS enabled with no insert path, so every upload is
-- silently rejected and falls back to a device-only copy that disappears on reload.
--
-- This recreates a clean member read + insert path with NO is_admin() dependency.
-- Safe to run and re-run. Run once in Supabase -> SQL Editor.

alter table public.resources enable row level security;

drop policy if exists resources_read         on public.resources;
drop policy if exists resources_insert        on public.resources;
drop policy if exists resources_member_read    on public.resources;
drop policy if exists resources_member_insert  on public.resources;
drop policy if exists resources_admin_all      on public.resources;

-- signed-in members can read published resources...
create policy resources_member_read on public.resources
  for select to authenticated using (published = true);

-- ...and publish new ones (must be published = true, matching the app's upload shape)
create policy resources_member_insert on public.resources
  for insert to authenticated with check (published = true);

grant select, insert on public.resources to authenticated;

-- Verify it worked (should list the two policies above):
--   select policyname, cmd from pg_policies
--   where schemaname='public' and tablename='resources';

-- NOTE on FILE uploads (not links): direct file uploads also need a Storage bucket
-- named 'media'. In Supabase -> Storage, create a public bucket called 'media' if it
-- doesn't exist. Pasting a link works without this; uploading a file needs it.
