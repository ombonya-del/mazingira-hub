// Supabase Edge Function: register-interest  (PUBLIC — partners click this from their email)
// Records a partner's interest in an opportunity and returns a thank-you page.
//
// Deploy (must be public, no JWT):
//   supabase functions deploy register-interest --no-verify-jwt
// (SUPABASE_URL and SUPABASE_ANON_KEY are injected automatically.)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const ANON = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function page(title: string, msg: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>
<style>body{font-family:system-ui,-apple-system,sans-serif;background:#0E1A15;color:#EDEAE0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px}
.c{max-width:480px;text-align:center;background:#13241D;border:1px solid #22392E;border-radius:16px;padding:34px}
h1{color:#62C79B;font-size:1.35rem;margin:0 0 12px}p{color:#B7C6BD;line-height:1.65;margin:0}a{color:#62C79B;font-weight:700}</style></head>
<body><div class="c"><h1>${esc(title)}</h1><p>${msg}</p></div></body></html>`;
}

Deno.serve(async (req) => {
  const q = new URL(req.url).searchParams;
  const title = q.get("t") || "this opportunity";
  const oppUrl = q.get("u") || "";
  const name = q.get("n") || "";
  const email = q.get("e") || "";
  try {
    const supa = createClient(SUPABASE_URL, ANON);
    await supa.from("opportunity_interest").insert({
      opportunity_title: title, opportunity_url: oppUrl, partner_name: name, partner_email: email,
    });
  } catch (_e) { /* best-effort: still show thanks */ }
  // Supabase serves HTML from *.supabase.co as plain text, so hand off to a thank-you page on the hub.
  const thanks = new URL("https://hub.mazingirakenya.org/interest.html");
  thanks.searchParams.set("t", title);
  if (name) thanks.searchParams.set("n", name);
  if (/^https:\/\//.test(oppUrl)) thanks.searchParams.set("u", oppUrl);
  return new Response(null, { status: 302, headers: { Location: thanks.toString(), "Cache-Control": "no-store" } });
});
