#!/usr/bin/env bash
# Queue all pending Events + Opportunities drafts (run 2026-08-17) into Supabase.
#
# WHY THIS EXISTS: the weekly watcher tasks run in a sandbox whose network proxy
# blocks the Supabase host, so their insert-*.mjs calls fail (HTTP 403 / DNS) and
# nothing reaches the admin review queue. Run THIS script once from your own
# machine (which can reach Supabase) to queue everything the watchers found.
# It uses the same anon-key + published=false RLS path — drafts only, never public.
#
#   cd /Users/vo/mazingira-hub && bash scripts/queue-all-drafts.sh
#
# Each line prints "... queued OK ... — awaiting admin review." on success.
# Then open admin → Events review / Opportunities review to Accept or Reject.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "=== Events (8) ==="
node scripts/insert-event-draft.mjs '{"title":"UNCCD COP17 — 17th UN Convention to Combat Desertification Conference of the Parties","start_date":"2026-08-17","time":"17–28 Aug 2026","location":"Ulaanbaatar, Mongolia","mode":"Hybrid","org":"UNCCD Secretariat / Government of Mongolia","link":"https://www.unccd.int/cop17","description":"Global land-restoration and drought negotiations under theme Restoring Land, Restoring Hope — directly relevant to Kenya drylands, pastoralists and Horn of Africa desertification."}'
node scripts/insert-event-draft.mjs '{"title":"18th World Congress on Public Health (WCPH 2026)","start_date":"2026-09-06","time":"6–9 Sep 2026","location":"Cape Town, South Africa","mode":"In person","org":"WFPHA & Public Health Association of South Africa","link":"https://www.wcph.org/","description":"Health Without Borders: Equity, Inclusion and Sustainability — includes Global Climate & Health Alliance sessions on climate, health and fossil fuels in Africa."}'
node scripts/insert-event-draft.mjs '{"title":"African Symposium on Climate Reparations: Accountability, Equity and Repair","start_date":"2026-09-30","time":"30 Sep – 1 Oct 2026","location":"Mombasa, Kenya","mode":"In person","org":"African Futures Lab & African Climate Reparations Collective","link":"https://www.afalab.org/the-latest/events/","description":"Pan-African convening in Kenya on climate reparations, state obligations and corporate accountability — core to East African climate-justice advocacy."}'
node scripts/insert-event-draft.mjs '{"title":"Pre-COP31 Ministerial Meeting","start_date":"2026-10-05","time":"5–8 Oct 2026","location":"Nadi, Fiji (leaders event in Tuvalu)","mode":"In person","org":"COP31 Presidency (Australia & Pacific partners) / UNFCCC","link":"https://unfccc.int/cop31/the-road-to-antalya","description":"Ministerial that sets negotiation priorities and landing zones ahead of COP31 — shapes the agenda the African bloc will push in Antalya."}'
node scripts/insert-event-draft.mjs '{"title":"CBD COP17 — 2026 UN Biodiversity Conference","start_date":"2026-10-19","time":"19–30 Oct 2026","location":"Yerevan, Armenia","mode":"Hybrid","org":"Convention on Biological Diversity / Government of Armenia","link":"https://www.cbd.int/conferences/2026","description":"Global biodiversity negotiations and Kunming-Montreal Framework implementation — bears on African ecosystem protection and nature-based climate solutions."}'
node scripts/insert-event-draft.mjs '{"title":"GreenShift Forum 2026","start_date":"2026-10-22","time":"22 Oct 2026","location":"Nairobi, Kenya","mode":"In person","org":"TechTrends Media & Ardena Consulting","link":"https://techtrendske.co.ke/2026/08/01/nairobi-to-host-esg-leaders-at-greenshift-forum-in-october/","description":"East African ESG, green finance and carbon-markets forum in Nairobi — practical climate-finance and just-transition angle coalition members can act on locally."}'
node scripts/insert-event-draft.mjs '{"title":"COP31 — 31st UNFCCC Conference of the Parties","start_date":"2026-11-09","time":"9–20 Nov 2026","location":"Antalya, Türkiye","mode":"Hybrid","org":"UNFCCC / COP31 Presidency","link":"https://unfccc.int/cop31","description":"Central annual UN climate negotiations — finance, adaptation, loss and damage and just transition outcomes that define the African climate-justice agenda."}'
node scripts/insert-event-draft.mjs '{"title":"COP31 World Leaders Summit","start_date":"2026-11-11","time":"11–12 Nov 2026","location":"Antalya, Türkiye","mode":"In person","org":"UNFCCC / COP31 Presidency","link":"https://unfccc.int/cop31/the-road-to-antalya","description":"Heads-of-state milestone within COP31 where high-level commitments including African leaders are announced."}'

