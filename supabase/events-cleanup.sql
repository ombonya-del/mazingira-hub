-- Remove event DRAFTS from the event scanner that have no exact date or no venue/online format.
-- Only unpublished scanner drafts (source = 'watch') are touched; published events and
-- member-submitted events are left alone. Run once in Supabase → SQL Editor.

-- 1) preview what will be removed
select id, title, start_date, location, mode, created_at
from public.calendar_events
where published = false and source = 'watch'
  and (start_date is null
       or start_date < current_date
       or (coalesce(trim(location), '') = '' and coalesce(mode, '') not in ('Virtual', 'Hybrid')))
order by created_at desc;

-- 2) delete them (run after checking the preview)
delete from public.calendar_events
where published = false and source = 'watch'
  and (start_date is null
       or start_date < current_date
       or (coalesce(trim(location), '') = '' and coalesce(mode, '') not in ('Virtual', 'Hybrid')));
