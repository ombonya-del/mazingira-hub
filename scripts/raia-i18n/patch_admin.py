#!/usr/bin/env python3
"""admin: SW/SH review+edit on Narrative disinfo cards; new 'Habari za leo' review page."""
import sys
p=sys.argv[1]; s=open(p,encoding="utf-8").read()
def rep(o,n,c=1):
    global s
    if s.count(o)!=c: sys.exit(f"anchor {s.count(o)}x: {o[:80]!r}")
    s=s.replace(o,n)

# ---------- nav + routing for the news digest page ----------
rep('''  {id:"copreview", label:"COP31 digest",''',
'''  {id:"newsreview", label:"Habari za leo", grp:"Publishing", icon:'<path d="M4 5h13v14H6a2 2 0 0 1-2-2z"/><path d="M17 8h3v9a2 2 0 0 1-2 2"/><path d="M7 9h7M7 13h7"/>', badgeFrom:"newspending"},
  {id:"copreview", label:"COP31 digest",''')
rep('views:["content","storyreview","copreview",', 'views:["content","storyreview","newsreview","copreview",')
rep('  if(v==="copreview") return state.copPending||0;', '  if(v==="copreview") return state.copPending||0;\n  if(v==="newsreview") return state.newsPending||0;')
rep('  else if(v==="copreview") app.innerHTML=viewCopReview();', '  else if(v==="copreview") app.innerHTML=viewCopReview();\n  else if(v==="newsreview") app.innerHTML=viewNewsReview();')
rep('  if(state.view==="copreview") loadCopReview();', '  if(state.view==="copreview") loadCopReview();\n  if(state.view==="newsreview") loadNewsReview();')
rep('''  ASB.from("cop_digests").select("id",{count:"exact",head:true}).eq("published",false).eq("raia_published",false).then(function(r){ if(!r.error){ state.copPending=r.count||0; renderNav(); } });''',
'''  ASB.from("cop_digests").select("id",{count:"exact",head:true}).eq("published",false).eq("raia_published",false).then(function(r){ if(!r.error){ state.copPending=r.count||0; renderNav(); } });
  ASB.from("news_digests").select("id",{count:"exact",head:true}).eq("published",false).then(function(r){ if(!r.error){ state.newsPending=r.count||0; renderNav(); } });''')

