# CoalHub → Community Pulse review log

Human-readable log of climate/environment posts pulled from the private X bookmark
folder **CoalHub** (@vombonya) by the daily "CoalHub Bookmark Sweep" task.

> **Blocker (as of 2026-09-19):** the `pulse_items` table has **no anon draft-insert
> path**, so these Community Pulse items could **not** be queued to the admin review
> queue this run. Both `SELECT` and `INSERT` as anon return `401 / 42501`.
> `resources` (Media briefs) works fine — media items were queued as drafts there.
>
> **Fix:** run the equivalent of `supabase/watch-drafts.sql` for `pulse_items` in
> Supabase SQL Editor (project `uueemckdoozsuowcqkhl`):
> ```sql
> grant insert on public.pulse_items to anon, authenticated;
> drop policy if exists pulse_draft_insert on public.pulse_items;
> create policy pulse_draft_insert on public.pulse_items
>   for insert to anon, authenticated with check ( published = false );
> -- optional, to let the sweep de-dupe:
> -- grant select (tweet_url) on public.pulse_items to anon;
> ```
> Once applied, the next sweep can queue the items below automatically.

---

## 2026-09-19 — pending Community Pulse (19 items, not yet queued)

Suggested columns: name · @handle · posted_at · tag · body (verbatim) · tweet_url

1. **James Orengo** @orengo_james · 17 Sep 2026 · *Siaya · Nuclear*
   Siaya is officially at the center of Kenya's energy future. Today in Vienna at the 70th IAEA General Conference, I led our delegation in a strategic meeting with IAEA DDG Hua Liu to secure technical framework support, technology transfer and safeguards for Kenya's nuclear energy programme.
   https://twitter.com/orengo_james/status/2100608731532743137

2. **Great Ngugi** @GreatNgugi · 16 Sep 2026 · *Forests*
   Another group of forests separated by human activity in Laikipia County. Loriak, Rumuruti and Nyahururu (Marmanet) forests were once one massive woodland — a wildlife migration corridor for elephants.
   https://twitter.com/GreatNgugi/status/2100232465897894028

3. **Mwango Capital** @MwangoCapital · 14 Sep 2026 · *Fossil fuels* (borderline: finance)
   Dangote Petroleum Refinery's IPO opened 14 Sep 2026 — thread on how Kenyan investors can participate.
   https://twitter.com/MwangoCapital/status/2099422953004011830

4. **State Dept for Environment & Climate Change** @EnviClimateC_Ke · 14 Sep 2026 · *Policy*
   The review of the National Environment Policy is an opportunity to position environmental stewardship as an enabler of Kenya's long-term development. @UNDPKenya partnering with the Government of Kenya to strengthen policy and institutional frameworks.
   https://twitter.com/EnviClimateC_Ke/status/2099434875388379506

5. **Money Academy** @moneyacademyKE · 14 Sep 2026 · *Fossil fuels* (borderline: finance)
   Aliko Dangote launching the IPO of his Dangote Refinery today — set to be Africa's largest-ever IPO; listing could add up to $23B to his net worth.
   https://twitter.com/moneyacademyKE/status/2099416112333013429

6. **Sholla Ard** @sholard_mancity · 11 Sep 2026 · *Forests*
   We exposed plans to degazette parts of Kenya's forests, incl. Mount Elgon, Turbo and Kakamega, and said plans were already advanced. TV47 has now reported the same issue, confirming our concerns.
   https://twitter.com/sholard_mancity/status/2098474890026479785

7. **Great Ngugi** @GreatNgugi · 9 Sep 2026 · *Forests*
   Kakamega and Nandi forests once formed one large, continuous forest block. Human activity, expanding agriculture, gold mining and road construction broke the canopy into separate fragments.
   https://twitter.com/GreatNgugi/status/2097687133662179667

8. **Money Academy** @moneyacademyKE · 8 Sep 2026 · *Fossil fuels* (borderline: finance)
   Q&A thread on the Dangote Refinery IPO — what investors should know about the upcoming listing.
   https://twitter.com/moneyacademyKE/status/2097353... (thread)

9. **Sholla Ard** @sholard_mancity · 7 Sep 2026 · *Forests*
   The forests being degazetted: Mount Elgon (Chepyuk Phases II & III) ~11,483 acres; Turbo (Manzini) ~3,069 acres; Kakamega (Shiru) ~235 acres; Kakamega (Shaviringa) ~89 acres. Plans already at final stages.
   https://twitter.com/sholard_mancity/status/2098... (see folder)

10. **Wamathai** @Wamathai · 7 Sep 2026 · *Wildfire*
    Mt. Kenya has been on fire for 6 days.
    https://twitter.com/Wamathai/status/2097... (see folder)

11. **Sholla Ard** @sholard_mancity · 7 Sep 2026 · *Pollution*
    THIS SHOULD ANGER EVERY KENYAN — raw sewage & wastewater being dumped directly into the Indian Ocean at the coast; documented repeatedly, not a one-off.
    https://twitter.com/sholard_mancity/status/2097... (see folder)

12. **SEKO** @MKchumba001 · 6 Sep 2026 · *Water*
    Lake Baringo–to–Nginyang River irrigation canal construction begins, to drain rising lake water that has submerged schools, houses and restaurants; expected to boost agriculture in Tiaty.
    https://twitter.com/MKchumba001/status/2096... (see folder)

13. **@mmghenyi_** · 5 Sep 2026 · *Climate finance*
    Women's climate finance alert: Mkamburi and Taita women collecting Acacia seed for dryland restoration; they lack a seed market. Call for ranchers to support women-led climate adaptation.
    https://twitter.com/mmghenyi_/status/2096... (see folder)

14. **Money Academy** @moneyacademyKE · 5 Sep 2026 · *Fossil fuels*
    Aliko Dangote's proposed $20 billion Lamu Oil Refinery in Kenya will break ground on September 30.
    https://twitter.com/moneyacademyKE/status/2095... (see folder)

15. **Nyakundi Report** @NyakundiReport · 19 Aug 2026 · *Bondo · Nuclear*
    Bondo residents demanding answers before Kenya's proposed nuclear power plant proceeds — guarantees on land compensation, electricity access, jobs, schools, healthcare and environmental safety. Senators warn public support can't be assumed.
    https://twitter.com/NyakundiReport/status/2078... (see folder)

