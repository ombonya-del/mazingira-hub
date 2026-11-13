#!/usr/bin/env python3
# Usage (from the repo root): python3 scripts/build_preview.py index.html preview/index.html
"""Build the 4-pillar restructure mock (preview/index.html) from the live hub index.html.
The live hub is untouched; every section, feed and form is reused as-is — only the
navigation layer, header name and a Home pillars strip change."""
import re, sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding="utf-8").read()

def rep(a, b, n=1):
    global s
    c = s.count(a)
    assert c == n, (a[:80], c)
    s = s.replace(a, b)

NAME = "Climate &amp; Environmental Justice Hub"
TAG = "Intelligence · Coordination · Communications · Resources"

# ---------------------------------------------------------------- name / head
rep('<span class="brand-sub">Comms Hub</span>', f'<span class="brand-sub">{NAME}</span>')
rep('<title>hub.mazingirakenya.org · MazingiraKenya Communications Hub</title>',
    f'<title>PREVIEW · MazingiraKenya {NAME}</title>\n<meta name="robots" content="noindex, nofollow">')
rep('content="MazingiraKenya Communications Hub — live intelligence',
    f'content="MazingiraKenya {NAME} — {TAG}. Live intelligence')

# ---------------------------------------------------------------- preview banner
m = re.search(r'<body[^>]*>', s)
s = s[:m.end()] + '''
<div class="pv-banner" role="note">
  <span class="pv-tag">Preview</span>
  <span class="pv-txt"><b>Proposed four-pillar structure.</b><span class="pv-long"> Same live data and features as the current hub, regrouped.
    Anything you post or submit here goes to the real hub.</span></span>
  <a class="pv-link" href="/">Current hub →</a>
</div>''' + s[m.end():]

# ---------------------------------------------------------------- desktop nav
desk_old = s[s.index('<nav class="tabs tabs-desk" id="tabbarDesk"'):]
desk_old = desk_old[:desk_old.index('</nav>') + 6]
s = s.replace(desk_old, '''<nav class="tabs tabs-desk" id="tabbarDesk" aria-label="Primary">
  <div class="wrap tabs-inner">
    <a href="#home"      data-pillar="home" class="on">Home</a>
    <a href="#map"       data-pillar="intel">Intelligence</a>
    <a href="#directory" data-pillar="coord">Coordination</a>
    <a href="#disinfo"   data-pillar="comms">Communications</a>
    <a href="#projects"  data-pillar="res">Resources</a>
    <span class="nav-actions">
      <a class="btn btn--public" href="https://raia.mazingirakenya.org" target="mzk_raia" rel="noopener" title="Open raia — the public platform">raia ↗</a>
      <a class="btn btn--ember" href="#report">Submit</a>
    </span>
  </div>
</nav>''', 1)

# ---------------------------------------------------------------- mobile nav (5 = Home + 4 pillars)
mob_old = s[s.index('<nav class="tabs tabs-mob" id="tabbarMob"'):]
mob_old = mob_old[:mob_old.index('</nav>') + 6]
s = s.replace(mob_old, '''<nav class="tabs tabs-mob" id="tabbarMob" aria-label="Primary">
  <div class="tabs-inner">
    <a href="#home" data-pillar="home" class="on"><svg class="ico" viewBox="0 0 24 24"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></svg><span>Home</span></a>
    <a href="#map" data-pillar="intel"><svg class="ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/><path d="M8.5 11h5M11 8.5v5"/></svg><span>Intel</span></a>
    <a href="#directory" data-pillar="coord"><svg class="ico" viewBox="0 0 24 24"><circle cx="6" cy="7" r="2.5"/><circle cx="18" cy="7" r="2.5"/><circle cx="12" cy="17" r="2.5"/><path d="M8 8.5 10.5 15M16 8.5 13.5 15M8.5 7h7"/></svg><span>Coordination</span></a>
    <a href="#disinfo" data-pillar="comms"><svg class="ico" viewBox="0 0 24 24"><path d="M4 10v4h3l6 4V6L7 10z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/></svg><span>Comms</span></a>
    <a href="#projects" data-pillar="res"><svg class="ico" viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3 2 2.6 4.5 3 4.5 1.3 4.5 3-2 3-4.5 3-4.5-1.3-4.5-3"/></svg><span>Resources</span></a>
  </div>
</nav>''', 1)

