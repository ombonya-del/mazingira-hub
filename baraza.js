/* MazingiraKenya — Baraza: the members' forum + Socials Wall.
   Discussions, shared posts (X / YouTube / Facebook / LinkedIn / web links) and, from
   Phase 2, swept partner socials — all in public.baraza_posts (see supabase/baraza.sql).
   Uses the hub's signed-in Supabase client (window.HAUTH). Loaded by index.html. */
(function(){
"use strict";

function sb(){ return window.HAUTH || window.MZ_SB || null; }
var CATS = ["Ask the network","Updates & reports","Campaigns & actions","Funding","Legal","Media & stories","General"];
var SECTORS = { o:"Oil & gas", c:"Coal", m:"Minerals", w:"Water", l:"Land & forest", e:"Energy", p:"Plastics" };
var COUNTIES = ["Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa","Homa Bay","Isiolo","Kajiado",
  "Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos",
  "Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a","Nairobi","Nakuru","Nandi","Narok","Nyamira",
  "Nyandarua","Nyeri","Samburu","Siaya","Taita Taveta","Tana River","Tharaka-Nithi","Trans Nzoia","Turkana",
  "Uasin Gishu","Vihiga","Wajir","West Pokot"];
var PLAT = { x:"X", youtube:"YouTube", facebook:"Facebook", instagram:"Instagram", linkedin:"LinkedIn", tiktok:"TikTok", web:"Web" };
var BUCKET = "baraza-media";

var S = { tab:"forum", cat:"all", q:"", me:null, posts:[], openId:null, compose:null, loading:false, loaded:false, err:"" };
var root;

/* ---------- helpers ---------- */
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function safeUrl(u){ u=String(u||"").trim(); return /^https:\/\/[^\s"'<>]+$/i.test(u) ? u : ""; }
function linkify(t){
  return esc(t).replace(/(https:\/\/[^\s<]+[^\s<.,;:!?)\]'"])/g, function(u){
    return '<a href="'+u+'" target="_blank" rel="noopener noreferrer">'+u+'</a>'; }).replace(/\n/g,"<br>");
}
function ago(ts){
  var s=(Date.now()-new Date(ts).getTime())/1000;
  if(s<60) return "just now"; if(s<3600) return Math.floor(s/60)+"m ago"; if(s<86400) return Math.floor(s/3600)+"h ago";
  if(s<604800) return Math.floor(s/86400)+"d ago";
  try{ return new Date(ts).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}); }catch(_){ return ""; }
}
function initials(n){ return String(n||"?").split(/\s+/).filter(Boolean).slice(0,2).map(function(w){ return w[0]; }).join("").toUpperCase(); }
function platformOf(u){
  var h=""; try{ h=new URL(u).hostname.replace(/^www\./,""); }catch(_){ return "web"; }
  if(/(^|\.)(x|twitter)\.com$/.test(h)) return "x";
  if(/(^|\.)(youtube\.com|youtu\.be)$/.test(h)) return "youtube";
  if(/(^|\.)(facebook\.com|fb\.watch)$/.test(h)) return "facebook";
  if(/(^|\.)instagram\.com$/.test(h)) return "instagram";
  if(/(^|\.)linkedin\.com$/.test(h)) return "linkedin";
  if(/(^|\.)tiktok\.com$/.test(h)) return "tiktok";
  return "web";
}
function ytId(u){ var m=String(u).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{6,})/); return m?m[1]:""; }
function host(u){ try{ return new URL(u).hostname.replace(/^www\./,""); }catch(_){ return ""; } }
function toast(t){
  var el=document.getElementById("bzToast");
  if(!el){ el=document.createElement("div"); el.id="bzToast"; el.className="bz-toast"; document.body.appendChild(el); }
  el.textContent=t; el.classList.add("on"); clearTimeout(el._t); el._t=setTimeout(function(){ el.classList.remove("on"); },2600);
}
function lsGet(k){ try{ return JSON.parse(localStorage.getItem(k)||"null"); }catch(_){ return null; } }
function lsSet(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(_){} }

