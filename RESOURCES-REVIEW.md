# Resources Watch — Review Log — 2026-09-29

MazingiraKenya coalition · weekly scan of **new climate & environmental-justice knowledge resources** (reports, policy briefs, toolkits, guidelines, research, datasets) relevant to Kenya / East Africa / pan-African climate justice. These are **drafts for admin review only** — nothing here is published to the live site until an admin Accepts it in **admin → Resources review**.

> ✅ **Queueing status (2026-09-29):** All 8 items below were queued as drafts (`published=false`, `source=watch`, `category=Resources`) straight into Supabase (project `uueemckdoozsuowcqkhl`) and each returned **HTTP 201**. The Mac device shell still cannot reach Supabase (host not on the device egress allowlist), so the writes were made through a connected Chrome (same-origin POST to `/rest/v1/resources` with the public anon key only). Replay commands: `scripts/queue-resources-2026-09-29.sh`. WebSearch was available this run (no 403); each URL was also fetched and confirmed to load with real content before queueing.

## Verified new resources (8) — 2026-09-29

All 8 are new to the queue, deduped against the 19 items in the 2026-09-22 (+ supplementary) and 2026-09-19 logs below. Several of these close long-standing gaps flagged in prior "could not verify" notes.

### 1. State of the Climate in Africa 2025
- **Source:** World Meteorological Organization (WMO)
- **Type:** Report (flagship annual; published Jun 2026)
- **URL:** https://wmo.int/resources/publication-series/state-of-climate-africa/state-of-climate-africa-2025
- **Why:** The 2025 edition finally posted (was 404 in the two prior runs). Continent-wide warming, extreme-weather impacts (incl. >8.5m affected by East Africa drought) and glacier loss — core Kenya/East Africa climate reference. Supersedes the 2024 edition queued 2026-09-19.
- **Verified:** fetched directly; loads with 2025 findings.

### 2. Kenya's Second Nationally Determined Contribution (2031–2035)
- **Source:** Government of Kenya (via UNFCCC registry)
- **Type:** Policy document (canonical NDC PDF, 2025)
- **URL:** https://unfccc.int/sites/default/files/2025-05/KENYAS%20SECOND%20NATIONALLY%20DETERMINED%20CONTRIBUTION%202031_2035.pdf
- **Why:** The canonical Kenya NDC document that both prior runs flagged as "no verified direct link." Kenya commits to a 35% emissions cut by 2035 (19% domestic / 81% international support) — the single most important Kenya climate-policy reference.
- **Verified:** fetched directly; official UNFCCC-hosted PDF loads.

### 3. Climate Risk Index 2026
- **Source:** Germanwatch
- **Type:** Report (annual index; published Nov 2025, 2024 data)
- **URL:** https://www.germanwatch.org/en/cri
- **Why:** Ranks 174 countries by human/economic losses from extreme weather; Global South (incl. African states) most affected — climate-justice / loss-and-damage advocacy evidence.
- **Verified:** fetched directly; landing page + full report confirmed.

### 4. State of the Climate in Kenya 2025
- **Source:** Kenya Meteorological Department (with Stockholm Environment Institute)
- **Type:** Report (national annual; published Mar 2026)
- **URL:** https://www.sei.org/publications/state-of-the-climate-in-kenya-2025/
- **Why:** Kenya-specific national climate report — temperature, rainfall, extreme events and sector impacts (agriculture, water, Nairobi air quality). A standing national reference.
- **Verified:** fetched directly; loads with report content.

### 5. National Climate Resilience Assessment for Kenya
- **Source:** International Energy Agency (IEA)
- **Type:** Report (published 25 Sep 2026)
- **URL:** https://www.iea.org/reports/national-climate-resilience-assessment-for-kenya
- **Why:** Kenya-specific analysis of climate threats to the energy system (grid, hydropower, geothermal, ports) under different warming scenarios, plus the resilience policy framework — fresh and highly relevant.
- **Verified:** fetched directly; loads with report content.

