# Events Watch — Admin Review Queue

**Run date (TODAY): 2026-09-22**
Coalition: MazingiraKenya · Prepared by: Events Watch (automated, device-bound)
Scope: upcoming climate & environmental-justice events on or after 2026-09-22, relevant to Kenya/East Africa, pan-Africa, or globally significant to African climate justice.

> ✅ **Queueing status:** 2 NEW verified events below were written **straight to Supabase as drafts (`published=false`, `source=watch`)** via the connected-browser write path — both inserts returned **HTTP 201**. Review and Accept/Reject them in **admin → Events review**. Nothing is public until an admin Accepts. (Anon `select` still returns 0 published rows, as expected — the 2026-09-19 drafts remain pending admin review and are not re-inserted here; dedupe is against this log.)

**Verification notes:** Each event was confirmed against a primary/organiser source and is future-dated (on/after 2026-09-22). Several candidates surfaced this run were **dropped as not future-dated or unverifiable**: UNEA-7 (a 10times/aggregator listing showed Dec 2026, but the authoritative UNEP source confirms UNEA-7 was **8–12 Dec 2025** — past); ICRECC Eldoret (April 2026 — past); Kenya Green Energy Conference & Expo (March 2026 — past); AISA 2026 Nairobi (July 2026 — past); Pan-African Conference on Environment, Climate Change & Health (Oct 2025 — past); Africa Clean Energy Summit 2026 and Just Transition Conference Africa 2026 (no firm future date/venue found — unverifiable, skipped per verified-only rule).

---

## Drafts queued this run (2) — all published=false, source=watch

| # | Event | Date(s) | Location | Mode | Host | Status |
|---|-------|---------|----------|------|------|--------|
| 1 | Carbon Markets Africa Summit (CMAS) 2026 | 13–15 Oct 2026 | Kigali, Rwanda | In person | VUKA Group / Rwanda Min. of Environment, UNDP & AfDB | INSERTED 201 |
| 2 | 9th GLF Investment Case Symposium | 18 Nov 2026 | Antalya, Türkiye (& online) | Hybrid | Global Landscapes Forum & Govt of Luxembourg | INSERTED 201 |

**New this run (not previously logged):** Carbon Markets Africa Summit (CMAS) 2026 (1), 9th GLF Investment Case Symposium (2).

**Dedupe:** All 9 events from the 2026-09-19 run (Reparations Symposium, African Energy Week, Africa Climate Forum, CBD COP17, GreenShift Forum, Global Off-Grid Solar Forum, 5th EIK Conference, COP31, ESG & Climate Africa Summit) were checked and **not re-queued** — they remain in the review queue from that run.

Reproducible record: `scripts/queue-events-2026-09-22.sh`.

*Approved events go live only when a human admin clicks Accept in the admin Events review tab. This log is a draft queue, not a publication.*

---

<!-- ================= PREVIOUS RUNS BELOW ================= -->

# Events Watch — Admin Review Queue

**Run date (TODAY): 2026-09-19**
Coalition: MazingiraKenya · Prepared by: Events Watch (automated, device-bound)
Scope: upcoming climate & environmental-justice events on or after 2026-09-19, relevant to Kenya/East Africa, pan-Africa, or globally significant to African climate justice.

> ✅ **Queueing status:** All 9 verified events below were written **straight to Supabase as drafts (`published=false`)** via the connected-browser write path — every insert returned **HTTP 201**. No 409 duplicates, which confirms the 2026-08-17 items had never actually reached the DB (that run's inserts failed). The public calendar was empty (anon `select` returned `[]`, i.e. 0 published events) before this run. Review and Accept/Reject them in **admin → Events review**. Nothing is public until an admin Accepts.

**Verification notes:** Each event was confirmed against a primary/organiser source and is future-dated. Two items carried over from the 2026-08-17 backlog were **dropped as unverified** — the "Pre-COP31 Ministerial (Fiji/Tuvalu)" and a separate "COP31 World Leaders' Summit (11–12 Nov)" are **not** listed on the official UNFCCC road-to-Antalya page, so they were not queued. Two 2026-08-17 items are now **past** (UNCCD COP17, WCPH 2026) and were skipped.

---

## Drafts queued this run (9) — all published=false, source=watch

| # | Event | Date(s) | Location | Mode | Host | Status |
|---|-------|---------|----------|------|------|--------|
| 1 | African Symposium on Climate Reparations | 30 Sep – 1 Oct 2026 | Mombasa, Kenya | In person | African Climate Reparations Collective / African Futures Lab | INSERTED 201 |
| 2 | African Energy Week 2026 | 12–16 Oct 2026 | Cape Town, South Africa | In person | African Energy Chamber | INSERTED 201 |
| 3 | Africa Climate Forum (ACF) 2026 | 13–14 Oct 2026 | Abuja, Nigeria | In person | GCLBE | INSERTED 201 |
| 4 | CBD COP17 — 2026 UN Biodiversity Conference | 19–30 Oct 2026 | Yerevan, Armenia | Hybrid | Convention on Biological Diversity | INSERTED 201 |
| 5 | GreenShift Forum 2026 | 22 Oct 2026 | Nairobi, Kenya | In person | TechTrends Media & Ardena Consulting | INSERTED 201 |
| 6 | Global Off-Grid Solar Forum & Expo 2026 | 27–29 Oct 2026 | Kigali, Rwanda | In person | GOGLA & World Bank ESMAP | INSERTED 201 |
| 7 | 5th EIK International Environmental Conference & Expo 2026 | 28–30 Oct 2026 | Mombasa, Kenya | In person | Environment Institute of Kenya (EIK) | INSERTED 201 |
| 8 | COP31 — 31st UNFCCC Conference of the Parties | 9–20 Nov 2026 | Antalya, Türkiye | Hybrid | UNFCCC / COP31 Presidency | INSERTED 201 |
| 9 | 2nd Annual ESG and Climate Africa Summit 2026 | 24–25 Nov 2026 | Nairobi, Kenya | In person | Leadvent Group | INSERTED 201 |

**New this run (not previously logged):** African Energy Week (2), Africa Climate Forum (3), Global Off-Grid Solar Forum (6), 5th EIK Conference (7), ESG & Climate Africa Summit (9).
**Re-queued from 2026-08-17 backlog (verified still-upcoming, never actually inserted):** Reparations Symposium (1), CBD COP17 (4), GreenShift (5), COP31 (8).

Reproducible record: `scripts/queue-events-2026-09-19.sh`.

*Approved events go live only when a human admin clicks Accept in the admin Events review tab. This log is a draft queue, not a publication.*

---

<!-- ================= PREVIOUS RUNS BELOW ================= -->

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
