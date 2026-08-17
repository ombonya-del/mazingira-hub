-- Remove duplicate review drafts and stop them recurring.
-- The doubles came from running the manual insert scripts twice (once individually,
-- once via queue-all-drafts.sh). This cleans the queue and adds partial unique
-- indexes so the same draft can't be queued twice again. Run once in Supabase -> SQL Editor.

-- 1) Delete duplicate EVENT drafts — keep the earliest row per (title, start_date)
delete from public.calendar_events a
using public.calendar_events b
where a.published = false and b.published = false
  and a.title = b.title
  and a.start_date is not distinct from b.start_date
  and a.ctid > b.ctid;

-- 2) Delete duplicate OPPORTUNITY drafts — keep the earliest per title
delete from public.resources a
using public.resources b
where a.published = false and b.published = false
  and a.category = 'Opportunities' and b.category = 'Opportunities'
  and a.title = b.title
  and a.ctid > b.ctid;

-- 3) Prevent future duplicate drafts (partial unique indexes on the pending queue).
--    A repeat POST now returns HTTP 409 instead of inserting a second copy.
create unique index if not exists calevents_draft_uniq
  on public.calendar_events (title, start_date) where published = false;

create unique index if not exists resources_opp_draft_uniq
  on public.resources (title) where published = false and category = 'Opportunities';
