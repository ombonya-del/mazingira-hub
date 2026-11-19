-- raia: Swahili + Sheng for Tetesi / Ukweli Halisi / Kwenye Habari  (2026-11-17)
-- Paste into the Supabase SQL Editor (the remote DB is hand-built; don't use db push).
-- Safe to re-run.

-- 1) Tetesi + Ukweli Halisi: translations of the claim, verdict and rebuttal.
--    Shape: {"body":{"sw":..,"sh":..},"verdict":{"sw":..,"sh":..},"rebuttal":{"sw":..,"sh":..},
--            "src":"<hash of the English it was made from>","edited":false}
--    If the English is edited later, the hash no longer matches and translate-raia redoes it
--    (unless an admin hand-edited the translation: edited=true is never overwritten).
alter table public.disinfo_items add column if not exists i18n jsonb;

-- 2) Kwenye Habari: plain-language gist of each headline + the feed's snippet (for the digest).
--    gist shape: {"sw":..,"sh":..}
alter table public.sentiment_items add column if not exists gist jsonb;
alter table public.sentiment_items add column if not exists snippet text;
create index if not exists sentiment_items_gist_null on public.sentiment_items (published_at desc) where gist is null;

-- 3) Daily "Habari za leo" digest (top stories summarised in EN / SW / SHENG).
create table if not exists public.news_digests (
  id           bigint generated always as identity primary key,
  digest_date  date not null unique,
  content      jsonb not null,          -- {headline,summary,stories:[{title,what,why,urls[]}],why_care} each {en,sw,sh}
  sources      jsonb not null default '[]'::jsonb,   -- [{title,url,source}]
  model        text,
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table public.news_digests enable row level security;

drop policy if exists news_digests_public_read on public.news_digests;
create policy news_digests_public_read on public.news_digests
  for select to anon, authenticated using (published = true);

drop policy if exists news_digests_admin_all on public.news_digests;
create policy news_digests_admin_all on public.news_digests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.news_digests to anon, authenticated;
grant insert, update, delete on public.news_digests to authenticated;
