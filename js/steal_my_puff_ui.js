/* Puffling — Race My Puffling HUD + result UI v1.2
 * Compatibility filename retained for beta loader stability.
 */
(function(){
  let attackBtn=null,root=null,result=null,hudFrame=null,lastHudPaint=0;
  function css(el,styles){Object.assign(el.style,styles);return el;}
  function raf(cb){return typeof requestAnimationFrame==='function'?requestAnimationFrame(cb):setTimeout(()=>cb(Date.now()),50);}
  function caf(id){if(typeof cancelAnimationFrame==='function')cancelAnimationFrame(id);else clearTimeout(id);}
  function hideLegacyHud(){
    try{
      const legacy=(typeof multiplayerHudEl!=='undefined'&&multiplayerHudEl)||document.getElementById('multiplayerHud');
      if(legacy)legacy.style.display='none';
    }catch(e){}
  }
  function ensure(){
    if(root)return;
    root=document.createElement('div');root.id='raceMyPufflingHud';
    css(root,{position:'fixed',left:'50%',top:'78px',transform:'translateX(-50%)',zIndex:'24',display:'none',width:'min(92vw,430px)',pointerEvents:'none'});
    root.innerHTML='<div style="background:rgba(18,45,82,.88);backdrop-filter:blur(8px);border:2px solid rgba(255,255,255,.35);border-radius:18px;padding:10px 12px;color:#fff;box-shadow:0 8px 26px rgba(0,0,0,.2)"><div style="display:flex;justify-content:space-between;gap:10px;font-size:12px;font-weight:1000"><span>YOU <b id="raceYou">0m</b></span><span>🏁 1500m</span><span>GHOST <b id="raceRival">0m</b></span></div><div style="height:12px;background:rgba(255,255,255,.17);border-radius:999px;margin-top:7px;overflow:hidden;position:relative"><div id="raceYouBar" style="position:absolute;left:0;top:0;bottom:0;width:0;background:#62e6a7;border-radius:999px;transition:width .08s linear"></div><div id="raceRivalBar" style="position:absolute;left:0;top:4px;height:4px;width:0;background:rgba(255,255,255,.86);border-radius:999px;transition:width .08s linear"></div></div><div id="raceLeader" style="font-size:10px;font-weight:900;text-align:center;margin-top:5px;opacity:.9">EVEN</div></div>';
    document.body.appendChild(root);

    attackBtn=document.createElement('button');attackBtn.id='raceAttackBtn';attackBtn.className='gold';
    css(attackBtn,{position:'fixed',right:'14px',bottom:'24px',zIndex:'25',display:'none',pointerEvents:'auto',minWidth:'112px',minHeight:'60px',borderRadius:'20px',fontWeight:'1000'});
    attackBtn.onclick=useAttack;document.body.appendChild(attackBtn);

    result=document.createElement('div');result.id='raceMyPufflingResult';result.className='overlay';result.style.display='none';
    result.innerHTML='<div class="card" style="max-width:520px"><h1 id="raceResultTitle" style="font-size:38px">RACE COMPLETE</h1><div id="raceResultBody" class="small" style="margin:12px 0 18px"></div><button id="raceAgainBtn" class="gold">RACE AGAIN</button><button id="raceMenuBtn" class="secondary">MAIN MENU</button></div>';
    document.body.appendChild(result);
    document.getElementById('raceAgainBtn').onclick=()=>{hideResult();if(typeof quickMatch==='function')quickMatch();};
    document.getElementById('raceMenuBtn').onclick=()=>{hideResult();if(typeof showMainMenu==='function')showMainMenu();};
    window.addEventListener('race:attack',e=>{flashAttack(e.detail?.ability);render();});
    window.addEventListener('race:effectStart',e=>effectNotice(e.detail));
    window.addEventListener('race:ghost',()=>{if(root?.style.display!=='none')render();});
    window.addEventListener('race:progress',()=>{if(root?.style.display!=='none')render();});
    window.addEventListener('race:reset',()=>hide());
  }
  function liveHudHeights(s={}){
    try{
      const p=window.SkyPuffRaceNetwork?.liveProgress?.();
      if(p&&Number.isFinite(Number(p.you))&&Number.isFinite(Number(p.rival))){
        return {you:Math.max(0,Number(p.you)),rival:Math.max(0,Number(p.rival)),goal:Math.max(1,Number(p.goal)||1500)};
      }
    }catch(e){}
    let you=Math.max(0,Number(s.youHeight)||0),rival=Math.max(0,Number(s.rivalHeight)||0);
    try{const n=Number(score);if(Number.isFinite(n))you=Math.max(0,n);}catch(e){}
    try{
      const n=Number(window.SkyPuffRaceNetwork?.opponent?.()?.height);
      if(Number.isFinite(n))rival=Math.max(0,n);
      else{
        const fallback=Number(multiplayerOpponentScore);
        if(Number.isFinite(fallback))rival=Math.max(0,fallback);
      }
    }catch(e){
      try{const n=Number(window.SkyPuffRaceGhost?.status?.().last?.height);if(Number.isFinite(n))rival=Math.max(0,n);}catch(_){}
    }
    return {you,rival,goal:Math.max(1,Number(s.goal)||1500)};
  }
  function startHudLoop(){
    if(hudFrame!==null)return;lastHudPaint=0;
    const frame=ts=>{
      hudFrame=null;
      if(!root||root.style.display==='none')return;
      const t=Number(ts)||Date.now();
      if(!lastHudPaint||t-lastHudPaint>=33){lastHudPaint=t;render();}
      hudFrame=raf(frame);
    };
    hudFrame=raf(frame);
  }
  function stopHudLoop(){if(hudFrame!==null){caf(hudFrame);hudFrame=null;}lastHudPaint=0;}
  function show(){ensure();hideLegacyHud();root.style.display='block';attackBtn.style.display='block';render();startHudLoop();}
  function hide(){ensure();root.style.display='none';attackBtn.style.display='none';stopHudLoop();}
  function hideResult(){ensure();result.style.display='none';}
  function render(){
    ensure();hideLegacyHud();const R=window.SkyPuffRace,s=R?.snapshot?.()||{};
    const h=liveHudHeights(s),youH=h.you,rivalH=h.rival,goal=h.goal;
    const you=document.getElementById('raceYou'),rival=document.getElementById('raceRival'),yb=document.getElementById('raceYouBar'),rb=document.getElementById('raceRivalBar'),lead=document.getElementById('raceLeader');
    if(you)you.textContent=Math.floor(youH)+'m';if(rival)rival.textContent=Math.floor(rivalH)+'m';
    if(yb)yb.style.width=Math.max(0,Math.min(100,youH/goal*100))+'%';if(rb)rb.style.width=Math.max(0,Math.min(100,rivalH/goal*100))+'%';
    if(lead)lead.textContent=youH>rivalH?'YOU LEAD':youH<rivalH?'GHOST LEADS':'EVEN';
    const a=s.ability||R?.abilityFor?.(s.selectedPufflingId),left=Number.isFinite(Number(s.attacksRemaining))?Number(s.attacksRemaining):(R?.MAX_ATTACKS||3),elapsed=Date.now()-(Number(s.lastAttackAt)||0),cd=Math.max(0,(R?.ATTACK_COOLDOWN_MS||4000)-elapsed);
    if(left<=0){attackBtn.disabled=true;attackBtn.innerHTML=`${a?.icon||'⚡'}<br>EMPTY`;}
    else if(cd>0&&s.lastAttackAt){attackBtn.disabled=true;attackBtn.innerHTML=`${a?.icon||'⚡'} ${a?.name||'ATTACK'}<br>${(cd/1000).toFixed(1)}s`;}
    else{attackBtn.disabled=false;attackBtn.innerHTML=`${a?.icon||'⚡'} ${a?.name||'ATTACK'}<br>${left} LEFT`;}
  }
  function useAttack(){const r=window.SkyPuffRace?.attack?.();if(!r?.ok){render();return;}if(typeof showToast==='function')showToast(`${r.ability?.icon||'⚡'} ${r.ability?.name||'ATTACK'}!`);}
  function flashAttack(a){if(!attackBtn)return;attackBtn.animate?.([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:220});}
  function effectNotice(e){if(typeof showToast==='function'&&e)showToast(`${e.icon||'⚠️'} ${e.name||String(e.type||'Effect').toUpperCase()}!`);}
  function showResult(state){
    ensure();hide();const s=state||window.SkyPuffRace?.snapshot?.();if(!s)return;
    result.style.display='flex';const win=s.winner==='you';
    document.getElementById('raceResultTitle').textContent=win?'YOU WIN! 🏆':'YOU LOSE!';
    const secs=s.finishedAt&&s.startedAt?((s.finishedAt-s.startedAt)/1000).toFixed(1):'—';
    document.getElementById('raceResultBody').innerHTML=`Time: <b>${secs}s</b><br>You: <b>${Math.floor(s.youHeight||0)}m</b> · Ghost: <b>${Math.floor(s.rivalHeight||0)}m</b><br>Attacks used: <b>${s.attacksUsed||0}/${window.SkyPuffRace?.MAX_ATTACKS||3}</b> · Falls: <b>${s.falls||0}</b>`;
  }
  window.SkyPuffRaceUI={ensure,show,hide,render,showResult,hideResult,liveHudHeights,hideLegacyHud};
  window.SkyPuffStealUI={show:()=>{}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure);else ensure();
})();
