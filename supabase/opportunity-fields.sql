-- Richer structured fields for Opportunity drafts, so the admin review preview shows
-- type, due date, amount and eligibility — not just a single meta line.
-- All nullable; member-uploaded resources simply leave them empty. Safe to re-run.
-- Run once in Supabase -> SQL Editor.

alter table public.resources add column if not exists opp_type    text;  -- Grant / Fellowship / Accreditation / Fund / Call
alter table public.resources add column if not exists deadline    text;  -- e.g. "31 Aug 2026" or "Rolling"
alter table public.resources add column if not exists amount      text;  -- e.g. "Up to USD 20,000"
alter table public.resources add column if not exists eligibility text;  -- who can apply (Kenya / Africa focus)
