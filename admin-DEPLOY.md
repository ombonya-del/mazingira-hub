# Deploy admin → admin.mazingirakenya.org

The `admin/` folder is a **standalone static site root** — `index.html`, `sw.js`,
`manifest.webmanifest`, `vercel.json`, and app icons — packaged exactly like `raia/`.
It runs as its **own Vercel project** built from the `admin/` subfolder of this repo.

> Admin is an internal tool: it ships `noindex, nofollow` (meta + `X-Robots-Tag`) and
> `X-Frame-Options: DENY`. The access gate and all data are **prototype/mock** — real
> sign-in and persistence come with the Supabase backend (auth + row-level security,
> anon key only on the client).

## A. Commit (Terminal)

```
cd ~/mazingira-hub
git add admin admin-DEPLOY.md
git commit -m "admin: standalone site root + icons, ready for deploy"
git push
```

## B. Create the Vercel project

1. Vercel → **Add New… → Project** → import the same repo.
2. **Root Directory → Edit → `admin`**.
3. Framework preset **Other**; no build command; no output dir.
4. **Deploy**, confirm the `admin-xxxx.vercel.app` URL loads (code **demo**).

## C. Domain + DNS

1. In the admin Vercel project → **Settings → Domains** → add `admin.mazingirakenya.org`.
2. Namecheap → **Advanced DNS** → **CNAME**, Host **admin**, Value **cname.vercel-dns.com**.
3. SSL issues automatically.

## Recommended hardening before real use
- Put the site behind **Vercel Access** (password/SSO) or Cloudflare Access — the in-page
  gate is cosmetic only.
- Wire Supabase auth; keep the service-role key in edge-function env, never the client.
