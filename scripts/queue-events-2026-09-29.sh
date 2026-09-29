#!/usr/bin/env bash
# Reproducible record — Events Watch run 2026-09-29.
# 4 NEW verified, future-dated events queued as drafts (published=false, source=watch).
# Drafts were written to Supabase via the connected-browser write path (all HTTP 201);
# this script reproduces the same inserts from any machine with Supabase network access.
# Nothing is public until an admin Accepts in admin → Events review.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-event-draft.mjs '{"title":"African Green Investment Forum 2026","start_date":"2026-10-01","time":"October 2026 (exact dates TBC)","location":"Nairobi, Kenya","mode":"In person","org":"Government of Kenya — National Treasury","link":"https://peopledaily.digital/news/govt-to-host-african-green-investment-forum-to-unlock-climate-finance","description":"Kenya-government forum to unlock climate finance for the region — carbon-market standardisation, green sovereign bonds, debt-for-nature swaps and e-mobility investment across East Africa. Announced in the 2026/27 budget; exact dates to be confirmed."}'

node scripts/insert-event-draft.mjs '{"title":"MOP38 — 38th Meeting of the Parties to the Montreal Protocol","start_date":"2026-11-02","time":"2–6 Nov 2026","location":"Kigali, Rwanda (Kigali Convention Centre)","mode":"In person","org":"UNEP Ozone Secretariat / Government of Rwanda","link":"https://ozone.unep.org/meetings/thirty-eighth-meeting-parties","description":"Global ozone and HFC talks return to Kigali, 10 years after the Kigali Amendment — sustainable cooling and HFC phase-down with direct climate benefits for East Africa."}'

node scripts/insert-event-draft.mjs '{"title":"COP32 — 32nd UNFCCC Conference of the Parties","start_date":"2027-11-08","time":"Nov 2027 (dates provisional)","location":"Addis Ababa, Ethiopia","mode":"Hybrid","org":"UNFCCC / COP32 Presidency (Ethiopia)","link":"https://en.wikipedia.org/wiki/2027_United_Nations_Climate_Change_Conference","description":"Africa'\''s next UN climate summit — Ethiopia confirmed as host in Addis Ababa. Finance, adaptation and loss & damage outcomes central to the African climate-justice agenda. Exact dates to be confirmed by UNFCCC."}'

node scripts/insert-event-draft.mjs '{"title":"UNEA-8 — Eighth Session of the UN Environment Assembly","start_date":"2027-12-06","time":"6–10 Dec 2027","location":"Nairobi, Kenya (UNEP HQ)","mode":"In person","org":"UN Environment Programme (UNEP)","link":"https://www.unep.org/environmentassembly/","description":"The UN'\''s top environmental decision-making body convenes at UNEP HQ in Nairobi — resolutions on climate, pollution, biodiversity and a just transition, central to Kenya and Africa'\''s environmental agenda."}'