echo "=== Opportunities (9) ==="
node scripts/insert-opportunity-draft.mjs '{"title":"COP31 Media / Focal-Point Accreditation (UNFCCC)","meta":"Accreditation · UNFCCC · registration open now for COP31 (9–20 Nov 2026)","url":"https://indico.un.org/event/1025065/","by":"UNFCCC / UN Climate Change"}'
node scripts/insert-opportunity-draft.mjs '{"title":"REACT — Women in Environmental Peacebuilding & Climate Change Prevention","meta":"Grant · The Kvinna till Kvinna Foundation · closes 28 Aug 2026","url":"https://kvinnatillkvinna.org/2026/08/03/call-for-proposals-react/","by":"The Kvinna till Kvinna Foundation"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Young Innovators (Environmental) Challenge 2026","meta":"Call · Kenya Community Development Foundation (KCDF) · closes 31 Aug 2026","url":"https://kcdf.or.ke/our-focus-areas/community-led-development/environmentalist-innovative-challenge-yeic","by":"Kenya Community Development Foundation (KCDF)"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Small Grants — Guinean Forests of West Africa Biodiversity Hotspot","meta":"Grant · Critical Ecosystem Partnership Fund (CEPF) · closes 31 Aug 2026","url":"https://www.cepf.net/grants/open-calls-for-proposals/gfwa-small-grants-cfp-july-2026","by":"Critical Ecosystem Partnership Fund (CEPF)"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Green and Just Energy Transition in South Africa","meta":"Grant · European Union · closes 27 Aug 2026","url":"https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/prospect-details/186091PROSPECTSEN","by":"European Union"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Innovate Africa Challenge 2026 — AI for Climate-Smart Agriculture","meta":"Call · Smart Africa & FAO · closes 31 Aug 2026","url":"https://sti-portal.fao.org/network/group/34/about","by":"Smart Africa & FAO"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Water and Sanitation Call for Proposals 2026 (climate resilience)","meta":"Grant · African Water Facility · closes 10 Sep 2026","url":"https://www.africanwaterfacility.org/en/news/awf-launches-2026-call-proposals-strengthen-africas-water-and-sanitation-investment-pipeline","by":"African Water Facility"}'
node scripts/insert-opportunity-draft.mjs '{"title":"PachiPanda Challenge Nigeria 2026 — Youth Environmental Solutions","meta":"Call · MTN, WWF, NCF, UNDP & Deloitte · closes 28 Aug 2026","url":"https://forms.cloud.microsoft/pages/responsepage.aspx?id=UMu5yUQ2tE2iZ_qE3y9M69rmdJRyczhFh4m3wbFU5hFUMUFZSDE0STZJSFBGODNJWjlPVFQ5QlJDSi4u&route=shorturl","by":"MTN Nigeria / WWF / NCF / UNDP / Deloitte"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Rufford Small Grants for Nature Conservation","meta":"Grant · The Rufford Foundation · Rolling (reviewed on a rolling basis)","url":"https://www.rufford.org/apply/","by":"The Rufford Foundation"}'

echo "=== Done. Open admin → Events review / Opportunities review to Accept or Reject. ==="
