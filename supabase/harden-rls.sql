-- Members-only hardening: lock the HUB-ONLY data tables to signed-in members.
-- disinfo_items is intentionally LEFT PUBLIC — the public raia site reads it for the
-- full rebuttal by id, so it must stay anon-readable.
-- Safe to re-run. Assumes is_admin() exists (from fix-admin-rls.sql).
-- This does NOT touch auth/sign-in, so it cannot lock anyone out of the app — if a
-- read is ever denied, the hub simply falls back to its built-in content.

-- ---- helper: wipe every existing policy on a table so we can recreate a clean set ----
do $$
declare t text; p record;
begin
  foreach t in array array['pulse_items','sentiment_items','resources'] loop
    for p in select policyname from pg_policies where schemaname='public' and tablename=t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- ================= pulse_items (hub Community Pulse) =================
create policy pulse_member_read on public.pulse_items
  for select to authenticated using (published);
create policy pulse_admin_all on public.pulse_items
  for all to authenticated using (is_admin()) with check (is_admin());

-- ================= sentiment_items (hub sentiment feed) =================
create policy sent_member_read on public.sentiment_items
  for select to authenticated using (true);
create policy sent_admin_all on public.sentiment_items
  for all to authenticated using (is_admin()) with check (is_admin());

-- ================= resources (hub Exchange uploads) =================
-- read: members only · insert: members (published) · edit/delete: admins
create policy resources_member_read on public.resources
  for select to authenticated using (published);
create policy resources_member_insert on public.resources
  for insert to authenticated with check (published);
create policy resources_admin_all on public.resources
  for all to authenticated using (is_admin()) with check (is_admin());

-- ---- table grants: give authenticated access, take it away from anon ----
grant select on public.pulse_items, public.sentiment_items, public.resources to authenticated;
grant insert on public.resources to authenticated;
revoke all on public.pulse_items, public.sentiment_items, public.resources from anon;

-- disinfo_items: NOT modified here — keeps its existing anon-read for raia.
