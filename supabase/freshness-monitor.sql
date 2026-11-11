-- MazingiraKenya freshness monitor  (pairs with the health-check edge function v2)
-- 1) health_state: the latest result of every freshness check (read by Admin → Overview)
-- 2) runs health-check every 3 hours (was every 6), alert-only email + 24h reminders
-- Run once in Supabase → SQL Editor. Safe to re-run. Requires public.is_admin() (fix-admin-rls.sql).

create table if not exists public.health_state (
  key           text primary key,
  grp           text,
  name          text,
  ok            boolean not null default true,
  level         text,
  detail        text,
  last_at       timestamptz,
  fix           text,
  since         timestamptz,       -- when it last changed between ok / failing
  checked_at    timestamptz,
  last_emailed  timestamptz,
  sort          int
);
alter table public.health_state enable row level security;
drop policy if exists health_state_admin_read on public.health_state;
create policy health_state_admin_read on public.health_state
  for select to authenticated using (public.is_admin());
grant select on public.health_state to authenticated;      -- RLS limits it to admins

create extension if not exists pg_cron;
create extension if not exists pg_net;
do $$ begin
  if exists (select 1 from cron.job where jobname='health-check-6h') then perform cron.unschedule('health-check-6h'); end if;
  if exists (select 1 from cron.job where jobname='health-check-3h') then perform cron.unschedule('health-check-3h'); end if;
end $$;
select cron.schedule('health-check-3h', '15 */3 * * *', $$
  select net.http_post(
    url     := 'https://uueemckdoozsuowcqkhl.supabase.co/functions/v1/health-check',
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZWVtY2tkb296c3Vvd2Nxa2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzcwMTUsImV4cCI6MjEwMDY1MzAxNX0.lRpyb6AdGft0eN21vOlH_dVtSMBrmqCPDbO77IHufyA'),
    body    := '{}'::jsonb,
    timeout_milliseconds := 60000);
$$);
