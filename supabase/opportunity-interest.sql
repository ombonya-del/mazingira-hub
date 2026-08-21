-- Partner "Register interest" responses. The public register-interest Edge Function
-- inserts a row when a partner clicks the button in their email. Admins read the list.
-- Run once in Supabase -> SQL Editor. Safe to re-run. Requires is_admin() (fix-admin-rls.sql).

create table if not exists public.opportunity_interest (
  id                uuid primary key default gen_random_uuid(),
  opportunity_title text,
  opportunity_url   text,
  partner_name      text,
  partner_email     text,
  created_at        timestamptz not null default now()
);

alter table public.opportunity_interest enable row level security;

-- The register link is clicked by partners who are NOT signed in, so anon may INSERT.
-- Nobody can read the rows back except an admin (is_admin()).
drop policy if exists oppint_insert     on public.opportunity_interest;
drop policy if exists oppint_admin_read on public.opportunity_interest;
create policy oppint_insert     on public.opportunity_interest for insert to anon, authenticated with check (true);
create policy oppint_admin_read on public.opportunity_interest for select to authenticated using (public.is_admin());

grant insert on public.opportunity_interest to anon, authenticated;
grant select on public.opportunity_interest to authenticated;