16. **@koxmusaInc_** · 24 Aug 2026 · *Clean energy* (verify claim)
    Kenya set to introduce 100% e-mobility in conservation areas — silent electric safari vehicles, solar-powered eco-lodges — billed as Africa's largest transition.
    https://twitter.com/koxmusaInc_/status/2087... (see folder)

17. **Sholla Ard** @sholard_mancity · 18 Aug 2026 · *Pollution*
    Locals say Masinga Dam is being turned into a toxic dump — industrial waste and raw sewage from Kirinyaga and Murang'a flowing straight in while NEMA is inactive.
    https://twitter.com/sholard_mancity/status/2081... (see folder)

18. **Kenya Human Rights Commission** @thekhrc · 3 Aug 2026 · *Mining*
    Two residents of Ramula, Siaya, shot and wounded by GSU officers amid a dispute over mining operations by Shanta Gold Kenya Ltd; residents in Siaya and western Kenya accuse the company of harm.
    https://twitter.com/thekhrc/status/2081... (see folder)

19. **The Organic Pod** @TheOrganicPod · 6 Sep 2026 · *Agriculture* — ⚠️ SEE DISINFO FLAG BELOW
    Claims a burning sensation after eating sukuma wiki is "your body reacting to cancer-causing toxic chemicals sprayed on your sukuma wiki."
    https://twitter.com/TheOrganicPod/status/2094... (see folder)

### ⚠️ Possible disinfo (bonus flag)
- **@TheOrganicPod (6 Sep 2026):** frames a common eating sensation as evidence of
  "cancer-causing toxic chemicals" on kale. This is an unsupported health/agriculture
  claim (correlation-as-proof, alarmist framing) and should be fact-checked before any
  amplification — candidate for the Narrative-disinfo review queue rather than Pulse.

---

*Media/resource items from the same 2026-09-19 sweep (9) were queued as `resources`
drafts (category "Media briefs", published=false) and await admin Accept/Reject.*


---

## 2026-09-22 — sweep

**Blocker STILL open:** a test INSERT into `pulse_items` this run returned `401 / 42501`
("permission denied for table pulse_items", hint: `GRANT INSERT ON public.pulse_items TO anon`).
So the fix at the top of this file has **not** been applied yet — the Community Pulse items
below could not be queued to the admin review queue and are logged here only. The `resources`
(Media briefs) path works: the BBC media brief was queued (HTTP 201).

### New Community Pulse (not yet queued — 4 on-theme)
1. **Dominic Walubengo** @waluwande · 20 Sep 2026 · *Energy · Coal* (tag_class `energy`)
   U.S. Energy Secretary Questions Kenya Coal Funding as Trump Govt Signals Support.
   https://twitter.com/waluwande/status/2101548954231906337
2. **Africa Uncensored** @AfUncensored · 10 Sep 2026 · *Forests* (tag_class `forest`)
   "You wake up, Mau is going. You sleep, Elgon is going..." Environmental lawyer Gichohi Waweru
   on the exhausting, relentless court fight to save Kenya's forests from aggressive land grabbing.
   https://twitter.com/AfUncensored/status/2098134014901080355
3. **Africa Uncensored** @AfUncensored · 8 Sep 2026 · *Forests* (tag_class `forest`)
   Green Belt Movement's Job Mwangi breaks down the deliberate, quiet erosion and grabbing of
   Kenya's public green spaces; full townhall episode on YouTube ("The government doesn't own the park. You do.").
   https://twitter.com/AfUncensored/status/2097356951944306907
4. **Nyakundi Report** @NyakundiReport · 8 Sep 2026 · *Pollution · Water* (tag_class `water`)
   The sorry state of the River Kibos. Raw waste from the Kibos Factory has contaminated the water.
   https://twitter.com/NyakundiReport/status/2097196411523678558

### New Community Pulse — borderline (fossil-fuel finance, tag_class "")
5. **Capital Markets Authority Kenya** @CMAKenya · 21 Sep 2026 · *Fossil fuels*
   PUBLIC NOTICE: Dangote Petroleum Refinery and Petrochemicals Initial Public Offering.
   https://twitter.com/CMAKenya/status/2102010107940753477
6. **Mwango Capital** @MwangoCapital · 8 Sep 2026 · *Fossil fuels*
   The Dangote Refinery Prospectus is here (PDF link).
   https://twitter.com/MwangoCapital/status/2097353400216330524

### Media brief queued to `resources` (HTTP 201, category "Media briefs", published=false)
- **BBC News Africa** — "What does buying into one of Africa's biggest oil refineries actually mean?"
  Explainer on the Dangote Refinery IPO. https://x.com/BBCAfrica/status/2101031205839806870

### Disinfo bonus
- None new this run. (The @TheOrganicPod sukuma-wiki "cancer chemicals" claim was already flagged
  in the 2026-09-19 log and remains a candidate for the Narrative-disinfo queue.)

### Dedupe notes for next run
- Already handled (do not re-queue): items 1-19 in the 2026-09-19 section, and this run's 6 pulse
  items + BBC media brief. Full tweet IDs already seen incl. 2101548954231906337, 2098134014901080355,
  2097356951944306907, 2097196411523678558, 2102010107940753477, 2097353400216330524, 2101031205839806870.
- Skipped as already-logged duplicates this run (content match to 2026-09-19 items): @sholard_mancity
  Sep 7 forest-degazette list, @sholard_mancity Sep 7 Indian-Ocean sewage, @Wamathai Sep 7 Mt Kenya fire,
  @MKchumba001 Sep 6 Lake Baringo canal, @moneyacademyKE Sep 8 Dangote IPO Q&A, @TheOrganicPod Sep 6.

---

## 2026-09-23 — sweep (browser reachable)

Ran the daily CoalHub sweep with the logged-in Chrome (@vombonya). Opened the CoalHub
bookmark folder and scrolled it fully — 13 posts currently load (X caps folder scroll
depth; the older 2095…/2087…/2081…/2078… items from the 2026-09-19 log no longer render
but were already handled). **Every loaded post maps to an already-logged/already-handled
item — nothing new to queue this run.**

