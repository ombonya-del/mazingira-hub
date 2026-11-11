-- raia-public-reads.sql  (apply in Supabase SQL Editor — deCOALonize project)
-- Phase 1: let the PUBLIC raia dashboard read the two AUTO-populated feeds live,
-- with no admin-publish step. Safe: these hold only scraped/curated public info
-- (news headlines, curated pulse) — no PII, no draft-only internal fields of concern.

-- 1) Media / sentiment radar (written by scan-sentiment). No 'published' column;
--    every row is public news, so expose read-only to anon.
alter table public.sentiment_items enable row level security;
drop policy if exists sentiment_public_read on public.sentiment_items;
create policy sentiment_public_read on public.sentiment_items
  for select to anon using (true);
grant select on public.sentiment_items to anon;

-- 2) Community Pulse (pulse_items) — expose only PUBLISHED rows. The policy existed
--    in supabase/manual-uploads.sql but was never applied to the live hand-built DB,
--    so anon is currently denied. Re-apply + grant.
alter table public.pulse_items enable row level security;
drop policy if exists pulse_public_read on public.pulse_items;
create policy pulse_public_read on public.pulse_items
  for select to anon using (published);
grant select on public.pulse_items to anon;

-- Sanity checks (run after):
--   set role anon;
--   select count(*) from public.sentiment_items;   -- expect > 0
--   select count(*) from public.pulse_items;        -- expect published count
--   reset role;