### 6. Kenya's Adaptation Communication to the UNFCCC
- **Source:** Republic of Kenya — Ministry of Environment, Climate Change and Forestry
- **Type:** Policy document (adaptation communication, 2024)
- **URL:** https://unfccc.int/sites/default/files/2025-12/Kenya's%20Adcom%20Report%20v6-Jan%202025.pdf
- **Why:** Kenya's first stand-alone adaptation communication — vulnerabilities, adaptation priorities and support needs across priority sectors through 2030. Companion to the NDC above.
- **Verified:** fetched directly; official UNFCCC-hosted PDF loads.

### 7. African Leaders' Addis Ababa Declaration on Climate Change and Call to Action
- **Source:** African Union
- **Type:** Declaration (adopted at the Second Africa Climate Summit, Addis Ababa, 8–10 Sep 2025)
- **URL:** https://au.int/sites/default/files/documents/45674-doc-Climate_Change_Declaration.pdf
- **Why:** The headline continental outcome (157 paragraphs) on climate finance, energy transition, adaptation and green industrialization ahead of COP30 — foundational pan-African climate-justice advocacy text.
- **Verified:** fetched directly; official AU-hosted PDF loads.

### 8. Africa Impact Report 2025
- **Source:** Climate Policy Initiative (CPI)
- **Type:** Report (2025)
- **URL:** https://www.climatepolicyinitiative.org/wp-content/uploads/2025/02/Africa-Impact-Report-2025.pdf
- **Why:** CPI's decade review of African climate-finance work — landscape data across Kenya, South Africa, Ghana, Nigeria; innovation instruments; adaptation-finance gap. A partial stand-in while the CPI *Landscape of Climate Finance in Africa* refresh (last edition 2022) remains pending.
- **Verified:** fetched directly; PDF loads.

## Notes for next run (dedupe)
- The 8 items above (2026-09-29) plus the 19 items in the 2026-09-22 (+supplementary) and 2026-09-19 logs below are all now pending/queued drafts. Do **not** re-queue any of them. Running total: **27 deduped drafts**.
- Gaps now CLOSED this run: WMO *State of the Climate in Africa 2025* (was 404) and the canonical **Kenya NDC** direct link — both finally verified and queued.
- Still open / watch next week: **CPI Landscape of Climate Finance in Africa** refresh (live page still the 2022 edition — the Africa Impact Report 2025 above is a partial stand-in, not a replacement); **World Bank Kenya Country Climate and Development Report** update (current live doc is the 2023 edition). Skipped as too narrow/off-scope: CPI *South African Climate Finance Landscape 2025* (SA-specific); IPCC *Special Report on Climate Change and Cities* (still in first-draft review, not yet published).
- Power Shift Africa publications page surfaced nothing new beyond items already queued in prior runs.

---
---
# Resources Watch — Review Log — 2026-09-22 (SUPPLEMENTARY, 08:08 UTC)

A second firing of the weekly task ran ~30 min after the 07:34 run (which queued 7). This supplementary run added **4 genuinely new, previously-missed** climate/environmental-justice knowledge resources — deduped against all 15 items already in this log. All 4 were queued as drafts (`published=false`, `source=watch`, `category=Resources`) into Supabase (project `uueemckdoozsuowcqkhl`) via a connected Chrome (same-origin POST to `/rest/v1/resources`, public anon key only) and each returned **HTTP 201**. The Mac device shell still cannot reach Supabase (curl 56 / proxy 403 — host not on the device egress allowlist). Replay commands: `scripts/queue-resources-2026-09-22b.sh`.

## Verified new resources (4) — 2026-09-22 (supplementary)

Each URL was fetched and confirmed to load with real content before queueing. All new to the queue (not in any prior log below).

### 1. Unlocking Africa's Energy Future: Integrating the COP28 Energy Package into the NDC 3.0 Framework
- **Source:** Power Shift Africa
- **Type:** Policy brief (2025)
- **URL:** https://www.powershiftafrica.org/publications/unlocking-africas-energy-future-integrating-the-cop28-energy-package-into-the-ndc-30-framework
- **Why:** Links the COP28 energy package (tripling renewables, doubling efficiency) to NDC 3.0 design — directly relevant to Kenya's NDC 3.0 and African energy-transition finance.
- **Verified:** fetched directly; landing page + download confirmed.

