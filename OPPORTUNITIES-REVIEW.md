# Opportunities Watch — Review Log — 2026-08-17

MazingiraKenya coalition · weekly scan of **currently-open** climate & environmental-justice opportunities relevant to Kenya and Africa. All deadlines are **on or after 2026-08-17** (or explicitly Rolling). These are **drafts for admin review only** — nothing here is published to the live site.

> ⚠️ **Queueing status:** The `insert-opportunity-draft.mjs` calls could **not** reach Supabase from this run — the sandbox proxy blocked the host `uueemckdoozsuowcqkhl.supabase.co` (HTTP 403 from proxy / DNS `EAI_AGAIN`). This is an environment network restriction, **not** an RLS/permission error. No drafts were queued. The exact commands to queue all 9 items are at the bottom of this file — run them from `/Users/vo/mazingira-hub` on a machine with network access.

## Verified open opportunities (9)

### 1. COP31 Media / Focal-Point Accreditation
- **Funder / host:** UNFCCC / UN Climate Change
- **Type:** Accreditation
- **Deadline:** Registration open now (COP31 runs 9–20 Nov 2026, Antalya)
- **Eligibility:** Media organisations register a media focal point to assign journalists — open to African outlets covering COP31.
- **URL:** https://indico.un.org/event/1025065/
- **Verified:** directly on indico.un.org (registration listed as "currently open").

### 2. REACT — Women in Environmental Peacebuilding & Climate Change Prevention
- **Funder / host:** The Kvinna till Kvinna Foundation
- **Type:** Grant
- **Deadline:** 28 Aug 2026
- **Eligibility:** Legally registered women-led CSOs/CBOs in Uganda, Rwanda and DRC (climate action, peacebuilding, gender-responsive policy).
- **URL:** https://kvinnatillkvinna.org/2026/08/03/call-for-proposals-react/
- **Verified:** directly (official call page + GSO write-up).

### 3. Young Innovators (Environmental) Challenge 2026
- **Funder / host:** Kenya Community Development Foundation (KCDF) & I&M Foundation
- **Type:** Call
- **Deadline:** 31 Aug 2026
- **Eligibility:** Kenya-resident youth (15–35) and registered youth-led orgs with environmental innovations supporting Kenya's green transition.
- **URL:** https://kcdf.or.ke/our-focus-areas/community-led-development/environmentalist-innovative-challenge-yeic
- **Verified:** deadline/eligibility confirmed via search of KCDF listings.

### 4. Small Grants — Guinean Forests of West Africa Biodiversity Hotspot
- **Funder / host:** Critical Ecosystem Partnership Fund (CEPF)
- **Type:** Grant
- **Deadline:** 31 Aug 2026 (Letters of Inquiry)
- **Eligibility:** NGOs, community groups, universities and small enterprises in 11 West/Central African countries; up to US$50,000.
- **URL:** https://www.cepf.net/grants/open-calls-for-proposals/gfwa-small-grants-cfp-july-2026
- **Verified:** confirmed on cepf.net.

### 5. Green and Just Energy Transition in South Africa
- **Funder / host:** European Union
- **Type:** Grant
- **Deadline:** 27 Aug 2026
- **Eligibility:** NGOs, communities, labour unions and local authorities in South Africa engaging in the green transition; €2,550,000.
- **URL:** https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/prospect-details/186091PROSPECTSEN
- **Verified:** listed on the EU F&T portal (via AfricanNGOs curated list, 10 Aug 2026).

### 6. Innovate Africa Challenge 2026 — AI for Climate-Smart Agriculture
- **Funder / host:** Smart Africa & FAO
- **Type:** Call
- **Deadline:** 31 Aug 2026
- **Eligibility:** AI-driven climate-smart agriculture solutions in Ghana, Kenya, Malawi, Rwanda and Uganda; US$50,000.
- **URL:** https://sti-portal.fao.org/network/group/34/about
- **Verified:** via AfricanNGOs curated list (10 Aug 2026).

### 7. Water and Sanitation Call for Proposals 2026 (climate resilience)
- **Funder / host:** African Water Facility
- **Type:** Grant
- **Deadline:** 10 Sep 2026
- **Eligibility:** High-impact water/sanitation projects across Africa that strengthen climate resilience and service delivery; up to €1 million.
- **URL:** https://www.africanwaterfacility.org/en/news/awf-launches-2026-call-proposals-strengthen-africas-water-and-sanitation-investment-pipeline
- **Verified:** via AfricanNGOs curated list (10 Aug 2026).