# ---------- news digest review page ----------
rep('/* Live badge counts for the two review queues (drafts awaiting an admin). */',
r'''/* ==================== HABARI ZA LEO — daily news digest (news-digest function) ====================
   One draft a day summarising the top radar stories in EN / SW / Sheng for raia's Kwenye Habari.
   Nothing shows on raia until published. A published digest is never overwritten by the function. */
function viewNewsReview(){
  return '<div class="view"><div class="vhead"><h2>Habari za leo</h2>'+
    '<p class="vsub">Every morning the news-digest function picks the day\'s top 3–5 climate &amp; environment stories from the radar and summarises them in English · Kiswahili · Sheng for raia\'s <b>Kwenye Habari</b> tab. It only has headlines and short feed snippets to work from, so check each story against its links, edit if needed, then publish.</p></div>'+
    '<div id="newsReviewList" class="ndr-list">Loading…</div></div>';
}
function loadNewsReview(){
  var host=document.getElementById("newsReviewList"); if(!host) return;
  if(!ASB){ host.textContent="Supabase unavailable — check the connection."; return; }
  host.textContent="Loading…";
  ASB.from("news_digests").select("*").order("digest_date",{ascending:false}).limit(21).then(function(res){
    if(res.error){ host.textContent="Load failed: "+res.error.message+(/news_digests/.test(res.error.message)?" — run supabase/raia-i18n.sql in the SQL Editor first.":""); return; }
    var data=res.data||[];
    state.newsPending=data.filter(function(r){ return !r.published; }).length; renderNav();
    if(!data.length){ host.innerHTML='<p class="vsub">No digests yet. One is written each morning (or run it now: GitHub → Actions → MazingiraKenya Scanners → Run workflow → news-digest).</p>'; return; }
    host.innerHTML=""; data.forEach(function(row){ host.appendChild(newsCard(row)); });
  });
}
function newsCard(row){
  var wrap=document.createElement("div"); wrap.className="ndr-draft"; wrap.style.marginBottom="14px";
  var lang="en";
  function mkbtn(t,cls){ var b=document.createElement("button"); b.type="button"; b.className="btn "+(cls||"ghost"); b.textContent=t; return b; }
  function e(v){ return esc(v==null?"":String(v)); }
  function T(o){ if(!o) return ""; if(typeof o==="string") return o; return o[lang]||""; }
  function update(fields,msg){ return ASB.from("news_digests").update(fields).eq("id",row.id).then(function(r){ if(r.error){ toast("Failed: "+r.error.message); return false; } Object.keys(fields).forEach(function(k){ row[k]=fields[k]; }); toast(msg); fetchWatchCounts(); viewMode(); return true; }); }
  function bodyHtml(){
    var c=row.content||{};
    var tabs=["en","sw","sh"].map(function(l){ return '<button type="button" data-nl="'+l+'" class="btn '+(l===lang?'approve':'ghost')+'" style="padding:3px 10px;font-size:.7rem">'+({en:"ENG",sw:"SWA",sh:"SHENG"})[l]+'</button>'; }).join(" ");
    var stories=(c.stories||[]).map(function(st){
      var links=(st.links||[]).map(function(l){ return '<a href="'+e(l.url)+'" target="_blank" rel="noopener" style="font-size:.72rem;margin-right:8px">'+e(l.source)+' ↗</a>'; }).join("");
      return '<li style="margin-bottom:8px"><b>'+e(T(st.title))+'</b><br>'+e(T(st.what))+'<br><span style="opacity:.75">↳ '+e(T(st.why))+'</span><br>'+links+'</li>';
    }).join("");
    return '<div style="display:flex;gap:6px;margin:0 0 8px">'+tabs+'</div>'+
      '<div style="font-size:.86rem;line-height:1.55;background:rgba(255,255,255,.03);padding:10px 12px;border-radius:8px">'+
      '<p style="margin:0 0 6px"><b>'+e(T(c.headline))+'</b></p><p style="margin:0 0 8px">'+e(T(c.summary))+'</p>'+
      '<ol style="margin:4px 0 8px 18px;padding:0">'+stories+'</ol>'+
      '<p style="margin:0"><b>'+e(T(c.why_care))+'</b></p></div>';
  }
  function viewMode(){
    var tag=row.published?'<span class="status-tag st-approved">Live on raia</span>':'<span class="status-tag st-pending">Pending review</span>';
    wrap.innerHTML='<div class="grow">'+tag+' <b>'+e(row.digest_date)+'</b> <span class="pill">Kwenye Habari</span><div class="nw-body" style="margin-top:8px">'+bodyHtml()+'</div></div>'+
      '<div class="ndr-acts" style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px"></div>';
    wrap.querySelectorAll("[data-nl]").forEach(function(b){ b.onclick=function(){ lang=b.getAttribute("data-nl"); viewMode(); }; });
    var acts=wrap.querySelector(".ndr-acts");
    var pb=mkbtn(row.published?"Unpublish from raia":"Publish to raia",row.published?"ghost":"approve"); pb.onclick=function(){ pb.disabled=true; update({published:!row.published,updated_at:new Date().toISOString()},row.published?"Removed from raia":"Live on raia"); }; acts.appendChild(pb);
    var ed=mkbtn("Edit","ghost"); ed.onclick=editMode; acts.appendChild(ed);
    var del=mkbtn("Delete","reject"); del.onclick=function(){ if(!confirm("Delete the digest for "+row.digest_date+"?")) return; del.disabled=true;
      ASB.from("news_digests").delete().eq("id",row.id).then(function(r){ if(r.error){ del.disabled=false; toast("Delete failed: "+r.error.message); return; } toast("Deleted"); wrap.remove(); fetchWatchCounts(); }); };
    acts.appendChild(del);
  }
  function editMode(){
    wrap.innerHTML='<div class="grow"><p class="vsub" style="margin:0 0 6px">Edit the text directly (en / sw / sh). Keep the structure (quotes, brackets, commas) intact — the save is checked first.</p>'+
      '<textarea class="nw-ed" style="width:100%;min-height:380px;font:12px/1.45 ui-monospace,Menlo,monospace"></textarea></div><div class="ndr-acts" style="margin-top:8px;display:flex;gap:6px"></div>';
    wrap.querySelector(".nw-ed").value=JSON.stringify(row.content||{},null,2);
    var acts=wrap.querySelector(".ndr-acts");
    var sv=mkbtn("Save","approve"); sv.onclick=function(){ var v; try{ v=JSON.parse(wrap.querySelector(".nw-ed").value); }catch(err){ toast("Not saved — formatting error: "+err.message); return; }
      sv.disabled=true; update({content:v,updated_at:new Date().toISOString()},"Saved").then(function(ok){ if(!ok) sv.disabled=false; }); };
    var cn=mkbtn("Cancel","ghost"); cn.onclick=viewMode; acts.appendChild(sv); acts.appendChild(cn);
  }
  viewMode(); return wrap;
}

/* Live badge counts for the two review queues (drafts awaiting an admin). */''')

