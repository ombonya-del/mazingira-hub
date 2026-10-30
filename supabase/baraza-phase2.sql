-- Baraza Phase 2 — partner socials sweep + auto-seeding. Run once in Supabase -> SQL Editor
-- AFTER baraza.sql. Safe to re-run.

-- who posted it on the source platform (X handle without @, or YouTube channel id)
alter table public.baraza_posts add column if not exists source_handle text;
-- auto-seed bookkeeping: when the seeder looked at a post, and what (if anything) it drafted
alter table public.baraza_posts add column if not exists seeded_at timestamptz;
alter table public.baraza_posts add column if not exists seeded_to text;

-- The daily X-list sweep writes from a browser with the public anon key. It may only add
-- HIDDEN 'social' posts; the baraza-seed function then publishes the ones whose handle
-- matches a partner's x_handle (spam from anyone else just stays hidden).
drop policy if exists bz_posts_sweep_insert on public.baraza_posts;
create policy bz_posts_sweep_insert on public.baraza_posts for insert to anon
  with check (kind = 'social' and hidden and not pinned and promoted_to is null
              and author_id is null and ext_id is not null and source_handle is not null
              and reply_count = 0 and useful_count = 0 and seeded_at is null);
grant insert on public.baraza_posts to anon;

-- the sweep checks which posts it already has (ext_id only — nothing else is readable to anon)
create or replace function public.baraza_known_ext_ids(ids text[]) returns setof text
language sql stable security definer set search_path = public as $$
  select ext_id from public.baraza_posts where ext_id = any(ids)
$$;
grant execute on function public.baraza_known_ext_ids(text[]) to anon, authenticated;
