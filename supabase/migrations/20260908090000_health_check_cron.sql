-- MazingiraKenya health-check — every 6h, alert-only email to mazingirakhub@gmail.com
create extension if not exists pg_cron;
create extension if not exists pg_net;
do $$ begin if exists (select 1 from cron.job where jobname='health-check-6h') then perform cron.unschedule('health-check-6h'); end if; end $$;
select cron.schedule('health-check-6h', '0 */6 * * *', $$
  select net.http_post(
    url     := 'https://uueemckdoozsuowcqkhl.supabase.co/functions/v1/health-check',
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZWVtY2tkb296c3Vvd2Nxa2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzcwMTUsImV4cCI6MjEwMDY1MzAxNX0.lRpyb6AdGft0eN21vOlH_dVtSMBrmqCPDbO77IHufyA'),
    body    := '{}'::jsonb);
$$);
