#!/usr/bin/env python3
"""Patch raia/index.html so Tetesi / Ukweli Halisi / Kwenye Habari show Swahili + Sheng.
Usage: python3 patch_raia.py path/to/raia/index.html   (edits in place, fails loudly if an anchor is missing)"""
import sys

p = sys.argv[1]
s = open(p, encoding="utf-8").read()

def rep(old, new, count=1):
    global s
    n = s.count(old)
    if n != count:
        sys.exit(f"anchor found {n}x (expected {count}): {old[:80]!r}")
    s = s.replace(old, new)

# ---- helpers: pick the translated field, plus a small "translated" / "not yet translated" note
rep('function hearsayCard(i){',
'''function tr(i,f){ var x=i.i18n&&i.i18n[f]; return L({en:(i[f]||""),sw:(x&&x.sw)||null,sh:(x&&(x.sh||x.sw))||null}); }
function trNote(i){
  if(LANG==="en") return "";
  var has=i.i18n&&i.i18n.body;
  return '<p class="muted" style="margin:0 0 6px;font-size:.7rem;font-style:italic">'+esc(has?L({en:"",sw:"Imetafsiriwa kutoka Kiingereza",sh:"Imetranslatiwa kutoka English"}):L(UI.fallback))+'</p>';
}
function hearsayCard(i){''')

# ---- Tetesi card: verdict, claim
rep("""\\u26a0 '+esc(i.verdict||"Flagged")+'</span>'+""",
    """\\u26a0 '+esc(tr(i,"verdict")||"Flagged")+'</span>'+trNote(i)+""")
rep("""'<p style="margin:0 0 10px;font-size:.98rem;line-height:1.45">\\u201c'+esc(dec(i.body||""))+'\\u201d</p>'+""",
    """'<p style="margin:0 0 10px;font-size:.98rem;line-height:1.45">\\u201c'+esc(dec(tr(i,"body")))+'\\u201d</p>'+""")

# ---- Ukweli Halisi card: verdict, rebuttal
rep("""(i.verdict?'<p class="muted" style="margin:0 0 6px;font-weight:700;font-size:.78rem">'+esc(L(UI.whatsTrue))+' \\u2014 '+esc(i.verdict)+'</p>':'')+
    '<p style="margin:0 0 10px;line-height:1.5">'+esc(dec(i.rebuttal||i.body||""))+'</p>'+""",
    """(i.verdict?'<p class="muted" style="margin:0 0 6px;font-weight:700;font-size:.78rem">'+esc(L(UI.whatsTrue))+' \\u2014 '+esc(tr(i,"verdict"))+'</p>':'')+trNote(i)+
    '<p style="margin:0 0 10px;line-height:1.5">'+esc(dec(i.rebuttal?tr(i,"rebuttal"):tr(i,"body")))+'</p>'+""")

# ---- Kwenye Habari item: SW/SH gist as the main line, original English headline underneath
rep("""'<span style="flex:1;color:var(--ink,#1a1a1a);font-weight:600;font-size:.9rem;line-height:1.35">'+esc(dec(i.title))+'</span>'+""", """radarTitle(i)+""", count=2)
rep('function radarItem(i){', '''function radarTitle(i){
  var g=LANG!=="en"&&i.gist&&(i.gist[LANG]||i.gist.sw);
  if(!g) return '<span style="flex:1;color:var(--ink,#1a1a1a);font-weight:600;font-size:.9rem;line-height:1.35">'+esc(dec(i.title))+'</span>';
  return '<span style="flex:1;line-height:1.35"><span style="display:block;color:var(--ink,#1a1a1a);font-weight:600;font-size:.9rem">'+esc(g)+'</span><span style="display:block;margin-top:3px;color:var(--muted,#6b7280);font-size:.74rem">'+esc(dec(i.title))+'</span></span>';
}
function radarItem(i){''')

# radar selects need the gist (home radar + news stream)
rep('select("source,title,url,stance,published_at")', 'select("source,title,url,stance,published_at,gist")', count=2)

# ---- Kwenye Habari stream: daily "Habari za leo" digest card on top
rep("""  if(brand==="news"){
    RSB.from("sentiment_items")""",
"""  if(brand==="news"){
    RSB.from("news_digests").select("digest_date,content,sources").eq("published",true).order("digest_date",{ascending:false}).limit(1).then(function(dr){
      var row=dr&&dr.data&&dr.data[0]; if(!row) return;
      var tgt=document.getElementById("streamDigest"); if(tgt) tgt.innerHTML=newsDigestCard(row);
    }, function(){});
    RSB.from("sentiment_items")""")
