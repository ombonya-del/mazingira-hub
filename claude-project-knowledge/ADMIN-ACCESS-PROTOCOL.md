# MazingiraKenya — Admin Access Protocol

Governs who may reach **admin.mazingirakenya.org** (the moderation & operations console) and
what they can do once inside. Owner: Community Media Trust. Data controller for DPA 2019
purposes: Community Media Trust, P.O. Box 9190–00300, Kirichwa Road, ADK House 1, Kilimani,
Nairobi.

> Status: the deployed admin is a **prototype**. The gate described in §4 is a client-side
> placeholder, **not** real security. §2–§3 define the production protocol to switch on before
> the console handles real submissions or member data.

---

## 1. Principle
Least privilege, defence in depth. Three independent layers must all pass before anyone reads
or changes real data:
1. **Network perimeter** — only invited identities can load the admin app at all.
2. **Authentication** — the person proves who they are (Supabase Auth).
3. **Authorisation** — the database itself enforces what their role may do (RLS).

No single layer is trusted alone. Even if the app loads, the database refuses actions the
role isn't entitled to.

## 2. The three layers

### 2a. Network perimeter — access control in front of the app
Put `admin.mazingirakenya.org` behind an identity proxy (Vercel Access or Cloudflare Access).
Only email addresses on the coalition allow-list can even fetch the page. This keeps the
console off the public internet and stops credential-stuffing at the door. The public app
(raia) and the coordination hub stay open; **only the admin subdomain** is gated here.

### 2b. Authentication — Supabase Auth
Sign-in is **magic-link / OTP email** (no passwords for Claude or anyone to handle). On login,
Supabase issues a session JWT carrying the user's `auth.uid()`. The app reads the matching
row in `members` to get their role. Sessions are short-lived and refresh silently; **Sign out**
clears the session.

### 2c. Authorisation — Row-Level Security (the real perimeter)
RLS policies in Postgres are the source of truth (already written in `supabase-schema.sql`):
- `is_staff()` → moderator, editor, or admin
- `is_editor()` → editor or admin
- Anon (the public) may **INSERT** to `submissions` but may **never SELECT** it (PII stays
  private); anon may read only published content.
- Service-role key lives **only** in edge functions, never in any browser.

## 3. Roles & permissions matrix

| Capability | Contributor | Moderator | Editor | Admin |
|---|:--:|:--:|:--:|:--:|
| Submit a Voice / content | ✅ | ✅ | ✅ | ✅ |
| See the moderation queue (PII) | — | ✅ | ✅ | ✅ |
| Approve / reject submissions | — | ✅ | ✅ | ✅ |
| Review & approve AI disinfo rebuttals | — | ✅ | ✅ | ✅ |
| Approve **sensitive** rebuttals (names a death/allegation) | — | — | ✅ | ✅ |
| Publish / unpublish to raia | — | — | ✅ | ✅ |
| Edit issues, Big Questions, myths, events | — | — | ✅ | ✅ |
| Set the featured "Story of the week" | — | — | ✅ | ✅ |
| Manage members & roles | — | — | — | ✅ |

Sensitive-tier rebuttals never auto-publish — an **Editor** must sign off (enforced in the
narrative queue).

## 4. Prototype gate (current state)
Until §2 is switched on, the console is protected by a single passcode held in
`admin/index.html` (`GATE_CODE`). Hardening already applied: the code is no longer shown in
the UI, wrong entries are rejected, five failures trigger a 1-minute lockout, and a valid
entry is remembered for the browser session only.

- **Current code:** `deCOAL-2026` — change it on the `GATE_CODE = …` line and redeploy.
- Treat this as a "please don't wander in" sign, not a lock. Do **not** load real member PII
  behind it — wait for §2.

## 5. Onboarding / offboarding
- **Add a member:** Admin adds their email to the Access allow-list (§2a) **and** inserts a
  `members` row with the right role. Both are required.
- **Change a role:** Admin updates `members.role`. RLS picks it up on their next action.
- **Remove a member:** set `members.active = false` **and** remove them from the Access
  allow-list. Suspending in one layer only is not enough.
- Review the member list quarterly; remove anyone who has left a partner organisation.

## 6. Operational rules
- One person, one identity — no shared logins.
- Moderators handle the queue; only Editors/Admins publish. Keep the split.
- All secrets (service-role key, `ANTHROPIC_API_KEY`) live in Supabase edge-function env only.
- Public write forms get a CAPTCHA (Cloudflare Turnstile) before launch.
- Security headers (HSTS, nosniff, X-Frame-Options, Referrer-Policy) ship via `vercel.json`.

## 7. Go-live checklist (flip before real data)
- [ ] Access proxy enabled on `admin.mazingirakenya.org`, allow-list seeded
- [ ] Supabase Auth (magic-link) wired; `members` rows created for each person
- [ ] RLS confirmed: anon cannot SELECT `submissions` (test with the anon key)
- [ ] Turnstile on the public submission form
- [ ] Security headers live; privacy policy linked in every footer
- [ ] `GATE_CODE` placeholder removed once real auth is in
