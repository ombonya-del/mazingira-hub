#!/usr/bin/env bash
# Reproducible record — Events Watch run 2026-11-09 (MazingiraKenya).
# 3 NEW verified, future-dated events queued as DRAFTS (published=false, source=watch).
# These were written straight to Supabase via the connected-Chrome write path this run
# (the Mac device-bridge shell could not reach Supabase — curl -> HTTP 403 from proxy after CONNECT).
# All three inserts returned HTTP 201. Re-running these inserts from a machine WITH Supabase
# network access is safe (admin can Reject duplicates). Nothing is public until an admin Accepts
# in admin -> Events review.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-event-draft.mjs '{"title":"UNESCO World Conference on Education for Sustainable Development 2027","start_date":"2027-01-13","time":"13–15 Jan 2027","location":"Nairobi, Kenya","mode":"In person","org":"UNESCO & Government of Kenya (co-organised with Japan)","link":"https://www.unesco.org/en/sustainable-development/education/2027-conference","description":"Global UNESCO conference in Nairobi marking the midpoint of the ESD-for-2030 framework, positioning greening education and climate action as central to shaping sustainable futures."}'

node scripts/insert-event-draft.mjs '{"title":"Intersolar Africa 2027","start_date":"2027-03-16","time":"16–17 Mar 2027","location":"Sarit Expo Centre, Nairobi, Kenya","mode":"In person","org":"Intersolar (Solar Promotion) & AFSIA (Africa Solar Industry Association)","link":"https://www.afsiasolar.com/afsia-events/2027-03-16/","description":"East Africa'"'"'s largest solar and energy-storage exhibition and conference, convening the renewable-energy industry, utilities and policymakers to accelerate Africa'"'"'s clean-energy transition."}'

node scripts/insert-event-draft.mjs '{"title":"What Works Climate Solutions Summit 2027","start_date":"2027-04-13","time":"13–16 Apr 2027","location":"University of Cape Town (Graduate School of Business), Cape Town, South Africa","mode":"In person","org":"African Synthesis Centre for Climate Change, Environment and Development (ASCEND)","link":"https://whatworksclimate.solutions/wwcs-summit-cape-town-2027/","description":"First African edition of the global climate-solutions summit, hosted by ASCEND, bringing researchers and practitioners together to assess what climate policies and interventions actually work for Africa."}'

echo "Done — 3 event drafts queued (published=false). Review in admin -> Events review."