# ---------------------------------------------------------------- sub-nav (filled by JS) + pillar intro
sub_old = s[s.index('<nav class="subtabs" id="exploreSub"'):]
sub_old = sub_old[:sub_old.index('</nav>') + 6]
s = s.replace(sub_old, '''<nav class="subtabs" id="pillarSub" aria-label="Pillar sections" hidden>
  <div class="wrap subtabs-inner" id="pillarSubInner"></div>
</nav>
<div class="pillar-intro" id="pillarIntro" hidden><div class="wrap"><span class="pi-name" id="piName"></span><span class="pi-q" id="piQ"></span></div></div>''', 1)

# copbar → COP route
rep('<a class="copbar" href="#cop"', '<a class="copbar" href="#cop"')  # unchanged; #cop is routed below

# ---------------------------------------------------------------- Home: four-pillar strip
rep('<!-- ============================ LIVE STREAMS ============================ -->', '''<!-- ============================ PILLARS (preview) ============================ -->
<section class="band" id="pillars" data-view="home">
  <div class="wrap">
    <div class="sec-head"><div class="grow"><p class="kicker">How the hub is organised</p>
      <h2>Four pillars</h2>
      <p class="lede">Intelligence tells us what is happening. Coordination decides who responds.
        Communications shapes how the public understands it. Resources pay for the response.</p></div></div>
    <div class="pillar-grid">
      <a class="pillar-card pc-intel" href="#map">
        <span class="pc-k">Intelligence</span><b>What is happening, and where?</b>
        <span class="pc-d">National map · Legal · Media pulse · Pledges · COP31 · Intelligence brief · Report</span></a>
      <a class="pillar-card pc-coord" href="#directory">
        <span class="pc-k">Coordination</span><b>Who is doing what, and where are the gaps?</b>
        <span class="pc-d">Directory &amp; gaps · Baraza forum · Convenings &amp; coalition room</span></a>
      <a class="pillar-card pc-comms" href="#disinfo">
        <span class="pc-k">Communications</span><b>What story do we tell, and how do we answer theirs?</b>
        <span class="pc-d">Disinformation &amp; rebuttals · Voices · Petitions · Socials wall · raia</span></a>
      <a class="pillar-card pc-res" href="#projects">
        <span class="pc-k">Resources</span><b>Who funds this, and what should they fund next?</b>
        <span class="pc-d">Fundable projects · Opportunities · Funding map</span></a>
    </div>
  </div>
</section>

<!-- ============================ LIVE STREAMS ============================ -->''')

# funding-map note inside the network section (shown only on Resources › Funding map)
m = re.search(r'(<section class="band" id="network"[^>]*>\s*<div class="wrap">)', s)
s = s.replace(m.group(1), m.group(1) + '''
    <div class="only-funders sent-callout" style="cursor:default">Funding map — tap a <b style="color:#C99A2E">yellow funder dot</b> (or any organisation) to see who it funds and who funds it. Same data as the Directory, viewed for resourcing.</div>''', 1)

