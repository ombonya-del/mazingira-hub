-- MazingiraKenya — dedicated live tables for the Live Streams board (Extractive / Litigation / Policy / Funding).
-- Public READ of published rows; WRITE limited to authenticated admins. Seeded from the board's curated content.
-- Run once in the Supabase SQL editor; re-running is safe (seed only inserts when the table is empty).

-- ===== extractive_signals =====
create table if not exists public.extractive_signals (
  id          uuid primary key default gen_random_uuid(),
  headline    text not null,
  link        text,
  published   boolean not null default true,
  happened_at timestamptz not null default now(),
  created_at  timestamptz not null default now()
);
alter table public.extractive_signals enable row level security;
drop policy if exists extractive_signals_read on public.extractive_signals;
create policy extractive_signals_read on public.extractive_signals for select to anon, authenticated using (published);
drop policy if exists extractive_signals_write on public.extractive_signals;
create policy extractive_signals_write on public.extractive_signals for all to authenticated using (true) with check (true);
grant select on public.extractive_signals to anon, authenticated;
grant insert, update, delete on public.extractive_signals to authenticated;
insert into public.extractive_signals (headline, happened_at)
select v.headline, v.happened_at from (values
  ('New prospecting licence lodged over <b>Kerio Valley</b> fluorspar block', now() - interval '0 hours'),
  ('Deadly clashes force shutdown of 13 <b>Hillo</b> gold sites, Marsabit; 10,000+ miners in 59 cooperatives', now() - interval '7 hours'),
  ('Strategic chromite EOIs opened at <b>Wamba &amp; Kang''ura</b>, Samburu', now() - interval '14 hours'),
  ('Rotor Systems files 114km² gold prospecting bid over <b>Samburu</b>', now() - interval '21 hours'),
  ('~70 gold blocks mapped without consent spark protests in <b>Dabel/Moyale</b>, Marsabit', now() - interval '28 hours'),
  ('July 2026 crackdown arrests foreign operators in <b>Migori &amp; Narok</b>', now() - interval '35 hours'),
  ('Kishushe Ranching pulls consent over a Sh150m royalty default, <b>Taita Taveta</b>', now() - interval '42 hours'),
  ('Kimwarer fluorspar revived under Sofax/Fujax, <b>Elgeyo Marakwet</b>', now() - interval '49 hours'),
  ('''Hanging homes'' quarry protests over unreclaimed pits, <b>Nakuru</b>', now() - interval '56 hours'),
  ('Seismic survey vessel reported off <b>Lamu</b> archipelago', now() - interval '63 hours'),
  ('Quarry expansion notice published for <b>Machakos</b>', now() - interval '70 hours'),
  ('Titanium sands tailings discharge reported, <b>Kwale</b>', now() - interval '77 hours'),
  ('Sand harvesting trucks recorded on <b>Makueni</b> riverbed at night', now() - interval '84 hours'),
  ('Exploration block boundaries redrawn in <b>Wajir</b>', now() - interval '91 hours'),
  ('Gold processing site expansion, <b>Migori</b>', now() - interval '98 hours'),
  ('Borehole drilling permits spike in <b>Mandera</b>', now() - interval '105 hours')
) as v(headline, happened_at)
where not exists (select 1 from public.extractive_signals);

-- ===== litigation_updates =====
create table if not exists public.litigation_updates (
  id          uuid primary key default gen_random_uuid(),
  headline    text not null,
  link        text,
  published   boolean not null default true,
  happened_at timestamptz not null default now(),
  created_at  timestamptz not null default now()
);
alter table public.litigation_updates enable row level security;
drop policy if exists litigation_updates_read on public.litigation_updates;
create policy litigation_updates_read on public.litigation_updates for select to anon, authenticated using (published);
drop policy if exists litigation_updates_write on public.litigation_updates;
create policy litigation_updates_write on public.litigation_updates for all to authenticated using (true) with check (true);
grant select on public.litigation_updates to anon, authenticated;
grant insert, update, delete on public.litigation_updates to authenticated;
insert into public.litigation_updates (headline, happened_at)
select v.headline, v.happened_at from (values
  ('Mention date set in <b>Mui Basin</b> judicial review', now() - interval '0 hours'),
  ('Replying affidavit filed, <b>Kilifi</b> community land matter', now() - interval '7 hours'),
  ('Court of Appeal ruling cited in a new <b>Taita Taveta</b> filing', now() - interval '14 hours'),
  ('Interim conservatory orders sought over <b>Kerio Valley</b> works', now() - interval '21 hours'),
  ('NEMA licence appeal lodged at the Tribunal', now() - interval '28 hours'),
  ('Judgment reserved in coastal land tenure matter', now() - interval '35 hours')
) as v(headline, happened_at)
where not exists (select 1 from public.litigation_updates);

-- ===== policy_updates =====
create table if not exists public.policy_updates (
  id          uuid primary key default gen_random_uuid(),
  headline    text not null,
  link        text,
  published   boolean not null default true,
  happened_at timestamptz not null default now(),
  created_at  timestamptz not null default now()
);
alter table public.policy_updates enable row level security;
drop policy if exists policy_updates_read on public.policy_updates;
create policy policy_updates_read on public.policy_updates for select to anon, authenticated using (published);
drop policy if exists policy_updates_write on public.policy_updates;
create policy policy_updates_write on public.policy_updates for all to authenticated using (true) with check (true);
grant select on public.policy_updates to anon, authenticated;
grant insert, update, delete on public.policy_updates to authenticated;
insert into public.policy_updates (headline, happened_at)
select v.headline, v.happened_at from (values
  ('<b>Energy (Amendment) Bill 2026</b> committee sitting scheduled', now() - interval '0 hours'),
  ('Public participation window opens on carbon markets rules', now() - interval '7 hours'),
  ('County assembly tables <b>Kitui</b> mining benefit-sharing motion', now() - interval '14 hours'),
  ('NEMA publishes revised EIA guideline draft', now() - interval '21 hours'),
  ('Senate committee requests coalition submission on water abstraction', now() - interval '28 hours'),
  ('Gazette notice: new mineral rights register published', now() - interval '35 hours')
) as v(headline, happened_at)
where not exists (select 1 from public.policy_updates);

-- ===== funding_opportunities =====
create table if not exists public.funding_opportunities (
  id          uuid primary key default gen_random_uuid(),
  headline    text not null,
  link        text,
  published   boolean not null default true,
  happened_at timestamptz not null default now(),
  created_at  timestamptz not null default now()
);
alter table public.funding_opportunities enable row level security;
drop policy if exists funding_opportunities_read on public.funding_opportunities;
create policy funding_opportunities_read on public.funding_opportunities for select to anon, authenticated using (published);
drop policy if exists funding_opportunities_write on public.funding_opportunities;
create policy funding_opportunities_write on public.funding_opportunities for all to authenticated using (true) with check (true);
grant select on public.funding_opportunities to anon, authenticated;
grant insert, update, delete on public.funding_opportunities to authenticated;
insert into public.funding_opportunities (headline, happened_at)
select v.headline, v.happened_at from (values
  ('AJWS narrative reporting window opens', now() - interval '0 hours'),
  ('FIMI Ayni Fund call — indigenous-led content production', now() - interval '7 hours'),
  ('County documentation sub-grant applications close in 28 days', now() - interval '14 hours'),
  ('New climate justice fund announced for East Africa', now() - interval '21 hours'),
  ('Pre-COP31 delegate accreditation support available', now() - interval '28 hours')
) as v(headline, happened_at)
where not exists (select 1 from public.funding_opportunities);
