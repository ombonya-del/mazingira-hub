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