Loaded folder posts, all previously handled:
- 2102010107940753477 @CMAKenya — Dangote IPO public notice (09-22 #5)
- 2101548954231906337 @waluwande — US Energy Sec questions Kenya coal funding (09-22 #1)
- 2100608731532743137 @orengo_james — Siaya/IAEA nuclear (09-19 #1)
- 2101031205839806870 @BBCAfrica — Dangote refinery explainer (queued to resources 09-22)
- 2100232465897894028 @GreatNgugi — Laikipia forest fragmentation (09-19 #2)
- 2097353400216330524 @MwangoCapital — Dangote prospectus (09-22 #6)
- 2097252559610130560 @moneyacademyKE — Dangote IPO Q&A thread (09-19 #8 / 09-22 dup)
- 2097196411523678558 @NyakundiReport — River Kibos pollution (09-22 #4)
- 2096959578407874570 @sholard_mancity — forest-degazette acreage list (09-19 #9)
- 2096839974788239640 @Wamathai — Mt Kenya fire (09-19 #10)
- 2096678347572994095 @TheOrganicPod — sukuma-wiki "cancer chemicals" (09-19 #19, disinfo)
- 2096853978042790295 @sholard_mancity — Indian Ocean raw sewage (09-19 #11)
- 2096629328335278130 @MKchumba001 — Lake Baringo canal (09-19 #12)

Disinfo bonus: none new. (@TheOrganicPod sukuma-wiki claim remains the standing candidate
from 09-19.)

`pulse_items` blocker: STILL open — re-confirmed this run that anon `SELECT` on
`pulse_items` returns `401 / 42501` ("permission denied for table pulse_items"), so the
GRANT/RLS fix at the top of this file has not been applied. No new items needed queueing
this run, so no INSERT was attempted (avoiding a throwaway draft in the admin queue).
`resources` read path OK (200). Next sweep picks up automatically.

---

## 2026-09-24 — sweep (browser reachable)

Ran the daily CoalHub sweep with the logged-in Chrome (@vombonya). Opened the CoalHub
bookmark folder and scrolled it fully — **8 posts currently load** (X caps folder scroll
depth). **Every loaded post maps to an already-logged / already-handled item — nothing
new to queue this run.**

Loaded folder posts, all previously handled:
- 2102010107940753477 @CMAKenya — Dangote IPO public notice (09-22 #5)
- 2101548954231906337 @waluwande — US Energy Sec questions Kenya coal funding (09-22 #1)
- 2100608731532743137 @orengo_james — Siaya/IAEA nuclear (09-19 #1)
- 2101031205839806870 @BBCAfrica — Dangote refinery explainer (queued to resources 09-22)
- 2100232465897894028 @GreatNgugi — Laikipia forest fragmentation (09-19 #2)
- 2099422953004011830 @MwangoCapital — Dangote IPO participation thread (09-14; ≈09-22 #6 dup)
- 2099434875388379506 @EnviClimateC_Ke — National Environment Policy review / UNDP (prev. handled)
- 2099416112333013429 @moneyacademyKE — Dangote IPO "Africa's largest" (09-19 #8 / 09-22 dup)

### ⚠️ Correction needed — 2 erroneous drafts I created this run (please REJECT in admin)
Before consulting this dedupe log I POSTed two `resources` Media-brief drafts (both
`category:"Media briefs"`, `source:"watch"`, `published:false`, HTTP 201). Root cause:
anon `SELECT` on `resources` only returns `published=true` rows, so it **cannot see
existing drafts** — my "dedupe" came back empty and missed that these were already
handled. Anon cannot DELETE (admin-only RLS), so I can't undo them. Admin should
**Reject** both:
- "What buying into Dangote Refinery's IPO actually means" — BBC News Africa
  (2101031205839806870) — **DUPLICATE** of the BBC brief already queued 09-22.
- "U.S. Energy Secretary questions Kenya coal funding as Trump govt signals support"
  — Kenyans.co.ke (via @waluwande) (2101548954231906337) — already handled (was
  logged as Community Pulse 09-22 #1; should not have been queued).

**Dedupe rule for future runs:** de-dupe against the tweet-ID list in THIS markdown log,
NOT against an anon `resources`/`pulse_items` SELECT — anon cannot read drafts, so those
SELECTs always look empty and cause duplicate inserts. When every loaded post is already
in this log, queue nothing (as the 09-23 run correctly did).

### Disinfo bonus
- None new this run. (@TheOrganicPod sukuma-wiki "cancer chemicals" claim remains the
  standing candidate from 09-19.)

`pulse_items` blocker: STILL open — re-confirmed this run a test INSERT into `pulse_items`
returns `401 / 42501` ("permission denied for table pulse_items", hint
`GRANT INSERT ON public.pulse_items TO anon`). The GRANT/RLS fix at the top of this file
has not been applied. `resources` insert path works (201); `resources`/`pulse_items` anon
SELECT for dedupe does not (drafts invisible to anon).

---

## 2026-09-29 — sweep (browser reachable)

Ran the daily CoalHub sweep with the logged-in Chrome (@vombonya). Opened the CoalHub
bookmark folder and scrolled it fully — 20 posts loaded this run. 12 map to
already-handled items (09-19 / 09-22 / 09-23 logs); **8 are NEW** (all 25–29 Sep, newer
than the last sweep) and are logged below.

**`pulse_items` blocker: STILL open.** A single test INSERT this run returned
`401 / 42501` ("permission denied for table pulse_items", hint `GRANT INSERT ON
public.pulse_items TO anon`). Per task instructions I did not loop further INSERTs. The
GRANT/RLS fix at the top of this file has still not been applied, so the 8 new Community
Pulse items below could not be queued to the admin review queue — they are logged here
only. `resources` (Media briefs) read path OK (200).

### New Community Pulse — 8 on-theme (not yet queued: blocker)
1. **Nyakundi Report** @NyakundiReport · 29 Sep 2026 · *Fossil fuels · Lamu* (tag_class `oil`)
   The High Court has ruled that construction of Dangote's planned Sh2.2 trillion oil refinery in Lamu must stop immediately after Lamu residents filed a case opposing the project.
   https://x.com/NyakundiReport/status/2104768584929149182
2. **Money Academy** @moneyacademyKE · 28 Sep 2026 · *Fossil fuels · Lamu* (tag_class `oil`)
   More than 130 Lamu residents have gone to court seeking to stop the planned Dangote refinery project, saying they risk losing their land, homes and crops without compensation.
   https://x.com/moneyacademyKE/status/2104577951669031223
3. **Ferdinand Omondi** @FerdyOmondi · 28 Sep 2026 · *Sentiment · Lamu* (tag_class `oil`)
   "This was coming. Katiba sio tissue." (reaction to the High Court halting the Dangote Lamu refinery.)
   https://x.com/FerdyOmondi/status/2104568240068538600
4. **Nyakundi Report** @NyakundiReport · 28 Sep 2026 · *Fossil fuels · Lamu* (tag_class `oil`)
   PLO Lumumba says the heavy machinery in Lamu ahead of the Dangote East Africa Refinery groundbreaking will be led by engineers from India and China, and that mega projects have neglected Kenyan professionals.
   https://x.com/NyakundiReport/status/2104525964562571725
5. **Mwalimu Mutemi wa Kiama** @MutemiWaKiama · 27 Sep 2026 · *Sentiment · Lamu* (tag_class `oil`)
   The government is very obsessed with groundbreaking before due process. The people of Lamu shouldn't permit this so-called groundbreaking without due process and project documents.
   https://x.com/MutemiWaKiama/status/2104069228211159074
6. **Money Academy** @moneyacademyKE · 25 Sep 2026 · *Fossil fuels · Oil* (tag_class `oil`)
   Kenya is now set to start producing crude oil in December 2026 after a drilling rig for the South Lokichar project arrived at the Port of Mombasa. Drilling is expected to start on November 1.
   https://x.com/moneyacademyKE/status/2103492541551161352
7. **Money Academy** @moneyacademyKE · 25 Sep 2026 · *Fossil fuels · Regional* (tag_class `oil`)
   Aliko Dangote and Ethiopian Investment Holdings will invest about Sh86 billion to build a 120-km petroleum products pipeline linking Ethiopia to Djibouti's coast; operational within 18 months.
   https://x.com/moneyacademyKE/status/2103341222542840182
8. **Money Academy** @moneyacademyKE · 25 Sep 2026 · *Industry* (borderline — heavy-emissions industry; tag_class `minerals`)
   Devki Group has started construction of a Sh50 billion cement factory in Ngaaie, Mwingi North, Kitui County; expected to start operations by mid-2027.
   https://x.com/moneyacademyKE/status/2103471032489111656

### Media brief queued to `resources`
- None new. (The BBC Dangote-refinery explainer and the Mwango Capital prospectus were
  already queued/handled in the 09-22 sweep.)

### Disinfo bonus
- None new. (The @TheOrganicPod sukuma-wiki "cancer chemicals" claim from 09-19 remains
  the standing candidate for the Narrative-disinfo queue.)

### Dedupe notes for next run
- New this run (now handled — do not re-queue): 2104768584929149182, 2104577951669031223,
  2104568240068538600, 2104525964562571725, 2104069228211159074, 2103492541551161352,
  2103341222542840182, 2103471032489111656.
- Already-handled folder posts seen again this run: 2102010107940753477, 2101548954231906337,
  2100608731532743137, 2101031205839806870, 2100232465897894028, 2099422953004011830,
  2099434875388379506, 2099416112333013429, 2098474890026479785, 2098134014901080355,
  2097687133662179667, 2097356951944306907.

---

## 2026-09-30 — sweep (browser reachable)

Ran the daily CoalHub sweep with the logged-in Chrome (@vombonya). Opened the CoalHub
bookmark folder and scrolled it fully — **23 posts loaded this run**. 17 map to
already-handled items (09-19 / 09-22 / 09-29 logs); **6 are NEW** and are logged below.

**`pulse_items` blocker: STILL open.** A single test INSERT this run returned
`401 / 42501` ("permission denied for table pulse_items", hint `GRANT INSERT ON
public.pulse_items TO anon`). Per task instructions I did not loop further INSERTs, and
the 401 wrote nothing (no throwaway draft created). The GRANT/RLS fix at the top of this
file has still not been applied, so the 6 new Community Pulse items below could not be
queued to the admin review queue — they are logged here only. `resources` (Media briefs)
read path OK (200); no new Media-brief items this run (BBC explainer & Mwango prospectus
already handled 09-22).

Dedupe was done against the tweet-ID list in THIS log (anon cannot read pulse_items or
draft resources), per the 2026-09-24 dedupe rule.

### New Community Pulse — 6 on-theme (not yet queued: blocker)
1. **Paul Neko** @ouma_neko · 29 Sep 2026 · *Fossil fuels · Lamu* (tag_class `oil`)
   Aliko Dangote is telling Kenyans that if they want to go to court, they can go, and that nothing will stop him from building his refinery. "Excuse me? Kenya is a constitutional democracy. Court orders, environmental laws, land laws, public participation and regulatory [approvals] are not optional." (98 replies · 172 reposts)
   https://x.com/ouma_neko/status/2104898928395124871
2. **Paul Muite SC** @Paul_Muite · 29 Sep 2026 · *Fossil fuels · Lamu* (tag_class `oil`)
   Mr Dangote, isn't it common sense that harmony between you and the People of Lamu is necessary for your success? The President in power is not synonymous with Kenyans. International law requires compliance with the host Country's Laws. (330 replies · 842 reposts)
   https://x.com/Paul_Muite/status/2104930594664722574
3. **Usonaki Social Justice Center** @UsonakiC · 1 Sep 2026 · *Nuclear · Bondo* (tag_class `energy`)
   Weaponising the criminal justice system against a rural community merely seeking information on the proposed NPP and a duty to exercise the inalienable freedom of choice is a new low. Free comrade Otieno Ombok. Free the Lenya 19.
   https://x.com/UsonakiC/status/2094717825214484961
4. **I am Chege** @_James041 · 1 Sep 2026 · *Nuclear · Bondo* (tag_class `energy`)
   His name is Otieno Ombok — an environmental activist from Siaya County. While standing in solidarity at the Bondo Law Courts with the 19 young Kenyans profiled and illegally arrested for opposing the Sakwa Bondo Nuclear Power Plant, Mr Ombok was [abducted].
   https://x.com/_James041/status/2094776399261278440
5. **I am Chege** @_James041 · 1 Sep 2026 · *Nuclear · Bondo* (tag_class `energy`)
   This was the court hearing at Bondo Law Courts where Otieno Ombok was abducted; he was standing in solidarity with 19 young Kenyans illegally arrested for opposing the Bondo Nuclear Power Plant over environmental and health concerns.
   https://x.com/_James041/status/2094776945607139511
6. **Money Academy** @moneyacademyKE · 30 Aug 2026 · *Fossil fuels · Regional* (tag_class `oil`)
   Ethiopia has expressed interest in taking a stake in Kenya's planned Lamu refinery alongside Kenya — following Rwanda's interest — seeking a closer source of refined fuel and stronger trade links through the LAPSSET Corridor.
   https://x.com/moneyacademyKE/status/2093959691449585772

> Note: items 3–5 (dated 1 Sep) are older than the last few sweeps but were never
> captured/logged before — X caps folder scroll depth and the set of posts that render
> varies run to run; these three loaded this run and are genuinely new to this log.

### Media brief queued to `resources`
- None new. (BBC Dangote-refinery explainer and Mwango Capital prospectus already handled 09-22.)

### Disinfo bonus
- None new. (The @TheOrganicPod sukuma-wiki "cancer chemicals" claim from 09-19 remains
  the standing candidate for the Narrative-disinfo queue.)

### Dedupe notes for next run
- New this run (now logged — do not re-queue): 2104898928395124871, 2104930594664722574,
  2094717825214484961, 2094776399261278440, 2094776945607139511, 2093959691449585772.
- Already-handled folder posts seen again this run: 2104768584929149182, 2104577951669031223,
  2104568240068538600, 2104525964562571725, 2104069228211159074, 2103492541551161352,
  2103341222542840182, 2103471032489111656, 2102010107940753477, 2101548954231906337,
  2100608731532743137, 2101031205839806870, 2100232465897894028, 2099422953004011830,
  2099416112333013429, 2098474890026479785, 2098134014901080355.


---

## 2026-10-13 (20:12 EAT run; fired 23:27 UTC) — sweep (browser logged in, but Supabase WRITE blocked)

Ran the daily CoalHub sweep with the logged-in Chrome (@vombonya). Opened the CoalHub
bookmark folder and scrolled it fully — **36 posts loaded this run**. 22 map to
already-handled items (logged in this file / PULSE-REVIEW.md); **14 are NEW** (7 Community
Pulse + 7 Media briefs) and are logged below.

> **WRITE BLOCKED THIS RUN — nothing was queued to Supabase (no pulse items, no media briefs).**
> Two independent blockers hit at once:
> 1. **Browser → Supabase blocked by the agent auto-mode classifier.** Every attempt to
>    reach the Supabase origin from the browser (navigate to `…supabase.co/rest/v1/`, incl.
>    a clean tab) was denied as *"Data Exfiltration"*. Per the denial guidance I did **not**
>    retry in a loop or reroute the write through another tool. So the Media-brief drafts
>    that normally queue to `resources` could **not** be posted this run.
> 2. **Device-bridge shell has no network to Supabase** (curl → HTTP 000), as the task notes.
> 3. (Standing) **`pulse_items` still has no anon draft-insert policy** (401/42501), so the
>    Community Pulse items below could not be queued regardless — same blocker open since 09-19.
>
> All 14 items are logged here only. An editor can paste the Pulse items via
> admin → Manual upload → Community Pulse, and the Media briefs via the Resources upload,
> or a future run (with the browser classifier allowing the Supabase write) can queue the
> Media briefs to `resources`. Dedupe was done against the tweet-ID lists in this file,
> PULSE-REVIEW.md, RESOURCES-REVIEW.md, DISINFO-REVIEW.md and scripts/.

### New Community Pulse — 7 on-theme (NOT queued: blockers above)

| # | Name | Handle | Date | Sector | tag_class | Engagement | Post (verbatim; … = X "show more" cut) | Link |
|---|------|--------|------|--------|-----------|------------|------|------|
| 1 | Stephen Mutoro | @smutoro | 12 Oct 2026 | Oil & Gas - Lamu / PPP | oil | ↻ 42 · ♥ 71 · 👁 15.2k | A refinery promised a slice of public equity, public land at Lamu and government support — yet the Directorate of PPP and the PPP Committee now say it is "not a PPP" and none of their business. 🔸 In PPP Petition No. E002 of 2026 (COFEK v Directorate of PPP & 7 others; Dangote… | https://x.com/smutoro/status/2109751266482208827 |
| 2 | Nyakundi Report | @NyakundiReport | 02 Oct 2026 | Oil & Gas - Lamu | oil | ↻ 36 · ♥ 88 · 👁 3.1k | Lamu residents confronted police officers who fired shots into the air while attempting to disperse them during protests against the Dangote Refinery project. The residents are protesting the displacement of 133 families, demanding answers over the impact of the project on the… | https://x.com/NyakundiReport/status/2105837150407180610 |
| 3 | Henix Obuchunju | @Obuchunju | 26 Aug 2026 | Energy - Power supply | energy | ↻ 3 · ♥ 4 · 👁 629 | Kenya is staring at a power shortage as its electricity reserve margin has fallen to just 3.3%, far below the 20% to 35% range recommended by the IEA. With demand rising and supply struggling to keep up, households and businesses face a growing risk of power rationing and… | https://x.com/Obuchunju/status/2092703646660301206 |
| 4 | Prince Papa | @princepapa1 | 04 Jun 2026 | Fossil fuels - Advocacy | oil | ♥ 3 · 👁 169 | #fossilfueltreaty #Kenya | https://x.com/princepapa1/status/2062584604322611537 |
| 5 | Prince Papa | @princepapa1 | 06 Jun 2026 | Climate action - Faith | climate | ↻ 1 · ♥ 5 · 👁 174 | My church is answering the call for climate action #NowForClimate #WorldEnvironmentDay2026 #LaudatoSi | https://x.com/princepapa1/status/2063220951957885027 |
| 6 | Philosopher | @Philosopher254 | 29 Jun 2025 | Nuclear - Siaya | energy | ↻ 6 · ♥ 7 · 👁 7.3k | This joke is going too far. A nuclear power plant requires a 30km radius free of habitation. Will they move and compensate whole of Siaya, noting that Siaya is densely populated and small? (Siaya size: 2400 km². A radius of 30km: 3.14x30x30 = 2826 km²) | https://x.com/Philosopher254/status/1939236484319428786 |
| 7 | Aziz Mire | @aziz_mire | 11 Jul 2026 | Oil & Gas - Lamu / Coal history | coal | ↻ 95 · ♥ 280 · 👁 37.7k | People celebrating the oil refinery, please read this thread. In 2013, GoK issued an official expression of interest to source investors for coal power plant. In 2014, Amu Power won the bid to build a 1,050 MW plant in Kwasasi, Lamu. This was to be a first in East Africa. [thread] | https://x.com/aziz_mire/status/2075873507565601080 |

### New Media briefs — 7 (would go to `resources`, category "Media briefs", published=false — NOT queued this run: Supabase write blocked)

| # | Source | Handle | Date | Brief | Link |
|---|--------|--------|------|-------|------|
| 1 | Money Academy | @moneyacademyKE | 12 Oct 2026 | High Court blocks Nairobi County's plan to lease parts of Uhuru Park & Central Park to private operators before public participation; parks must stay publicly accessible. | https://x.com/moneyacademyKE/status/2109539571797295404 |
| 2 | BBC News Africa | @BBCAfrica | 11 Oct 2026 | Ground broken on a new $16bn oil refinery in Lamu; activists say locals weren't consulted and have no assurances on environmental impact. | https://x.com/BBCAfrica/status/2109237942354846113 |
| 3 | Money Academy | @moneyacademyKE | 27 Aug 2026 | Rwanda wants a stake in Dangote's planned Sh2.1tn Lamu refinery; Kagame says preliminary talks underway (Kenya offered ~10% / Sh65bn). | https://x.com/moneyacademyKE/status/2092839530118467945 |
| 4 | BBC News Africa | @BBCAfrica | 20 Aug 2026 | Reported gold discovery draws hundreds (incl. from Uganda) to Cheporor village, western Kenya; safety/security concerns. | https://x.com/BBCAfrica/status/2090393673615675889 |
| 5 | BBC News Africa | @BBCAfrica | 25 Aug 2026 | Four arrested over the suspected poisoning of at least 18 elephants in Amboseli National Park. | https://x.com/BBCAfrica/status/2092265779198603663 |
| 6 | Money Academy | @moneyacademyKE | 05 Aug 2026 | Dangote Refinery plans Africa's biggest IPO (~Sh646bn / $5bn) by Oct 2026; funds to expand Lagos refinery and support a proposed Kenya-coast refinery. *(borderline: finance)* | https://x.com/moneyacademyKE/status/2084844344767316317 |
| 7 | Kenya Judiciary Academy | @KJA_Kenya | 16 May 2026 | Supreme Court holds that only the Environment & Land Court — not the Cabinet Secretary for Mining — can determine alleged violations of constitutional environmental rights. | https://x.com/KJA_Kenya/status/2055696392358650132 |

### Disinfo bonus
- None new. The @TheOrganicPod sukuma-wiki "cancer-causing toxic chemicals" claim remains the
  standing candidate for the Narrative-disinfo queue (already logged; seen again this run).

### Dedupe notes for next run
- New this run (now logged — do not re-queue): 2109751266482208827, 2109539571797295404,
  2109237942354846113, 2105837150407180610, 2092839530118467945, 2092703646660301206,
  2090393673615675889, 2092265779198603663, 2062584604322611537, 2084844344767316317,
  2063220951957885027, 1939236484319428786, 2075873507565601080, 2055696392358650132.
- Pending write: none queued to Supabase this run (browser→Supabase classifier block +
  pulse_items anon-insert block). Media briefs #1–#7 above are still unqueued and can be
  posted to `resources` on a future run.

---

## 2026-10-20 (14:12 EAT run) — swept CoalHub, 19 bookmarks

Browser: Browser 1 (macOS), @vombonya logged in. Supabase GET+POST from the
`…supabase.co/rest/v1/` origin tab worked this run (no exfiltration block;
pulse_items anon read OK, 69 rows).

**Dedupe:** 17 of the 19 current CoalHub posts are already in `pulse_items`
(matched by exact tweet_url) — a prior run/backlog-clear already queued them LIVE.
Not re-posted.

**Queued this run → `resources` (category "Media briefs", published=false drafts, await admin Accept/Reject):**
1. **Africa Uncensored** @AfUncensored · 17 Oct 2026 · *Land, Gold and Power* — investigative documentary on Western Kenya's gold rush, displacement from Ramula to Mubana, forged agreements & consent. https://x.com/AfUncensored/status/2111495682448408645  → **POST 201 OK**
2. **Architectural Association of Kenya** @Arch_KE · 16 Oct 2026 · AAK Statement on Averting the Looming Environmental Crisis — formal statement on widespread tree destruction & environmental degradation. https://x.com/Arch_KE/status/2111096809338621987  → **POST 201 OK**

**Community Pulse:** 0 new (all 17 on-theme items already live).

**Disinfo bonus:** no clear new disinfo claim to queue. Note: @vick_kiprotich
(2105201425756115002, already in Pulse) sarcastically repeats inflated official
Dangote-refinery figures — "700 million barrels" capacity and "KSh 2 trillion"
worth — highlighting questionable official claims rather than spreading them.

**Dedupe notes for next run — new this run (do not re-queue):**
2111495682448408645, 2111096809338621987.
Already-live pulse tweet_urls seen again (deduped): 2111510182828110332,
2110723399026635185, 2110332882665234488, 2110235709638664269, 2110383445041967329,
2110370219642298621, 2109751266482208827, 2109539571797295404, 2109237942354846113,
2107777858789679386, 2107517916379845070, 2107386313540255979, 2106000116817793370,
2105657237121208569, 2105837150407180610, 2105287962762039358, 2105201425756115002.

---

## 2026-11-12 (09:12 EAT run) — 7 Community Pulse items LIVE + 3 Media briefs queued

Source: private X bookmark folder **CoalHub** (@vombonya), read via connected Chrome
(logged in as @vombonya). Folder held **41** posts this run. Deduped against the
**125** existing `pulse_items` rows (tweet_url) — 26 of 33 on-theme pulse posts were
already stored. Writes done as same-origin POSTs from a tab on the Supabase origin
(`/rest/v1/...`, public anon key only); the Mac device shell still can't reach Supabase.

**Community Pulse — 7 NEW, posted `published=true` (LIVE on dashboard), HTTP 201:**
| Name | Handle | Date | Tag | tag_class |
|------|--------|------|-----|-----------|
| FERDINAND OMONDI | @FerdyOmondi | 11 Nov 2026 | Fossil fuels | oil |
| African Investigative Journalism Conference | @AIJC_Conference | 11 Nov 2026 | AIJC2026 · Media | carbon |
| Mwango Capital | @MwangoCapital | 14 Sep 2026 | Dangote · IPO | oil |
| C. NyaKundi | @C_NyaKundiH | 12 Aug 2026 | Solar · Grid | energy |
| mmnjug | @mmnjug | 03 Aug 2026 | Siaya · Nuclear | nuclear |
| Money Academy | @moneyacademyKE | 29 Jul 2026 | Magadi · Mining | minerals |
| deCOALonize | @deCOALonize | 23 Jul 2026 | Siaya · Nuclear | nuclear |

(The @MwangoCapital Sep-14 item was logged to markdown on 2026-09-19 but never reached
the DB back when pulse_items INSERT was RLS-blocked; it is now backfilled.)

**Media briefs — 3 NEW, posted `resources` category='Media briefs' `published=false` (DRAFTS for admin Accept/Reject), HTTP 201:**
- **Citizen TV Kenya** — "Ecological disaster looms in Baringo as Lake Baringo risks spilling into Lake Bogoria" (2 Nov 2026)
- **Al Jazeera** — Naivasha freshwater lake / Rift Valley feature (24 Aug 2026)
- **People Daily** (via @katibainstitute) — "Kenya's forest law battle: a new era of conservation or a threat?" (23 Jul 2026)

**Skipped (not queued):**
- 3 media-type posts already stored as Community Pulse by prior runs (would duplicate across categories): @waluwande ×2 (Business Insider / Dangote IPO & Cargill-wildlife), @AfUncensored (Siaya / Shanta Gold). Left as-is.
- @BellahPoetry (off-theme / ambiguous) and @irumanyika ("Congratulations Nakate", too thin) — not on-theme enough to file.

**Dedup note for media:** anon cannot read `published=false` drafts and the Media-briefs
draft has no unique index, so media dedup here relied on (a) absence of each tweet-ID from
all repo markdown logs and (b) absence from `pulse_items`. The 3 queued were new on both.

**Disinfo bonus:** none this run — no clear disinformation claim among the new on-theme posts.

---

## 2026-11-18 (20:12 EAT run) — 19 Community Pulse items LIVE + 1 Media brief queued

Source: private X bookmark folder **CoalHub** (@vombonya), read via connected Chrome
(logged in as @vombonya). Folder held **92** posts this run. Deduped against the **159**
existing `pulse_items` rows (tweet_url) — 63 of 92 were already stored; **29 new**.
Writes done as same-origin POSTs from a tab on the Supabase origin (`/rest/v1/...`,
public anon key only); the Mac device shell still can't reach Supabase.

**Community Pulse — 19 NEW, posted `published=true` (LIVE on dashboard), HTTP 201:**
| Name | Handle | Date | Tag | tag_class |
|------|--------|------|-----|-----------|
| Oil Refinery Residents Association (ORRA) | @RefineryOil | 16 Nov 2026 | COP31 · Fossil fuels | oil |
| Moe | @moneyacademyKE | 17 Nov 2026 | Gas · Dongo Kundu LNG | energy |
| CAN EASTERN AFRICA | @CANEasternAfric | 16 Nov 2026 | COP31 · Climate justice | carbon |
| StopEACOP | @stopEACOP | 16 Nov 2026 | COP31 · Gender & climate | carbon |
| StopEACOP | @stopEACOP | 16 Nov 2026 | COP31 · Fossil fuels | oil |
| Architectural Association of Kenya | @Arch_KE | 16 Oct 2026 | Deforestation · AAK | forest |
| @_James041 | @_James041 | 21 Aug 2026 | Bondo · Nuclear | nuclear |
| Nyakundi Report | @NyakundiReport | 21 Aug 2026 | Siaya · Nuclear | nuclear |
| Moe | @moneyacademyKE | 3 Jul 2026 | Maasai Mara · Conservation | wildlife |
| Moe | @moneyacademyKE | 8 Aug 2026 | Lamu refinery · Oil | oil |
| @kattoloo | @kattoloo | 1 Aug 2026 | Amboseli · Wildlife | wildlife |
| Ferdinand Omondi | @FerdyOmondi | 15 Jul 2026 | Lamu refinery · Oil | oil |
| Ferdinand Omondi | @FerdyOmondi | 7 Aug 2026 | Invasive species · Birds | wildlife |
| @princepapa1 | @princepapa1 | 6 Mar 2026 | Fossil Fuel Treaty · Counties | oil |
| @_James041 | @_James041 | 31 Jul 2026 | Bondo · Nuclear | nuclear |
| Moe | @moneyacademyKE | 5 Aug 2026 | Carbon credits · Policy | carbon |
| @princepapa1 | @princepapa1 | 13 Apr 2026 | Energy transition · CoG | energy |
| Nyakundi Report | @NyakundiReport | 30 Jul 2026 | Pollution · Roysambu waste | waste |
| Moe | @moneyacademyKE | 13 Jul 2026 | Lamu refinery · Oil | oil |

**Media briefs — 1 NEW, posted `resources` category='Media briefs' `published=false` (DRAFT for admin Accept/Reject), HTTP 201:**
- **People Daily** (via @waluwande) — "Why Dangote chose Lamu over Mombasa and Tanga for his oil refinery" (14 Jul 2026) — 2077003616418734105

**Skipped (9, not queued):**
- @citizentvkenya "Ecological disaster looms in Baringo…" (2117349827847635219) — DUPLICATE: already queued as a Media brief draft on 2026-11-12.
- @MwangoCapital Dangote Refinery prospectus PDF (2097353400216330524) — IPO/finance, off-theme.
- @moneyacademyKE Dangote IPO investor Q&A (2097252559610130560) — finance, off-theme.
- @MwangoCapital Dangote $1B IPO underwriting (2090665218263404628) — finance, off-theme.
- @MwangoCapital Dangote 30% equity stake to EAC (2090686408919069182) — finance/policy, off-theme.
- @NyakundiReport Tana River airstrip land dispute / police shooting (2092977722347647318) — land/violence, not climate/env.
- @katibainstitute Lamu curfew since 2014 (2080221564071825530) — rights/security, tangential.
- @ivymuthe Nairobi CBD robbery / Internal Security critique (2091001223524532374) — off-theme.
- @Eddie_Mugoh "Joho…looking for gold for Kasongo" (2084189513530904994) — off-theme politics.

**Disinfo bonus:** none. (The @stopEACOP COP31 post criticises TotalEnergies' "climate facts"
workshops as diplomatic cover for fossil expansion — a critique of greenwashing, not a
disinformation claim itself.)

---

## Run 2026-11-19 (3×/day CoalHub sweep, ~09:12 EAT) — 6 Community Pulse items published LIVE

POSTed to `pulse_items` (published=true → live on the hub dashboard) via connected Chrome
(device shell blocked from Supabase). Each returned HTTP 201. Deduped against the 179 live
`pulse_items` rows + all tweet URLs previously logged. pulse_items count 179 → 185.

1. **Lynn Ngugi** @lynn_ngugi1 · 2026-11-19 · *Agriculture · Seed sovereignty* — indigenous seeds / seed-sharing harvest
   https://x.com/lynn_ngugi1/status/2123316772413866310
2. **Oil Refinery Residents Association (ORRA)** @RefineryOil · 2026-11-16 · *COP31 · Fossil fuels* — team at People's Climate March, Antalya; #EndFossilFuel
   https://x.com/RefineryOil/status/2122251845116608676
3. **CAN Eastern Africa** @CANEasternAfric · 2026-11-16 · *COP31 · Climate justice* — People's Climate March call for climate justice
   https://x.com/CANEasternAfric/status/2122226630080745692
4. **StopEACOP** @stopEACOP · 2026-11-16 · *COP31 · Gender justice* — Belem Gender Action Plan, no climate justice without gender justice
   https://x.com/stopEACOP/status/2122267608460218546
5. **StopEACOP** @stopEACOP · 2026-11-16 · *COP31 · Fossil fuels* — callout of TotalEnergies "climate facts" diplomatic cover at COP31
   https://x.com/stopEACOP/status/2122396569718628844
6. **I am Chege** @_James041 · 2026-08-21 · *Siaya · Nuclear* — threats/intimidation in Sakwa, Bondo over proposed nuclear plant
   https://x.com/_James041/status/2090671021145661566

---

## Run 2026-11-20 (3×/day CoalHub sweep) — checked but NOT queued + disinfo note

Folder held ~194 loaded posts; 184 already in `pulse_items`, 28 new candidates. 15 queued to
Community Pulse (live, see PULSE-REVIEW.md) + 5 media briefs (drafts, see RESOURCES-REVIEW.md).
Skipped this run:
- @princepapa1 "Kenya first African country to receive crucial climate funding" (2064693335575388604) — bare superlative news-claim, dubious/unverifiable, low sentiment value.
- @otienowill Siaya "PAWA in Nairobi" rally politics (2084482089450086783) — political, not climate/env.
- @BBCAfrica Dangote refinery IPO explainer (2101031205839806870) — already queued to resources 09-22.
- @jumaf3 BATUK / illegal-mining claim (2084238492440133718) — unverified serious allegation; held from live feed (see disinfo).
- @AfUncensored Mau/Elgon forests defender (2098134014901080355) — already handled/logged.
- @katibainstitute Lamu curfew since 2014 (2080221564071825530) — already logged, rights/security tangential.
- @ivymuthe Nairobi CBD robbery (2091001223524532374) — already logged, off-theme.
- @MwangoCapital Dangote prospectus (2097353400216330524) — already queued to resources 09-22 #6.

**Disinfo bonus:**
- @jumaf3 (2084238492440133718): claims 80% of BATUK's activity is cover for protecting illegal mining — unverified conspiratorial allegation against a named military unit; NOT amplified to the live feed.
- @BravinYuri (2095162867603435597, queued as sentiment): asserts Kenya's nuclear plants exist to power AI data centres — unverified factual linkage inside an opinion/suspicion post; queued as community sentiment with this caveat.
- @princepapa1 (2064693335575388604): "first African country to receive crucial climate funding" — dubious superlative; not queued.

---

## Run 2026-11-22 (3×/day CoalHub sweep, ~14:12 EAT slot) — 1 Community Pulse item published LIVE

CoalHub folder held 48 posts this run. Deduped against the 214 live `pulse_items` rows
(202 distinct tweet IDs) — only 3 bookmarks were not already in `pulse_items`, and of those
2 were excluded (see below), leaving 1 new on-theme item, POSTed to `pulse_items`
(published=true → live on the hub dashboard) via connected Chrome. HTTP 201. pulse_items 214 → 215.

1. Ministry of Environment, Climate Change & Forestry @Environment_Ke · 2026-11-21 · *COP31 · Carbon markets* (tc: carbon)
   "At COP 31, Kenya and Switzerland advanced their Article 6 carbon market partnership,
   targeting $520M in investments, 115,000 green jobs, and 5M tonnes of CO₂ reductions."
   https://x.com/Environment_Ke/status/2124233834858418259

### Excluded this run
- @ivymuthe (2091001223524532374) — youth robbery / internal-security post; off-theme (crime, not environment). Skipped.
- @MwangoCapital Dangote Refinery prospectus (2097353400216330524) — already queued to resources 09-22 and previously flagged off-theme (IPO/finance). Not re-posted.

### Notes
- The large COP31 cluster (Nov 11–21: @FerdyOmondi, @stopEACOP, @CANEasternAfric, @RefineryOil,
  @AIJC_Conference, @LulaOficial, @moneyacademyKE, etc.) was already captured by the earlier
  3×/day runs since Nov 20 — all deduped against existing `pulse_items`.
- No disinfo flagged this run.
- resources (Media briefs) SELECT returns 0 to anon (drafts not readable); no new media briefs this run.
