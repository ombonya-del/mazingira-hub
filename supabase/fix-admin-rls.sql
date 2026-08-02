-- Fix: make the admin check case-insensitive + trimmed, with a metadata fallback,
-- and add a whoami() so you can see exactly what the DB sees for your session.
-- Run in Supabase → SQL Editor. Safe to re-run.

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins a
    where lower(trim(a.email)) = lower(trim(coalesce(
      auth.jwt() ->> 'email',
      auth.jwt() -> 'user_metadata' ->> 'email'
    )))
  );
$$;

-- diagnostic: returns the email the DB sees for the caller + whether they're an admin
create or replace function public.whoami() returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'jwt_email',  auth.jwt() ->> 'email',
    'meta_email', auth.jwt() -> 'user_metadata' ->> 'email',
    'is_admin',   public.is_admin()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.whoami()   to anon, authenticated;

-- make sure your posting email is on the list (edit as needed)
insert into public.admins (email) values
  ('ombonya@gmail.com'),
  ('mazingirakhub@gmail.com')
on conflict do nothing;

-- image uploads: media column on each table + a public 'media' storage bucket ----
alter table public.pulse_items   add column if not exists media_url text;
alter table public.disinfo_items add column if not exists media_url text;

insert into storage.buckets (id, name, public) values ('media','media',true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects for select using ( bucket_id = 'media' );
drop policy if exists media_admin_write on storage.objects;
create policy media_admin_write on storage.objects for insert
  with check ( bucket_id = 'media' and public.is_admin() );
