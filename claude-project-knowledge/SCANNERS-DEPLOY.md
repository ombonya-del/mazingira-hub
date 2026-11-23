# MazingiraKenya Scanners — deploy guide (server-side, hands-off)

This moves the four web-based scanners (Opportunities, Resources, Events, Narrative-Disinfo)
off Claude scheduled tasks and onto **Supabase edge functions + a GitHub Actions cron** —
exactly how ImaarishaSRHR's scanners already run. Once deployed, drafts insert themselves
into the admin review queue automatically; you just Accept/Reject. No Mac, no Terminal, no
Claude credits.

Files added to this repo:
- `supabase/functions/opportunity-scanner/index.ts` → `resources` (category=Opportunities, published=false)
- `supabase/functions/resource-scanner/index.ts`   → `resources` (category=Resources, published=false)
- `supabase/functions/event-scanner/index.ts`      → `calendar_events` (published=false; Claude extracts dates)
- `supabase/functions/disinfo-scanner/index.ts`    → `disinfo_items` (published=false; Claude flags + rebuts)
- `.github/workflows/scanners.yml`                 → weekly cron that fires all four

Run everything from Terminal inside this folder. One-time setup, then it's automatic forever.

---

## Step 1 — Pick a cron secret

Generate one shared secret (any long random string). You'll set it in two places (Supabase + GitHub) so only the cron can call the functions.

```bash
CRON=$(openssl rand -hex 24); echo "$CRON"   # copy this value
```

## Step 2 — Point the Supabase CLI at the project

```bash
supabase login                       # one-time, opens browser
supabase link --project-ref uueemckdoozsuowcqkhl
```

## Step 3 — Set the function secrets

`ANTHROPIC_API_KEY` is already set on this project (scan-sentiment uses it) — the event & disinfo
scanners reuse it. You only need to add the cron secret:

```bash
supabase secrets set CRON_SECRET="$CRON" --project-ref uueemckdoozsuowcqkhl
# (verify Anthropic key exists; if the list doesn't show it, set it)
supabase secrets list --project-ref uueemckdoozsuowcqkhl
# supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref uueemckdoozsuowcqkhl
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically — don't set them.

## Step 4 — Deploy the four functions

```bash
for fn in opportunity-scanner resource-scanner event-scanner disinfo-scanner; do
  supabase functions deploy "$fn" --project-ref uueemckdoozsuowcqkhl
done
```

## Step 5 — Give GitHub the same secret

```bash
gh secret set MAZINGIRA_CRON_SECRET --body "$CRON"     # run inside this repo (needs: gh auth login)
```

## Step 6 — Commit & push (arms the weekly cron)

```bash
git add supabase/functions .github/workflows/scanners.yml SCANNERS-DEPLOY.md
git commit -m "feat: server-side scanners (edge functions + Actions cron)"
git push
```

## Step 7 — First run + verify

```bash
gh workflow run scanners.yml -f target=all      # kick all four now
# then watch:
gh run list --workflow=scanners.yml
```

Each function returns JSON like `{"scanned":N,"inserted":M,...}`. Then open the hub admin →
Opportunities / Resources / Events / Narrative-disinfo review — new drafts should be waiting
for Accept/Reject. The GitHub → Actions tab should show a green **MazingiraKenya Scanners** run.

---

## After it's confirmed working

The four Claude scheduled tasks (Mazingira Opportunities / Events / Resources / Narrative-Disinfo
Watch) now do the same job less efficiently. Once you've seen a green Actions run drop drafts into
review, **disable those four Claude tasks** so nothing runs twice (the inserts de-dupe by URL, so a
double-run is harmless — this is just tidiness). Ask Claude to disable them, or leave them as a
belt-and-braces backup — your call. The three **bookmark-based** tasks (MOTD, Voices, Coalhub
community pulse) stay as they are — those can't be edge functions.

## Tuning

- **Schedule:** edit the `cron` in `.github/workflows/scanners.yml` (currently Mondays 06:00 UTC).
  Disinfo can run more often if you want — add another cron line.
- **Sources / keywords:** each function has a `FEEDS`/`RSS_FEEDS` array and a keyword list at the
  top — add or remove sources there and redeploy that one function.
- **Run one manually:** `gh workflow run scanners.yml -f target=disinfo-scanner`.