rep("""      host.innerHTML='<div style="display:grid;gap:8px;padding:0 16px">'+r.data.map(radarItem).join("")+'</div>';
    }, fail);
  } else if(brand==="hearsay"){""",
"""      host.innerHTML='<div id="streamDigest" style="padding:0 16px"></div>'+
        '<p class="muted" style="padding:0 16px;margin:14px 0 8px;font-weight:800;font-size:.72rem;text-transform:uppercase;letter-spacing:.05em">'+esc(L({en:"Latest headlines",sw:"Vichwa vya habari vya karibuni",sh:"Headlines za saa hii"}))+'</p>'+
        '<div style="display:grid;gap:8px;padding:0 16px">'+r.data.map(radarItem).join("")+'</div>';
    }, fail);
  } else if(brand==="hearsay"){""")

rep('function fetchStream(brand){',
'''function newsDigestCard(row){
  var c=row.content||{};
  var day; try{ day=new Date(row.digest_date+"T00:00:00").toLocaleDateString(LANG==="en"?"en-GB":"sw-KE",{weekday:"long",day:"numeric",month:"long"}); }catch(e){ day=row.digest_date; }
  var stories=(c.stories||[]).map(function(st){
    var links=(st.links||[]).slice(0,3).map(function(l){ return '<a href="'+esc(l.url)+'" target="_blank" rel="noopener noreferrer" style="color:var(--green-ink);font-weight:700;font-size:.74rem;margin-right:10px">'+esc(l.source||L({en:"Source",sw:"Chanzo",sh:"Source"}))+' \\u2197</a>'; }).join("");
    return '<li style="margin:0 0 12px"><b>'+esc(L(st.title))+'</b><br><span>'+esc(L(st.what))+'</span>'+
      (st.why?'<br><span class="muted" style="font-size:.84rem">\\u21b3 '+esc(L(st.why))+'</span>':'')+
      (links?'<div style="margin-top:4px">'+links+'</div>':'')+'</li>';
  }).join("");
  return '<article style="background:var(--paper,#faf7f2);border:1px solid rgba(0,0,0,.08);border-left:4px solid var(--gold,#DC9A18);border-radius:13px;padding:15px 16px">'+
    '<div style="font-weight:900;font-size:.64rem;text-transform:uppercase;letter-spacing:.05em;color:var(--green-ink);margin-bottom:4px">'+esc(L({en:"Today in the news",sw:"Habari za leo",sh:"Habari za leo"}))+' \\u00b7 '+esc(day)+'</div>'+
    '<h3 style="margin:0 0 6px;font-size:1.05rem;line-height:1.3">'+esc(L(c.headline))+'</h3>'+
    '<p style="margin:0 0 12px;line-height:1.5">'+esc(L(c.summary))+'</p>'+
    '<ol style="margin:0;padding-left:18px;line-height:1.45">'+stories+'</ol>'+
    (c.why_care?'<p style="margin:6px 0 0;font-weight:700">'+esc(L(c.why_care))+'</p>':'')+
    '<p class="muted" style="margin:10px 0 0;font-size:.7rem">'+esc(L({en:"Summarised from the headlines below. Follow the links for the full stories.",sw:"Muhtasari kutoka kwa vichwa vya habari hapa chini. Fuata viungo upate habari kamili.",sh:"Summary kutoka kwa headlines za chini. Fuata links upate story yote."}))+'</p>'+
  '</article>';
}
function fetchStream(brand){''')

open(p, "w", encoding="utf-8").write(s)
print("raia patched OK")

# ---- (appended) fact-check detail page also translated
s = open(p, encoding="utf-8").read()
for old, new in [
  ("""'px;margin:8px 0 10px">&#9888; '+esc(i.verdict||"Flagged")+'</span>'+""", None),
]:
    pass
def rep2(old,new):
    global s
    if s.count(old)!=1: sys.exit(f"detail anchor {s.count(old)}x: {old[:70]!r}")
    s=s.replace(old,new)
rep2("""margin:8px 0 10px">&#9888; '+esc(i.verdict||"Flagged")+'</span>'+""", """margin:8px 0 10px">&#9888; '+esc(tr(i,"verdict")||"Flagged")+'</span>'+trNote(i)+""")
rep2("""'<p style="font-size:1.02rem;line-height:1.5;margin:0 0 14px">&#8220;'+esc(i.body||"")+'&#8221;</p>'+""", """'<p style="font-size:1.02rem;line-height:1.5;margin:0 0 14px">&#8220;'+esc(tr(i,"body"))+'&#8221;</p>'+""")
rep2("""<p style="margin:0;line-height:1.55">'+esc(i.rebuttal||"")+'</p></div>'+""", """<p style="margin:0;line-height:1.55">'+esc(tr(i,"rebuttal"))+'</p></div>'+""")
open(p, "w", encoding="utf-8").write(s)
print("raia detail page patched OK")