/* ---------- styles ---------- */
var CSS = [
".bz-bar{ display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin:0 0 14px; }",
".bz-seg{ display:inline-flex; border:1px solid var(--line-2); border-radius:100px; overflow:hidden; }",
".bz-seg button{ background:none; border:0; color:var(--muted); font:inherit; font-size:.72rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; padding:9px 14px; cursor:pointer; }",
".bz-seg button[aria-pressed=true]{ background:var(--green-wash); color:var(--green); }",
".bz-grow{ flex:1; }",
".bz-chips{ display:flex; gap:6px; flex-wrap:wrap; margin:0 0 14px; }",
".bz-chip{ background:none; border:1px solid var(--line-2); color:var(--muted); border-radius:100px; padding:5px 11px; font:inherit; font-size:.72rem; font-weight:700; cursor:pointer; }",
".bz-chip[aria-pressed=true]{ border-color:var(--green); color:var(--green); background:var(--green-wash); }",
".bz-search{ background:var(--panel); border:1px solid var(--line-2); color:var(--text); border-radius:9px; padding:8px 11px; font:inherit; font-size:.85rem; min-width:180px; }",
".bz-panel{ background:var(--panel); border:1px solid var(--line-2); padding:16px; margin:0 0 16px; }",
".bz-panel h3{ font-family:Lora,serif; font-size:1.05rem; margin:0 0 10px; }",
".bz-form label{ display:block; font-size:.66rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); margin:10px 0 4px; }",
".bz-form input,.bz-form select,.bz-form textarea{ width:100%; box-sizing:border-box; background:#0a1712; border:1px solid var(--line-2); color:var(--text); border-radius:9px; padding:9px 10px; font:inherit; font-size:.9rem; }",
".bz-form textarea{ resize:vertical; min-height:90px; }",
".bz-row{ display:grid; gap:0 12px; }",
"@media(min-width:700px){ .bz-row{ grid-template-columns:1fr 1fr; } }",
".bz-acts{ display:flex; gap:9px; justify-content:flex-end; align-items:center; margin-top:14px; flex-wrap:wrap; }",
".bz-me{ font-size:.78rem; color:var(--muted-dim); margin:0 0 4px; }",
".bz-me a{ color:var(--green); }",
".bz-note{ font-size:.74rem; color:var(--muted-dim); line-height:1.5; margin:10px 0 0; }",
".bz-list{ display:grid; gap:1px; background:var(--line); border:1px solid var(--line); }",
".bz-item{ background:var(--panel); padding:14px 16px; cursor:pointer; display:flex; gap:12px; align-items:flex-start; }",
".bz-item:hover{ background:var(--panel-2); }",
".bz-av{ flex:0 0 34px; height:34px; border-radius:50%; background:var(--green-wash); color:var(--green); display:grid; place-items:center; font-size:.72rem; font-weight:800; }",
".bz-item h4{ font-family:Lora,serif; font-size:1rem; font-weight:600; margin:0; line-height:1.35; }",
".bz-meta{ font-size:.74rem; color:var(--muted-dim); margin-top:4px; }",
".bz-meta b{ color:var(--muted); font-weight:700; }",
".bz-tag{ display:inline-block; font-size:.6rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; padding:2px 8px; border-radius:100px; border:1px solid var(--line-2); color:var(--muted); margin:6px 5px 0 0; }",
".bz-tag.pin{ border-color:rgba(238,148,85,.5); color:var(--ember); }",
".bz-tag.cat{ border-color:rgba(98,199,155,.45); color:var(--green); }",
".bz-count{ flex:0 0 auto; text-align:center; font-size:.7rem; color:var(--muted-dim); min-width:44px; }",
".bz-count b{ display:block; font-size:1.05rem; color:var(--text); }",
".bz-wall{ display:grid; gap:14px; }",
"@media(min-width:760px){ .bz-wall{ grid-template-columns:1fr 1fr; } }",
"@media(min-width:1100px){ .bz-wall{ grid-template-columns:1fr 1fr 1fr; } }",
".bz-card{ background:var(--panel); border:1px solid var(--line); padding:14px; display:flex; flex-direction:column; gap:10px; min-width:0; }",
".bz-card .bz-cap{ font-size:.88rem; line-height:1.5; color:var(--text); }",
".bz-src{ display:flex; align-items:center; gap:8px; font-size:.74rem; color:var(--muted-dim); }",
".bz-plat{ font-size:.58rem; font-weight:900; letter-spacing:.08em; text-transform:uppercase; padding:3px 8px; border-radius:100px; background:var(--panel-3); color:var(--muted); }",
".bz-link{ display:block; border:1px solid var(--line-2); padding:12px; color:inherit; text-decoration:none; background:var(--panel-2); }",
".bz-link:hover{ border-color:var(--green); text-decoration:none; }",
".bz-link b{ display:block; color:var(--text); font-size:.86rem; word-break:break-word; }",
".bz-link span{ font-size:.74rem; color:var(--green); }",
".bz-yt{ position:relative; padding-top:56.25%; background:#000; }",
".bz-yt iframe{ position:absolute; inset:0; width:100%; height:100%; border:0; }",
".bz-imgs{ display:flex; gap:8px; flex-wrap:wrap; }",
".bz-imgs img{ max-width:100%; max-height:320px; border:1px solid var(--line); }",
".bz-foot{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-top:auto; }",
".bz-btn{ background:none; border:1px solid var(--line-2); color:var(--muted); border-radius:100px; padding:6px 12px; font:inherit; font-size:.72rem; font-weight:800; cursor:pointer; }",
".bz-btn:hover{ color:var(--text); border-color:var(--muted); }",
".bz-btn.on{ color:var(--green); border-color:var(--green); background:var(--green-wash); }",
".bz-btn.warn{ color:var(--ember); }",
".bz-thread .bz-body{ font-size:.95rem; line-height:1.65; margin:12px 0 0; word-wrap:break-word; }",
".bz-thread .bz-body a{ color:var(--green); }",
".bz-replies{ margin-top:18px; border-top:1px solid var(--line); }",
".bz-reply{ display:flex; gap:10px; padding:12px 0; border-bottom:1px solid var(--line); }",
".bz-reply .bz-body{ font-size:.9rem; margin:4px 0 0; }",
".bz-admin{ display:flex; gap:6px; flex-wrap:wrap; padding:10px; margin-top:14px; border:1px dashed rgba(238,148,85,.45); }",
".bz-admin .lab{ font-size:.62rem; font-weight:900; letter-spacing:.1em; text-transform:uppercase; color:var(--ember); align-self:center; margin-right:4px; }",
".bz-empty{ background:var(--panel); border:1px solid var(--line); padding:26px; text-align:center; color:var(--muted); font-size:.9rem; line-height:1.6; }",
".bz-toast{ position:fixed; left:50%; bottom:calc(76px + env(safe-area-inset-bottom)); transform:translateX(-50%) translateY(16px); background:var(--panel); border:1px solid var(--green); color:var(--text); padding:10px 16px; border-radius:10px; font-weight:800; font-size:.84rem; z-index:240; opacity:0; transition:.2s; pointer-events:none; }",
".bz-toast.on{ opacity:1; transform:translateX(-50%) translateY(0); }",
"@media(min-width:860px){ .bz-toast{ bottom:24px; } }"
].join("\n");

