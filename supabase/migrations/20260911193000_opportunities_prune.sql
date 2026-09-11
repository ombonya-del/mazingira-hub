-- MazingiraKenya — expired-opportunity pruning
-- 1) Add a real date column so the scanner can store a machine-comparable deadline.
-- 2) Weekly pg_cron job that deletes published/draft Opportunities whose deadline has passed.
--    (Rolling / unknown-deadline rows have deadline_iso = NULL and are left untouched.)

create extension if not exists pg_cron;

alter table public.resources
  add column if not exists deadline_iso date;

-- Re-create the job idempotently.
do $$ begin
  if exists (select 1 from cron.job where jobname='prune-expired-opportunities') then
    perform cron.unschedule('prune-expired-opportunities');
  end if;
end $$;

-- Mondays 07:00 UTC — an hour after the weekly scanners run (06:00 UTC).
select cron.schedule('prune-expired-opportunities', '0 7 * * 1', $$
  delete from public.resources
   where category = 'Opportunities'
     and deadline_iso is not null
     and deadline_iso < current_date;
$$);
