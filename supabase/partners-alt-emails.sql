-- Alternate contact emails for partners: if the primary misses, the alternates still get it.
-- One comma-separated field holds up to two alternates. Run once in Supabase -> SQL Editor. Safe to re-run.
alter table public.partners add column if not exists email_alt text;  -- e.g. "programs@org.org, director@org.org"
