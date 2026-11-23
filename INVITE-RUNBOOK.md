# MazingiraKenya Hub — Member Invite Runbook

*Why invites sometimes don't land, and the exact steps to do it right. Diagnosed 2026-09-11 against the live Supabase (deCOALonize org) + Resend setup.*

---

## TL;DR — the 4 rules

1. **Invite from the Supabase dashboard**, not the admin app. (The admin app's "Send invite" button is a non-functional prototype — it shows "Saved" and sends nothing.)
2. **Never delete a user to re-send.** Deleting invalidates the link already in their inbox. Use **Resend / Send magic link** on the existing user instead.
3. **Tell every invitee to check Spam / Promotions** and add **admin@mazingirakenya.org** to their contacts. (Gmail is the main offender.)
4. **Links now last 24 hours** (raised from 1 hour on 2026-09-11). Ask people to click the same day.

---

## What the setup actually is (verified healthy)

- Auth emails send via **Resend** custom SMTP, from **admin@mazingirakenya.org** ("MazingiraKenya").
- Both `mazingirakenya.org` and `mail.mazingirakenya.org` are **Verified** in Resend (SPF / DKIM / DMARC in place).
- Supabase email cap: **45/hour**. Invite/OTP link expiry: **24 hours**.
- Site URL `https://hub.mazingirakenya.org`; redirect allow-list includes `hub.mazingirakenya.org/**`.
- In Resend's logs: invites are **Delivered**, with **zero bounces** and **zero suppressions**.

**Conclusion:** invites are being *sent and accepted* by recipients' mail servers. When someone "doesn't get it," the loss is almost always **after** delivery — spam-foldering or an expired/killed link — not a send failure.

---

## How to invite a new member (the right way)

1. Supabase → **Authentication → Users → Add user ▸ Send invitation** (or **Invite user**).
2. Enter their email, exactly. Double-check spelling — a typo on a catch-all domain still shows "Delivered" but nobody reads it.
3. They get "You're invited to the MazingiraKenya coalition hub" → click **Accept invitation** → they land in the hub signed in.
4. Tell them: **click within the day**, and **check Spam/Promotions** if it's not in the inbox.

## How to RE-send (without breaking anything)

Do **not** delete the user. Instead:

- Supabase → **Authentication → Users** → find the person → row **⋯ menu → "Send magic link"** (or "Resend invitation" if shown).
- This sends a **fresh, valid link** to the same account — no deletion, no duplicate, no dead links.

*Why the old habit hurt:* deleting the user killed the invite link already delivered to their inbox, and firing repeated identical invites is exactly what trains Gmail to mark them as spam. That's why Gmail addresses were disproportionately affected.

---

## Troubleshooting "X didn't get it"

1. **Resend → Emails**, search the address:
   - **Delivered** → it reached their server; it's in Spam/Promotions, or the link expired. Have them search their mail for "MazingiraKenya", check Spam, then re-send a magic link.
   - **Bounced / no record** → address is wrong, or the invite errored (e.g., user already exists). Fix the address / send a magic link to the existing user.
2. **Supabase → Authentication → Users**, search the address:
   - **Exists (Waiting for verification)** → send a magic link; don't re-invite.
   - **Doesn't exist** → invite fresh (they may have been deleted).

---

## Known deliverability caveat (Gmail)

Resend's Insights flag one issue: **invite link URLs point to `…supabase.co`, not `mazingirakenya.org`.** Gmail treats a sender-vs-link domain mismatch as suspicious and is more likely to spam-folder it. 

- **Proper fix:** give Supabase a **custom auth domain** on `mazingirakenya.org` (e.g. `auth.mazingirakenya.org`) so links come from your own domain. *Requires the Supabase Pro plan — the project is currently on Free.*
- **Until then:** the mitigations above (check Spam, whitelist admin@, click same-day) are the levers. A few recipients marking an invite "Not spam" measurably improves future placement.

---

## One-time hardening ideas (optional)

- Move DMARC from `p=none` → `p=quarantine` after a couple of weeks of monitoring, to raise Gmail trust.
- If you want the admin console's "Send invite" button to actually work, wire it to a Supabase **edge function** that calls `inviteUserByEmail` with the service-role key (never from the client).
