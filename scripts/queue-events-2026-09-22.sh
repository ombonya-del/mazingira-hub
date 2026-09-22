#!/usr/bin/env bash
# Reproducible record of the Events Watch run on 2026-09-22.
# Queues UNPUBLISHED event drafts (published=false, source=watch) into Supabase
# for admin review in admin → Events review. Run from a machine with Supabase access.
#
# This run added 2 NEW verified, future-dated events (on/after 2026-09-22) not
# previously queued in EVENTS-REVIEW.md. Both were written straight to Supabase
# via the connected-browser write path and returned HTTP 201.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-event-draft.mjs '{"title":"Carbon Markets Africa Summit (CMAS) 2026","start_date":"2026-10-13","time":"13–15 Oct 2026","location":"Kigali, Rwanda","mode":"In person","org":"VUKA Group — hosted by Rwanda Ministry of Environment with UNDP & AfDB (AUDA-NEPAD strategic partner)","link":"https://carbonmarketsafrica.com/","description":"Pan-African carbon markets summit connecting policymakers, project developers, investors and standards bodies to scale high-integrity carbon markets and unlock climate finance across Africa as Article 6 mechanisms move into implementation."}'

node scripts/insert-event-draft.mjs '{"title":"9th GLF Investment Case Symposium","start_date":"2026-11-18","time":"18 Nov 2026","location":"Antalya, Türkiye (DoubleTree by Hilton) & online","mode":"Hybrid","org":"Global Landscapes Forum & Government of Luxembourg","link":"https://events.globallandscapesforum.org/9th-investment-case-symposium/","description":"GLF flagship sustainable-finance forum, held alongside COP31, on using AI, data and partnerships to channel capital to climate and nature-based solutions across the Global South."}'