/* ---------- identity ---------- */
function loadMe(cb){
  var c=sb(); if(!c||!c.auth){ cb(null); return; }
  c.auth.getSession().then(function(r){
    var u=r&&r.data&&r.data.session&&r.data.session.user; if(!u){ cb(null); return; }
    var md=u.user_metadata||{}, saved=lsGet("mzk_bz_me")||{};
    var me={ id:u.id, email:u.email||"",
      name: saved.name || md.full_name || md.name || (u.email?u.email.split("@")[0]:"Member"),
      org:  saved.org  || md.org || md.organisation || "", isAdmin:false };
    c.rpc("is_admin").then(function(a){ me.isAdmin = !!(a && a.data === true); cb(me); }, function(){ cb(me); });
  }, function(){ cb(null); });
}

/* ---------- data ---------- */
function load(){
  var c=sb(); if(!c){ S.err="The hub's sign-in service isn't available."; render(); return; }
  S.loading=true; render();
  c.from("baraza_posts").select("*").order("pinned",{ascending:false}).order("last_activity_at",{ascending:false}).limit(200)
   .then(function(r){
     S.loading=false; S.loaded=true;
     if(r.error){ S.err = /does not exist|relation/i.test(r.error.message) ? "Baraza isn't set up yet — an admin needs to run supabase/baraza.sql." : ("Couldn't load Baraza: "+r.error.message); render(); return; }
     S.err=""; S.posts=r.data||[]; render();
   }, function(e){ S.loading=false; S.err="Couldn't load Baraza: "+e; render(); });
}
function mine(){ var c=sb(); if(!c||!S.me) return Promise.resolve([]);
  return c.from("baraza_reactions").select("post_id").eq("user_id",S.me.id).then(function(r){ return (r.data||[]).map(function(x){ return x.post_id; }); }, function(){ return []; }); }

