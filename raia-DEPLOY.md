# Deploy raia → raia.mazingirakenya.org

The `raia/` folder is now a **standalone static site root**: `index.html`, `sw.js`,
`manifest.webmanifest`, `privacy.html`, `vercel.json`, and the app icons. You'll run it as
its **own Vercel project** that builds from the `raia/` subfolder of this same repo — so
there's no second repo to manage, and one `git push` updates both hub and raia.

---

## A. Commit the raia site (Terminal)

Run these one line at a time from the repo:

```
cd ~/mazingira-hub
git rm raia/raia.html raia/raia-sw.js raia/raia.webmanifest raia/raia-privacy.html
git add raia raia-DEPLOY.md
git commit -m "raia: standalone site root + icons, ready for deploy"
git push
```

The `git rm` line removes the four old `raia-*` files that were replaced by
`index.html` / `sw.js` / `manifest.webmanifest` / `privacy.html` (the sandbox couldn't
delete them, but git can).

## B. Create the raia Vercel project

1. Vercel dashboard → **Add New… → Project**.
2. **Import** the same GitHub repo you use for the hub.
3. Before deploying, open **Root Directory → Edit** and select the **`raia`** folder.
4. Framework preset: **Other**. No build command; no output directory (it's plain static).
5. **Deploy.** You'll get a `raia-xxxx.vercel.app` URL — open it and confirm it loads.

> Both projects now build from one repo. The hub project keeps Root Directory = repo root;
> the raia project uses Root Directory = `raia`. Every push deploys both.

## C. Add the custom domain

1. In the **raia** Vercel project → **Settings → Domains**.
2. Add `raia.mazingirakenya.org`.
3. Vercel will show the DNS target to use — typically **`cname.vercel-dns.com`**
   (use whatever value Vercel displays).

## D. Point the domain in Namecheap

1. Namecheap → **Domain List → mazingirakenya.org → Manage → Advanced DNS**.
2. **Add New Record:**
   - Type: **CNAME Record**
   - Host: **raia**
   - Value: **cname.vercel-dns.com**  *(or the exact target Vercel gave you)*
   - TTL: **Automatic**
3. **Save.** Propagation is usually minutes (can be up to ~an hour). Vercel verifies the
   domain and issues the HTTPS certificate automatically — no action needed from you.

## Done — verify

- Visit **https://raia.mazingirakenya.org** → the "Ni Nini?" home should load.
- Language toggle (ENG/SWA/SHENG), the six tabs, and Voices interactions should all work.
- On a phone: **Add to Home Screen** should show the gold-dot "M" icon and open full-screen.

---

### Alternative (if you'd rather keep raia fully separate)
Create a brand-new GitHub repo containing only the *contents* of `raia/` (so `index.html`
sits at the repo root), and import that as the Vercel project with the default root
directory. Everything else (steps C–D) is identical. The subfolder approach above is
simpler and needs no new repo.
