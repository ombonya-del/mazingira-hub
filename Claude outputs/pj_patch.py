import sys
p = sys.argv[1]
s = open(p, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (a[:70], s.count(a)); s = s.replace(a, b)
assert 'var PJV = (function(){' not in s, "already patched"

JS = r'''
/* ---------- Je, Hatua? — three views of the fundable portfolio: Portfolio · Map · Table ----------
   Shared filters (lane, sector, search) drive all three views. Map: counties shaded by response gap,
   project markers coloured by lane; tap a county or marker for the cards. Table: sortable + CSV.
   Admins get a shortcut to Match & notify in the admin console. */
var PJV = (function(){
  var host = document.getElementById("projectLanes"); if(!host) return null;
  var LANE_COL = { document:"#7FB0D8", challenge:"#EE9455", build:"#62C79B" };
  var LANE_N = { document:"Document", challenge:"Challenge", build:"Build" };
  function h(x){ return String(x==null?"":x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function kes(p){ var m=String(p.budget).match(/([\d.]+)\s*M/i); return m?parseFloat(m[1])*1e6:0; }
  function months(p){ var m=String(p.budget).match(/(\d+)\s*mo/i); return m?+m[1]:0; }
  function fmtKES(n){ return "KES "+(n>=1e7?Math.round(n/1e6):(n/1e6).toFixed(1).replace(/\.0$/,""))+"M"; }
  function ctys(p){ return String(p.county).split(/\s*·\s*/).filter(function(n){ return GEO[n]; }); }
  function secs(p){ return String(p.sector).split(/\s*·\s*/); }
  var ALL = PROJECTS.slice();
  var SECTORS = []; ALL.forEach(function(p){ secs(p).forEach(function(x){ if(SECTORS.indexOf(x)<0) SECTORS.push(x); }); }); SECTORS.sort();
  var V = { view:"portfolio", lane:"all", sector:"all", q:"", sk:"budget", sd:-1, cty:null, pj:null, admin:false };
  try{ var sv=localStorage.getItem("mk.pjView"); if(/^(portfolio|map|table)$/.test(sv)) V.view=sv; }catch(_){}
  function match(p){
    if(V.lane!=="all" && p.lane!==V.lane) return false;
    if(V.sector!=="all" && secs(p).indexOf(V.sector)<0) return false;
    if(V.q){ var hay=(p.title+" "+p.pitch+" "+p.county+" "+p.sector+" "+p.funder).toLowerCase(); if(hay.indexOf(V.q.toLowerCase())<0) return false; }
    return true;
  }
  function open(p){ if(window.MZK_KITS && MZK_KITS.kits && MZK_KITS.kits[p.title]) MZK_KITS.open(p); }

  /* toolbar + summary + view hosts */
  var top = el("div","pj-top"); host.parentNode.insertBefore(top, host);
  var mapBox = el("div","pj-mapview"), tabBox = el("div","pj-tableview");
  host.parentNode.insertBefore(mapBox, host.nextSibling); host.parentNode.insertBefore(tabBox, mapBox.nextSibling);

  function drawSum(){
    var list=ALL.filter(match), tot=0, cs={}; list.forEach(function(p){ tot+=kes(p); ctys(p).forEach(function(c){ cs[c]=1; }); });
    var b=top.querySelectorAll(".pj-sum > div:not(.pj-views) b");
    if(b.length===3){ b[0].textContent=list.length; b[1].textContent=fmtKES(tot); b[2].textContent=Object.keys(cs).length; }
  }
  function drawTop(){
    var lanes=["all","document","challenge","build"].map(function(k){
      return '<button type="button" class="chip pj-lane'+(k!=="all"?' l-'+k:'')+'" data-pjlane="'+k+'" aria-pressed="'+(V.lane===k)+'">'+(k==="all"?"All lanes":LANE_N[k])+'</button>'; }).join("");
    top.innerHTML =
      '<div class="pj-sum">'+
        '<div><b>0</b><span>fundable projects</span></div>'+
        '<div><b>0</b><span>total ask</span></div>'+
        '<div><b>0</b><span>counties reached</span></div>'+
        '<div class="pj-views" role="tablist" aria-label="Project views">'+
          [["portfolio","Portfolio"],["map","Map"],["table","Table"]].map(function(v){
            return '<button type="button" role="tab" data-pjview="'+v[0]+'" aria-selected="'+(V.view===v[0])+'">'+v[1]+'</button>'; }).join("")+
        '</div>'+
      '</div>'+
      '<div class="pj-filters">'+lanes+
        '<select class="pj-sel" data-pjsec aria-label="Sector"><option value="all">All sectors</option>'+
          SECTORS.map(function(x){ return '<option'+(V.sector===x?' selected':'')+'>'+h(x)+'</option>'; }).join("")+'</select>'+
        '<input class="pj-q" type="search" placeholder="Search projects, counties, funders…" value="'+h(V.q)+'" data-pjq aria-label="Search projects">'+
        (V.admin?'<a class="btn btn--ghost pj-admin" href="https://admin.mazingirakenya.org/#projects" target="mzk_admin" rel="noopener" title="Admins: match these projects to partners and email them the proposal kit">Match &amp; notify partners ↗</a>':'')+
      '</div>';
    drawSum();
  }
  /* Portfolio: the existing lane cards, filtered in place */
  function drawPortfolio(){
    var by={}; ALL.forEach(function(p){ by[p.title]=p; });
    host.querySelectorAll(".lane-block").forEach(function(b){
      var any=0; b.querySelectorAll(".project").forEach(function(card){
        var t=card.querySelector("h4"), p=t&&by[t.textContent], ok=!!(p&&match(p)); card.hidden=!ok; if(ok) any++;
        var pt=card.querySelector(".p-top");
        if(p && pt && !card.querySelector(".pj-badge")){ pt.appendChild(el("span","pj-badge", fmtKES(kes(p))+(months(p)?' · '+months(p)+' mo':''))); }
      });
      b.hidden=!any; var tg=b.querySelector(".lb-head .tag"); if(tg) tg.textContent=any+" project"+(any===1?"":"s");
    });
  }
  /* Map */
  var GAPMAX = Math.max.apply(null, C.map(function(c){ return Math.max(0,c.comm.gap); })) || 1;
  function cByName(n){ for(var i=0;i<C.length;i++) if(C[i].n===n) return C[i]; return null; }
  function drawMap(){
    var list=ALL.filter(match);
    var inCty={}; list.forEach(function(p){ ctys(p).forEach(function(c){ (inCty[c]=inCty[c]||[]).push(p); }); });
    var hot={}; if(V.pj) ctys(V.pj).forEach(function(c){ hot[c]=1; });
    var light = MAPC===MAP_PAL.light, gapHi = light ? "#D9722C" : "#B05A21";
    mapBox.innerHTML =
      '<div class="pj-maplayout"><div class="pj-mapwrap"><svg class="pj-svg" id="pjMap" role="img" aria-label="Fundable projects on the county response-gap map"></svg>'+
        '<div class="maptip" id="pjTip" role="status"></div>'+
        '<div class="pj-legend">'+["document","challenge","build"].map(function(k){ return '<span><i style="background:'+LANE_COL[k]+'"></i>'+LANE_N[k]+'</span>'; }).join("")+
          '<span class="pj-ramp">Shading = response gap <i></i></span></div></div>'+
        '<aside class="pj-panel" id="pjPanel"></aside></div>'+
      '<div class="pj-national" id="pjNational"></div>';
    var svg=document.getElementById("pjMap");
    drawCounties(svg, function(n){
        var c=cByName(n), v=c?Math.max(0,c.comm.gap)/GAPMAX:0;
        return v<=0.02 ? MAPC.none : mix(MAPC.densLo, gapHi, Math.pow(v,.8));
      }, document.getElementById("pjTip"),
      function(n){ var c=cByName(n), k=(inCty[n]||[]).length;
        return '<b>'+h(n)+'</b>'+(c?'Response gap '+Math.round(Math.max(0,c.comm.gap)*100)+'% · ':'')+(k?k+' project'+(k>1?'s':''):'no project yet'); },
      function(n){ V.cty=n; V.pj=null; drawMap(); });
    svg.querySelectorAll(".cty2").forEach(function(pth){ var n=pth.dataset.n; if(hot[n]||V.cty===n) pth.classList.add("sel"); });
    var g=document.createElementNS(NS,"g");
    Object.keys(inCty).forEach(function(n){
      var gg=GEO[n], ps=inCty[n], k=ps.length;
      ps.forEach(function(p,i){
        var c=document.createElementNS(NS,"circle");
        c.setAttribute("cx", gg[1] + (i-(k-1)/2)*8); c.setAttribute("cy", gg[2]);
        c.setAttribute("r", V.pj===p ? 5.4 : 4.2); c.setAttribute("fill", LANE_COL[p.lane]||"#fff");
        c.setAttribute("stroke","#050B08"); c.setAttribute("stroke-width", V.pj===p ? 2 : 1.3);
        c.setAttribute("class","pj-dot"); if(V.pj && V.pj!==p) c.setAttribute("opacity",".45");
        var t=document.createElementNS(NS,"title"); t.textContent=p.title+" — "+fmtKES(kes(p)); c.appendChild(t);
        c.addEventListener("click", function(e){ e.stopPropagation(); V.pj=p; V.cty=null; drawMap(); });
        g.appendChild(c);
      });
    });
    svg.appendChild(g);
    var panel=document.getElementById("pjPanel"), show, head;
    if(V.pj){ show=[V.pj]; head='<p class="kicker">Project</p><h3>'+h(V.pj.title)+'</h3><p class="pj-ph">Covers '+h(V.pj.county)+'</p>'; }
    else if(V.cty){ var cc=cByName(V.cty); show=inCty[V.cty]||[];
      head='<p class="kicker">County</p><h3>'+h(V.cty)+'</h3><p class="pj-ph">'+(cc?'Response gap '+Math.round(Math.max(0,cc.comm.gap)*100)+'%. ':'')+
        (show.length?show.length+' fundable project'+(show.length>1?'s':'')+' here.':'No fundable project here yet — a gap a funder could open.')+'</p>'; }
    else { show=list.slice().sort(function(a,b){ return kes(b)-kes(a); }).slice(0,3);
      head='<p class="kicker">Tap a county or a dot</p><h3>Where the money closes gaps</h3><p class="pj-ph">The darker the county, the bigger its response gap. Dots are fundable projects, coloured by lane. Largest asks:</p>'; }
    panel.innerHTML = head + show.map(miniCard).join("") + ((V.cty||V.pj)?'<button type="button" class="btn btn--ghost pj-clear" data-pjclear>Show all</button>':'');
    var nat=list.filter(function(p){ return !ctys(p).length; });
    document.getElementById("pjNational").innerHTML = nat.length ? '<p class="kicker">National &amp; regional</p><div class="pj-natlist">'+nat.map(miniCard).join("")+'</div>' : '';
  }
  function miniCard(p){
    return '<button type="button" class="pj-mini" data-pjopen="'+h(p.title)+'"><span class="pj-mlane" style="background:'+LANE_COL[p.lane]+'"></span>'+
      '<span class="pj-mt">'+h(p.title)+'</span><span class="pj-mm">'+h(LANE_N[p.lane])+' · '+h(p.sector)+' · <b>'+fmtKES(kes(p))+'</b></span>'+
      '<span class="pj-mm">'+h(p.county)+'</span><span class="pj-go">Details &amp; proposal kit →</span></button>';
  }
  /* Table */
  var COLS=[["title","Project"],["lane","Lane"],["sector","Sector"],["county","Counties"],["budget","Budget"],["months","Months"],["status","Status"],["funder","Funder fit"]];
  function val(p,k){ return k==="budget"?kes(p):k==="months"?months(p):k==="lane"?LANE_N[p.lane]:k==="status"?(p.status==="dev"?"In development":"Idea"):String(p[k]||""); }
  function drawTable(){
    var list=ALL.filter(match).sort(function(a,b){ var x=val(a,V.sk), y=val(b,V.sk); return (typeof x==="number"?x-y:String(x).localeCompare(String(y)))*V.sd; });
    tabBox.innerHTML='<div class="pj-tablewrap"><table class="pj-tbl"><thead><tr>'+COLS.map(function(c){
        return '<th><button type="button" data-pjsort="'+c[0]+'">'+c[1]+(V.sk===c[0]?(V.sd<0?' ↓':' ↑'):'')+'</button></th>'; }).join("")+'</tr></thead><tbody>'+
      list.map(function(p){ return '<tr data-pjopen="'+h(p.title)+'" tabindex="0"><td><b>'+h(p.title)+'</b></td><td><span class="pj-dotk" style="background:'+LANE_COL[p.lane]+'"></span>'+h(LANE_N[p.lane])+'</td><td>'+h(p.sector)+
        '</td><td>'+h(p.county)+'</td><td class="num">'+fmtKES(kes(p))+'</td><td class="num">'+(months(p)||"")+'</td><td>'+(p.status==="dev"?"In development":"Idea")+'</td><td>'+h(p.funder)+'</td></tr>'; }).join("")+
      '</tbody></table></div><div class="pj-tfoot"><button type="button" class="btn btn--ghost" data-pjcsv>Download as CSV</button><span>Click a row for the description, sources and proposal templates.</span></div>';
  }
  function csv(){
    var rows=[["Project","Lane","Sector","Counties","Budget (KES)","Months","Status","Funder fit","Pitch","Gap it closes"]].concat(ALL.filter(match).map(function(p){
      return [p.title,LANE_N[p.lane],p.sector,p.county,kes(p),months(p),(p.status==="dev"?"In development":"Idea"),p.funder,p.pitch,p.gap]; }));
    var txt="﻿"+rows.map(function(r){ return r.map(function(x){ x=String(x==null?"":x).replace(/<[^>]+>/g,""); return /[",\n]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x; }).join(","); }).join("\r\n");
    var a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([txt],{type:"text/csv;charset=utf-8"})); a.download="MazingiraKenya-fundable-projects.csv";
    document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function drawView(){
    host.hidden = V.view!=="portfolio"; mapBox.hidden = V.view!=="map"; tabBox.hidden = V.view!=="table";
    if(V.view==="portfolio") drawPortfolio(); else if(V.view==="map") drawMap(); else drawTable();
    drawSum();
  }
  function render(){ drawTop(); drawView(); }
  var sec=document.getElementById("ajesasa");
  sec.addEventListener("click", function(e){
    var t=e.target.closest("[data-pjview],[data-pjlane],[data-pjopen],[data-pjsort],[data-pjcsv],[data-pjclear]"); if(!t || !sec.contains(t)) return;
    if(t.hasAttribute("data-pjview")){ V.view=t.getAttribute("data-pjview"); try{ localStorage.setItem("mk.pjView",V.view); }catch(_){} render(); }
    else if(t.hasAttribute("data-pjlane")){ V.lane=t.getAttribute("data-pjlane"); V.pj=null; render(); }
    else if(t.hasAttribute("data-pjopen")){ var ti=t.getAttribute("data-pjopen"); ALL.forEach(function(p){ if(p.title===ti) open(p); }); }
    else if(t.hasAttribute("data-pjsort")){ var k=t.getAttribute("data-pjsort"); if(V.sk===k) V.sd=-V.sd; else { V.sk=k; V.sd=(k==="budget"||k==="months")?-1:1; } drawTable(); }
    else if(t.hasAttribute("data-pjcsv")) csv();
    else if(t.hasAttribute("data-pjclear")){ V.cty=null; V.pj=null; drawMap(); }
  });
  sec.addEventListener("keydown", function(e){ var tr=e.target.closest && e.target.closest("tr[data-pjopen]"); if(tr && (e.key==="Enter"||e.key===" ")){ e.preventDefault(); tr.click(); } });
  sec.addEventListener("change", function(e){ if(e.target.matches && e.target.matches("[data-pjsec]")){ V.sector=e.target.value; V.pj=null; render(); } });
  sec.addEventListener("input", function(e){ if(e.target.matches && e.target.matches("[data-pjq]")){ V.q=e.target.value; V.pj=null; drawView(); } });
  window.addEventListener("mk-theme", function(){ if(V.view==="map") drawMap(); });
  /* admins: shortcut to Match & notify */
  try{
    if(SB && SB.rpc){ (SB.auth&&SB.auth.getSession?SB.auth.getSession():Promise.resolve()).then(function(){ return SB.rpc("is_admin"); })
      .then(function(r){ if(r && r.data===true){ V.admin=true; render(); } }, function(){}); }
  }catch(_){}
  render();
  return { total:function(){ var t=0; ALL.forEach(function(p){ t+=kes(p); }); return t; }, fmt:fmtKES,
           counties:function(){ var cs={}; ALL.forEach(function(p){ ctys(p).forEach(function(c){ cs[c]=1; }); }); return Object.keys(cs).length; }, n:ALL.length };
})();

/* Home: the fifth KPI tile is a doorway into Je, Hatua? */
(function(){
  var t=document.getElementById("kpiHatua"); if(!t || !PJV) return;
  document.getElementById("khN").textContent=PJV.n;
  document.getElementById("khSub").textContent=PJV.fmt(PJV.total())+" total ask · "+PJV.counties()+" counties";
})();
'''
anchor = '/* ---- the intelligence brief, composed from live state ---- */'
rep(anchor, JS.lstrip('\n') + '\n' + anchor)

gauge_end = '''          <span class="gauge-txt"><span class="n mono" id="gapIdx">0</span><span class="s" id="gapLabel">calculating</span></span>
        </div>
      </div>
'''
rep(gauge_end, gauge_end + '''      <a class="kpi kpi-hatua" id="kpiHatua" href="#projects" aria-label="Je, Hatua? — open the fundable projects">
        <span class="lab"><span lang="sw">Je, Hatua?</span> · fundable projects</span>
        <span class="val mono" id="khN">0</span>
        <span class="sub" id="khSub">Projects mapped to evidenced gaps</span>
        <span class="kh-go">See where the money closes gaps →</span>
      </a>
''')

CSS = '''
/* ---- Home: Je, Hatua? KPI tile ---- */
a.kpi-hatua{ display:block; color:var(--text); text-decoration:none; grid-column:span 2;
  background:linear-gradient(135deg, rgba(232,180,90,.16), rgba(238,148,85,.07) 60%), var(--panel); transition:background .15s; }
a.kpi-hatua:hover{ text-decoration:none; background:linear-gradient(135deg, rgba(232,180,90,.24), rgba(238,148,85,.12) 60%), var(--panel); }
a.kpi-hatua .lab{ color:#C99A2E; }
a.kpi-hatua .val{ color:#E8B45A; }
a.kpi-hatua .kh-go{ display:block; margin-top:8px; font-size:.7rem; font-weight:800; color:var(--green); }
html[data-theme="light"] a.kpi-hatua .lab, html[data-theme="light"] a.kpi-hatua .val{ color:#8A5E00; }
@media (min-width:1000px){ a.kpi-hatua{ grid-column:auto; } }

/* ---- Je, Hatua? project views ---- */
.pj-top{ margin:22px 0 14px; }
.pj-sum{ display:flex; flex-wrap:wrap; align-items:center; gap:10px 26px; padding:14px 16px; background:var(--panel); border:1px solid var(--line); border-radius:var(--radius-l); }
.pj-sum > div:not(.pj-views) b{ display:block; font-family:Lora,serif; font-size:1.5rem; line-height:1.05; color:var(--text); }
.pj-sum > div:not(.pj-views) span{ font-size:.66rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:var(--muted-dim); }
.pj-views{ margin-left:auto; display:inline-flex; background:var(--panel-2); border:1px solid var(--line-2); border-radius:100px; padding:3px; }
.pj-views button{ border:0; background:transparent; color:var(--muted); font:inherit; font-size:.74rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; padding:7px 14px; border-radius:100px; cursor:pointer; }
.pj-views button[aria-selected="true"]{ background:var(--ember-hot); color:#160B03; }
.pj-filters{ display:flex; flex-wrap:wrap; align-items:center; gap:7px; margin-top:12px; }
.pj-lane.l-document[aria-pressed="true"]{ background:#7FB0D8; border-color:#7FB0D8; color:#08131c; }
.pj-lane.l-challenge[aria-pressed="true"]{ background:#EE9455; border-color:#EE9455; color:#1a0d03; }
.pj-lane.l-build[aria-pressed="true"]{ background:#62C79B; border-color:#62C79B; color:#062018; }
.pj-sel, .pj-q{ background:var(--panel); border:1px solid var(--line-2); color:var(--text); border-radius:100px; padding:7px 12px; font:inherit; font-size:.8rem; }
.pj-q{ flex:1 1 200px; min-width:160px; }
.pj-admin{ margin-left:auto; }
.pj-badge{ margin-left:auto; flex:none; font-size:.66rem; font-weight:900; letter-spacing:.04em; color:#E8B45A; border:1px solid rgba(232,180,90,.45); border-radius:100px; padding:2px 9px; white-space:nowrap; }
html[data-theme="light"] .pj-badge{ color:#8A5E00; }
.pj-mapview[hidden], .pj-tableview[hidden], #projectLanes[hidden]{ display:none; }
.pj-maplayout{ display:grid; gap:14px; }
@media (min-width:900px){ .pj-maplayout{ grid-template-columns:1.45fr 1fr; align-items:start; } }
.pj-mapwrap{ position:relative; background:var(--panel); border:1px solid var(--line); border-radius:var(--radius-l); padding:10px; }
.pj-svg{ display:block; width:100%; height:auto; max-height:640px; }
.pj-dot{ cursor:pointer; }
.pj-legend{ display:flex; flex-wrap:wrap; gap:6px 16px; padding:8px 4px 2px; font-size:.64rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); }
.pj-legend i{ display:inline-block; width:10px; height:10px; border-radius:50%; margin-right:6px; vertical-align:-1px; border:1px solid #050B08; }
.pj-ramp i{ width:60px !important; height:8px !important; border-radius:4px !important; border:0 !important; margin-left:6px; background:linear-gradient(90deg, var(--panel-3), #B05A21); }
.pj-panel{ background:var(--panel); border:1px solid var(--line); border-radius:var(--radius-l); padding:16px; }
@media (min-width:900px){ .pj-panel{ position:sticky; top:150px; } }
.pj-panel h3{ font-size:1.2rem; margin:0 0 4px; }
.pj-ph{ font-size:.84rem; color:var(--muted); margin:0 0 12px; }
.pj-mini{ display:block; width:100%; text-align:left; background:var(--panel-2); border:1px solid var(--line); border-radius:10px; padding:11px 12px 11px 16px; margin:0 0 8px; position:relative; color:var(--text); font:inherit; cursor:pointer; }
.pj-mini:hover{ border-color:var(--line-2); }
.pj-mlane{ position:absolute; left:0; top:0; bottom:0; width:5px; border-radius:10px 0 0 10px; }
.pj-mt{ display:block; font-weight:800; font-size:.92rem; line-height:1.3; }
.pj-mm{ display:block; font-size:.76rem; color:var(--muted); margin-top:2px; }
.pj-mm b{ color:var(--text); }
.pj-go{ display:block; font-size:.72rem; font-weight:800; color:var(--green); margin-top:6px; }
.pj-national{ margin-top:16px; }
.pj-natlist{ display:grid; gap:8px; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); }
.pj-tablewrap{ overflow-x:auto; border:1px solid var(--line); border-radius:var(--radius-l); background:var(--panel); }
.pj-tbl{ width:100%; border-collapse:collapse; font-size:.82rem; min-width:860px; }
.pj-tbl th{ text-align:left; background:var(--panel-2); border-bottom:1px solid var(--line-2); }
.pj-tbl th button{ background:none; border:0; color:var(--muted); font:inherit; font-size:.62rem; font-weight:900; letter-spacing:.1em; text-transform:uppercase; padding:10px 10px; cursor:pointer; white-space:nowrap; }
.pj-tbl td{ padding:10px; border-bottom:1px solid var(--line); vertical-align:top; }
.pj-tbl td.num{ text-align:right; font-variant-numeric:tabular-nums; white-space:nowrap; }
.pj-tbl tbody tr{ cursor:pointer; } .pj-tbl tbody tr:hover td{ background:var(--panel-2); }
.pj-tbl td:nth-child(2), .pj-tbl td:nth-child(7){ white-space:nowrap; }
.pj-dotk{ display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:6px; }
.pj-tfoot{ display:flex; flex-wrap:wrap; align-items:center; gap:12px; margin-top:10px; font-size:.78rem; color:var(--muted); }
@media (max-width:600px){ .pj-views{ margin-left:0; } .pj-sum{ gap:8px 18px; } .pj-sum > div:not(.pj-views) b{ font-size:1.25rem; } }
'''
i = s.index('/* ---- theme switch button ---- */')
s = s[:i] + CSS + s[i:]
open(p, 'w', encoding='utf-8').write(s)
print("ok")
