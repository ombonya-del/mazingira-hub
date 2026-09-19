#!/usr/bin/env bash
# Weekly MazingiraKenya Narrative-Disinfo queue — 2026-09-19
# Queues UNPUBLISHED drafts (published=false) into Supabase disinfo_items for admin review.
# The device shell cannot reach Supabase directly; this run wrote the drafts via a connected
# Chrome (POST to /rest/v1/disinfo_items with the public anon key). This script reproduces the
# same inserts anywhere Supabase IS reachable, via scripts/insert-disinfo-draft.mjs.
#   Usage: bash scripts/queue-disinfo-2026-09-19.sh
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-disinfo-draft.mjs '{
  "name":"Circulating on Facebook",
  "body":"Glaciers have always advanced and retreated — their fluctuations don'\''t support the idea of human-made global warming.",
  "verdict":"Climate denial","verdict_class":"vf",
  "source_url":"https://pesacheck.org/false-glaciers-are-fluctuating-because-of-human-made-global-warming/",
  "source_label":"PesaCheck · Mt Kenya glaciers fact-check",
  "rebuttal":"Glaciers do vary naturally, but the century-long, accelerating retreat we'\''re seeing is not natural variation. The IPCC finds human influence is very likely the main driver of the global retreat of glaciers since the 1990s, and the WMO warns Mount Kenya will be one of the first entire mountain ranges to lose its glaciers to human-induced warming. East Africa'\''s ice on Mt Kenya, Kilimanjaro and Rwenzori has been wasting away for over a century and is projected to vanish by the 2040s; worldwide, glaciers have lost roughly 270 gigatonnes of ice every year for two decades, and the loss is speeding up."
}'

node scripts/insert-disinfo-draft.mjs '{
  "name":"Circulating on X",
  "body":"The Sahara is shrinking and getting greener — proof that climate change is a scam.",
  "verdict":"Cherry-picking / denial","verdict_class":"vf",
  "source_url":"https://pesacheck.org/false-the-sahara-is-not-shrinking-and-its-greening-doesnt-disprove-climate-change/",
  "source_label":"PesaCheck · Sahara greening fact-check",
  "rebuttal":"The premise is wrong: the Sahara is expanding, not shrinking. Studies in Nature and the Journal of Climate found it grew about 8-10% over the last century, advancing roughly 100km south into the Sahel and threatening Lake Chad — which is why the African Union launched the Great Green Wall to hold it back. Where patches do green, it is driven by occasional heavy rains that climate change itself is making more likely: a symptom of a warming climate, not a refutation of it."
}'

node scripts/insert-disinfo-draft.mjs '{
  "name":"Circulating on X",
  "body":"KFS has illegally grabbed private land from the historic Muthaiga Golf Club. This is state overreach against a members'\'' club, not conservation.",
  "verdict":"Bad-faith framing","verdict_class":"vf",
  "source_url":"https://www.kenyans.co.ke/news/127082-kfs-muthaiga-golf-club-meet-over-218ha-karura-forest-land-dispute",
  "source_label":"Kenyans.co.ke · Karura–Muthaiga boundary",
  "rebuttal":"This inverts what happened. Karura Forest was surveyed in 1923, declared a Forest Reserve in 1932 and gazetted in 1964, and KFS says the golf club'\''s parcel encroaches about 21.8 hectares onto that gazetted public forest — so reclaiming it is enforcing the law, not grabbing private land. Karura is a public green lung that Wangari Maathai and Nairobi residents fought to save; verifying and restoring its boundary is exactly what protecting a gazetted forest requires. Both sides are now in talks to confirm the line."
}'

echo "Queued 3 disinfo drafts (2026-09-19) — awaiting admin review."