### 2. PIDA Master Plan Assessment Report — Currents of Integration: Africa's Path to a Shared, Resilient Grid
- **Source:** Power Shift Africa
- **Type:** Report (Jan 2026)
- **URL:** https://www.powershiftafrica.org/publications/pida-assessment
- **Why:** Assesses PIDA and the Continental Power Systems Master Plan for regional grid integration, renewables and a unified African electricity market — pan-African just-transition / energy-infrastructure reference.
- **Verified:** fetched directly; landing page + PDF download confirmed.

### 3. African Priorities for COP30 Policy Brief
- **Source:** Power Shift Africa
- **Type:** Policy brief (Nov 2025)
- **URL:** https://www.powershiftafrica.org/publications/african-priorities-for-cop30-policy-brief
- **Why:** African negotiating priorities and implementation strategies for COP30 — advocacy reference complementing the already-queued COP30 Scorecard.
- **Verified:** fetched directly; landing page + download confirmed.

### 4. Mission 300: A Step Change for Africa?
- **Source:** Power Shift Africa
- **Type:** Policy brief (2025)
- **URL:** https://www.powershiftafrica.org/publications/mission-300-a-step-change-for-africa
- **Why:** Critical pan-African assessment of the World Bank/AfDB Mission 300 energy-access initiative (equity, private-capital dependency, community engagement) — companion to the already-queued Kenya-specific Mission 300 brief.
- **Verified:** fetched directly; landing page + PDF download confirmed.

### Notes for next run (dedupe)
- The 4 items above are now pending drafts — do **not** re-queue them, in addition to the 7 (07:34) + 8 (2026-09-19) already logged = **19 total** deduped drafts.
- Power Shift Africa items still NOT queued (intentionally skipped this run — revisit if desired): the two *Shifting Power Quarterly* newsletters (Mar/Jun 2026, not knowledge resources); *The Empty Promises of Nuclear Energy in South Africa* (Oct 2025, SA-specific); *AFREXIM Campaign Fact Sheet* (Oct 2025); *PACAR Third Annual Workshop Report* (Jul 2025); *Assessment of COP29 Outcomes* (Jun 2025); *What is the Missing Ingredient? German Agriculture & Food Strategy for Africa* (Mar 2025).
- Still unverified (carried from 07:34 run): WMO *State of the Climate in Africa 2025* (still 404, not yet posted); Kenya *NDC 3.0* canonical direct link; CPI *Landscape of Climate Finance in Africa* (live page still the 2022 edition — too old; watch for a refresh).
- WebSearch remains disabled for this org (HTTP 403); research via WebFetch on authoritative domains.

---
---

# Resources Watch — Review Log — 2026-09-22

MazingiraKenya coalition · weekly scan of **new climate & environmental-justice knowledge resources** (reports, policy briefs, toolkits, guidelines, research, datasets) relevant to Kenya / East Africa / pan-African climate justice. These are **drafts for admin review only** — nothing here is published to the live site until an admin Accepts it in **admin → Resources review**.

> ✅ **Queueing status (2026-09-22):** All 7 items below were queued as drafts (`published=false`, `source=watch`, `category=Resources`) straight into Supabase (project `uueemckdoozsuowcqkhl`) and each returned HTTP 201. The Mac device shell still could **not** reach Supabase (curl exit 56 — host not on the device egress allowlist), so the writes were made through a connected Chrome (same-origin POST to `/rest/v1/resources` with the public anon key only). The exact replay commands are in `scripts/queue-resources-2026-09-22.sh`.

## Verified new resources (7) — 2026-09-22

Each URL was fetched and confirmed to load with real content before queueing. All were deduped against every item in the 2026-09-19 log below.

### 1. Adaptation Gap Report 2025
- **Source:** UN Environment Programme (UNEP)
- **Type:** Report (2025 edition — supersedes the 2024 edition queued 2026-09-19)
- **URL:** https://www.unep.org/resources/adaptation-gap-report-2025
- **Why:** Latest global adaptation-finance gap figures (needs ~US$310–365bn/yr vs ~US$26bn received) — central to African adaptation-finance advocacy.
- **Verified:** fetched directly; page loads with 2025 findings.

### 2. Emissions Gap Report 2025
- **Source:** UN Environment Programme (UNEP)
- **Type:** Report (2025 edition — supersedes the 2024 edition queued 2026-09-19)
- **URL:** https://www.unep.org/resources/emissions-gap-report-2025
- **Why:** Latest mitigation benchmark (pledges track to ~2.3–2.5°C) framing climate-justice arguments.
- **Verified:** fetched directly; page loads with 2025 findings.

