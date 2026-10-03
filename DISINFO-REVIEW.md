# Narrative-Disinfo review log (weekly scan → admin queue)

Human-readable log of the weekly MazingiraKenya Narrative-Disinfo scan. Each run writes
UNPUBLISHED drafts (`published=false`) straight into Supabase `disinfo_items`; an admin
reviews them in **admin → Narrative-disinfo review** and clicks Accept (publishes to the
hub/raia), Reject, or Hide. Nothing here is public until an admin accepts it.

Dedupe: each run checks the currently-published `disinfo_items` (anon-readable) and this
log before queueing, so the same narrative is not filed twice. Drafts already in the queue
are only visible to the admin, so avoid re-running a queue script for a date already listed
below.

Classification key: `vf` = false / bad-faith (red) · `vm` = misleading (amber) ·
`vc` = needs context / false dilemma.

---

## 2026-10-03 — 4 new drafts queued

Queue script: `scripts/queue-disinfo-2026-10-03.sh`. All four written to Supabase as drafts via the
connected Chrome (POST /rest/v1/disinfo_items, 201) — the Mac device-bridge shell could not reach
supabase.co this run (proxy 403), so Chrome was the writer. Status: **awaiting admin review**.
Deduped against published `disinfo_items` (26 rows read via anon GET) and the 2026-09-19 / -22 / -29
logs. Mix of a global denialist talking point and three Kenya/East-Africa-specific framings
(carbon-market greenwashing, tree-planting accountability, El Niño conflation).

1. **Climate denial / warming minimised (`vf`) — "Earth hasn't warmed 1.5°C since 1900"**
   - Narrative (social media): the 1.5°C warming figure is exaggerated; the planet hasn't really
     warmed that much.
   - Fuller picture: global mean surface temperature is ~1.3–1.5°C above the 1850–1900 baseline;
     2024 was the first full year averaging ~1.5°C. NASA, NOAA, Berkeley Earth and the Met
     Office/Copernicus agree within ~0.1°C. The trend is non-linear, so cherry-picking hides it.
     East Africa signal: heatwaves, Mt Kenya/Kilimanjaro ice loss, drought↔flood swings.
   - Source: PesaCheck — https://pesacheck.org/false-the-earths-temperature-did-not-rise-by-1-5-since-1900/

2. **Greenwashing / misleading framing (`vm`) — "Northern Kenya Grassland Carbon project is a model community climate solution"**
   - Narrative (carbon-market promotion): the world's largest soil-carbon scheme delivers verified
     offsets and real benefits to local pastoralists.
   - Fuller picture: NRT-run, Verra-certified; sold millions of credits to Meta/Netflix. Suspended
     by Verra in 2023 and 2025 (a court found two credit-supplying conservancies unconstitutional);
     Maasai & Rendille herders are in court alleging coerced agreements and grazing restrictions
     without FPIC; soil-carbon permanence questioned. Verra reinstated it June 2026 despite the
     ongoing case. A suspended, litigated scheme sold as proven and community-backed.
   - Source: Survival International / REDD-Monitor — https://www.survivalinternational.org/news/14571

3. **Needs context / unverified claim (`vc`) — "Kenya has planted hundreds of millions of trees, so it's reversing deforestation"**
   - Narrative (government climate messaging): headline planting numbers prove Kenya is reversing
     deforestation and leading on climate.
   - Fuller picture: the 15 Billion Trees campaign is real, but figures like ~981M "tree-growing
     contributions" (since 2011) count trees planted, not survived. Environmentalists (Dr Isaac
     Kalua Green) demand site-level survival verification; seedlings die from drought/pests/poor
     sites and losses may not show in tallies. The 2023 logging-moratorium lift also allows felling
     of mature forest. Seedlings planted ≠ restored forest cover.
   - Source: Kenyans.co.ke (13 Sep 2026) — https://www.kenyans.co.ke/news/127033-environmentalists-pile-pressure-govt-verify-survival-over-981m-trees

4. **Needs context / misconception (`vc`) — "El Niño means guaranteed catastrophic floods everywhere in Kenya"**
   - Narrative (social media): El Niño is here, so the whole country faces certain catastrophic
     floods in the coming weeks.
   - Fuller picture: Kenya Met forecasts above-normal Oct–Dec 2026 rains and real flood risk, but
     has corrected the conflation — "El Niño is not rainfall"; it's a tropical-Pacific warming
     pattern (every 2–7 yrs) that shifts odds wetter, not a uniform-disaster guarantee. Effects
     vary by region/timing; onset wasn't yet declared in early Oct. Over-certainty fuels panic and
     fake "forecasts"/evacuation notices — trust official Kenya Met advisories, not viral posts.
   - Source: Kenya Met (KEMSA) / Kenyans.co.ke — https://www.kenyans.co.ke/news/125577-kenya-met-releases-el-nino-forecast-says-rains-increase-october-2026

---


## 2026-09-29 — 6 new drafts queued

