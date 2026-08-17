# Events Watch — Admin Review Queue

**Run date (TODAY): 2026-08-17**
Coalition: MazingiraKenya · Prepared by: Events Watch (automated)
Scope: upcoming climate & environmental-justice events on or after 2026-08-17, relevant to Kenya/East Africa, pan-Africa, or globally significant to African climate justice.

> ⚠️ **Queueing status:** The insert script (`scripts/insert-event-draft.mjs`) could **not** post drafts this run — the Supabase host `uueemckdoozsuowcqkhl.supabase.co` is unreachable from the scheduled-run sandbox (proxy returns HTTP 403 on CONNECT; DNS unresolvable). No drafts were queued to the admin Events review tab. The 8 verified events below are ready to queue; an admin can run the commands in the "To queue manually" section from a machine with network access to Supabase. Nothing was published to the live site.

---

## Verified upcoming events (8)

### 1. UNCCD COP17 — 17th UN Convention to Combat Desertification COP
- **Date:** 2026-08-17 (17–28 Aug 2026)
- **Host:** UNCCD Secretariat / Government of Mongolia
- **Location & mode:** Ulaanbaatar, Mongolia — Hybrid
- **Relevance:** Global land-restoration and drought negotiations ("Restoring Land. Restoring Hope.") — directly relevant to Kenya's drylands, pastoralists and Horn of Africa desertification.
- **Link:** https://www.unccd.int/cop17

### 2. 18th World Congress on Public Health (WCPH 2026)
- **Date:** 2026-09-06 (6–9 Sep 2026)
- **Host:** WFPHA & Public Health Association of South Africa
- **Location & mode:** Cape Town, South Africa — In person
- **Relevance:** "Health Without Borders: Equity, Inclusion and Sustainability" — includes Global Climate & Health Alliance sessions on climate, health and fossil fuels in Africa.
- **Link:** https://www.wcph.org/

### 3. African Symposium on Climate Reparations: Accountability, Equity and Repair
- **Date:** 2026-09-30 (30 Sep – 1 Oct 2026)
- **Host:** African Futures Lab & African Climate Reparations Collective
- **Location & mode:** Mombasa, Kenya — In person
- **Relevance:** Pan-African convening in Kenya on climate reparations, state obligations and corporate accountability — core to East African climate-justice advocacy.
- **Link:** https://www.afalab.org/the-latest/events/