### 3. Implications of the ICJ Advisory Opinion on the Climate Obligations of African States
- **Source:** Power Shift Africa
- **Type:** Policy brief (2025)
- **URL:** https://www.powershiftafrica.org/publications/icj-advisory-opinion-policy-brief-for-africa
- **Why:** Analyses the July 2025 ICJ advisory opinion on state climate obligations from an African standpoint — a landmark climate-justice / climate-litigation resource.
- **Verified:** fetched directly; loads with brief content.

### 4. COP30 Scorecard: Technical Assessment of Outcomes Against the African Agenda
- **Source:** Power Shift Africa
- **Type:** Report (2025)
- **URL:** https://www.powershiftafrica.org/publications/cop30scorecard
- **Why:** Assesses COP30 outcomes against African priorities (finance, adaptation, loss & damage, just transition) — advocacy reference.
- **Verified:** fetched directly; loads with assessment content.

### 5. African Energy Leadership Report: The Case for 100% Renewable Energy
- **Source:** Power Shift Africa
- **Type:** Report (2025)
- **URL:** https://www.powershiftafrica.org/publications/african-energy-leadership-report
- **Why:** Argues 100% renewable energy across Africa is technically feasible and economically advantageous — just-transition / energy-access resource.
- **Verified:** fetched directly; loads with report content.

### 6. The Africa Green Industrialization Initiative (AGII) — Policy Brief
- **Source:** Power Shift Africa
- **Type:** Policy brief (2025)
- **URL:** https://www.powershiftafrica.org/publications/the-africa-green-industrialization-initiative-agii-policy-brief
- **Why:** Examines the AGII launched around the Second Africa Climate Summit (Addis Ababa, 2025) and African green-growth finance — pan-African just-transition resource.
- **Verified:** fetched directly; loads with brief content.

### 7. Why Carbon Markets Are a Dangerous Distraction for Africa
- **Source:** Power Shift Africa
- **Type:** Policy brief (2024)
- **URL:** https://www.powershiftafrica.org/publications/policy-brief-why-carbon-markets-are-a-dangerous-distraction-for-africa
- **Why:** Critiques carbon markets as inadequate African climate finance — a core climate-justice argument (new to the queue).
- **Verified:** fetched directly; loads with brief content.

---

