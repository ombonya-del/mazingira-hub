#!/usr/bin/env bash
# Events Watch — reproducible queue record for the 2026-11-16 run.
# Writes 3 NEW verified climate/environmental events as DRAFTS (published=false,
# source=watch) into Supabase for admin Accept/Reject in admin → Events review.
# This run the drafts were written via the connected-Chrome write path (the Mac
# device-bridge shell could not reach Supabase — curl returned HTTP 000). The
# node calls below reproduce the same inserts where the shell CAN reach Supabase.
# Nothing is public until an admin Accepts. Re-running is safe (admin de-dupes).
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-event-draft.mjs '{"title":"Solar Africa Kenya 2027 (12th East Africa Solar & Renewable Energy Exhibition)","start_date":"2027-06-16","time":"16–18 Jun 2027","location":"Carnivore Exhibition Grounds, Nairobi, Kenya","mode":"In person","org":"Expogroup","link":"https://expogr.com/solarafrica/","description":"East Africa'\''s largest solar, clean-energy and energy-storage exhibition and conference, bringing manufacturers, developers and policymakers to Nairobi to accelerate the region'\''s renewable-energy transition."}'

node scripts/insert-event-draft.mjs '{"title":"Lagos Climate Week 2027","start_date":"2027-02-22","time":"22–26 Feb 2027","location":"Eko Convention Centre, Lagos, Nigeria","mode":"In person","org":"Lagos State Government (Ministry of the Environment & Water Resources)","link":"https://lagosclimateweek.com/","description":"Pan-African climate week themed '\''Unified Action for Climate Resilience'\'', convening governments, business, investors, researchers and communities on climate action, resilience and coastal/ocean innovation."}'

node scripts/insert-event-draft.mjs '{"title":"SETAC Africa 13th Biennial Conference 2027","start_date":"2027-09-26","time":"26–30 Sep 2027","location":"Dar es Salaam, Tanzania","mode":"In person","org":"Society of Environmental Toxicology and Chemistry (SETAC)","link":"https://www.setac.org/discover-events/global-meetings/setac-africa-13th-biennial-conference.html","description":"East African environmental-science conference — '\''From Science to Solutions: Advancing Environmental Stewardship, Chemical Safety and Public Health in Africa'\'' — with tracks on climate change, ecosystems and pollution prevention across the continent."}'

echo "All 3 event drafts queued (published=false) — awaiting admin review."
