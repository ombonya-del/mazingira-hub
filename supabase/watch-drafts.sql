-- MazingiraKenya — "Watch" draft queue for Opportunities + Events found online.
-- Lets the weekly watcher tasks queue UNPUBLISHED drafts (published=false) that an
-- admin then Accepts (→ published=true, live on the hub) or Rejects (→ deleted) in
-- admin → Opportunities review / Events review.
--
-- Security model (CMT house style): the client/scripts use the PUBLIC anon key only.
-- RLS is the perimeter — anon may INSERT drafts but ONLY as published=false, and can
-- never read them back (public read requires published=true). Only a signed-in admin
-- (is_admin()) can read drafts and flip them to published. Mirrors the existing
-- disinfo-draft pattern (scripts/insert-disinfo-draft.mjs). Safe to re-run.
--
-- Run once in Supabase → SQL Editor (project uueemckdoozsuowcqkhl).
-- Assumes is_admin() already exists (from fix-admin-rls.sql) and that resources.sql
-- and events.sql have been applied.

-- 1) Provenance marker so drafts (and the hub) can tell watcher finds from member posts
alter table public.resources       add column if not exists source text not null default 'member';
alter table public.calendar_events  add column if not exists source text not null default 'member';

-- 2) Opportunities (resources) -------------------------------------------------
-- The existing resources_insert policy only allows published=true (member posts).
-- Add a parallel policy so anon/scripts may queue DRAFTS (published=false) only.
grant insert on public.resources to anon, authenticated;

drop policy if exists resources_draft_insert on public.resources;
create policy resources_draft_insert on public.resources
  for insert to anon, authenticated
  with check ( published = false );

-- Admin already reads everything + edits/deletes via resources_admin_all (is_admin()).
-- Public still cannot see drafts: resources_read requires published = true.

-- 3) Events (calendar_events) --------------------------------------------------
-- Member inserts require authenticated + published=true. Add an anon/script draft
-- path (published=false only) so the events watcher can queue finds.
grant insert on public.calendar_events to anon;

drop policy if exists calevents_draft_insert on public.calendar_events;
create policy calevents_draft_insert on public.calendar_events
  for insert to anon, authenticated
  with check ( published = false );

-- Admin already reads/edits/deletes via calevents_admin_all (is_admin()).

-- 4) Helpful indexes for the review queues
create index if not exists resources_pending_idx
  on public.resources (created_at desc) where published = false;
create index if not exists calevents_pending_idx
  on public.calendar_events (created_at desc) where published = false;
