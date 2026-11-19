/* MazingiraKenya — coalition video room on JaaS (8x8 Jitsi-as-a-Service).
   Used by the hub (index.html #virtual). Members only.
   MZRoom.start({ stage, token:{jwt,appId,roomName,moderator}, onStatus(text), onLeave() }) -> { dispose() } */
(function(){
  var DOMAIN="8x8.vc";
  function loadApi(appId){
    return new Promise(function(res, rej){
      if(window.JitsiMeetExternalAPI) return res();
      var s=document.createElement("script"); s.src="https://"+DOMAIN+"/"+appId+"/external_api.js";
      s.onload=function(){ res(); }; s.onerror=function(){ rej(new Error("Couldn't load the video service. Check your connection and try again.")); };
      document.head.appendChild(s);
    });
  }
  function start(o){
    var status=o.onStatus||function(){}, t=o.token, api=null, lobbyDone=false, transDone=false;
    return loadApi(t.appId).then(function(){
      o.stage.innerHTML="";
      api=new window.JitsiMeetExternalAPI(DOMAIN,{
        roomName:t.roomName, jwt:t.jwt, parentNode:o.stage, width:"100%", height:"100%", lang:"en",
        configOverwrite:{
          defaultLanguage:"en", prejoinPageEnabled:true, startWithAudioMuted:true, startWithVideoMuted:false,
          disableDeepLinking:true, transcription:{ enabled:true, useAppLanguage:false, preferredLanguage:"en-US" },
          lobby:{ autoKnock:true, enableChat:true }, hideConferenceSubject:false
        },
        interfaceConfigOverwrite:{ MOBILE_APP_PROMO:false, SHOW_JITSI_WATERMARK:false }
      });
      api.addEventListener("readyToClose", function(){ dispose(); if(o.onLeave) o.onLeave(); });
      api.addEventListener("videoConferenceJoined", function(){
        if(!t.moderator){ status(t.minutes===false ? "You're in. This call isn't being minuted." : "You're in. Minutes will be emailed after the call."); return; }
        // Hosts: Lobby for coalition/booked calls (not quick calls), and start the transcript for the minutes.
        setTimeout(function(){
          var lobby=t.lobby!==false, mins=t.minutes!==false;
          if(lobby && !lobbyDone){ try{ api.executeCommand("toggleLobby", true); lobbyDone=true; }catch(e){} }
          if(mins && !transDone){ try{ api.executeCommand("setSubtitles", true, false); transDone=true; }catch(e){} }
          status("Host mode"+(lobby?" · Lobby on — admit each person":" · members can click straight in")+(mins?" · Transcript starting…":" · No minutes for this call"));
        }, 1500);
      });
      api.addEventListener("transcribingStatusChanged", function(e){
        if(e && e.on) status((t.moderator?"Host mode · ":"")+"● Transcribing — minutes will be emailed after the call");
        else if(t.moderator && t.minutes!==false) status("Host mode · Transcription is OFF — open ⋯ › Start transcription (or Subtitles) to get minutes");
      });
      api.addEventListener("participantKickedOut", function(e){
        try{ status("Removed: "+((e.kicked&&e.kicked.name)||"a participant")+". Lobby stays on, so they can't walk back in."); }catch(_){}
      });
      return { api:api, dispose:dispose };
    });
    function dispose(){ if(api){ try{ api.dispose(); }catch(e){} api=null; } }
  }
  window.MZRoom={ start:start };
})();