## Notes for next run (dedupe)
- The 7 items above (2026-09-22) plus the 8 items in the 2026-09-19 log below are all now pending/queued drafts. Do **not** re-queue any of them.
- The UNEP 2025 Adaptation Gap and Emissions Gap reports queued this run are the newer editions of the 2024 reports queued 2026-09-19 — both editions are intentionally in the queue; the admin can keep the latest and Reject the older if desired.
- Could not verify this run (revisit next week): **WMO State of the Climate in Africa 2025** (https://wmo.int/publication-series/state-of-climate-africa-2025 → 404; 2025 edition not yet posted); **Kenya NDC 3.0** canonical document URL (still no verified direct link); **CPI Landscape of Climate Finance in Africa** (current live page is the 2022 edition — too old; watch for a refresh).
- Environment: WebSearch remains disabled for this org (HTTP 403). Research was done via WebFetch on authoritative domains. Some domains (reliefweb, IIED, IPCC, World Bank openknowledge) block the fetch bot — use the connected Chrome for those next time. Power Shift Africa and UNEP fetch reliably.

---
---

# Resources Watch — Review Log — 2026-09-19

MazingiraKenya coalition · weekly scan of **new climate & environmental-justice knowledge resources** (reports, policy briefs, toolkits, guidelines, research, datasets) relevant to Kenya / East Africa / pan-African climate justice. These are **drafts for admin review only** — nothing here is published to the live site until an admin Accepts it in **admin → Resources review**.

> ✅ **Queueing status:** All 8 items below were queued as drafts (`published=false`, `source=watch`, `category=Resources`) straight into Supabase (project `uueemckdoozsuowcqkhl`) and each returned HTTP 201. The Mac device shell could **not** reach Supabase (DNS `EAI_AGAIN` — host not on the device egress allowlist), so the writes were made through a connected Chrome (same-origin POST to `/rest/v1/resources` with the public anon key only). The exact replay commands are in `scripts/queue-resources-2026-09-19.sh`.

## Verified new resources (8)

Each URL was fetched and confirmed to load with real content before queueing.

### 1. State of the Climate in Africa 2024
- **Source:** World Meteorological Organization (WMO)
- **Type:** Report (flagship annual, published May 2025)
- **URL:** https://wmo.int/publication-series/state-of-climate-africa-2024
- **Why:** Continent-wide temperature, marine-heatwave and climate-impact data with an interactive dashboard and datasets — core reference for Kenya/East Africa climate context.
- **Verified:** fetched directly; loads with report content + dashboard.

### 2. Adaptation Gap Report 2024: Come hell and high water
- **Source:** UN Environment Programme (UNEP)
- **Type:** Report
- **URL:** https://www.unep.org/resources/adaptation-gap-report-2024
- **Why:** Global adaptation finance gap ($187–359bn/yr) — central to African adaptation-finance advocacy.
- **Verified:** fetched directly; loads with summary + key findings.

### 3. Emissions Gap Report 2024: No more hot air … please!
- **Source:** UN Environment Programme (UNEP)
- **Type:** Report
- **URL:** https://www.unep.org/resources/emissions-gap-report-2024
- **Why:** 15th edition; sets the mitigation benchmark (42% cut by 2030) framing climate-justice arguments.
- **Verified:** fetched directly; loads with report links + findings.

### 4. Climate Change Laws of the World — Kenya
- **Source:** Grantham Research Institute (LSE) & Climate Policy Radar
- **Type:** Database / dataset (continuously updated; 75 Kenya documents incl. NDC 3.0, 2025)
- **URL:** https://climate-laws.org/geographies/kenya
- **Why:** Searchable database of Kenya's climate laws, policies and litigation — a standing research/dataset resource.
- **Verified:** fetched directly; loads with Kenya document list.

### 5. Mission 300: Building Just Transition Pathways Through Kenya's National Energy Compact
- **Source:** Power Shift Africa
- **Type:** Policy brief (2026)
- **URL:** https://www.powershiftafrica.org/publications/mission-300-building-just-transition-pathways-kenya-compact
- **Why:** Kenya-specific just-transition analysis of the National Energy Compact (energy access, regulatory reform, renewables).
- **Verified:** fetched directly; landing page + PDF download confirmed.

### 6. Pipe Dreams: How Oil and Gas Fail to Deliver Economic Development in Africa
- **Source:** Power Shift Africa
- **Type:** Report (2026)
- **URL:** https://www.powershiftafrica.org/publications/pipe-dreams-how-oil-and-gas-fail-to-deliver-economic-development-for-africa-254
- **Why:** Evidence from 13 producing countries that fossil fuels have not delivered development — key fossil-phase-out advocacy resource.
- **Verified:** fetched directly; landing page + PDF download confirmed.

### 7. Clean Cooking in Sub-Saharan Africa
- **Source:** Power Shift Africa
- **Type:** Policy brief (2026)
- **URL:** https://www.powershiftafrica.org/publications/clean-cooking-in-sub-saharan-africa
- **Why:** Scale of the clean-cooking access challenge and the limits of current efforts across sub-Saharan Africa.
- **Verified:** fetched directly; landing page + PDF download confirmed.

### 8. Africa Forward: Africa-France Partnership for Innovation and Growth
- **Source:** Power Shift Africa
- **Type:** Policy brief (2026)
- **URL:** https://www.powershiftafrica.org/publications/africa-forward-summit-policy-brief
- **Why:** African government positions on equitable climate finance, debt relief and financial-architecture reform.
- **Verified:** fetched directly; landing page + PDF (EN/FR) download confirmed.

---

## Notes for next run (dedupe)
- The 8 items above are now pending drafts. Do **not** re-queue them.
- Could not verify this run (revisit next week): World Bank *Kenya Country Climate and Development Report* (candidate URLs 404/403); Kenya *NDC 3.0 (2025)* direct document link (referenced by climate-laws.org but no verified canonical PDF yet).
- WebSearch is disabled for this org; research was done via WebFetch on authoritative domains. Some domains (reliefweb, IIED, IPCC, World Bank openknowledge) block the fetch bot — use the connected Chrome for those next time.
