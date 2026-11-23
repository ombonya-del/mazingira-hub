# MazingiraKenya — Backend Architecture (Supabase)

*How the three dashboards stop being prototypes and start sharing one live database.
Draft v1 — for the developer.*

---

## 1. Purpose & principles

Today all three sites (hub, raia, admin) are static single-file PWAs with **mock data
in the markup**. This document specifies the backend that makes them real and connected:
one database, three views onto it, with moderation flowing through to the public.

Principles (from the CMT house style):
- **Static frontends stay static.** No rewrite. Each `index.html` gains a small
  `supabase-js` client and reads/writes the shared DB. No build step required.
- **Anon key only on the client.** The public/anon key ships in the HTML; the
  **service-role key never leaves the server** (edge-function env only).
- **Row-Level Security (RLS) is the perimeter.** Anon may INSERT to public forms and
  SELECT only what's meant to be public; it must never SELECT PII tables.
- **Privileged work runs in Edge Functions** (Supabase/Deno): publishing, the scanner,
  anything using the service role.
- **Privacy by law.** Kenya Data Protection Act 2019: consent captured and stored,
  PII access restricted, right to deletion supported.

## 2. Stack

- **Supabase**: Postgres + Auth + Storage + Edge Functions + `pg_cron`.
- **Frontends**: existing static HTML on Vercel + `@supabase/supabase-js` via CDN.
- **Admin** additionally behind **Vercel Access / Cloudflare Access** (network gate)
  on top of Supabase Auth (app gate).
- **Turnstile** (Cloudflare) CAPTCHA on every public write form.

## 3. Data model (core tables)

```
orgs(id, name, type)                       -- coalition organisations
members(id, auth_uid, org_id, name, role,  -- role: admin|editor|moderator|contributor
        active, last_seen)

-- Pipeline A: community voices
submissions(id, kind, lang, county, body, media_path, submitter_name, submitter_email,
            consent bool, has_minor bool, status, created_at, reviewed_by, review_note)
            -- status: pending|approved|rejected|changes
publish_queue(id, source, ref_id, target, title, status, published_at, published_by)
            -- source: voices|hub ; status: ready|live
published(id, surface, issue_id, payload jsonb, live bool, created_at)
            -- what raia actually reads (Voices wall, issue cross-posts)

-- Pipeline B: disinformation
disinfo(id, verdict, claim jsonb, where_seen, why jsonb, truth jsonb, status,
        linked_issue, updated_by, updated_at)          -- jsonb = {en,sw,sh}

-- Pipeline C: sentiment scanner
sentiment_items(id, source, source_type, title, url, published_at, stance, score,
                theme, ingested_at)                     -- source_type: news|scholarly|social
sentiment_index(id, period_start, period_end, index_score, delta,
                split_news jsonb, split_scholarly jsonb, split_social jsonb, themes jsonb)

-- Content the coalition curates (issues, big questions, myths, events)
issues(id, slug, status, featured, place jsonb, title jsonb, streams jsonb, action jsonb)
bigq(id, slug, q jsonb, a jsonb, case_study jsonb, video)
myths(id, slug, m jsonb, reality jsonb, why jsonb, where jsonb, link)
events(id, title, type, mode, starts_at, location, org, description, link, status)
county_scores(id, county, sector, score, evidence jsonb, scorer, status, created_at)
```

`status`/moderation columns everywhere: nothing public is visible until a moderator
flips it. `jsonb {en,sw,sh}` mirrors the trilingual shape the frontends already use.

## 4. Pipeline A — Voices: moderation → publishing → raia

1. **Submit (public).** The hub/raia Voices form does `insert into submissions` with the
   anon key. RLS allows anon INSERT only; consent + minor flags are required columns.
   Turnstile token verified in a `before-insert` edge function.
2. **Moderate (admin).** Moderators (authenticated) `select … where status='pending'`.
   The admin Moderation queue is exactly today's UI — approve / reject / request-changes
   write `status` + `review_note`. Approve is blocked in-app when `consent=false` or
   `has_minor=true` without guardian consent (already enforced in the prototype).
3. **Publish (admin → edge function).** "Send to publish" / "Publish to raia" calls a
   `publish` edge function (service role): it copies the approved item into `published`
   with `live=true` and the target surface (Voices wall or an issue cross-post), and
   marks `publish_queue.status='live'`.
