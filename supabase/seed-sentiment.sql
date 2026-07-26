-- MazingiraKenya — seed the sentiment feed so the hub's LIVE read has data to show.
-- Paste into the Supabase SQL Editor → Run. These are the same 8 real items the hub shows
-- as its static fallback, so once this runs the feed looks identical but now says
-- "● Live from Supabase". The scanner will keep adding to this table later.

insert into sentiment_items (source, source_type, title, url, published_at, stance, theme) values
('Daily Nation','news','Climate activists reject Dangote''s Sh2.2tn Lamu oil refinery','https://nation.africa/kenya/climate/climate-environmental-activists-reject-dangote-s-proposed-sh2-2-trillion-lamu-oil-refinery-project--5526536','2026-07-20','supportive','lamu-refinery'),
('Climate Home News','news','Campaigners oppose Dangote refinery over climate & ecological risks','https://www.climatechangenews.com/2026/07/15/campaigners-oppose-dangotes-planned-kenya-refinery-over-climate-and-ecological-risks/','2026-07-15','supportive','lamu-refinery'),
('The Star','news','Kenya unveils Africa''s first national carbon registry','https://www.the-star.co.ke/news/2026-02-17-kenya-unveils-africas-first-national-carbon-registry','2026-02-17','neutral','carbon-credits'),
('Daily Nation','news','Carbon credits: the gamble communities are rejecting','https://nation.africa/kenya/climate/carbon-credits-government-gamble-communities-rejecting-5453972','2026-06-10','supportive','carbon-credits'),
('African Leadership','news','Kenya''s geothermal surge fuels Africa''s renewable future','https://www.africanleadershipmagazine.co.uk/kenyas-geothermal-power-surge-fuels-africas-renewable-energy-future/','2026-05-28','supportive','geothermal'),
('Earth Island Journal','scholarly','Kenya''s carbon market: a setback for Indigenous land rights','https://www.earthisland.org/journal/index.php/articles/entry/kenyas-growing-carbon-market-setback-indigenous-land-rights/','2026-04-15','neutral','carbon-credits'),
('SOMO','scholarly','Carbon: the new frontier in the scramble for Kenyan land','https://www.somo.nl/carbon-the-new-frontier-in-the-scramble-for-land-in-kenya/','2026-03-22','neutral','carbon-credits'),
('Bloomberg','news','Greenpeace warns $17bn Lamu refinery threatens the ecosystem','https://www.bloomberg.com/news/articles/2026-07-15/greenpeace-warns-dangote-s-17-billion-kenya-refinery-threatens-lamu-ecosystem','2026-07-15','supportive','lamu-refinery')
on conflict (url) do nothing;

-- verify:
select source, stance, title from sentiment_items order by published_at desc;