# ---------------------------------------------------------------- router (replaces the old tab/Explore router)
start = s.index('var VIEWS = ["live","explore","cop","voices","baraza","act"];')
end_marker = '''  showView(h in HASH2VIEW ? HASH2VIEW[h] : "live");
  mzNarrativeMaybe(h);
})();
'''
end = s.index(end_marker) + len(end_marker)
old_router = s[start:end]
assert 'window.addEventListener("mk-theme"' in old_router
s = s[:start] + r'''/* =================================================================
   FOUR-PILLAR ROUTER (preview) — Home + Intelligence · Coordination · Communications · Resources.
   Each route shows a set of existing sections (and, for split sections, one part).
   ================================================================= */
var PILLARS = [
  { id:"home",  name:"Home", q:"", subs:["home"] },
  { id:"intel", name:"Intelligence", q:"What is happening, and where?",
    subs:["map","legal","pulse","pledges","cop","brief","report"] },
  { id:"coord", name:"Coordination", q:"Who is doing what, and where are the gaps?",
    subs:["directory","forum","convene"] },
  { id:"comms", name:"Communications", q:"What story do we tell, and how do we answer theirs?",
    subs:["disinfo","voices","petitions","wall","raia"] },
  { id:"res",   name:"Resources", q:"Who funds this, and what should they fund next?",
    subs:["projects","opps","funders"] }
];
var ROUTES = {
  home:     { p:"home",  label:"Overview",            show:[".deck","#pillars","#live"] },
  map:      { p:"intel", label:"National map",        show:["#map"] },
  legal:    { p:"intel", label:"Legal",               show:["#legal"] },
  pulse:    { p:"intel", label:"Media pulse",         show:["#sentiment"], part:"pulse" },
  pledges:  { p:"intel", label:"Pledges",             show:["#accountability"] },
  cop:      { p:"intel", label:"COP31 · live",        show:["#cop"] },
  brief:    { p:"intel", label:"Intelligence brief",  show:["#ajesasa"], part:"brief" },
  report:   { p:"intel", label:"Report",              show:["#contribute"] },
  directory:{ p:"coord", label:"Directory & gaps",    show:["#sectors","#network"] },
  forum:    { p:"coord", label:"Baraza forum",        show:["#baraza"], part:"forum" },
  convene:  { p:"coord", label:"Convenings & coalition room", show:["#events","#virtual"] },
  disinfo:  { p:"comms", label:"Disinformation",      show:["#sentiment"], part:"disinfo" },
  voices:   { p:"comms", label:"Voices",              show:["#voices"] },
  petitions:{ p:"comms", label:"Petitions",           show:["#petitions"] },
  wall:     { p:"comms", label:"Socials wall",        show:["#baraza"], part:"wall" },
  raia:     { p:"comms", label:"raia ↗",              href:"https://raia.mazingirakenya.org" },
  projects: { p:"res",   label:"Fundable projects",   show:["#ajesasa"], part:"projects" },
  opps:     { p:"res",   label:"Opportunities",       show:["#desk"] },
  funders:  { p:"res",   label:"Funding map",         show:["#network"], part:"funders" }
};
/* old hashes (bookmarks, in-page links, raia links) → new routes */
var ALIAS = { live:"home", explore:"map", sectors:"directory", network:"directory",
  sentiment:"pulse", narrative:"disinfo", exchange:"opps", desk:"opps", events:"convene", virtual:"convene",
  accountability:"pledges", baraza:"forum", ajesasa:"projects", contribute:"report", act:"projects" };
var curRoute = "home", lastSub = {};
function resolve(h){ h = ALIAS[h] || h; return ROUTES[h] && !ROUTES[h].href ? h : null; }
var mainEl = document.querySelector("main");

function drawSubnav(pid){
  var P = PILLARS.filter(function(x){ return x.id===pid; })[0];
  var nav = document.getElementById("pillarSub"), inner = document.getElementById("pillarSubInner");
  var intro = document.getElementById("pillarIntro");
  if(!P || P.id==="home"){ nav.hidden = true; intro.hidden = true; return; }
  inner.innerHTML = P.subs.map(function(k){
    var r = ROUTES[k];
    return r.href ? '<a href="'+r.href+'" target="mzk_raia" rel="noopener">'+r.label+'</a>'
                  : '<a href="#'+k+'" data-route="'+k+'"'+(k===curRoute?' class="on"':'')+'>'+r.label+'</a>';
  }).join("");
  nav.hidden = false; intro.hidden = false;
  document.getElementById("piName").textContent = P.name;
  document.getElementById("piQ").textContent = P.q;
}
/* re-run the lazy painters for whatever is on screen (also used by the theme switch) */
function applyExploreSub(){
  var r = ROUTES[curRoute]; if(!r) return;
  if(curRoute==="directory" || curRoute==="funders"){ renderSectorMap(); renderCoverStrip(); renderNetMap(); }
  if(curRoute==="legal" && typeof renderLegalMap === "function") renderLegalMap();
}
window.addEventListener("mk-theme", function(){
  applyMapTheme();
  try{ paint(); }catch(e){}
  try{ applyExploreSub(); }catch(e){}
});
function barazaTab(tab){
  if(!window.MZK_BARAZA) return;
  window.MZK_BARAZA.show();
  var tries = 0;
  (function pick(){
    var b = document.querySelector('#barazaRoot [data-bz-tab="'+tab+'"]');
    if(b){ if(b.getAttribute("aria-pressed")!=="true") b.click(); return; }
    if(++tries < 40) setTimeout(pick, 150);
  })();
}
function go(route, push){
  route = resolve(route) || "home";
  var r = ROUTES[route]; curRoute = route; lastSub[r.p] = route;
  // sections
  var want = {}; r.show.forEach(function(sel){ document.querySelectorAll("main > "+sel).forEach(function(el){ want[el.id||sel]=el; }); });
  document.querySelectorAll("main > [data-view]").forEach(function(el){
    var on = false; for(var k in want) if(want[k]===el) on = true;
    el.classList.toggle("view-on", on); el.classList.remove("sub-off");
  });
  if(r.part) mainEl.setAttribute("data-part", r.part); else mainEl.removeAttribute("data-part");
  // nav state
  document.querySelectorAll("nav.tabs a[data-pillar]").forEach(function(a){
    a.classList.toggle("on", a.getAttribute("data-pillar") === r.p);
    var last = lastSub[a.getAttribute("data-pillar")]; if(last) a.setAttribute("href", "#"+last);
  });
  drawSubnav(r.p);
  // lazy work per route
  applyExploreSub();
  if(route==="pulse" && window.MZ_showSent) window.MZ_showSent("pulse");
  if(route==="disinfo" && window.MZ_showSent){
    var cur = document.querySelector('#sentSeg button[aria-pressed="true"]');
    window.MZ_showSent(location.hash.slice(1)==="narrative" ? "narrative" :
      (cur && cur.getAttribute("data-spanel")!=="pulse" ? cur.getAttribute("data-spanel") : "classic"));
  }
  if((route==="brief" || route==="projects") && typeof renderBrief === "function") renderBrief();
  if(route==="forum") barazaTab("forum");
  if(route==="wall") barazaTab("wall");
  try { window.scrollTo({ top:0, behavior: reduce ? "auto" : "smooth" }); } catch(_){ try { window.scrollTo(0,0); } catch(__){} }
  if(push !== false) history.replaceState(null, "", "#"+route);
}
/* every in-page anchor (pillar tabs, sub-tabs, hero buttons, callouts, Submit) goes through the router */
document.addEventListener("click", function(e){
  var a = e.target.closest && e.target.closest('a[href^="#"]');
  if(!a) return;
  var h = a.getAttribute("href").slice(1);
  if(!resolve(h)) return;
  e.preventDefault();
  go(h);
});
window.addEventListener("hashchange", function(){ var h = location.hash.slice(1); if(resolve(h)) go(h, false); });
(function(){ var h = location.hash.slice(1); go(resolve(h) ? h : "home", !!resolve(h)); })();
''' + s[end:]

