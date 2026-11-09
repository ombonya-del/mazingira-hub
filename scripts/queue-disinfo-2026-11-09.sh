#!/usr/bin/env bash
# Weekly MazingiraKenya Narrative-Disinfo queue — 2026-11-09
# Queues UNPUBLISHED drafts (published=false) into Supabase disinfo_items for admin review.
# This run wrote the 4 drafts via a connected Chrome (POST /rest/v1/disinfo_items, 201) because
# the Mac device-bridge shell cannot reach supabase.co (proxy 403 / HTTP 000 on CONNECT).
# This script reproduces the same inserts anywhere Supabase IS reachable, via insert-disinfo-draft.mjs.
#   Usage: bash scripts/queue-disinfo-2026-11-09.sh
set -euo pipefail
cd "$(dirname "$0")/.."

run() { node scripts/insert-disinfo-draft.mjs "$1"; }

run "$(cat <<'JSON'
{"name":"Circulating on social media (X/Facebook)","posted_at":"2026-11-09","body":"A graph of global temperatures from 1900 to 2010 shows a flat line — there has been no real warming since 1900, and no link to carbon dioxide.","verdict":"Climate denial / manipulated data","verdict_class":"vf","source_url":"https://pesacheck.org/false-this-global-temperature-graph-is-not-accurate/","source_label":"PesaCheck (28 Oct 2026) · flat temperature-graph fact-check","rebuttal":"The flat graph is contradicted by every major global temperature dataset. NOAA data for January 1900 to December 2010 shows a clear rise over land and ocean, and the UK Met Office's HadCRUT record shows the same sharp spike from the 1960s onward, with near-identical agreement across the world's datasets (World Meteorological Organization). The warming shows up in both hemispheres, and WMO data show Africa heating fastest across its north, central and east — the belt that includes Kenya. A hand-drawn or cherry-picked flat line is a classic data-manipulation tactic: the measured record shows rapid, human-driven warming from burning fossil fuels, with recent years among the hottest ever recorded."}
JSON
)"

run "$(cat <<'JSON'
{"name":"Circulating on social media / skeptic websites","posted_at":"2026-11-09","body":"Global warming is caused not by human activity but by natural changes in the Earth's cloud cover and reflectivity (albedo) — and NASA's CERES satellite data proves it.","verdict":"Climate denial / misattributed cause","verdict_class":"vf","source_url":"https://pesacheck.org/false-clouds-and-albedo-changes-do-not-account-for-all-modern-warming/","source_label":"PesaCheck (28 Oct 2026) · clouds-and-albedo fact-check","rebuttal":"Neither clouds nor albedo accounts for modern warming, and NASA's CERES data does not support the claim. Global temperatures keep climbing — the EU's Copernicus programme ranked May 2026 the second-hottest such month on record. Water vapour cannot drive the long-term trend because it condenses out as rain or snow within days; overall, clouds tend to cool the planet, and the causation runs the other way — warming is reducing cloud cover and shifting wind patterns in feedback loops that amplify the heating rather than cause it. The measured driver of the trend is the build-up of greenhouse gases from burning fossil fuels. Citing NASA data to blame clouds or albedo, when that data says no such thing, is misdirection."}
JSON
)"

run "$(cat <<'JSON'
{"name":"Circulating on social media / climate-skeptic sites (AI-generated 'study')","posted_at":"2026-11-09","body":"A peer-reviewed, AI-written study — with Elon Musk's Grok AI credited as lead author — proves global warming is a natural phenomenon, not caused by humans. Just ask an AI chatbot and it confirms climate change is natural or a hoax.","verdict":"Climate denial / fabricated AI authority","verdict_class":"vf","source_url":"https://www.newsguardrealitycheck.com/p/no-grok-ai-written-study-does-not","source_label":"NewsGuard Reality Check · Grok 'AI study' debunk (also Global Witness 2025, Scientific American)","rebuttal":"This is false, and a newer disinformation tactic — dressing up long-debunked denial as 'AI-verified science.' The article (posted by ScienceofClimateChange.org) recycles discredited arguments, such as that oceans and forests absorb all human emissions and that the Sun is the main driver, and several of its human co-authors are known climate-consensus skeptics. Grok itself, asked neutrally, replied that there is 'strong evidence that human activities are a major driver of climate change.' AI chatbots are not authorities: NewsGuard audits found leading chatbots repeat false claims about 40% of the time, and both a 2025 Global Witness investigation and Scientific American documented Grok and other chatbots reciting climate-denial talking points — which can be prompted or cherry-picked into a fake 'AI proves it' screenshot. The scientific consensus that warming is real, worsening and human-caused is unchanged. Treat any 'an AI said climate change is natural/a hoax' claim as manufactured, not evidence."}
JSON
)"

run "$(cat <<'JSON'
{"name":"Circulating on Facebook (East Africa floods)","posted_at":"2026-11-09","body":"This photo shows widespread flooding in Kampala, Uganda, after recent heavy rains — proof of a major disaster in the capital.","verdict":"Fabricated / AI-generated image","verdict_class":"vf","source_url":"https://allafrica.com/stories/202603310161.html","source_label":"Africa Check (via AllAfrica, 31 Mar 2026) · AI-generated Kampala flood image","rebuttal":"The image is altered and likely AI-generated, not a photograph of real flooding. A reverse-image search turned up a non-flooded original in which buildings and roads sit clearly above water, and a building sign that reads 'Mapeera' in the real version garbles to 'Mapeeba' in the viral one — the kind of text error typical of AI image generators. The picture also lacks the hallmarks of a genuine flood scene: debris, stranded vehicles, people, or any emergency response. Kampala did experience real flooding after heavy rain on 6 March 2026, but this picture does not document it. With East Africa in another wet season — Kenya Met warned of heavy November 2026 rains — recycled, miscaptioned and AI-generated 'flood' images spread quickly, so disaster visuals should be checked against official sources before sharing."}
JSON
)"

echo "Queued 4 disinfo drafts (2026-11-09) — awaiting admin review."