Queue script: `scripts/queue-disinfo-2026-09-29.sh`. All six written to Supabase as drafts via
the connected Chrome (POST /rest/v1/disinfo_items, 201). Status: **awaiting admin review**.
Source this week: PesaCheck (Code for Africa) climate desk, Aug 2026 fact-checks — global
denialist and false-attribution talking points that also circulate in the Kenyan/East African
infosphere. Deduped against published `disinfo_items` and the 2026-09-19 / 2026-09-22 logs.

1. **Climate denial / natural-cause myth (`vf`) — "Ocean warming is just a natural cycle"**
   - Narrative (social media): the ocean is warming but it's a natural cycle, unrelated to human
     emissions.
   - Fuller picture: oceans have absorbed >90% of the excess heat from human emissions; ocean
     heat content is at record highs and accelerating since the 1970s — natural cycles (El Niño,
     solar) would have cooled, not warmed. Drives Indian Ocean cyclones, Kenyan/Tanzanian coral
     bleaching and Indian Ocean Dipole rainfall disruption.
   - Source: PesaCheck — https://pesacheck.org/false-the-heating-of-the-ocean-is-not-natural/

2. **Fabricated / misattributed to IPCC (`vf`) — "IPCC admits no evidence climate affects extreme weather"**
   - Narrative (social media): the IPCC itself says there's no evidence climate change affects
     extreme weather.
   - Fuller picture: the IPCC AR6 says the opposite — human emissions have made heat extremes,
     heavy rain and drought more frequent/intense in many regions. No IPCC report contains the
     quoted claim. East Africa's drought↔flood swings match the documented trends.
   - Source: PesaCheck — https://pesacheck.org/false-the-ipcc-did-not-say-theres-no-evidence-that-climate-change-is-affecting-extreme-weather/

3. **Misrepresented study (`vf`) — "New study proves human emissions have zero climate impact"**
   - Narrative (social media): a peer-reviewed study proves human emissions have zero impact on
     climate.
   - Fuller picture: no credible study shows this; the claim rests on a fringe/misrepresented
     paper. CO₂ up from ~280 to >420 ppm with a fossil-fuel isotopic signature, tracking observed
     warming; every major science academy agrees. One contrarian paper doesn't overturn that.
   - Source: PesaCheck — https://pesacheck.org/false-this-study-does-not-confirm-human-emissions-have-zero-impact-on-climate-change/

4. **Fabricated quote / false attribution (`vf`) — "Bill Gates admitted climate change is a hoax"**
   - Narrative (social media): Bill Gates now admits climate change is a hoax and a lie.
   - Fuller picture: no record of him saying this; it contradicts his published pro-climate
     position and funding. Attaching a famous name to a fabricated "admission" is a recurring
     disinformation tactic; the quote traces to no verifiable source.
   - Source: PesaCheck — https://pesacheck.org/false-bill-gates-did-not-say-climate-change-is-a-hoax-or-a-lie/

5. **Pseudo-scientific denial (`vf`) — "The lapse rate proves greenhouse gases can't cause warming"**
   - Narrative (social media/blogs): the atmosphere's tropospheric lapse rate disproves the
     greenhouse origin of warming.
   - Fuller picture: the lapse rate (air cooling with altitude) is real physics but describes a
     different thing from the greenhouse effect; greenhouse gases absorb/re-emit outgoing heat and
     adding them warms the surface. Warming actually alters the lapse rate in an amplifying
     feedback. A talking point, not a finding.
   - Source: PesaCheck (27 Aug 2026) — https://pesacheck.org/false-this-atmospheric-process-does-not-disprove-the-greenhouse-gas-origin-of-global-warming/

6. **False attribution / misinformation (`vf`) — "Magnitude-6 earthquakes are increasing due to climate change"**
   - Narrative (social media): climate change is causing a rise in magnitude-6 earthquakes.
   - Fuller picture: the rate of large quakes is roughly stable (better instruments record more
     small ones); quakes are tectonic, unrelated to atmospheric warming. Over-attributing to
     climate both overstates data and misassigns cause — as corrosive to public understanding as
     denial. (Flagged to show the scan catches misleading pro-climate framings too.)
   - Source: PesaCheck — https://pesacheck.org/false-magnitude-6-earthquakes-are-not-increasing-and-are-not-linked-to-climate-change/

---

## 2026-09-22 — 4 new drafts queued

Queue script: `scripts/queue-disinfo-2026-09-22.sh`. All four written to Supabase as drafts
via the connected Chrome (POST /rest/v1/disinfo_items, 201). Status: **awaiting admin review**.
Source this week: PesaCheck (Code for Africa) climate desk, Aug 2026 fact-checks — global
denialist talking points that also circulate in the Kenyan/East African infosphere.

1. **Climate denial / data manipulation (`vf`) — "CO₂ was only 345 ppm in 2025"**
   - Narrative (social media): atmospheric CO₂ stood at ~345 ppm in 2025, far below what
     scientists claim.
   - Fuller picture: credible monitoring (Mauna Loa / Scripps) puts 2025 CO₂ at ~425→430 ppm.
     345 ppm was last seen in the early 1980s; CO₂ stayed below ~300 ppm for 800,000 years until
     the 1960s. Today's level is unprecedented and fossil-fuel driven.
   - Source: PesaCheck (13 Aug 2026) — https://pesacheck.org/false-atmospheric-carbon-dioxide-was-not-345ppm-in-2025/

