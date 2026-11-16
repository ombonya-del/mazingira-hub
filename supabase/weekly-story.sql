-- raia "Story of the week" (MazingiraKenya)
-- Each Monday the weekly-story function drafts one story from the week's intelligence, in raia's
-- issue format (happening / narrative / gap / action) in English, Kiswahili and Sheng.
-- Admin reviews and publishes it (Admin → Review → Story of the week). An admin can also feature
-- an existing raia issue instead (a row with issue_id set) — the newest published row wins.
-- Run once in Supabase → SQL Editor. Safe to re-run. Requires public.is_admin().

create table if not exists public.weekly_stories (
  id          uuid primary key default gen_random_uuid(),
  week_of     date not null,                       -- Monday of the week (EAT)
  issue_id    text,                                -- set = feature this existing raia issue instead
  story       jsonb not null default '{}'::jsonb,  -- {status,place,title,summary,happening,narrative,gap,action,why} each {en,sw,sh}
  sources     jsonb not null default '[]'::jsonb,  -- [{n,title,url,source}]
  note        text,                                -- why this story was picked (for the reviewer)
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists weekly_stories_week_idx on public.weekly_stories (week_of desc, updated_at desc);

alter table public.weekly_stories enable row level security;
drop policy if exists weekly_stories_admin_all on public.weekly_stories;
drop policy if exists weekly_stories_public_read on public.weekly_stories;
create policy weekly_stories_admin_all on public.weekly_stories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy weekly_stories_public_read on public.weekly_stories
  for select to anon, authenticated using (published);
grant select on public.weekly_stories to anon;
grant select, insert, update, delete on public.weekly_stories to authenticated;  -- RLS still applies