4. **Read (raia).** raia's Voices wall and issue pages `select … from published where
   live=true`. RLS: anon can SELECT `published` but **not** `submissions` (which holds
   emails/PII).

Net effect: the flow the admin prototype already mimics becomes real, and raia updates
without a redeploy.

## 5. Pipeline B — Disinformation watch

- Editors/moderators maintain `disinfo` rows in admin (claim, verdict, why, truth,
  linked issue, status: active|monitoring|debunked).
- Hub's **Disinfo** sub-tab reads `disinfo` (all rows); raia's **Spot the lie** reads the
  same rows filtered to `status != 'draft'`. One source, two surfaces — the cross-link
  they already show becomes a real join.
- Optional: attach `sentiment_items` that triggered a narrative, so a spike in the
  scanner can auto-suggest a new disinfo card for review.

## 6. Pipeline C — RSS & sentiment scanner (the "radar")

A scheduled **edge function** (`pg_cron`, e.g. every 6 h):
1. **Fetch** a curated source list — RSS feeds (Nation, Standard, The Star, Business
   Daily, Mongabay, Climate Home, KBC…) + APIs where available. CORS isn't a problem
   because this runs **server-side**, not in the browser (that's why the client can't
   do it).
2. **Normalise & de-dupe** by URL/title hash into `sentiment_items`.
3. **Stance-score** each item toward climate/environmental-justice framing
   (supportive · neutral · critical) using an LLM call or a fine-tuned classifier;
   store `stance`, `score`, `theme`. Flag low-confidence items for **human review**.
4. **Aggregate** per period into `sentiment_index` (index score, delta, the three
   source splits, top themes).
5. Hub's **Sentiment** tab reads `sentiment_index` (latest) + the recent
   `sentiment_items` feed. The Je, Hatua? callout reads the same index score.

> The eight real items now seeded in the hub feed are exactly the shape this produces —
> so the UI is already correct; only the ingestion job is missing.

## 7. Auth, roles & security

- **Auth**: Supabase Auth (magic-link email or org SSO). Each member row links to an
  `auth.uid`.
- **Roles → permissions** (enforced by RLS, not the UI):
  Contributor = INSERT submissions; Moderator = update submission status; Editor =
  publish + edit content/disinfo/events; Admin = manage members + everything.
- **RLS sketch** (Voices):
  ```sql
  -- anyone may submit
  create policy voices_insert on submissions for insert to anon with check (true);
  -- only staff may read submissions (PII)
  create policy voices_read on submissions for select to authenticated
    using (exists (select 1 from members m where m.auth_uid = auth.uid()
                   and m.role in ('moderator','editor','admin')));
  -- the public reads only published, live content
  create policy pub_read on published for select to anon using (live = true);
  ```
- **Service-role** key only in edge functions (publish, scanner). Never in HTML.
- **Network gate** on admin (Vercel/Cloudflare Access) in addition to app auth.
- **Turnstile** on all public write forms; verified server-side before insert.
- **DPA 2019**: `consent` + `has_minor` required on submissions; PII (emails) never
  exposed to anon; a delete endpoint honours the right to erasure; privacy policy already
  linked in every footer.

## 8. How each frontend connects

| Site  | Reads | Writes | Extra |
|-------|-------|--------|-------|
| **hub**   | issues, disinfo, sentiment, events, county_scores | submissions, county_scores (public forms) | review gate stays until launch |
| **raia**  | published (Voices + issues), issues, bigq, myths, disinfo | submissions (Add your voice) | anon read-only otherwise |
| **admin** | submissions, publish_queue, disinfo, members, content, sentiment | everything (via auth + edge functions) | behind network gate |

Each site adds ~15 lines: create the client with the anon key, swap the in-file mock
arrays for `await supabase.from('…').select()`. The render functions don't change.

## 9. What's buildable now vs needs the coalition

**Buildable now from public data (no stakeholder input):**
- The sentiment scanner's **source list + ingestion** (public RSS/APIs) — seed underway.
- Disinformation cards grounded in **public fact-checks** (Africa Check, PesaCheck).
- Issue "further reading" links from **public reporting** (as just seeded on the hub).
- Legal matters & the extraction map from **public court records and news**.

**Needs the coalition (Tier-1/Tier-2 input):**
- Community pressure **scores** per county, real **Voices** submissions, the verified
  **org/funding network**, event calendar, and any consent-bearing media.

## 10. Phased rollout

1. **DB + Auth + RLS** and move `issues / bigq / myths / disinfo / events` reads to
   Supabase (content the frontends already hold). Low risk, immediate.
2. **Voices pipeline** end-to-end (submit → moderate → publish → raia) + Turnstile.
3. **Sentiment scanner** edge function + `sentiment_index`; connect hub + Je, Hatua?.
4. **Admin auth + network gate**; retire the cosmetic demo gate.
5. **Analytics/exports** for donor reporting.

---

## 11. AI-assisted narrative rebuttals (Claude in the loop)

The Narrative-disinfo desk works even better when the *first draft* of each rebuttal is
machine-written and a human only verifies it — turning a slow fact-check (days) into a rapid
response (minutes). Buildable and safe, if it is **grounded and gated**.

Pipeline (extends Pipeline C — the scanner):
1. **Detect** — the social scanner surfaces a candidate post: climate/EJ topic + high
   virality + a false/misleading stance score.
2. **Classify & match** — an LLM pass tags the narrative type (bad-faith framing, science
   denial, defender smear, manipulated media, false dilemma) and links it to the relevant
   **issue** (Lamu refinery, carbon credits…) and any existing classic-disinfo entry.
3. **Ground (retrieval)** — pull the coalition's OWN verified evidence from the DB: the
   issue's Happening/Truth text, the classic debunks, the fact-check corpus, the real
   sentiment-feed articles, legal rulings. **This is the guardrail against hallucination —
   Claude writes only from retrieved, cited facts, never free memory.**
4. **Draft** — Claude (Messages API, called from a Supabase edge function) writes the inline
   rebuttal in the coalition's plain-language "counter" voice, and returns the sources it
   used plus a grounding-confidence score. If it can't ground a claim, it returns
   *"insufficient evidence — needs a human,"* not an invented answer.
5. **Gate by risk:**
   - Low-risk + well-grounded → auto-draft to the hub desk as "AI draft," light human OK.
   - **Sensitive tier is always human-signed** — anything naming individuals, deaths (e.g.
     Gem-Ramula), legal allegations, or a named company.
6. **Verify** — a moderator sees the flagged post, the AI draft, and its cited sources
   side-by-side, and approves / edits / rejects in seconds.
7. **Publish** — approved → DB → hub desk + farmed to raia. Every AI draft is logged
   (model, prompt version, sources, approver) for audit.

Why this shape: the human stays the accountable, on-message editor, but Claude removes the
blank-page delay that makes rapid response impractical. **Drafted in seconds, verified in a
minute, live within the hour** — ahead of the lie's spread.

New tables/columns: `narrative_items(id, platform, url, reach, first_seen, narrative_type,
issue_id, stance, virality)`, `rebuttals(id, narrative_id, draft_body, model, prompt_version,
sources jsonb, confidence, status, approved_by, published_at)`.

## 12. Farming out to raia — where the lie actually lands

The hub desk is internal; the public meets the disinfo on the *same social feeds*. So an
approved rebuttal is pushed to raia, targeted to where it's needed most:

- **On the matching issue page.** A Lamu-refinery rebuttal appears on raia's Lamu-refinery
  issue — a reader learning about the refinery also sees "here's a lie circulating about
  this, and the truth." Context where it counts.
- **In a live "Trending lies" feed** under raia's *Spot the lie* — the fast, current layer
  beside the evergreen myths, trilingual (Claude drafts EN/SW; Sheng goes to LAWA's youth
  writers for the re-voice).
- **Prioritised by reach.** The scanner tracks virality; the highest-spreading narratives
  surface first and get the loudest placement.
- **Regionally.** A narrative spiking in one county (Gem-Ramula, Lamu) is surfaced harder
  for that audience.
- **Made shareable.** Each raia rebuttal is a one-tap share card (X, WhatsApp, TikTok) so
  citizens counter the lie *on the platform it is spreading on*. The public becomes the
  distribution — the fastest, most trusted channel back into the same networks.

Flow, one line: **scanner detects → Claude drafts (grounded) → coalition verifies on the
hub → publish to the raia issue + trending feed + a shareable card → the public rebuts at
source.**