2. **Climate denial / cooling myth (`vf`) — "A new Little Ice Age has begun"**
   - Narrative (social media): Earth has entered a Little Ice Age / "30 cold years", so warming
     is over.
   - Fuller picture: the historical Little Ice Age (~1300–1850) was a modest ~0.6°C natural
     cooling. Today the planet is warming — recent years are the hottest on record. Orbital
     cycles that drive real ice ages act over tens of thousands of years; anthropogenic warming
     may even delay the next one.
   - Source: PesaCheck (13 Aug 2026) — https://pesacheck.org/false-a-little-ice-age-has-not-begun/

3. **Cherry-picking / denial (`vf`) — "Surging glaciers prove climate change is a scam"**
   - Narrative (X): glaciers are suddenly surging/growing, proving climate change is a scam.
   - Fuller picture: "surging" glaciers are a rare special type (<1% of glaciers) that flow fast
     for internal reasons unrelated to short-term climate; warming can even make a thinning
     glacier look "longer". Globally glaciers have lost mass for decades and the loss is
     accelerating; East Africa's ice (Mt Kenya, Kilimanjaro, Rwenzori) is nearly gone. Cherry-
     picking the exception to dismiss the trend.
   - Source: PesaCheck (26 Aug 2026) — https://pesacheck.org/false-surging-glaciers-do-not-mean-climate-change-is-a-scam/

4. **Misleading / CO₂-is-good framing (`vm`) — "More CO₂ greens the planet, so climate change doesn't hurt crops"**
   - Narrative (social media): it's "crazy" to say climate change cuts crop yields because extra
     CO₂ greens the planet and boosts harvests.
   - Fuller picture: CO₂ aids photosynthesis and some regions have greened, but warming is
     already cutting staple yields via heat stress, drought, erratic rainfall, pests and disease.
     For East Africa's largely rain-fed farming, hotter, more erratic seasons threaten maize and
     other staples far more than any CO₂ "fertilisation" helps. Greener ≠ harvests safe.
   - Source: PesaCheck (13 Aug 2026) — https://pesacheck.org/fact-checked-does-climate-change-reduce-crop-yields/

---

## 2026-09-19 — 3 new drafts queued

Queue script: `scripts/queue-disinfo-2026-09-19.sh`. All three written to Supabase as
drafts via the connected Chrome (POST /rest/v1/disinfo_items, 201). Status: **awaiting admin review**.

1. **Climate denial (`vf`) — "Glacier fluctuations disprove human-made warming"**
   - Narrative (circulating on Facebook): glaciers have always advanced/retreated, so their
     fluctuations don't support human-made global warming.
   - Fuller picture: IPCC — human influence "very likely the main driver of the global retreat
     of glaciers since the 1990s"; WMO — Mount Kenya among first ranges to lose glaciers to
     human-induced warming; East Africa's ice (Mt Kenya, Kilimanjaro, Rwenzori) wasting >100 yrs,
     projected gone by the 2040s.
   - Source: PesaCheck (20 Aug 2026) — https://pesacheck.org/false-glaciers-are-fluctuating-because-of-human-made-global-warming/

2. **Cherry-picking / denial (`vf`) — "Sahara greening proves climate change is a scam"**
   - Narrative (circulating on X): the Sahara is shrinking and getting greener, which proves
     climate change is a scam.
   - Fuller picture: the Sahara has actually expanded ~8–10% over the last century (Nature;
     Journal of Climate), advancing ~100km south into the Sahel and threatening Lake Chad; the
     AU's Great Green Wall exists to hold it back. Localised greening comes from occasional heavy
     rains that warming makes more likely — a symptom, not a refutation.
   - Source: PesaCheck (26 Aug 2026) — https://pesacheck.org/false-the-sahara-is-not-shrinking-and-its-greening-doesnt-disprove-climate-change/

3. **Bad-faith framing (`vf`) — "KFS grabbed private land from Muthaiga Golf Club"**
   - Narrative (circulating on X): KFS illegally grabbed private land from the historic Muthaiga
     Golf Club — state overreach, not conservation.
   - Fuller picture: Karura Forest was surveyed in 1923, declared a Forest Reserve in 1932 and
     gazetted in 1964; KFS says the club's parcel encroaches ~21.8 ha onto that gazetted public
     forest. Reclaiming gazetted forest is enforcing the law, not grabbing private land; both
     sides are in talks to verify the boundary.
   - Source: Kenyans.co.ke (15 Sep 2026) — https://www.kenyans.co.ke/news/127082-kfs-muthaiga-golf-club-meet-over-218ha-karura-forest-land-dispute

Already-published narratives skipped as duplicates this run: Tata Chemicals Magadi ("jobs vs
compliance"), Imenti Forest airstrip, Bondo/Siaya nuclear defender-smear, Lamu refinery
("foreign-funded activists"), "Kenya is already 90% renewable" refinery framing, Jusper
Machogu / "Fossil Fuels for Africa", Githaka "environmentalists are anti-development".
