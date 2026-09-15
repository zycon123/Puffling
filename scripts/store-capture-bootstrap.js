/* Development-only store capture helper. Never loaded by index.html or mobile www/. */
(function(){
  const params=new URLSearchParams(location.search),scene=params.get('scene')||'gameplay';
  if(!params.has('storeCapture'))return;
  try{
    localStorage.setItem('skyPuffLang','en');
    localStorage.setItem('skyPuffStarterChoiceV1','starterdrop');
    localStorage.setItem('skyPuffActivePuffling','starterdrop');
    localStorage.setItem('skyPuffPufflings',JSON.stringify({owned:{starterdrop:1,ember:2,volt:1,frost:1,prism:1,wind:1,nova:1,celestial:1},vault:['celestial'],discovered:['starterpuff','starterdrop','starterspark','ember','volt','frost','prism','wind','nova','celestial'],tradeReceipts:[]}));
    localStorage.setItem('skyPuffPufflingProgressV1',JSON.stringify({ember:{level:20,xp:0},volt:{level:14,xp:84},frost:{level:9,xp:120},prism:{level:12,xp:70},wind:{level:7,xp:44},nova:{level:20,xp:0},celestial:{level:20,xp:0}}));
  }catch(e){}

  const freezeCss=document.createElement('style');
  freezeCss.textContent='*{animation-play-state:paused!important;caret-color:transparent!important}#studioSplash{display:none!important}';
  document.head.appendChild(freezeCss);

  function hideOverlays(){document.querySelectorAll('.overlay').forEach(el=>el.style.display='none');}
  function settle(){
    try{document.getElementById('studioSplash')?.classList.add('hide');applyLanguage?.();}catch(e){}
    hideOverlays();
    if(scene==='orbdex'){
      window.SkyPuffFusionUI?.openDex?.();
      return;
    }
    startGame();
    score=scene==='boss'?1200:scene==='race'?820:640;
    scoreEl.textContent=String(score);coins=scene==='gameplay'?34:18;coinsEl.textContent=String(coins);
    cameraY=-Math.max(0,score*10-H*.56);
    paused=true;
    if(scene==='boss'){
      const stage=bossStages.find(row=>row.id==='storm')||bossStages[0];
      spawnBoss({...stage,tier:1});paused=true;boss.hp=Math.round(boss.maxHp*.68);bossBar.style.width='68%';
      playerShots.push({x:player.x,y:player.y-112,vx:0,vy:-10.2,r:12,life:120,damage:12});
      bossShots.push({x:boss.x-62,y:boss.y+84,vx:-1.2,vy:2.2,r:11,life:160,type:'orb'});
    }else if(scene==='race'){
      multiplayerMode=true;
      window.SkyPuffRace?.start?.({selectedPufflingId:'volt'});
      window.SkyPuffRace?.updateHeights?.(820,735);
      const previous=window.SkyPuffRaceNetwork||{};
      window.SkyPuffRaceNetwork={...previous,isOnline:()=>true,liveProgress:()=>({you:820,rival:735,goal:1500}),opponent:()=>({height:735})};
      window.SkyPuffRaceGhost?.push?.({x:W*.72,worldY:cameraY+player.y-46,height:735,state:'jumping',pufflingId:'nova',evolutionStage:2});
      window.SkyPuffRaceUI?.show?.();
    }
    window.SkyPuffPufflingGameplay?.refreshHud?.();
    draw();
  }
  if(window.__skyPuffModulesReady)setTimeout(settle,100);else window.addEventListener('sky-puff-ready',()=>setTimeout(settle,100),{once:true});
})();
