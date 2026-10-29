-- Baraza — the members' forum + Socials Wall on the hub.
--   baraza_posts      discussions (kind=discussion), shared links (kind=share),
--                     and, from Phase 2, swept partner posts (kind=social, ext_id = source post id)
--   baraza_replies    replies under a post
--   baraza_reactions  one "useful" per member per post
--   baraza_reports    members flag a post/reply for admin review
-- Members (any signed-in hub user) read and post; admins (is_admin()) can hide, pin,
-- edit and delete anything. Requires public.is_admin() (fix-admin-rls.sql).
-- Run once in Supabase -> SQL Editor. Safe to re-run.

create table if not exists public.baraza_posts (
  id               uuid primary key default gen_random_uuid(),
  kind             text not null default 'discussion' check (kind in ('discussion','share','social')),
  category         text,
  title            text,
  body             text,
  url              text,
  media            text[] not null default '{}',
  source_name      text,          -- whose post it is (for shares / socials)
  platform         text,          -- x · youtube · facebook · linkedin · instagram · tiktok · web
  county           text,
  sector           text,
  author_id        uuid default auth.uid() references auth.users(id) on delete set null,
  author_name      text,
  author_org       text,
  reply_count      int not null default 0,
  useful_count     int not null default 0,
  pinned           boolean not null default false,
  hidden           boolean not null default false,
  promoted_to      text,          -- set by admins when promoted into Resources / Events
  ext_id           text unique,   -- source post id for swept socials (dedupe)
  created_at       timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);
create index if not exists baraza_posts_activity_idx on public.baraza_posts (kind, last_activity_at desc);

create table if not exists public.baraza_replies (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.baraza_posts(id) on delete cascade,
  body        text not null,
  author_id   uuid default auth.uid() references auth.users(id) on delete set null,
  author_name text,
  author_org  text,
  hidden      boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists baraza_replies_post_idx on public.baraza_replies (post_id, created_at);

create table if not exists public.baraza_reactions (
  post_id    uuid not null references public.baraza_posts(id) on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.baraza_reports (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid references public.baraza_posts(id) on delete cascade,
  reply_id   uuid references public.baraza_replies(id) on delete cascade,
  reason     text,
  reporter   uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- keep counters + "last activity" in step (security definer so members needn't update posts)
create or replace function public.baraza_after_reply() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.baraza_posts
     set reply_count = (select count(*) from public.baraza_replies r where r.post_id = new.post_id and not r.hidden),
         last_activity_at = now()
   where id = new.post_id;
  return new;
end $$;
drop trigger if exists baraza_reply_count on public.baraza_replies;
create trigger baraza_reply_count after insert on public.baraza_replies
  for each row execute function public.baraza_after_reply();

create or replace function public.baraza_after_reaction() returns trigger
language plpgsql security definer set search_path = public as $$
declare pid uuid := coalesce(new.post_id, old.post_id);
begin
  update public.baraza_posts
     set useful_count = (select count(*) from public.baraza_reactions x where x.post_id = pid)
   where id = pid;
  return null;
end $$;
drop trigger if exists baraza_reaction_count on public.baraza_reactions;
create trigger baraza_reaction_count after insert or delete on public.baraza_reactions
  for each row execute function public.baraza_after_reaction();

-- ---------- row-level security ----------
alter table public.baraza_posts     enable row level security;
alter table public.baraza_replies   enable row level security;
alter table public.baraza_reactions enable row level security;
alter table public.baraza_reports   enable row level security;

drop policy if exists bz_posts_read    on public.baraza_posts;
drop policy if exists bz_posts_insert  on public.baraza_posts;
drop policy if exists bz_posts_delete  on public.baraza_posts;
drop policy if exists bz_posts_admin   on public.baraza_posts;
create policy bz_posts_read   on public.baraza_posts for select to authenticated
  using (not hidden or author_id = auth.uid() or public.is_admin());
create policy bz_posts_insert on public.baraza_posts for insert to authenticated
  with check (author_id = auth.uid() and not hidden and not pinned and promoted_to is null
              and kind in ('discussion','share') and reply_count = 0 and useful_count = 0);
create policy bz_posts_delete on public.baraza_posts for delete to authenticated
  using (author_id = auth.uid());
create policy bz_posts_admin  on public.baraza_posts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists bz_replies_read   on public.baraza_replies;
drop policy if exists bz_replies_insert on public.baraza_replies;
drop policy if exists bz_replies_delete on public.baraza_replies;
drop policy if exists bz_replies_admin  on public.baraza_replies;
create policy bz_replies_read   on public.baraza_replies for select to authenticated
  using (not hidden or author_id = auth.uid() or public.is_admin());
create policy bz_replies_insert on public.baraza_replies for insert to authenticated
  with check (author_id = auth.uid() and not hidden);
create policy bz_replies_delete on public.baraza_replies for delete to authenticated
  using (author_id = auth.uid());
create policy bz_replies_admin  on public.baraza_replies for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists bz_react_read   on public.baraza_reactions;
drop policy if exists bz_react_insert on public.baraza_reactions;
drop policy if exists bz_react_delete on public.baraza_reactions;
create policy bz_react_read   on public.baraza_reactions for select to authenticated using (true);
create policy bz_react_insert on public.baraza_reactions for insert to authenticated with check (user_id = auth.uid());
create policy bz_react_delete on public.baraza_reactions for delete to authenticated using (user_id = auth.uid());

drop policy if exists bz_reports_insert on public.baraza_reports;
drop policy if exists bz_reports_admin  on public.baraza_reports;
create policy bz_reports_insert on public.baraza_reports for insert to authenticated with check (reporter = auth.uid());
create policy bz_reports_admin  on public.baraza_reports for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

grant select, insert, delete on public.baraza_posts, public.baraza_replies to authenticated;
grant update on public.baraza_posts, public.baraza_replies to authenticated;   -- RLS limits updates to admins
grant select, insert, delete on public.baraza_reactions to authenticated;
grant select, insert on public.baraza_reports to authenticated;

-- ---------- photo uploads (Supabase Storage) ----------
-- Public-read bucket: images are viewable by anyone holding the link, uploads are members-only.
insert into storage.buckets (id, name, public) values ('baraza-media', 'baraza-media', true)
  on conflict (id) do nothing;
drop policy if exists bz_media_insert on storage.objects;
drop policy if exists bz_media_read   on storage.objects;
create policy bz_media_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'baraza-media');
create policy bz_media_read   on storage.objects for select to anon, authenticated
  using (bucket_id = 'baraza-media');

-- ---------- partner social handles (used by the Phase 2 Socials Wall sweep) ----------
alter table public.partners add column if not exists x_handle  text;   -- e.g. FoNNaPKenya (no @)
alter table public.partners add column if not exists youtube   text;   -- channel URL or ID
alter table public.partners add column if not exists facebook  text;
alter table public.partners add column if not exists instagram text;
alter table public.partners add column if not exists linkedin  text;
alter table public.partners add column if not exists website   text;
