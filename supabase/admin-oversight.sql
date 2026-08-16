-- Admin oversight for Exchange resources + Virtual Space meetings (calls).
-- Requires is_admin() (from fix-admin-rls.sql) and your email in public.admins.
-- Run once in Supabase -> SQL Editor. Safe to re-run.
--
-- Members keep: read published resources + publish new ones; read all calls + schedule.
-- Admins gain:  read everything, and EDIT / DELETE (cancel) resources and calls.

-- ---------- resources: restore admin edit/delete + read-all ----------
drop policy if exists resources_admin_all on public.resources;
create policy resources_admin_all on public.resources
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant update, delete on public.resources to authenticated;   -- RLS still limits to is_admin()

-- ---------- calls (virtual-space meetings): admin edit/cancel ----------
drop policy if exists calls_admin_all on public.calls;
create policy calls_admin_all on public.calls
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant update, delete on public.calls to authenticated;       -- RLS still limits to is_admin()

-- Verify (should show the two admin policies plus the member ones):
--   select tablename, policyname, cmd from pg_policies
--   where schemaname='public' and tablename in ('resources','calls') order by tablename;
