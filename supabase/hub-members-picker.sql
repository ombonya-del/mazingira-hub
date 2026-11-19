-- MazingiraKenya — list hub members for the "send the minutes to" picker.
-- Reads Supabase Auth (everyone invited to the hub). Members see NAME + ORGANISATION only;
-- emails never leave the server (the picker stores "uid:<id>", resolved when minutes are sent).
-- Run once in Supabase -> SQL Editor. Safe to re-run.

create or replace function public.hub_members()
returns table (id uuid, label text)
language sql
security definer
set search_path = public, auth
as $$
  select u.id,
         coalesce(nullif(trim(u.raw_user_meta_data->>'person'), ''),
                  nullif(trim(u.raw_user_meta_data->>'full_name'), ''),
                  split_part(u.email, '@', 1))
         || coalesce(' — ' || nullif(trim(u.raw_user_meta_data->>'org'), ''), '') as label
  from auth.users u
  where u.email is not null
    and u.deleted_at is null
    and (u.banned_until is null or u.banned_until < now())
  order by 2;
$$;

revoke all on function public.hub_members() from public, anon;
grant execute on function public.hub_members() to authenticated;
