-- Seed the admin Partners table from the hub Directory (coalition partners only:
-- funders and contested actors are left out). Safe to re-run: a partner is skipped
-- if a row whose name contains its short name already exists. Emails are left
-- blank -- add them in admin -> Partners so Match & notify can reach them.

insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'deCOALonize', 'Coalition', 'oil, gas, coal, energy, land, forest, advocacy, campaign', 'National', 'deCOALonize', 'https://www.youtube.com/channel/UCU1vBwzZuIZ5zARXaJGRd1Q', 'https://decoalonize.net', true
  where not exists (select 1 from partners where lower(name) like '%decoalonize%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Save Lamu', 'Community', 'coal, energy, land, forest, water, plastics, waste, community', 'Coast, Lamu', 'savelamu', null, 'https://www.savelamu.org', true
  where not exists (select 1 from partners where lower(name) like '%save lamu%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'LAWA — Lamu Women Alliance', 'Community', 'coal, land, forest, water, community, youth, women, journalism', 'Coast, Lamu', 'lamuwomenallia1', 'https://www.youtube.com/Lamuwomenalliance', null, true
  where not exists (select 1 from partners where lower(name) like '%lawa%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'MKNF — Mount Kenya Network of Farmers', 'Community', 'water, land, forest, community, pastoralist, climate', 'Rift Valley, Laikipia', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%mknf%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Katiba Institute', 'Legal', 'oil, gas, coal, mining, minerals, water, land, forest, energy, legal, litigation', 'National', 'katibainstitute', 'https://www.youtube.com/@Katiba_Institute', 'https://katibainstitute.org', true
  where not exists (select 1 from partners where lower(name) like '%katiba institute%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Friends of Lake Turkana', 'Community', 'oil, gas, water, energy, community, lake', 'Rift Valley, Turkana', 'FoLTurkana', null, 'https://friendsoflaketurkana.org', true
  where not exists (select 1 from partners where lower(name) like '%friends of lake turkana%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Green Belt Movement', 'Research', 'land, forest, water, research, reforestation', 'National', 'GreenBeltMovmnt', 'https://www.youtube.com/@TheGreenBeltMovement', 'https://www.greenbeltmovement.org', true
  where not exists (select 1 from partners where lower(name) like '%green belt movement%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Mazingira Trust', 'Research', 'mining, minerals, water, land, forest, energy, plastics, waste, research, coal', 'National', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%mazingira trust%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Greenpeace Africa', 'International', 'oil, gas, coal, energy, land, forest, plastics, waste, media', 'National', 'Greenpeaceafric', 'https://www.youtube.com/channel/UC9Mgh3aOcyJg7bTWdWrZNOw', 'https://www.greenpeace.org/africa/', true
  where not exists (select 1 from partners where lower(name) like '%greenpeace africa%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Fossil Fuel Non-Proliferation Treaty Initiative', 'International', 'oil, gas, coal', 'National, Transnational', 'fossiltreaty', 'https://www.youtube.com/channel/UC11W0u-g3ksZPSw_OXs_mBg', 'https://fossilfueltreaty.org', true
  where not exists (select 1 from partners where lower(name) like '%fossil fuel non-proliferation treaty initiative%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select '350 Africa', 'International', 'oil, gas, coal, energy', 'National', '350Africa', 'https://www.youtube.com/@350africa3', 'https://350africa.org', true
  where not exists (select 1 from partners where lower(name) like '%350 africa%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'CHRCE — Center for Human Rights & Civic Education', 'Community', 'coal, land, forest, community', 'Eastern, Kitui', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%chrce%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Natural Justice', 'Legal', 'oil, gas, coal, mining, minerals, water, land, forest, energy, legal, litigation', 'National', 'NaturalJustice', 'https://www.youtube.com/channel/UCBH2fwJvWtTeUNacZ-c51uw', 'https://naturaljustice.org', true
  where not exists (select 1 from partners where lower(name) like '%natural justice%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'KeNRA — Kenya National Rivers Association', 'Community', 'water, community, coal', 'National', 'kenrakenya', null, null, true
  where not exists (select 1 from partners where lower(name) like '%kenra%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Samburu Women''s Trust', 'Community', 'land, forest, water, community, women, gender, pastoralist, land rights', 'Rift Valley, Eastern, Samburu', 'samburuwtrust', null, null, true
  where not exists (select 1 from partners where lower(name) like '%samburu women''s trust%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'PACIDA — Pastoralist Community Initiative & Development Assistance', 'Community', 'water, land, forest, community, pastoralist, drought, climate', 'Eastern, Marsabit', null, 'https://www.youtube.com/@PACIDATV', null, true
  where not exists (select 1 from partners where lower(name) like '%pacida%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'NAMATI', 'Legal', 'land, forest, legal, litigation, climate', 'National', 'GlobalNamati', 'https://www.youtube.com/c/GlobalNamati', 'https://namati.org', true
  where not exists (select 1 from partners where lower(name) like '%namati%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'GROOTS Kenya', 'Community', 'land, forest, water, community, women, climate, land rights', 'National', 'GROOTSKenya', 'https://www.youtube.com/channel/UCB7VYNHpRAccZgltu7ldOuA', 'https://grootskenya.org', true
  where not exists (select 1 from partners where lower(name) like '%groots kenya%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Defenders Coalition', 'Coalition', 'land, forest, advocacy, campaign, coal, human rights, defenders', 'National', 'DefendersKE', 'https://www.youtube.com/channel/UCu8pzxS2PpXJ43CXSEidt8w', 'https://defenderscoalition.org', true
  where not exists (select 1 from partners where lower(name) like '%defenders coalition%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'PACJA — Pan African Climate Justice Alliance', 'Coalition', 'oil, gas, coal, mining, minerals, water, land, forest, energy, plastics, waste, advocacy, campaign, climate', 'National', 'PACJA1', 'https://www.youtube.com/channel/UCZ1kDCiFqwuez5rG8VbVc_g', 'https://pacja.org', true
  where not exists (select 1 from partners where lower(name) like '%pacja%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'KHRC — Kenya Human Rights Commission', 'Legal', 'coal, mining, minerals, land, forest, legal, litigation, gold', 'National', 'thekhrc', 'https://www.youtube.com/thekhrc', 'https://www.khrc.or.ke', true
  where not exists (select 1 from partners where lower(name) like '%khrc%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Mzalendo Halisi Foundation', 'Community', 'land, forest, coal, community, defenders', 'National', 'UtuNaUzalendoKE', 'https://www.youtube.com/@UtuNaUzalendoKE', null, true
  where not exists (select 1 from partners where lower(name) like '%mzalendo halisi foundation%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'ALDEF Kenya — Arid Lands Development Focus', 'Community', 'water, land, forest, community, pastoralist, drought', 'North Eastern, Wajir', 'aldefkenya', null, null, true
  where not exists (select 1 from partners where lower(name) like '%aldef kenya%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Wajir Peace & Development Agency (WPDA)', 'Community', 'water, land, forest, community', 'North Eastern, Wajir', 'Wajirpeace94', null, null, true
  where not exists (select 1 from partners where lower(name) like '%wajir peace & development agency%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Wajir Women for Environmental & Climate Change (WWECC)', 'Community', 'water, land, forest, community, women, climate', 'North Eastern, Wajir', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%wajir women for environmental & climate change%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Bunge la Wananchi (Wajir Chapter)', 'Community', 'land, forest, water, community, accountability', 'North Eastern, Wajir', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%bunge la wananchi%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Executive Rangeland Management Committees (ERMC)', 'Community', 'land, forest, water, community', 'North Eastern, Wajir', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%executive rangeland management committees%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Green Globe Realization & Youth Activists', 'Community', 'land, forest, water, community, youth, climate', 'North Eastern, Wajir', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%green globe realization & youth activists%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'MACSON — Marsabit Civil Society Network', 'Community', 'land, forest, water, community, accountability', 'Eastern, Marsabit', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%macson%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Green Africa Foundation', 'Research', 'land, forest, water, research', 'National', 'greenafricaorg', null, null, true
  where not exists (select 1 from partners where lower(name) like '%green africa foundation%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Saku Accountability Forum (SAF)', 'Community', 'land, forest, community, accountability', 'Eastern, Marsabit', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%saku accountability forum%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Marsabit Indigenous Organization Network', 'Community', 'land, forest, water, community', 'Eastern, Marsabit', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%marsabit indigenous organization network%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Voices for Just Climate Action (VJCA)', 'Coalition', 'land, forest, water, energy, advocacy, campaign, pastoralist, climate', 'National', 'WeAreVCA', 'https://www.youtube.com/@WeAreVCA', null, true
  where not exists (select 1 from partners where lower(name) like '%voices for just climate action%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Mandera Conservation Consortium (MaCoCo)', 'Community', 'land, forest, water, community, conservation', 'North Eastern, Mandera', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%mandera conservation consortium%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Barwaaqo Development Organization (BDO)', 'Community', 'water, land, forest, community, drought', 'North Eastern, Mandera', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%barwaaqo development organization%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Wa-PAYDO — Pastoralist Youth Development Organization', 'Community', 'land, forest, water, community, youth, pastoralist', 'North Eastern, Mandera', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%wa-paydo%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Cross-Border Community Resilience (CBCR) Networks', 'Community', 'water, land, forest, community, peace', 'North Eastern, Mandera', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%cross-border community resilience%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Pastoralist Community Initiatives (PCI)', 'Community', 'water, land, forest, community, pastoralist', 'North Eastern, Mandera', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%pastoralist community initiatives%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'StopEACOP (Kenya hub)', 'Coalition', 'oil, gas, advocacy, campaign, coal', 'National', 'stopEACOP', 'https://www.youtube.com/@Stop_EACOP', 'https://stopeacop.net', true
  where not exists (select 1 from partners where lower(name) like '%stopeacop%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'OSIENALA (Friends of Lake Victoria)', 'Community', 'water, land, forest, plastics, waste, community, lake', 'Nyanza, Kisumu', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%osienala%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Kisumu Environmental Champions (KEC)', 'Community', 'water, plastics, waste, land, forest, community, youth, lake, climate', 'Nyanza, Kisumu', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%kisumu environmental champions%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'SUSWATCH Kenya', 'Research', 'water, energy, land, forest, research, lake, climate', 'Nyanza, Kisumu', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%suswatch kenya%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Friends of Siaya Anti-Nuclear Plant (FSANP)', 'Community', 'energy, water, land, forest, community, nuclear', 'Nyanza, Siaya', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%friends of siaya anti-nuclear plant%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Kenya Anti-Nuclear Alliance (KANA)', 'Coalition', 'energy, advocacy, campaign', 'Nyanza, Siaya', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%kenya anti-nuclear alliance%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'ILEG — Institute for Law & Environmental Governance', 'Legal', 'mining, minerals, land, forest, water, energy, legal, litigation, land rights', 'Nyanza, Siaya Township', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%ileg%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'CIAGK — Community Initiative Action Group Kenya', 'Community', 'mining, minerals, land, forest, community, accountability', 'Nyanza, Siaya', 'CommunityCiag', null, null, true
  where not exists (select 1 from partners where lower(name) like '%ciagk%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Siaya Muungano Network (SIMUN)', 'Community', 'land, forest, water, energy, community, youth, women, climate', 'Nyanza, Siaya', 'SiayaNetwork', 'https://www.youtube.com/@siayamuunganonetwork4916', null, true
  where not exists (select 1 from partners where lower(name) like '%siaya muungano network%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Rona Foundation', 'Community', 'land, forest, water, community, climate', 'Nyanza, Siaya', 'RonaFoundation', 'https://www.youtube.com/channel/UCkizX5eSl4q8ty7g37MBBKA', null, true
  where not exists (select 1 from partners where lower(name) like '%rona foundation%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Busia CSO Network', 'Coalition', 'mining, minerals, water, land, forest, advocacy, campaign, climate', 'Western, Busia', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%busia cso network%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Tira Small Scale Mining Association', 'Community', 'mining, minerals, water, community, mercury', 'Western, Busia', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%tira small scale mining association%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'Dhamira Moja', 'Community', 'land, forest, energy, community, youth, climate', 'Western, Busia', null, null, null, true
  where not exists (select 1 from partners where lower(name) like '%dhamira moja%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'JustAct Kenya', 'Legal', 'land, forest, legal, litigation', 'National', 'justact_kenya', null, 'https://justactkenya.org', true
  where not exists (select 1 from partners where lower(name) like '%justact kenya%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'EarthLungs Reforestation Foundation', 'Research', 'land, forest, research, mangrove', 'Coast', null, null, 'https://www.earthlungs.org', true
  where not exists (select 1 from partners where lower(name) like '%earthlungs reforestation foundation%');
insert into partners (name, category, focus, region, x_handle, youtube, website, active)
  select 'FoNNaP — Friends of Nairobi National Park', 'Community', 'land, forest, water, plastics, waste, community', 'Nairobi, Rift Valley', 'FoNNaPKenya', null, 'https://fonnap.org', true
  where not exists (select 1 from partners where lower(name) like '%fonnap%');

-- Fill handles on partners that already existed under a slightly different name
-- (only where empty, so nothing you typed is overwritten)
update partners set x_handle = coalesce(x_handle, 'deCOALonize'), youtube = coalesce(youtube, 'https://www.youtube.com/channel/UCU1vBwzZuIZ5zARXaJGRd1Q') where lower(name) like '%decoalonize%';
update partners set x_handle = coalesce(x_handle, 'savelamu'), youtube = coalesce(youtube, null) where lower(name) like '%save lamu%';
update partners set x_handle = coalesce(x_handle, 'lamuwomenallia1'), youtube = coalesce(youtube, 'https://www.youtube.com/Lamuwomenalliance') where lower(name) like '%lawa%';
update partners set x_handle = coalesce(x_handle, 'katibainstitute'), youtube = coalesce(youtube, 'https://www.youtube.com/@Katiba_Institute') where lower(name) like '%katiba institute%';
update partners set x_handle = coalesce(x_handle, 'FoLTurkana'), youtube = coalesce(youtube, null) where lower(name) like '%friends of lake turkana%';
update partners set x_handle = coalesce(x_handle, 'GreenBeltMovmnt'), youtube = coalesce(youtube, 'https://www.youtube.com/@TheGreenBeltMovement') where lower(name) like '%green belt movement%';
update partners set x_handle = coalesce(x_handle, 'Greenpeaceafric'), youtube = coalesce(youtube, 'https://www.youtube.com/channel/UC9Mgh3aOcyJg7bTWdWrZNOw') where lower(name) like '%greenpeace africa%';
update partners set x_handle = coalesce(x_handle, 'fossiltreaty'), youtube = coalesce(youtube, 'https://www.youtube.com/channel/UC11W0u-g3ksZPSw_OXs_mBg') where lower(name) like '%fossil fuel non-proliferation treaty initiative%';
update partners set x_handle = coalesce(x_handle, '350Africa'), youtube = coalesce(youtube, 'https://www.youtube.com/@350africa3') where lower(name) like '%350 africa%';
update partners set x_handle = coalesce(x_handle, 'NaturalJustice'), youtube = coalesce(youtube, 'https://www.youtube.com/channel/UCBH2fwJvWtTeUNacZ-c51uw') where lower(name) like '%natural justice%';
update partners set x_handle = coalesce(x_handle, 'kenrakenya'), youtube = coalesce(youtube, null) where lower(name) like '%kenra%';
update partners set x_handle = coalesce(x_handle, 'samburuwtrust'), youtube = coalesce(youtube, null) where lower(name) like '%samburu women''s trust%';
update partners set x_handle = coalesce(x_handle, null), youtube = coalesce(youtube, 'https://www.youtube.com/@PACIDATV') where lower(name) like '%pacida%';
update partners set x_handle = coalesce(x_handle, 'GlobalNamati'), youtube = coalesce(youtube, 'https://www.youtube.com/c/GlobalNamati') where lower(name) like '%namati%';
update partners set x_handle = coalesce(x_handle, 'GROOTSKenya'), youtube = coalesce(youtube, 'https://www.youtube.com/channel/UCB7VYNHpRAccZgltu7ldOuA') where lower(name) like '%groots kenya%';
update partners set x_handle = coalesce(x_handle, 'DefendersKE'), youtube = coalesce(youtube, 'https://www.youtube.com/channel/UCu8pzxS2PpXJ43CXSEidt8w') where lower(name) like '%defenders coalition%';
update partners set x_handle = coalesce(x_handle, 'PACJA1'), youtube = coalesce(youtube, 'https://www.youtube.com/channel/UCZ1kDCiFqwuez5rG8VbVc_g') where lower(name) like '%pacja%';
update partners set x_handle = coalesce(x_handle, 'thekhrc'), youtube = coalesce(youtube, 'https://www.youtube.com/thekhrc') where lower(name) like '%khrc%';
update partners set x_handle = coalesce(x_handle, 'UtuNaUzalendoKE'), youtube = coalesce(youtube, 'https://www.youtube.com/@UtuNaUzalendoKE') where lower(name) like '%mzalendo halisi foundation%';
update partners set x_handle = coalesce(x_handle, 'aldefkenya'), youtube = coalesce(youtube, null) where lower(name) like '%aldef kenya%';
update partners set x_handle = coalesce(x_handle, 'Wajirpeace94'), youtube = coalesce(youtube, null) where lower(name) like '%wajir peace & development agency%';
update partners set x_handle = coalesce(x_handle, 'greenafricaorg'), youtube = coalesce(youtube, null) where lower(name) like '%green africa foundation%';
update partners set x_handle = coalesce(x_handle, 'WeAreVCA'), youtube = coalesce(youtube, 'https://www.youtube.com/@WeAreVCA') where lower(name) like '%voices for just climate action%';
update partners set x_handle = coalesce(x_handle, 'stopEACOP'), youtube = coalesce(youtube, 'https://www.youtube.com/@Stop_EACOP') where lower(name) like '%stopeacop%';
update partners set x_handle = coalesce(x_handle, 'CommunityCiag'), youtube = coalesce(youtube, null) where lower(name) like '%ciagk%';
update partners set x_handle = coalesce(x_handle, 'SiayaNetwork'), youtube = coalesce(youtube, 'https://www.youtube.com/@siayamuunganonetwork4916') where lower(name) like '%siaya muungano network%';
update partners set x_handle = coalesce(x_handle, 'RonaFoundation'), youtube = coalesce(youtube, 'https://www.youtube.com/channel/UCkizX5eSl4q8ty7g37MBBKA') where lower(name) like '%rona foundation%';
update partners set x_handle = coalesce(x_handle, 'justact_kenya'), youtube = coalesce(youtube, null) where lower(name) like '%justact kenya%';
update partners set x_handle = coalesce(x_handle, 'FoNNaPKenya'), youtube = coalesce(youtube, null) where lower(name) like '%fonnap%';

select name, category, region, x_handle, youtube, email from partners order by name;