# ---------- Narrative disinfo card: show + edit SW / SH ----------
rep('''      '<p class="ndr-meta" style="font-size:.86rem;margin:0"><b>Rebuttal:</b> '+esc(row.rebuttal||"(none yet)")+'</p>'+
      '<div class="qact" style="padding:12px 0 0;border:0"></div>';''',
'''      '<p class="ndr-meta" style="font-size:.86rem;margin:0"><b>Rebuttal:</b> '+esc(row.rebuttal||"(none yet)")+'</p>'+
      ndI18nHtml(row)+
      '<div class="qact" style="padding:12px 0 0;border:0"></div>';''')
rep('''    wrap.appendChild(fld("Verdict",vd)); wrap.appendChild(fld("Claim / narrative",bd)); wrap.appendChild(fld("Rebuttal",rb));''',
'''    wrap.appendChild(fld("Verdict",vd)); wrap.appendChild(fld("Claim / narrative",bd)); wrap.appendChild(fld("Rebuttal",rb));
    var I=row.i18n||{}, tx={};
    [["sw","Kiswahili"],["sh","Sheng"]].forEach(function(lg){
      var h=document.createElement("p"); h.style.cssText="margin:12px 0 0;font-size:.72rem;font-weight:800;color:var(--muted)"; h.textContent=lg[1]+(I.body?"":" — not translated yet (leave blank to let it auto-translate)"); wrap.appendChild(h);
      ["verdict","body","rebuttal"].forEach(function(f){
        var n=f==="verdict"?document.createElement("input"):document.createElement("textarea"); if(f!=="verdict") n.rows=f==="body"?2:3;
        n.value=(I[f]&&I[f][lg[0]])||""; tx[lg[0]+"."+f]=n;
        wrap.appendChild(fld(lg[1]+" · "+({verdict:"verdict",body:"claim",rebuttal:"rebuttal"})[f],n));
      });
    });''')
rep('''    var sv=mkbtn("Save","pub"); sv.onclick=function(){ sv.disabled=true; ASB.from("disinfo_items").update({verdict:vd.value,body:bd.value,rebuttal:rb.value}).eq("id",row.id).then(function(r){ if(r.error){sv.disabled=false;toast("Save failed: "+r.error.message);return;} row.verdict=vd.value;row.body=bd.value;row.rebuttal=rb.value; toast("Saved"); viewMode(); }); };''',
'''    var sv=mkbtn("Save","pub"); sv.onclick=function(){
      var upd={verdict:vd.value,body:bd.value,rebuttal:rb.value};
      // translations: a hand edit is marked edited=true so the auto-translator never overwrites it
      var changed=false, ni=JSON.parse(JSON.stringify(I||{}));
      ["sw","sh"].forEach(function(l){ ["verdict","body","rebuttal"].forEach(function(f){ var v=tx[l+"."+f].value.trim(), old=((I[f]&&I[f][l])||"").trim(); if(v!==old){ changed=true; ni[f]=ni[f]||{}; ni[f][l]=v; } }); });
      if(changed){ var any=["body","rebuttal"].some(function(f){ return ni[f]&&(ni[f].sw||ni[f].sh); }); upd.i18n=any?Object.assign(ni,{edited:true}):null; }
      sv.disabled=true; ASB.from("disinfo_items").update(upd).eq("id",row.id).then(function(r){ if(r.error){sv.disabled=false;toast("Save failed: "+r.error.message);return;} Object.assign(row,upd); toast("Saved"); viewMode(); }); };''')
rep('function ndCard(row,isPub){',
r'''function ndI18nHtml(row){
  var I=row.i18n;
  if(!I||!I.body) return '<p style="font-size:.74rem;color:var(--gold);margin:8px 0 0">SW / Sheng: not translated yet — the translator fills it in on its next run (or add your own via Edit).</p>';
  function blk(l,name){ return '<div style="margin-top:6px"><b style="font-size:.7rem;letter-spacing:.04em">'+name+'</b> <span class="type-tag" style="font-size:.6rem">'+esc((I.verdict&&I.verdict[l])||"")+'</span><div style="font-style:italic;margin:3px 0">"'+esc((I.body&&I.body[l])||"")+'"</div><div><b>Jibu:</b> '+esc((I.rebuttal&&I.rebuttal[l])||"")+'</div></div>'; }
  return '<details style="margin-top:8px;font-size:.82rem"><summary style="cursor:pointer;font-weight:800;font-size:.76rem">Kiswahili · Sheng'+(I.edited?' (hand-edited)':' (auto — check before publishing)')+'</summary>'+blk("sw","SWA")+blk("sh","SHENG")+'</details>';
}
function ndCard(row,isPub){''')

open(p,"w",encoding="utf-8").write(s); print("admin patched OK")