### 8. PachiPanda Challenge Nigeria 2026 — Youth Environmental Solutions
- **Funder / host:** MTN Nigeria / WWF / NCF / UNDP / Deloitte
- **Type:** Call
- **Deadline:** 28 Aug 2026
- **Eligibility:** Young people and youth-led SMEs in Nigeria developing long-term environmental/sustainability solutions; up to ₦10 million.
- **URL:** https://forms.cloud.microsoft/pages/responsepage.aspx?id=UMu5yUQ2tE2iZ_qE3y9M69rmdJRyczhFh4m3wbFU5hFUMUFZSDE0STZJSFBGODNJWjlPVFQ5QlJDSi4u&route=shorturl
- **Verified:** via AfricanNGOs curated list (10 Aug 2026). Note: application is a hosted MS Form.

### 9. Rufford Small Grants for Nature Conservation
- **Funder / host:** The Rufford Foundation
- **Type:** Grant
- **Deadline:** Rolling (applications reviewed on a rolling basis)
- **Eligibility:** Nature-conservation projects in emerging/developing economies, incl. Kenya and across Africa; £7,000–£18,000.
- **URL:** https://www.rufford.org/apply/
- **Verified:** via AfricanNGOs curated list (10 Aug 2026).

---

## Notable items checked and DROPPED (past deadline or out of scope)
- EJN COP31 CCMP Reporting Fellowship — applications closed 17 Jun 2026.
- MESHA ARECCCA Climate Media Fellowship — closed 21 Feb 2026.
- Cultural Survival Indigenous Community Media Fund (2027) — closed 9 Aug 2026.
- Africa Climate Justice Movement grants — closed 12 Aug 2026.
- Urgent Action Fund-Africa (Feminist Knowledge & Documentation) — closed 12 Aug 2026.
- Australian Direct Aid Programme East Africa — closed 16 Aug 2026.
- NDN Collective Community Action Fund — open (16 Oct 2026) but eligibility limited to US/Canada/Mexico Indigenous groups; not Africa-eligible.

---

## Commands to queue these drafts (run from /Users/vo/mazingira-hub)

```bash
node scripts/insert-opportunity-draft.mjs '{"title":"COP31 Media / Focal-Point Accreditation (UNFCCC)","meta":"Accreditation · UNFCCC · registration open now for COP31 (9–20 Nov 2026)","url":"https://indico.un.org/event/1025065/","by":"UNFCCC / UN Climate Change"}'
node scripts/insert-opportunity-draft.mjs '{"title":"REACT — Women in Environmental Peacebuilding & Climate Change Prevention","meta":"Grant · The Kvinna till Kvinna Foundation · closes 28 Aug 2026","url":"https://kvinnatillkvinna.org/2026/08/03/call-for-proposals-react/","by":"The Kvinna till Kvinna Foundation"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Young Innovators (Environmental) Challenge 2026","meta":"Call · Kenya Community Development Foundation (KCDF) · closes 31 Aug 2026","url":"https://kcdf.or.ke/our-focus-areas/community-led-development/environmentalist-innovative-challenge-yeic","by":"Kenya Community Development Foundation (KCDF)"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Small Grants — Guinean Forests of West Africa Biodiversity Hotspot","meta":"Grant · Critical Ecosystem Partnership Fund (CEPF) · closes 31 Aug 2026","url":"https://www.cepf.net/grants/open-calls-for-proposals/gfwa-small-grants-cfp-july-2026","by":"Critical Ecosystem Partnership Fund (CEPF)"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Green and Just Energy Transition in South Africa","meta":"Grant · European Union · closes 27 Aug 2026","url":"https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/prospect-details/186091PROSPECTSEN","by":"European Union"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Innovate Africa Challenge 2026 — AI for Climate-Smart Agriculture","meta":"Call · Smart Africa & FAO · closes 31 Aug 2026","url":"https://sti-portal.fao.org/network/group/34/about","by":"Smart Africa & FAO"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Water and Sanitation Call for Proposals 2026 (climate resilience)","meta":"Grant · African Water Facility · closes 10 Sep 2026","url":"https://www.africanwaterfacility.org/en/news/awf-launches-2026-call-proposals-strengthen-africas-water-and-sanitation-investment-pipeline","by":"African Water Facility"}'
node scripts/insert-opportunity-draft.mjs '{"title":"PachiPanda Challenge Nigeria 2026 — Youth Environmental Solutions","meta":"Call · MTN, WWF, NCF, UNDP & Deloitte · closes 28 Aug 2026","url":"https://forms.cloud.microsoft/pages/responsepage.aspx?id=UMu5yUQ2tE2iZ_qE3y9M69rmdJRyczhFh4m3wbFU5hFUMUFZSDE0STZJSFBGODNJWjlPVFQ5QlJDSi4u&route=shorturl","by":"MTN Nigeria / WWF / NCF / UNDP / Deloitte"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Rufford Small Grants for Nature Conservation","meta":"Grant · The Rufford Foundation · Rolling (reviewed on a rolling basis)","url":"https://www.rufford.org/apply/","by":"The Rufford Foundation"}'
```

_Approved items go live only when a human admin clicks Accept in the admin → Opportunities review tab._
