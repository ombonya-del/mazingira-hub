/* Voices media gallery: compact tiles, click to enlarge (lightbox with prev/next, Esc, arrows) */
var VGAL = (function(){
  var lb, items=[], idx=0;
  function q(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function kindOf(path){ var n=String(path||"").toLowerCase();
    if(/\.(mp4|mov|m4v|webm|3gp|mkv)$/.test(n)) return "video";
    if(/\.(mp3|m4a|aac|wav|ogg|oga|opus|amr|weba)$/.test(n)) return "audio";
    return "image"; }
  function ensure(){
    if(lb) return lb;
    lb=document.createElement("div"); lb.className="vlb"; lb.hidden=true;
    lb.setAttribute("role","dialog"); lb.setAttribute("aria-modal","true"); lb.setAttribute("aria-label","Media viewer");
    lb.innerHTML='<div class="vlb-stage"></div><button class="vlb-x" aria-label="Close">×</button>'+
      '<button class="vlb-p" aria-label="Previous">‹</button><button class="vlb-n" aria-label="Next">›</button><div class="vlb-c"></div>';
    document.body.appendChild(lb);
    lb.addEventListener("click", function(e){ if(e.target===lb || e.target.classList.contains("vlb-stage")) close(); });
    lb.querySelector(".vlb-x").addEventListener("click", close);
    lb.querySelector(".vlb-p").addEventListener("click", function(){ show(idx-1); });
    lb.querySelector(".vlb-n").addEventListener("click", function(){ show(idx+1); });
    document.addEventListener("keydown", function(e){ if(lb.hidden) return;
      if(e.key==="Escape") close(); else if(e.key==="ArrowLeft") show(idx-1); else if(e.key==="ArrowRight") show(idx+1); });
    return lb;
  }
  function show(i){
    if(!items.length) return; idx=(i+items.length)%items.length; var it=items[idx];
    var st=lb.querySelector(".vlb-stage");
    st.innerHTML = it.k==="video" ? '<video src="'+q(it.u)+'" controls autoplay playsinline></video>' : '<img src="'+q(it.u)+'" alt="">';
    var many=items.length>1;
    lb.querySelector(".vlb-p").style.display = many?"":"none"; lb.querySelector(".vlb-n").style.display = many?"":"none";
    lb.querySelector(".vlb-c").textContent = many ? (idx+1)+" / "+items.length : "";
  }
  function open(list,i){ ensure(); items=list; lb.hidden=false; document.documentElement.style.overflow="hidden"; show(i); lb.querySelector(".vlb-x").focus(); }
  function close(){ if(!lb) return; lb.hidden=true; lb.querySelector(".vlb-stage").innerHTML=""; document.documentElement.style.overflow=""; }
  /* box: container element; signed: [{path, signedUrl}] from createSignedUrls */
  function render(box, signed){
    var vis=[], aud=[];
    (signed||[]).forEach(function(x){ if(!x||!x.signedUrl) return; var k=kindOf(x.path);
      if(k==="audio") aud.push(x.signedUrl); else vis.push({u:x.signedUrl,k:k}); });
    var MAX=6, shown=vis.slice(0,MAX), extra=vis.length-shown.length;
    var n = shown.length>=3 ? 3 : shown.length;
    var html = shown.length ? '<div class="vgal n'+n+'">'+shown.map(function(it,i){
      var more = (extra>0 && i===shown.length-1) ? '<span class="vmore">+'+extra+'</span>' : '';
      var inner = it.k==="video" ? '<video src="'+q(it.u)+'#t=0.5" preload="metadata" muted playsinline></video><span class="vplay"></span>'
                                 : '<img src="'+q(it.u)+'" alt="" loading="lazy">';
      return '<button type="button" class="vt" data-vi="'+i+'" aria-label="Enlarge '+(it.k==="video"?"video":"photo")+'">'+inner+more+'</button>';
    }).join("")+'</div>' : '';
    if(aud.length) html += '<div class="vaud">'+aud.map(function(u){ return '<audio src="'+q(u)+'" controls preload="none"></audio>'; }).join("")+'</div>';
    box.innerHTML = html;
    box.querySelectorAll(".vt").forEach(function(b){ b.addEventListener("click", function(){ open(vis, +b.getAttribute("data-vi")); }); });
  }
  return { render: render, open: open, close: close };
})();