/* ---------- render ---------- */
function render(){
  if(!root) return;
  var h='<div class="sec-head"><div class="grow"><p class="kicker">Members\' space · talk, share, plan</p>'+
    '<h2><span lang="sw">Baraza</span> <span class="subttl">— the network in conversation</span></h2>'+
    '<p class="lede">Ask the network, share updates, reports and videos, and see what partners are posting on their own channels. Everything here is for coalition members only.</p></div></div>';
  if(!S.me && S.loaded!=="nouser"){ h+='<div class="bz-empty">Loading…</div>'; root.innerHTML=h; return; }
  if(S.loaded==="nouser"){ h+='<div class="bz-empty">Sign in to the hub to join the Baraza.</div>'; root.innerHTML=h; return; }
  if(S.openId){ root.innerHTML=h; renderThread(); return; }
  h+='<div class="bz-bar"><div class="bz-seg" role="group" aria-label="Baraza sections">'+
       '<button type="button" data-bz-tab="forum" aria-pressed="'+(S.tab==="forum")+'">Forum</button>'+
       '<button type="button" data-bz-tab="wall" aria-pressed="'+(S.tab==="wall")+'">Socials Wall</button></div>'+
     '<span class="bz-grow"></span>'+
     '<input class="bz-search" type="search" placeholder="Search…" aria-label="Search Baraza" data-bz-q value="'+esc(S.q)+'">'+
     '<button class="btn btn--green" type="button" data-bz-compose="discussion">Start a discussion</button>'+
     '<button class="btn btn--ghost" type="button" data-bz-compose="share">Share to the Wall</button></div>';
  if(S.compose) h+=composer(S.compose);
  if(S.err) h+='<div class="bz-empty">'+esc(S.err)+'</div>';
  else if(S.loading && !S.posts.length) h+='<div class="bz-empty">Loading…</div>';
  else h += '<div data-bz-listbox>'+(S.tab==="forum" ? forumList() : wallList())+'</div>';
  root.innerHTML=h;
  embedTweets(root);
}
function match(p){
  if(!S.q) return true;
  var hay=[p.title,p.body,p.author_name,p.author_org,p.source_name,p.county,p.category,p.url].join(" ").toLowerCase();
  return S.q.toLowerCase().split(/\s+/).every(function(w){ return hay.indexOf(w)>=0; });
}
function forumList(){
  var all=S.posts.filter(function(p){ return p.kind==="discussion"; });
  var h='<div class="bz-chips"><button type="button" class="bz-chip" data-bz-cat="all" aria-pressed="'+(S.cat==="all")+'">All</button>'+
    CATS.map(function(c){ return '<button type="button" class="bz-chip" data-bz-cat="'+esc(c)+'" aria-pressed="'+(S.cat===c)+'">'+esc(c)+'</button>'; }).join("")+'</div>';
  var list=all.filter(function(p){ return (S.cat==="all"||p.category===S.cat) && match(p); });
  if(!list.length) return h+'<div class="bz-empty">'+(all.length?'Nothing matches that filter.':'No discussions yet. Start the first one — ask the network a question, share an update, or flag something that needs a response.')+'</div>';
  return h+'<div class="bz-list">'+list.map(function(p){
    return '<div class="bz-item" role="button" tabindex="0" data-bz-open="'+p.id+'">'+
      '<div class="bz-av" aria-hidden="true">'+esc(initials(p.author_org||p.author_name))+'</div>'+
      '<div style="flex:1;min-width:0"><h4>'+esc(p.title||"(untitled)")+'</h4>'+
      '<div class="bz-meta"><b>'+esc(p.author_name||"Member")+'</b>'+(p.author_org?' · '+esc(p.author_org):'')+' · '+esc(ago(p.created_at))+(p.reply_count?' · last reply '+esc(ago(p.last_activity_at)):'')+'</div>'+
      (p.pinned?'<span class="bz-tag pin">Pinned</span>':'')+(p.category?'<span class="bz-tag cat">'+esc(p.category)+'</span>':'')+
      (p.county?'<span class="bz-tag">'+esc(p.county)+'</span>':'')+(p.sector&&SECTORS[p.sector]?'<span class="bz-tag">'+esc(SECTORS[p.sector])+'</span>':'')+
      (p.hidden?'<span class="bz-tag pin">Hidden</span>':'')+'</div>'+
      '<div class="bz-count"><b>'+(p.reply_count||0)+'</b>replies</div></div>';
  }).join("")+'</div>';
}
function wallList(){
  var all=S.posts.filter(function(p){ return p.kind==="share"||p.kind==="social"; });
  var list=all.filter(match);
  if(!list.length) return '<div class="bz-empty">'+(all.length?'Nothing matches that search.':'The wall is empty. Share a partner\'s post — an X thread, a YouTube video, a Facebook or LinkedIn update, a report — with <b>Share to the Wall</b>.')+'</div>';
  return '<div class="bz-wall">'+list.map(function(p){
    return '<div class="bz-card">'+
      '<div class="bz-src"><span class="bz-plat">'+esc(PLAT[p.platform]||"Web")+'</span><span>'+esc(p.source_name||host(p.url))+'</span>'+(p.pinned?'<span class="bz-tag pin" style="margin:0">Pinned</span>':'')+'</div>'+
      embed(p)+(p.body?'<div class="bz-cap">'+linkify(p.body)+'</div>':'')+
      '<div class="bz-meta">Shared by <b>'+esc(p.author_name||(p.kind==="social"?"the Socials sweep":"a member"))+'</b>'+(p.author_org?' · '+esc(p.author_org):'')+' · '+esc(ago(p.created_at))+
      (p.county?' · '+esc(p.county):'')+(p.hidden?' · <span style="color:var(--ember)">hidden</span>':'')+'</div>'+
      '<div class="bz-foot"><button type="button" class="bz-btn" data-bz-open="'+p.id+'">Discuss · '+(p.reply_count||0)+'</button>'+
      (p.useful_count?'<span class="bz-meta" style="margin:0">'+p.useful_count+' found this useful</span>':'')+'</div></div>';
  }).join("")+'</div>';
}
function embed(p){
  var u=safeUrl(p.url), imgs=(p.media||[]).map(safeUrl).filter(Boolean), out="";
  if(u){
    var pl=p.platform||platformOf(u);
    if(pl==="youtube" && ytId(u)) out+='<div class="bz-yt"><iframe src="https://www.youtube-nocookie.com/embed/'+ytId(u)+'" title="YouTube video" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div>';
    else if(pl==="x") out+='<blockquote class="twitter-tweet" data-theme="dark" data-dnt="true"><a href="'+esc(u.replace(/\/\/(www\.)?x\.com\//,"//twitter.com/"))+'">View the post on X</a></blockquote>';
    else out+='<a class="bz-link" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer"><b>'+esc(p.title||host(u))+'</b><span>Open on '+esc(PLAT[pl]||host(u))+' ↗</span></a>';
  }
  if(imgs.length) out+='<div class="bz-imgs">'+imgs.map(function(i){ return '<a href="'+esc(i)+'" target="_blank" rel="noopener"><img src="'+esc(i)+'" alt="" loading="lazy"></a>'; }).join("")+'</div>';
  return out;
}
var twLoading=false;
function embedTweets(el){
  if(!el.querySelector("blockquote.twitter-tweet")) return;
  if(window.twttr && window.twttr.widgets){ window.twttr.widgets.load(el); return; }
  if(twLoading) return; twLoading=true;
  var s=document.createElement("script"); s.src="https://platform.twitter.com/widgets.js"; s.async=true; s.charset="utf-8";
  document.head.appendChild(s);
}

function composer(kind){
  var me=S.me, isShare=kind==="share";
  var h='<div class="bz-panel bz-form"><h3>'+(isShare?"Share to the Wall":"Start a discussion")+'</h3>'+
    '<p class="bz-me">Posting as <b>'+esc(me.name)+'</b>'+(me.org?' · '+esc(me.org):'')+' · <a href="#" data-bz-editme>edit name &amp; organisation</a></p>'+
    '<div data-bz-mebox hidden class="bz-row"><div><label>Your name</label><input data-bz-f="myname" value="'+esc(me.name)+'"></div><div><label>Organisation</label><input data-bz-f="myorg" value="'+esc(me.org)+'" placeholder="e.g. LAWA"></div></div>';
  if(isShare){
    h+='<label>Link to the post</label><input data-bz-f="url" type="url" placeholder="https://x.com/… · youtube.com/… · facebook.com/… · a report link" required>'+
       '<label>Whose post is it?</label><input data-bz-f="source" placeholder="e.g. FoNNaP, Save Lamu, a partner\'s name">'+
       '<label>Why it matters (optional)</label><textarea data-bz-f="body" rows="3" placeholder="A line or two of context for the network"></textarea>';
  } else {
    h+='<div class="bz-row"><div><label>Category</label><select data-bz-f="category">'+CATS.map(function(c){ return '<option>'+esc(c)+'</option>'; }).join("")+'</select></div>'+
       '<div><label>Title</label><input data-bz-f="title" maxlength="160" placeholder="What do you want to discuss?" required></div></div>'+
       '<label>Message</label><textarea data-bz-f="body" rows="5" placeholder="Share the update, ask your question, or set out the issue for reflection…"></textarea>'+
       '<label>Link (optional)</label><input data-bz-f="url" type="url" placeholder="https://… report, video or post">';
  }
  h+='<div class="bz-row"><div><label>County (optional)</label><select data-bz-f="county"><option value="">—</option>'+COUNTIES.map(function(c){ return '<option>'+esc(c)+'</option>'; }).join("")+'</select></div>'+
     '<div><label>Sector (optional)</label><select data-bz-f="sector"><option value="">—</option>'+Object.keys(SECTORS).map(function(k){ return '<option value="'+k+'">'+esc(SECTORS[k])+'</option>'; }).join("")+'</select></div></div>'+
     '<label>Photos (optional, up to 3)</label><input data-bz-f="files" type="file" accept="image/*" multiple>'+
     '<p class="bz-note">Be kind and specific. Don\'t post anyone\'s personal details, or photos of people without their consent. Photos are stored at a link that anyone holding it can open.</p>'+
     '<div class="bz-acts"><span class="bz-meta" data-bz-stat></span><button type="button" class="btn btn--ghost" data-bz-cancel>Cancel</button>'+
     '<button type="button" class="btn btn--green" data-bz-submit="'+kind+'">'+(isShare?"Share":"Post")+'</button></div></div>';
  return h;
}
function val(sel){ var e=root.querySelector('[data-bz-f="'+sel+'"]'); return e ? String(e.value||"").trim() : ""; }

function upload(files){
  var c=sb(); var list=[].slice.call(files||[]).slice(0,3);
  return Promise.all(list.map(function(f){
    if(!/^image\//.test(f.type)) return null;
    if(f.size>5*1024*1024){ toast(f.name+" is over 5 MB — skipped"); return null; }
    var path=S.me.id+"/"+Date.now()+"_"+f.name.replace(/[^\w.\-]/g,"_");
    return c.storage.from(BUCKET).upload(path,f,{ contentType:f.type, upsert:false }).then(function(r){
      if(r.error){ toast("Photo upload failed: "+r.error.message); return null; }
      return c.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    });
  })).then(function(urls){ return urls.filter(Boolean); });
}
function submit(kind, btn){
  var c=sb(), stat=root.querySelector("[data-bz-stat]");
  var nm=val("myname")||S.me.name, org=val("myorg");
  if(root.querySelector('[data-bz-mebox]') && !root.querySelector('[data-bz-mebox]').hidden){ S.me.name=nm; S.me.org=org; lsSet("mzk_bz_me",{name:nm,org:org}); }
  var url=val("url");
  if(url && !/^https?:\/\//i.test(url)) url="https://"+url;
  url=url.replace(/^http:\/\//i,"https://");
  if(kind==="share" && !safeUrl(url)){ stat.textContent="Paste the link to the post first."; return; }
  if(kind==="discussion" && !val("title")){ stat.textContent="Give your discussion a title."; return; }
  if(url && !safeUrl(url)){ stat.textContent="That link doesn't look right."; return; }
  btn.disabled=true; stat.textContent="Posting…";
  var fi=root.querySelector('[data-bz-f="files"]');
  upload(fi&&fi.files).then(function(media){
    var row={ kind:kind, author_id:S.me.id, author_name:S.me.name, author_org:S.me.org||null,
      body:val("body")||null, url:url||null, media:media, county:val("county")||null, sector:val("sector")||null };
    if(kind==="share"){ row.platform=platformOf(url); row.source_name=val("source")||null; row.title=null; }
    else { row.title=val("title"); row.category=val("category")||"General"; row.platform=url?platformOf(url):null; }
    return c.from("baraza_posts").insert(row).select().single();
  }).then(function(r){
    btn.disabled=false;
    if(r.error){ stat.textContent="Couldn't post: "+r.error.message; return; }
    S.compose=null; S.posts.unshift(r.data); S.tab=(kind==="share"?"wall":"forum");
    toast(kind==="share"?"Shared to the Wall":"Discussion posted"); render();
  }, function(e){ btn.disabled=false; stat.textContent="Couldn't post: "+e; });
}

/* ---------- thread ---------- */
var myReacts={};
function renderThread(){
  var p=S.posts.filter(function(x){ return x.id===S.openId; })[0];
  if(!p){ S.openId=null; render(); return; }
  var c=sb(), box=document.createElement("div"); box.className="bz-panel bz-thread";
  var canDel = S.me.isAdmin || p.author_id===S.me.id;
  box.innerHTML='<button type="button" class="bz-btn" data-bz-back>‹ Back to '+(p.kind==="discussion"?"the Forum":"the Wall")+'</button>'+
    '<div style="display:flex;gap:12px;margin-top:14px"><div class="bz-av">'+esc(initials(p.author_org||p.author_name))+'</div><div style="flex:1;min-width:0">'+
    (p.title?'<h3 style="margin:0">'+esc(p.title)+'</h3>':'')+
    '<div class="bz-meta"><b>'+esc(p.author_name||"Member")+'</b>'+(p.author_org?' · '+esc(p.author_org):'')+' · '+esc(ago(p.created_at))+(p.source_name?' · post by <b>'+esc(p.source_name)+'</b>':'')+'</div>'+
    (p.category?'<span class="bz-tag cat">'+esc(p.category)+'</span>':'')+(p.county?'<span class="bz-tag">'+esc(p.county)+'</span>':'')+(p.sector&&SECTORS[p.sector]?'<span class="bz-tag">'+esc(SECTORS[p.sector])+'</span>':'')+(p.promoted_to?'<span class="bz-tag pin">Promoted → '+esc(p.promoted_to)+'</span>':'')+
    '</div></div>'+
    (p.body?'<div class="bz-body">'+linkify(p.body)+'</div>':'')+
    '<div style="margin-top:12px">'+embed(p)+'</div>'+
    '<div class="bz-foot" style="margin-top:12px"><button type="button" class="bz-btn" data-bz-useful>Useful · <span>'+(p.useful_count||0)+'</span></button>'+
      '<button type="button" class="bz-btn warn" data-bz-report>Report</button>'+(canDel?'<button type="button" class="bz-btn warn" data-bz-del>Delete</button>':'')+'</div>'+
    (S.me.isAdmin?'<div class="bz-admin"><span class="lab">Admin</span>'+
      '<button type="button" class="bz-btn" data-bz-adm="pin">'+(p.pinned?"Unpin":"Pin")+'</button>'+
      '<button type="button" class="bz-btn" data-bz-adm="hide">'+(p.hidden?"Unhide":"Hide")+'</button>'+
      '<button type="button" class="bz-btn" data-bz-promote="Resources">→ Resource draft</button>'+
      '<button type="button" class="bz-btn" data-bz-promote="Opportunities">→ Opportunity draft</button>'+
      '<button type="button" class="bz-btn" data-bz-promote="Media briefs">→ Media brief draft</button>'+
      '<button type="button" class="bz-btn" data-bz-promote="Event">→ Event draft</button></div>':'')+
    '<div class="bz-replies" data-bz-replies><p class="bz-meta">Loading replies…</p></div>'+
    '<div class="bz-form"><label>Your reply</label><textarea data-bz-f="reply" rows="3" placeholder="Add to the conversation…"></textarea>'+
    '<div class="bz-acts"><span class="bz-meta" data-bz-rstat></span><button type="button" class="btn btn--green" data-bz-reply>Reply</button></div></div>';
  root.appendChild(box);
  embedTweets(box);
  if(myReacts[p.id]) box.querySelector("[data-bz-useful]").classList.add("on");
  c.from("baraza_replies").select("*").eq("post_id",p.id).order("created_at",{ascending:true}).then(function(r){
    var host=box.querySelector("[data-bz-replies]"); if(!host) return;
    var rows=r.data||[];
    host.innerHTML = rows.length ? rows.map(function(x){
      var mineR = S.me.isAdmin || x.author_id===S.me.id;
      return '<div class="bz-reply"><div class="bz-av">'+esc(initials(x.author_org||x.author_name))+'</div><div style="flex:1;min-width:0">'+
        '<div class="bz-meta"><b>'+esc(x.author_name||"Member")+'</b>'+(x.author_org?' · '+esc(x.author_org):'')+' · '+esc(ago(x.created_at))+(x.hidden?' · <span style="color:var(--ember)">hidden</span>':'')+'</div>'+
        '<div class="bz-body">'+linkify(x.body)+'</div>'+
        '<div class="bz-foot" style="margin-top:6px"><button type="button" class="bz-btn warn" data-bz-rreport="'+x.id+'">Report</button>'+
        (mineR?'<button type="button" class="bz-btn warn" data-bz-rdel="'+x.id+'">Delete</button>':'')+
        (S.me.isAdmin?'<button type="button" class="bz-btn" data-bz-rhide="'+x.id+'" data-h="'+(x.hidden?1:0)+'">'+(x.hidden?"Unhide":"Hide")+'</button>':'')+'</div></div></div>';
    }).join("") : '<p class="bz-meta" style="padding:12px 0">No replies yet — be the first.</p>';
  });
}
function current(){ return S.posts.filter(function(x){ return x.id===S.openId; })[0]; }
function patchLocal(id, fields){ S.posts.forEach(function(p){ if(p.id===id) Object.keys(fields).forEach(function(k){ p[k]=fields[k]; }); }); }

function onClick(e){
  var t=e.target, c=sb(), el;
  if((el=t.closest("[data-bz-tab]"))){ S.tab=el.getAttribute("data-bz-tab"); render(); return; }
  if((el=t.closest("[data-bz-cat]"))){ S.cat=el.getAttribute("data-bz-cat"); render(); return; }
  if((el=t.closest("[data-bz-compose]"))){ S.compose=el.getAttribute("data-bz-compose"); render(); var f=root.querySelector(".bz-form input:not([type=file]),.bz-form select"); return; }
  if(t.closest("[data-bz-cancel]")){ S.compose=null; render(); return; }
  if(t.closest("[data-bz-editme]")){ e.preventDefault(); var b=root.querySelector("[data-bz-mebox]"); if(b) b.hidden=!b.hidden; return; }
  if((el=t.closest("[data-bz-submit]"))){ submit(el.getAttribute("data-bz-submit"), el); return; }
  if((el=t.closest("[data-bz-open]"))){ S.openId=el.getAttribute("data-bz-open"); render(); try{ root.scrollIntoView({block:"start"}); }catch(_){} return; }
  if(t.closest("[data-bz-back]")){ S.openId=null; render(); return; }
  var p=current(); if(!p) return;
  if((el=t.closest("[data-bz-useful]"))){
    var on=!!myReacts[p.id];
    (on ? c.from("baraza_reactions").delete().eq("post_id",p.id).eq("user_id",S.me.id)
        : c.from("baraza_reactions").insert({ post_id:p.id, user_id:S.me.id })).then(function(r){
      if(r.error){ toast("Couldn't save: "+r.error.message); return; }
      myReacts[p.id]=!on; p.useful_count=Math.max(0,(p.useful_count||0)+(on?-1:1));
      el.classList.toggle("on",!on); el.querySelector("span").textContent=p.useful_count; });
    return;
  }
  if(t.closest("[data-bz-report]") || (el=t.closest("[data-bz-rreport]"))){
    var why=prompt("What's the problem with this "+(el?"reply":"post")+"? (optional)"); if(why===null) return;
    c.from("baraza_reports").insert({ post_id:p.id, reply_id: el?el.getAttribute("data-bz-rreport"):null, reason:why||null, reporter:S.me.id })
      .then(function(r){ toast(r.error?("Couldn't report: "+r.error.message):"Thanks — an admin will take a look"); });
    return;
  }
  if(t.closest("[data-bz-del]")){
    if(!confirm("Delete this post and its replies?")) return;
    c.from("baraza_posts").delete().eq("id",p.id).then(function(r){
      if(r.error){ toast("Couldn't delete: "+r.error.message); return; }
      S.posts=S.posts.filter(function(x){ return x.id!==p.id; }); S.openId=null; toast("Deleted"); render(); });
    return;
  }
  if((el=t.closest("[data-bz-rdel]"))){
    if(!confirm("Delete this reply?")) return;
    c.from("baraza_replies").delete().eq("id",el.getAttribute("data-bz-rdel")).then(function(r){ toast(r.error?("Couldn't delete: "+r.error.message):"Reply deleted"); render(); });
    return;
  }
  if((el=t.closest("[data-bz-rhide]"))){
    c.from("baraza_replies").update({ hidden: el.getAttribute("data-h")!=="1" }).eq("id",el.getAttribute("data-bz-rhide")).then(function(r){ toast(r.error?("Failed: "+r.error.message):"Updated"); render(); });
    return;
  }
  if((el=t.closest("[data-bz-adm]"))){
    var f = el.getAttribute("data-bz-adm")==="pin" ? { pinned:!p.pinned } : { hidden:!p.hidden };
    c.from("baraza_posts").update(f).eq("id",p.id).then(function(r){ if(r.error){ toast("Failed: "+r.error.message); return; } patchLocal(p.id,f); toast("Updated"); render(); });
    return;
  }
  if((el=t.closest("[data-bz-promote]"))){ promote(p, el.getAttribute("data-bz-promote")); return; }
  if(t.closest("[data-bz-reply]")){
    var body=val("reply"), st=root.querySelector("[data-bz-rstat]"); if(!body){ st.textContent="Write something first."; return; }
    c.from("baraza_replies").insert({ post_id:p.id, body:body, author_id:S.me.id, author_name:S.me.name, author_org:S.me.org||null }).then(function(r){
      if(r.error){ st.textContent="Couldn't reply: "+r.error.message; return; }
      p.reply_count=(p.reply_count||0)+1; p.last_activity_at=new Date().toISOString(); render(); });
  }
}
/* admin: copy a post into an existing review queue as an unpublished draft */
function promote(p, target){
  var c=sb(), by=p.author_org||p.author_name||"Baraza", title=p.title||(p.source_name?p.source_name+" — shared post":"Shared on Baraza");
  var meta="From the Baraza · shared by "+by+(p.county?" · "+p.county:"");
  if(!confirm("Create an unpublished "+target+" draft from this post? It will wait in the review queue.")) return;
  var q = target==="Event"
    ? c.from("calendar_events").insert({ title:title, description:p.body||null, org:by, link:safeUrl(p.url)||null, published:false })
    : c.from("resources").insert({ category:target, title:title, meta:meta, url:safeUrl(p.url)||null, kind:"LINK", by:by, published:false });
  q.then(function(r){
    if(r.error){ toast("Couldn't create the draft: "+r.error.message); return; }
    c.from("baraza_posts").update({ promoted_to:target }).eq("id",p.id).then(function(){ patchLocal(p.id,{promoted_to:target}); render(); });
    toast(target+" draft created — review it in the admin console");
  });
}

/* ---------- boot ---------- */
var started=false;
function show(){
  root=document.getElementById("barazaRoot"); if(!root) return;
  if(!started){
    started=true;
    var st=document.createElement("style"); st.textContent=CSS; document.head.appendChild(st);
    root.addEventListener("click", onClick);
    root.addEventListener("keydown", function(e){ var it=e.target.closest&&e.target.closest(".bz-item"); if(it && (e.key==="Enter"||e.key===" ")){ e.preventDefault(); it.click(); } });
    root.addEventListener("input", function(e){ if(e.target.matches("[data-bz-q]")){ S.q=e.target.value; var lb=root.querySelector("[data-bz-listbox]"); if(lb){ lb.innerHTML=(S.tab==="forum"?forumList():wallList()); embedTweets(lb); } } });
    var c0=sb();
    if(c0 && c0.auth && c0.auth.onAuthStateChange) c0.auth.onAuthStateChange(function(_e, session){
      if(session && !S.me){ S.loaded=false; boot(); } });
    boot();
  } else if(S.me && !S.compose && !S.openId) load();
}
function boot(){
    loadMe(function(me){
      if(!me){ S.loaded="nouser"; render(); return; }
      S.me=me; render(); load();
      mine().then(function(ids){ ids.forEach(function(id){ myReacts[id]=true; }); });
    });
}
window.MZK_BARAZA = { show:show };
/* if the page opened straight onto #baraza, start now */
var sec=document.getElementById("baraza");
if(sec && sec.classList.contains("view-on")) show();
})();
