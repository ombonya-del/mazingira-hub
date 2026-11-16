-- MazingiraKenya — Voices photo/video/audio uploads (PRIVATE until approved)
-- Run in Supabase → SQL Editor (project uueemckdoozsuowcqkhl). Safe to re-run.
--
-- How it works
--   • Members' files go into a PRIVATE storage bucket "voices" (no public URLs).
--   • Admins can preview them in the review queue (short-lived signed links).
--   • The public (hub + raia) can open a file ONLY while its submission is
--     approved AND has consent AND no minor flag. Reject or Reopen = access gone.
--   • voices_feed() returns approved voices + their file paths to the walls,
--     without exposing emails / minor flags.

-- 1) Where the uploaded file paths are stored ---------------------------------
alter table public.submissions add column if not exists media_files text[];

-- 2) The private bucket (50 MB/file = Supabase Free plan max) ------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('voices', 'voices', false, 52428800,
        array['image/*','video/*','audio/*'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 3) Helper checks (security definer → can look at submissions safely) ---------
-- Who may review: anyone in public.admins, plus staff if is_staff() exists.
create or replace function public.voices_can_review() returns boolean
language plpgsql stable security definer set search_path = public as $$
declare ok boolean := false;
begin
  begin ok := public.is_admin(); exception when others then ok := false; end;
  if not ok and exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                        where n.nspname = 'public' and p.proname = 'is_staff' and p.pronargs = 0) then
    begin execute 'select public.is_staff()' into ok; exception when others then ok := false; end;
  end if;
  return coalesce(ok, false);
end $$;

-- Is this storage object attached to an approved, consented, no-minor voice?
create or replace function public.voice_file_is_public(obj_name text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.submissions s
    where s.status = 'approved' and s.consent and not coalesce(s.has_minor, false)
      and obj_name = any (s.media_files)
  );
$$;

grant execute on function public.voices_can_review()        to anon, authenticated;
grant execute on function public.voice_file_is_public(text) to anon, authenticated;

-- 4) Storage policies -----------------------------------------------------------
-- If the editor says "must be owner of table objects", add these 3 in
-- Storage → Policies → voices bucket instead (same definitions).
drop policy if exists voices_member_upload  on storage.objects;
drop policy if exists voices_review_read    on storage.objects;
drop policy if exists voices_public_read    on storage.objects;
drop policy if exists voices_review_delete  on storage.objects;

-- signed-in members can upload, only into pending/
create policy voices_member_upload on storage.objects for insert to authenticated
  with check ( bucket_id = 'voices' and (storage.foldername(name))[1] = 'pending' );

-- reviewers can see everything in the bucket (needed for previews)
create policy voices_review_read on storage.objects for select to authenticated
  using ( bucket_id = 'voices' and public.voices_can_review() );

-- everyone else: only files of approved voices
create policy voices_public_read on storage.objects for select to anon, authenticated
  using ( bucket_id = 'voices' and public.voice_file_is_public(name) );

-- reviewers can delete (cleanup of rejected material)
create policy voices_review_delete on storage.objects for delete to authenticated
  using ( bucket_id = 'voices' and public.voices_can_review() );

-- 5) Feed for the Voices walls (hub + raia) --------------------------------------
create or replace function public.voices_feed(lim int default 12)
returns table (id uuid, kind text, county text, body text, submitter_name text,
               source_url text, media_files text[], created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select s.id, s.kind, s.county, s.body, s.submitter_name, s.source_url,
         s.media_files, s.created_at
  from public.submissions s
  where s.status = 'approved' and s.consent and not coalesce(s.has_minor, false)
  order by s.created_at desc
  limit least(greatest(coalesce(lim, 12), 1), 50);
$$;
grant execute on function public.voices_feed(int) to anon, authenticated;
