#!/usr/bin/env bash
# Reproducible record — Events Watch run 2026-10-09 (MazingiraKenya).
# 3 NEW verified, future-dated events queued as DRAFTS (published=false, source=watch).
# These were written straight to Supabase via the connected-Chrome write path this run
# (the Mac device-bridge shell could not reach Supabase — proxy blocked the host).
# Re-running these inserts from a machine WITH Supabase network access is safe & idempotent-ish
# (admin can Reject duplicates). Nothing is public until an admin Accepts in admin → Events review.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-event-draft.mjs '{"title":"Solarexpo, Power & Energy 2026 (East Africa Solar & Energy Exhibition)","start_date":"2026-11-10","time":"10–12 Nov 2026","location":"Sarit Expo Centre, Nairobi, Kenya","mode":"In person","org":"VeriFair (Power & Elec Kenya)","link":"https://powereleckenya.com/","description":"East Africa largest solar & energy exhibition — solar, power, storage and renewables for the regional clean-energy transition; 27 countries represented."}'

node scripts/insert-event-draft.mjs '{"title":"IMPAC6 — 6th International Congress on Marine Protected Areas","start_date":"2027-02-01","time":"February 2027 (exact days TBC)","location":"Dakar, Senegal","mode":"In person","org":"Government of Senegal / IUCN","link":"https://afrik21.africa/en/dakar-to-host-the-6th-international-congress-on-marine-protected-areas-in-2027","description":"First-ever African edition of the global marine protected areas congress — blue economy, ocean justice, overfishing, seabed mining and the High Seas Treaty."}'

node scripts/insert-event-draft.mjs '{"title":"3rd Eastern Africa Agroecology Conference","start_date":"2027-03-16","time":"16–19 Mar 2027","location":"Speke Resort Munyonyo, Kampala, Uganda","mode":"Hybrid","org":"Biovision Africa Trust, KALRO, CIFOR-ICRAF & partners","link":"https://ea-agroecologyconference.org/","description":"Regional convening on accelerating agroecological transitions for inclusive, resilient and climate-adapted agri-food systems across East Africa."}'

echo "Done — 3 event drafts queued (published=false). Review in admin → Events review."
