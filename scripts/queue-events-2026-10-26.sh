#!/usr/bin/env bash
# Reproducible record — Events Watch run 2026-10-26 (MazingiraKenya).
# 3 NEW verified, future-dated events queued as DRAFTS (published=false, source=watch).
# These were written straight to Supabase via the connected-Chrome write path this run
# (the Mac device-bridge shell could not reach Supabase — curl -> HTTP 000, host blocked by the proxy).
# All three inserts returned HTTP 201. Re-running these inserts from a machine WITH Supabase
# network access is safe (admin can Reject duplicates). Nothing is public until an admin Accepts
# in admin -> Events review.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-event-draft.mjs '{"title":"2nd Africa Clean Cooking Summit","start_date":"2027-01-27","time":"27–28 Jan 2027","location":"Nairobi, Kenya","mode":"In person","org":"Govt of Kenya, Norway & USA with African Union Commission, AfDB, IEA & Clean Cooking Alliance","link":"https://allafrica.com/stories/202609230342.html","description":"Pan-African summit where governments, investors, development partners, industry and civil society review clean-cooking pledges and mobilise financing to expand clean cooking access across Africa."}'

node scripts/insert-event-draft.mjs '{"title":"Africa'"'"'s Green Economy Summit (AGES) 2027","start_date":"2027-02-23","time":"23–26 Feb 2027","location":"Cape Town, South Africa","mode":"In person","org":"VUKA Group (Go Green Africa) & City of Cape Town","link":"https://wearevuka.com/green-economy/ages/","description":"5th edition of Africa'"'"'s green-economy dealmaking platform connecting global investors with investment-ready, bankable climate and green-economy projects across Africa."}'

node scripts/insert-event-draft.mjs '{"title":"BACE 2027 — Blue Africa Conference & Exhibition","start_date":"2027-08-12","time":"12–14 Aug 2027","location":"Eko Hotel & Suites, Lagos, Nigeria","mode":"In person","org":"Bahari Network with Nigeria'"'"'s Ministry of Marine & Blue Economy","link":"https://blueeconomy.africa/","description":"Pan-African ocean-economy convening where business, government and academia shape a sustainable blue economy — fisheries, marine conservation, coastal resilience and ocean investment."}'

echo "Done — 3 event drafts queued (published=false). Review in admin -> Events review."
