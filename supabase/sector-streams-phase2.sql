-- Phase 2 — let the scan-sectors edge function auto-populate the four sector tables.
-- Adds a `source` (outlet) column and a dedupe key on `link` so the function can upsert
-- without creating duplicates. Seed rows have a null link; Postgres allows many nulls in a
-- unique index, so they coexist untouched. Run once in the Supabase SQL editor.

alter table public.extractive_signals    add column if not exists source text;
alter table public.litigation_updates    add column if not exists source text;
alter table public.policy_updates         add column if not exists source text;
alter table public.funding_opportunities  add column if not exists source text;

create unique index if not exists extractive_signals_link_uniq    on public.extractive_signals(link);
create unique index if not exists litigation_updates_link_uniq    on public.litigation_updates(link);
create unique index if not exists policy_updates_link_uniq        on public.policy_updates(link);
create unique index if not exists funding_opportunities_link_uniq on public.funding_opportunities(link);
