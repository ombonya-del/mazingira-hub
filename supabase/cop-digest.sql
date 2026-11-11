-- COP31 Daily digest  (MazingiraKenya)
-- One draft per COP day and edition (am = 09:00 EAT run, pm = 17:00 EAT run), written by the
-- cop-digest edge function. Nothing is visible until an admin publishes it:
--   published       -> members see the full analytical digest on the hub (#cop)
--   raia_published  -> the public sees the plain-language, trilingual version on raia
-- Run once in Supabase -> SQL Editor. Safe to re-run. Requires public.is_admin() (fix-admin-rls.sql).

create table if not exists public.cop_digests (
  id              uuid primary key default gen_random_uuid(),
  digest_date     date not null,
  edition         text not null default 'pm' check (edition in ('am','pm')),
  cop_day         int,
  hub             jsonb not null default '{}'::jsonb,   -- full English digest for members
  raia            jsonb not null default '{}'::jsonb,   -- {headline,summary,points[],kenya,belem,why_care} each {en,sw,sh}
  sources         jsonb not null default '[]'::jsonb,   -- [{title,url,source}]
  published       boolean not null default false,
  raia_published  boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (digest_date, edition)
);

alter table public.cop_digests enable row level security;

drop policy if exists cop_digests_admin_all     on public.cop_digests;
drop policy if exists cop_digests_member_read   on public.cop_digests;
drop policy if exists cop_digests_public_read   on public.cop_digests;

-- admins: everything (review, edit, publish, delete)
create policy cop_digests_admin_all on public.cop_digests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- signed-in hub members: published digests
create policy cop_digests_member_read on public.cop_digests
  for select to authenticated using (published or raia_published);

-- public (raia): only rows released to raia ...
create policy cop_digests_public_read on public.cop_digests
  for select to anon using (raia_published);

-- ... and only the public-safe columns (the members' analysis stays members-only)
revoke all on public.cop_digests from anon;
grant select (id, digest_date, edition, cop_day, raia, sources, raia_published, updated_at)
  on public.cop_digests to anon;
grant select, insert, update, delete on public.cop_digests to authenticated;  -- RLS still applies

create index if not exists cop_digests_date_idx on public.cop_digests (digest_date desc, edition desc);
