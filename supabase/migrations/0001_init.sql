-- MazingiraKenya — Supabase schema + Row-Level Security
-- Run in the Supabase SQL editor (or `supabase db push`). Idempotent-ish for first setup.

create extension if not exists pgcrypto;

-- ========================= roles / members =========================
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid unique references auth.users(id) on delete cascade,
  org text, name text,
  role text not null default 'contributor' check (role in ('admin','editor','moderator','contributor')),
  active boolean not null default true,
  last_seen timestamptz default now()
);
create or replace function is_staff() returns boolean language sql stable as $$
  select exists (select 1 from members m where m.auth_uid = auth.uid()
                 and m.active and m.role in ('moderator','editor','admin')); $$;
create or replace function is_editor() returns boolean language sql stable as $$
  select exists (select 1 from members m where m.auth_uid = auth.uid()
                 and m.active and m.role in ('editor','admin')); $$;

-- ========================= curated content =========================
create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  slug text unique, status text, featured boolean default false,
  place jsonb, title jsonb, summary jsonb, streams jsonb, action jsonb,
  updated_at timestamptz default now());
create table if not exists bigq  (id uuid primary key default gen_random_uuid(), slug text unique, q jsonb, a jsonb, case_study jsonb, video text);
create table if not exists myths (id uuid primary key default gen_random_uuid(), slug text unique, m jsonb, reality jsonb, why jsonb, where_seen jsonb, link text);
create table if not exists events(id uuid primary key default gen_random_uuid(), title text, type text, mode text,
  starts_at timestamptz, location text, org text, description text, link text,
  status text default 'published', created_at timestamptz default now());
create table if not exists classic_disinfo (
  id uuid primary key default gen_random_uuid(),
  verdict text, claim jsonb, where_seen text, why jsonb, truth jsonb,
  status text default 'active', linked_issue text, source_url text, updated_at timestamptz default now());

-- ========================= sentiment (Pipeline C) =========================
create table if not exists sentiment_items (
  id uuid primary key default gen_random_uuid(),
  source text, source_type text check (source_type in ('news','scholarly','social')),
  title text, url text unique, published_at timestamptz,
  stance text check (stance in ('supportive','neutral','critical')), score numeric,
  theme text, ingested_at timestamptz default now());
create table if not exists sentiment_index (
  id uuid primary key default gen_random_uuid(),
  period_start date, period_end date, index_score int, delta int,
  split_news jsonb, split_scholarly jsonb, split_social jsonb, themes jsonb,
  created_at timestamptz default now());

-- ========================= narrative disinfo + AI rebuttals (§11) =========================
create table if not exists narrative_items (
  id uuid primary key default gen_random_uuid(),
  platform text, url text, reach text, virality int,
  claim text, narrative_type text, issue_slug text,
  stance text, first_seen timestamptz default now(), status text default 'new');
create table if not exists rebuttals (
  id uuid primary key default gen_random_uuid(),
  narrative_id uuid references narrative_items(id) on delete cascade,
  draft_body text, model text, prompt_version text, sources jsonb,
  confidence numeric, risk_tier text default 'standard',
  status text not null default 'draft' check (status in ('draft','pending','approved','rejected','published')),
  approved_by uuid references members(id), created_at timestamptz default now(), published_at timestamptz);

-- ========================= community voices (Pipeline A) =========================
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  kind text, lang text, county text, body text, media_path text,
  submitter_name text, submitter_email text,
  consent boolean not null default false, has_minor boolean not null default false,
  status text not null default 'pending' check (status in ('pending','approved','rejected','changes')),
  created_at timestamptz default now(), reviewed_by uuid references members(id), review_note text);
create table if not exists published (         -- what raia reads: Voices wall, issue cross-posts, rebuttals
  id uuid primary key default gen_random_uuid(),
  surface text, issue_slug text, payload jsonb, live boolean default true,
  created_at timestamptz default now());

-- ============================== RLS ==============================
do $$ declare t text;
begin
  foreach t in array array['members','issues','bigq','myths','events','classic_disinfo',
    'sentiment_items','sentiment_index','narrative_items','rebuttals','submissions','published']
  loop execute format('alter table %I enable row level security;', t); end loop;
end $$;

-- public (anon) READ of curated / published content
create policy pub_issues    on issues          for select using (true);
create policy pub_bigq      on bigq            for select using (true);
create policy pub_myths     on myths           for select using (true);
create policy pub_events    on events          for select using (status = 'published');
create policy pub_classic   on classic_disinfo for select using (true);
create policy pub_sitems    on sentiment_items for select using (true);
create policy pub_sindex    on sentiment_index for select using (true);
create policy pub_narr      on narrative_items for select using (true);
create policy pub_reb       on rebuttals       for select using (status = 'published');
create policy pub_published on published       for select using (live = true);

-- submissions hold PII: anon may INSERT, only staff may READ/UPDATE
create policy sub_insert on submissions for insert with check (true);
create policy sub_read   on submissions for select using (is_staff());
create policy sub_update on submissions for update using (is_staff());

-- staff/editor writes (service-role key in edge functions bypasses RLS)
create policy issues_write  on issues          for all using (is_editor()) with check (is_editor());
create policy events_write  on events          for all using (is_editor()) with check (is_editor());
create policy classic_write on classic_disinfo for all using (is_editor()) with check (is_editor());
create policy narr_write    on narrative_items for all using (is_staff())  with check (is_staff());
create policy reb_write     on rebuttals       for all using (is_staff())  with check (is_staff());
create policy pubd_write    on published       for all using (is_editor()) with check (is_editor());
create policy members_admin on members         for all using (is_editor()) with check (is_editor());