### 4. Pre-COP31 Ministerial Meeting
- **Date:** 2026-10-05 (5–8 Oct 2026)
- **Host:** COP31 Presidency (Australia & Pacific partners) / UNFCCC
- **Location & mode:** Nadi, Fiji (leaders' event in Tuvalu) — In person
- **Relevance:** Ministerial that sets negotiation priorities and landing zones ahead of COP31 — shapes the agenda the African bloc will push in Antalya.
- **Link:** https://unfccc.int/cop31/the-road-to-antalya

### 5. CBD COP17 — 2026 UN Biodiversity Conference
- **Date:** 2026-10-19 (19–30 Oct 2026)
- **Host:** Convention on Biological Diversity / Government of Armenia
- **Location & mode:** Yerevan, Armenia — Hybrid
- **Relevance:** Global biodiversity negotiations and Kunming-Montreal Framework implementation — bears on African ecosystem protection and nature-based climate solutions.
- **Link:** https://www.cbd.int/conferences/2026

### 6. GreenShift Forum 2026
- **Date:** 2026-10-22 (22 Oct 2026)
- **Host:** TechTrends Media & Ardena Consulting
- **Location & mode:** Nairobi, Kenya — In person
- **Relevance:** East African ESG, green finance and carbon-markets forum in Nairobi — practical climate-finance and just-transition angle coalition members can act on locally.
- **Link:** https://techtrendske.co.ke/2026/08/01/nairobi-to-host-esg-leaders-at-greenshift-forum-in-october/

### 7. COP31 — 31st UNFCCC Conference of the Parties
- **Date:** 2026-11-09 (9–20 Nov 2026)
- **Host:** UNFCCC / COP31 Presidency (Türkiye host, Australia presiding)
- **Location & mode:** Antalya, Türkiye — Hybrid
- **Relevance:** Central annual UN climate negotiations — finance, adaptation, loss & damage and just transition outcomes that define the African climate-justice agenda.
- **Link:** https://unfccc.int/cop31

### 8. COP31 World Leaders' Summit
- **Date:** 2026-11-11 (11–12 Nov 2026)
- **Host:** UNFCCC / COP31 Presidency
- **Location & mode:** Antalya, Türkiye — In person
- **Relevance:** Heads-of-state milestone within COP31 where high-level commitments (including African leaders') are announced.
- **Link:** https://unfccc.int/cop31/the-road-to-antalya

---

## To queue manually (run from a machine with Supabase access)

```bash
cd /Users/vo/mazingira-hub
node scripts/insert-event-draft.mjs '{"title":"UNCCD COP17 — 17th UN Convention to Combat Desertification Conference of the Parties","start_date":"2026-08-17","time":"17–28 Aug 2026","location":"Ulaanbaatar, Mongolia","mode":"Hybrid","org":"UNCCD Secretariat / Government of Mongolia","link":"https://www.unccd.int/cop17","description":"Global land-restoration and drought negotiations under theme Restoring Land, Restoring Hope — directly relevant to Kenya drylands, pastoralists and Horn of Africa desertification."}'
node scripts/insert-event-draft.mjs '{"title":"18th World Congress on Public Health (WCPH 2026)","start_date":"2026-09-06","time":"6–9 Sep 2026","location":"Cape Town, South Africa","mode":"In person","org":"WFPHA & Public Health Association of South Africa","link":"https://www.wcph.org/","description":"Health Without Borders: Equity, Inclusion and Sustainability — includes Global Climate & Health Alliance sessions on climate, health and fossil fuels in Africa."}'
node scripts/insert-event-draft.mjs '{"title":"African Symposium on Climate Reparations: Accountability, Equity and Repair","start_date":"2026-09-30","time":"30 Sep – 1 Oct 2026","location":"Mombasa, Kenya","mode":"In person","org":"African Futures Lab & African Climate Reparations Collective","link":"https://www.afalab.org/the-latest/events/","description":"Pan-African convening in Kenya on climate reparations, state obligations and corporate accountability — core to East African climate-justice advocacy."}'
node scripts/insert-event-draft.mjs '{"title":"Pre-COP31 Ministerial Meeting","start_date":"2026-10-05","time":"5–8 Oct 2026","location":"Nadi, Fiji (leaders event in Tuvalu)","mode":"In person","org":"COP31 Presidency (Australia & Pacific partners) / UNFCCC","link":"https://unfccc.int/cop31/the-road-to-antalya","description":"Ministerial that sets negotiation priorities and landing zones ahead of COP31 — shapes the agenda the African bloc will push in Antalya."}'
node scripts/insert-event-draft.mjs '{"title":"CBD COP17 — 2026 UN Biodiversity Conference","start_date":"2026-10-19","time":"19–30 Oct 2026","location":"Yerevan, Armenia","mode":"Hybrid","org":"Convention on Biological Diversity / Government of Armenia","link":"https://www.cbd.int/conferences/2026","description":"Global biodiversity negotiations and Kunming-Montreal Framework implementation — bears on African ecosystem protection and nature-based climate solutions."}'
node scripts/insert-event-draft.mjs '{"title":"GreenShift Forum 2026","start_date":"2026-10-22","time":"22 Oct 2026","location":"Nairobi, Kenya","mode":"In person","org":"TechTrends Media & Ardena Consulting","link":"https://techtrendske.co.ke/2026/08/01/nairobi-to-host-esg-leaders-at-greenshift-forum-in-october/","description":"East African ESG, green finance and carbon-markets forum in Nairobi — practical climate-finance and just-transition angle coalition members can act on locally."}'
node scripts/insert-event-draft.mjs '{"title":"COP31 — 31st UNFCCC Conference of the Parties","start_date":"2026-11-09","time":"9–20 Nov 2026","location":"Antalya, Türkiye","mode":"Hybrid","org":"UNFCCC / COP31 Presidency","link":"https://unfccc.int/cop31","description":"Central annual UN climate negotiations — finance, adaptation, loss and damage and just transition outcomes that define the African climate-justice agenda."}'
node scripts/insert-event-draft.mjs '{"title":"COP31 World Leaders Summit","start_date":"2026-11-11","time":"11–12 Nov 2026","location":"Antalya, Türkiye","mode":"In person","org":"UNFCCC / COP31 Presidency","link":"https://unfccc.int/cop31/the-road-to-antalya","description":"Heads-of-state milestone within COP31 where high-level commitments including African leaders are announced."}'
```

*Approved events go live only when a human admin clicks Accept in the admin Events review tab. This log is a draft queue, not a publication.*