# ---------------------------------------------------------------- CSS for the preview layer
css = '''
/* ================= PREVIEW: four-pillar restructure ================= */
.pv-banner{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:7px 16px; font-size:.78rem; line-height:1.4;
  background:repeating-linear-gradient(135deg, rgba(232,180,90,.16) 0 12px, rgba(232,180,90,.10) 12px 24px), var(--panel);
  border-bottom:1px solid rgba(232,180,90,.45); color:var(--text); }
.pv-tag{ white-space:nowrap; font-size:.6rem; font-weight:900; letter-spacing:.14em; text-transform:uppercase; background:#E8B45A; color:#231a04; padding:3px 8px; border-radius:4px; }
.pv-txt{ flex:1 1 300px; color:var(--muted); } .pv-txt b{ color:var(--text); }
.pv-link{ font-weight:800; white-space:nowrap; }
/* sub-nav is shown on desktop too (the old Explore bar was mobile-only) */
@media (min-width:860px){ nav.subtabs#pillarSub{ display:block; } nav.subtabs#pillarSub[hidden]{ display:none; } }
@media (max-width:859px){
  nav.subtabs#pillarSub{ position:sticky; top:calc(var(--nav-h) + 36px + env(safe-area-inset-top)); z-index:88; }
  nav.subtabs#pillarSub .subtabs-inner{ display:flex; overflow-x:auto; gap:0; padding:0 6px; }
  nav.subtabs#pillarSub a{ flex:none; width:auto; white-space:nowrap; font-size:.62rem; letter-spacing:.06em; padding:10px 10px 8px; }
  .pv-banner{ padding:6px 12px; font-size:.7rem; gap:8px; flex-wrap:nowrap; }
  .pv-txt .pv-long{ display:none; }
  .pillar-intro .wrap{ padding-top:10px; gap:8px; }
  .pi-name{ font-size:1.05rem; } .pi-q{ font-size:.8rem; }
  nav.tabs.tabs-mob a{ font-size:.48rem; }
}
.pillar-intro{ border-bottom:1px solid var(--line); background:var(--bg); }
.pillar-intro .wrap{ display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; padding-top:14px; padding-bottom:2px; }
.pi-name{ font-family:Lora, Georgia, serif; font-weight:700; font-size:1.25rem; color:var(--text); }
.pi-q{ font-size:.9rem; color:var(--muted); font-style:italic; }
.pillar-intro[hidden]{ display:none; }
/* Home pillar cards */
.pillar-grid{ display:grid; grid-template-columns:repeat(auto-fit, minmax(230px,1fr)); gap:12px; margin-top:6px; }
.pillar-card{ display:flex; flex-direction:column; gap:6px; padding:16px 16px 18px; background:var(--panel); border:1px solid var(--line);
  border-top:3px solid var(--green); border-radius:var(--radius-l); color:var(--text); transition:border-color .15s, transform .15s; }
.pillar-card:hover{ text-decoration:none; transform:translateY(-2px); border-color:var(--line-2); }
.pillar-card.pc-intel{ border-top-color:#7FB0D8; } .pillar-card.pc-coord{ border-top-color:var(--green); }
.pillar-card.pc-comms{ border-top-color:var(--ember); } .pillar-card.pc-res{ border-top-color:#E8B45A; }
.pillar-card .pc-k{ font-size:.62rem; font-weight:900; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); }
.pillar-card b{ font-family:Lora, Georgia, serif; font-size:1.06rem; line-height:1.3; font-weight:600; }
.pillar-card .pc-d{ font-size:.78rem; color:var(--muted); line-height:1.5; }
/* split sections: show only the part this route owns */
main[data-part="pulse"] #sentSeg{ display:none !important; }
main[data-part="disinfo"] #sentSeg [data-spanel="pulse"]{ display:none; }
main[data-part="brief"] #ajesasa .sec-head,
main[data-part="brief"] #ajesasa .idesk-stats,
main[data-part="brief"] #ajesasa #laneRow,
main[data-part="brief"] #ajesasa .sent-callout,
main[data-part="brief"] #ajesasa .fundercta,
main[data-part="brief"] #ajesasa #projectLanes,
main[data-part="brief"] #ajesasa .wrap > p.brief-note{ display:none; }
main[data-part="projects"] #ajesasa .briefcard,
main[data-part="projects"] #ajesasa .sent-callout{ display:none; }
main[data-part="forum"] #baraza .bz-seg, main[data-part="wall"] #baraza .bz-seg{ display:none; }
main:not([data-part="funders"]) .only-funders{ display:none; }
html[data-theme="light"] .pillar-card.pc-intel{ border-top-color:#235E8F; }
'''
i = s.index('/* ---- theme switch button ---- */')
s = s[:i] + css + s[i:]

open(dst, "w", encoding="utf-8").write(s)
print("ok", len(s))
