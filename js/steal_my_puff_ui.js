/* Sky Puff — Race My Puffling HUD + result UI v1.0
 * Compatibility filename retained for beta loader stability.
 */
(function(){
  let attackBtn=null,root=null,result=null,cooldownTimer=null;
  function css(el,styles){Object.assign(el.style,styles);return el;}
  function ensure(){
    if(root)return;
    root=document.createElement('div');root.id='raceMyPufflingHud';
    css(root,{position:'fixed',left:'50%',top:'78px',transform:'translateX(-50%)',zIndex:'9',display:'none',width:'min(92vw,430px)',pointerEvents:'none'});
    root.innerHTML='<div style="background:rgba(18,45,82,.83);backdrop-filter:blur(8px);border:2px solid rgba(255,255,255,.35);border-radius:18px;padding:10px 12px;color:#fff;box-shadow:0 8px 26px rgba(0,0,0,.2)"><div style="display:flex;justify-content:space-between;gap:10px;font-size:12px;font-weight:1000"><span>YOU <b id="raceYou">0m</b></span><span>🏁 1500m</span><span>GHOST <b id="raceRival">0m</b></span></div><div style="height:10px;background:rgba(255,255,255,.17);border-radius:999px;margin-top:7px;overflow:hidden;position:relative"><div id="raceYouBar" style="position:absolute;left:0;top:0;bottom:0;width:0;background:#62e6a7;border-radius:999px"></div><div id="raceRivalBar" style="position:absolute;left:0;top:3px;height:4px;width:0;background:rgba(255,255,255,.75);border-radius:999px"></div></div><div id="raceLeader" style="font-size:10px;font-weight:900;text-align:center;margin-top:5px;opacity:.86">EVEN</div></div>';
    document.body.appendChild(root);

    attackBtn=document.createElement('button');attackBtn.id='raceAttackBtn';attackBtn.className='gold';
    css(attackBtn,{position:'fixed',right:'14px',bottom:'24px',zIndex:'12',display:'none',pointerEvents:'auto',minWidth:'112px',minHeight:'60px',borderRadius:'20px',fontWeight:'1000'});
    attackBtn.onclick=useAttack;document.body.appendChild(attackBtn);

    result=document.createElement('div');result.id='raceMyPufflingResult';result.className='overlay';result.style.display='none';
    result.innerHTML='<div class="card" style="max-width:520px"><h1 id="raceResultTitle" style="font-size:38px">RACE COMPLETE</h1><div id="raceResultBody" class="small" style="margin:12px 0 18px"></div><button id="raceAgainBtn" class="gold">RACE AGAIN</button><button id="raceMenuBtn" class="secondary">MAIN MENU</button></div>';
    document.body.appendChild(result);
    document.getElementById('raceAgainBtn').onclick=()=>{hideResult();if(typeof quickMatch==='function')quickMatch();};
    document.getElementById('raceMenuBtn').onclick=()=>{hideResult();if(typeof showMainMenu==='function')showMainMenu();};
    window.addEventListener('race:attack',e=>{flashAttack(e.detail?.ability);render();});
    window.addEventListener('race:effectStart',e=>effectNotice(e.detail));
    window.addEventListener('race:reset',()=>hide());
  }
  function show(){ensure();root.style.display='block';attackBtn.style.display='block';render();if(!cooldownTimer)cooldownTimer=setInterval(render,100);}
  function hide(){ensure();root.style.display='none';attackBtn.style.display='none';if(cooldownTimer){clearInterval(cooldownTimer);cooldownTimer=null;}}
  function hideResult(){ensure();result.style.display='none';}
  function render(){
    ensure();const R=window.SkyPuffRace,s=R?.snapshot?.();if(!s)return;
    const you=document.getElementById('raceYou'),rival=document.getElementById('raceRival'),yb=document.getElementById('raceYouBar'),rb=document.getElementById('raceRivalBar'),lead=document.getElementById('raceLeader');
    if(you)you.textContent=Math.floor(s.youHeight)+'m';if(rival)rival.textContent=Math.floor(s.rivalHeight)+'m';
    if(yb)yb.style.width=Math.min(100,s.youHeight/s.goal*100)+'%';if(rb)rb.style.width=Math.min(100,s.rivalHeight/s.goal*100)+'%';
    if(lead)lead.textContent=s.youHeight>s.rivalHeight?'YOU LEAD':s.youHeight<s.rivalHeight?'GHOST LEADS':'EVEN';
    const a=s.ability||R.abilityFor?.(s.selectedPufflingId),left=s.attacksRemaining,elapsed=Date.now()-s.lastAttackAt,cd=Math.max(0,(R.ATTACK_COOLDOWN_MS||4000)-elapsed);
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
    document.getElementById('raceResultBody').innerHTML=`Time: <b>${secs}s</b><br>You: <b>${Math.floor(s.youHeight)}m</b> · Ghost: <b>${Math.floor(s.rivalHeight)}m</b><br>Attacks used: <b>${s.attacksUsed}/${window.SkyPuffRace?.MAX_ATTACKS||3}</b> · Falls: <b>${s.falls}</b>`;
  }
  window.SkyPuffRaceUI={ensure,show,hide,render,showResult,hideResult};
  // Legacy symbol kept as no-op compatibility only.
  window.SkyPuffStealUI={show:()=>{}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure);else ensure();
})();