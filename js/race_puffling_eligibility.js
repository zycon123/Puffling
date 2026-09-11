/* Sky Puff — Race My Puffling eligibility gate v1.2
 * Race mode is unavailable until the player owns at least one Puffling.
 * Online Race syncs authoritative inventory before joining.
 */
(function(){
  const baseOpen=typeof window.openMultiplayer==='function'?window.openMultiplayer:null;
  const baseQuick=typeof window.quickMatch==='function'?window.quickMatch:null;
  const baseStart=typeof window.startMultiplayerRace==='function'?window.startMultiplayerRace:null;
  if(!baseStart)return;

  const COPY={
    no:{need:'Du må skaffe deg minst én Puffling før du kan spille Race My Puffling.',hint:'Velg en gratis starter-Puffling først. Deretter låses Race My Puffling opp automatisk.',cta:'VELG STARTER-PUFFLING',locked:'🔒 RACE MY PUFFLING — VELG EN PUFFLING FØRST',syncFail:'Kunne ikke bekrefte Puffling-samlingen med serveren. Race ble stoppet for å beskytte inventory.'},
    en:{need:'You need to own at least one Puffling before you can play Race My Puffling.',hint:'Choose a free starter Puffling first. Race My Puffling will then unlock automatically.',cta:'CHOOSE STARTER PUFFLING',locked:'🔒 RACE MY PUFFLING — CHOOSE A PUFFLING FIRST',syncFail:'Could not verify your Puffling collection with the server. Race was stopped to protect inventory.'},
    de:{need:'Du brauchst mindestens einen Puffling, bevor du Race My Puffling spielen kannst.',hint:'Wähle zuerst einen kostenlosen Starter-Puffling. Danach wird Race My Puffling automatisch freigeschaltet.',cta:'STARTER-PUFFLING WÄHLEN',locked:'🔒 RACE MY PUFFLING — ZUERST PUFFLING WÄHLEN',syncFail:'Die Puffling-Sammlung konnte nicht mit dem Server bestätigt werden. Das Rennen wurde zum Schutz des Inventars gestoppt.'},
    es:{need:'Necesitas al menos un Puffling antes de jugar Race My Puffling.',hint:'Elige primero un Puffling inicial gratis. Race My Puffling se desbloqueará automáticamente.',cta:'ELEGIR PUFFLING INICIAL',locked:'🔒 RACE MY PUFFLING — ELIGE UN PUFFLING',syncFail:'No se pudo verificar tu colección de Pufflings con el servidor. La carrera se detuvo para proteger el inventario.'},
    fr:{need:'Vous devez posséder au moins un Puffling avant de jouer à Race My Puffling.',hint:'Choisissez d’abord un Puffling de départ gratuit. Race My Puffling sera ensuite débloqué automatiquement.',cta:'CHOISIR UN PUFFLING DE DÉPART',locked:'🔒 RACE MY PUFFLING — CHOISISSEZ UN PUFFLING',syncFail:'Impossible de vérifier votre collection de Pufflings avec le serveur. La course a été arrêtée pour protéger l’inventaire.'}
  };

  function tr(){try{return COPY[typeof lang==='string'?lang:'no']||COPY.en;}catch(e){return COPY.no;}}
  function ownedIds(){
    try{
      const s=window.SkyPuffFusion?.load?.();
      return Object.entries(s?.owned||{}).filter(([,count])=>Number(count)>0).map(([id])=>id);
    }catch(e){return [];}
  }
  function eligible(){return ownedIds().length>0;}
  function el(id){return document.getElementById(id);}
  function ensurePanel(){
    let panel=el('racePufflingRequired');
    if(panel)return panel;
    const card=document.querySelector('#multiplayerMenu .card');if(!card)return null;
    panel=document.createElement('div');panel.id='racePufflingRequired';
    panel.style.cssText='display:none;margin:12px 0;padding:16px;border-radius:18px;background:rgba(255,244,210,.96);border:2px solid rgba(239,179,45,.45);box-shadow:0 9px 24px rgba(75,55,10,.10);text-align:center';
    panel.innerHTML='<div style="font-size:34px;margin-bottom:5px">🔒☁️</div><div id="racePufflingRequiredTitle" style="font-size:16px;font-weight:1000;color:#624b18"></div><div id="racePufflingRequiredHint" class="small" style="margin:7px 0 12px;color:#705d2b"></div><button id="racePufflingRequiredCta" class="gold" type="button" style="margin:0;width:100%"></button>';
    const status=el('multiplayerStatus');if(status)status.insertAdjacentElement('afterend',panel);else card.appendChild(panel);
    el('racePufflingRequiredCta').onclick=goToPufflings;
    return panel;
  }
  function controls(){
    return [
      typeof quickMatchBtnEl!=='undefined'?quickMatchBtnEl:el('quickMatchBtn'),
      typeof createRoomBtnEl!=='undefined'?createRoomBtnEl:el('createRoomBtn'),
      typeof joinRoomBtnEl!=='undefined'?joinRoomBtnEl:el('joinRoomBtn'),
      typeof roomCodeInputEl!=='undefined'?roomCodeInputEl:el('roomCodeInput')
    ].filter(Boolean);
  }
  function refresh(){
    const ok=eligible(),t=tr(),panel=ensurePanel();
    if(panel){
      panel.style.display=ok?'none':'block';
      const title=el('racePufflingRequiredTitle'),hint=el('racePufflingRequiredHint'),cta=el('racePufflingRequiredCta');
      if(title)title.textContent=t.need;if(hint)hint.textContent=t.hint;if(cta)cta.textContent=t.cta;
    }
    controls().forEach(node=>{node.disabled=!ok;node.style.opacity=ok?'':'0.45';node.style.cursor=ok?'':'not-allowed';});
    const race=el('raceMyPufflingBtn');
    if(race){race.disabled=!ok;race.style.opacity=ok?'':'0.55';race.textContent=ok?'RACE MY PUFFLING 🏁':t.locked;}
    const friendPanel=el('raceFriendLobbyPanel');if(friendPanel&&!ok)friendPanel.style.display='none';
    return ok;
  }
  function deny(){
    const t=tr();
    if(baseOpen)baseOpen();
    if(typeof multiplayerMode!=='undefined')multiplayerMode=false;
    if(typeof multiplayerState!=='undefined')multiplayerState='locked_puffling_required';
    if(typeof running!=='undefined')running=false;
    if(el('multiplayerHud'))el('multiplayerHud').style.display='none';
    if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='flex';
    if(typeof multiplayerStatusEl!=='undefined'&&multiplayerStatusEl)multiplayerStatusEl.textContent=t.need;
    refresh();
    if(typeof showToast==='function')showToast('🔒 '+t.need);
    window.dispatchEvent(new CustomEvent('race:pufflingRequired'));
    return false;
  }
  function requirePuffling(){return eligible()?true:deny();}
  async function syncServerInventory(){
    const sync=window.PufflingTradeInventorySync?.ensure;
    if(typeof sync!=='function')return true;
    try{await sync();return true;}catch(e){
      const t=tr();
      try{window.SkyPuffRaceTransport?.disconnect?.();}catch(_){}
      if(typeof multiplayerMode!=='undefined')multiplayerMode=false;
      if(typeof multiplayerState!=='undefined')multiplayerState='inventory_sync_failed';
      if(typeof running!=='undefined')running=false;
      if(typeof multiplayerHudEl!=='undefined'&&multiplayerHudEl)multiplayerHudEl.style.display='none';
      if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='flex';
      if(typeof multiplayerStatusEl!=='undefined'&&multiplayerStatusEl)multiplayerStatusEl.textContent=t.syncFail;
      if(typeof showToast==='function')showToast('⚠️ '+t.syncFail);
      return false;
    }
  }
  function goToPufflings(){
    try{window.SkyPuffRaceTransport?.disconnect?.();}catch(e){}
    if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='none';
    if(window.SkyPuffStarterChoice?.eligible?.()){window.SkyPuffStarterChoice.open();return;}
    const start=typeof startEl!=='undefined'?startEl:el('start');if(start)start.style.display='flex';
    if(window.SkyPuffMenuCleanup?.openHub){window.SkyPuffMenuCleanup.openHub('pufflings');return;}
    setTimeout(()=>el('pufflingsHubBtn')?.click(),0);
  }

  window.openMultiplayer=function(){
    if(!eligible())return deny();
    const result=baseOpen?.apply(this,arguments);refresh();return result;
  };
  if(baseQuick)window.quickMatch=function(){if(!requirePuffling())return;return baseQuick.apply(this,arguments);};
  window.startMultiplayerRace=async function(){if(!requirePuffling())return false;if(!await syncServerInventory())return false;return baseStart.apply(this,arguments);};

  function bindButtons(){
    const mp=typeof multiplayerBtnEl!=='undefined'?multiplayerBtnEl:el('multiplayerBtn');if(mp)mp.onclick=()=>window.openMultiplayer();
    const quick=typeof quickMatchBtnEl!=='undefined'?quickMatchBtnEl:el('quickMatchBtn');if(quick)quick.onclick=()=>{if(requirePuffling())window.quickMatch?.();};
    const create=typeof createRoomBtnEl!=='undefined'?createRoomBtnEl:el('createRoomBtn');if(create)create.onclick=()=>{if(requirePuffling())window.PufflingRaceMode?.hostRoom?.();};
    const join=typeof joinRoomBtnEl!=='undefined'?joinRoomBtnEl:el('joinRoomBtn');if(join)join.onclick=()=>{if(requirePuffling())window.PufflingRaceMode?.joinRoom?.();};
    const race=el('raceMyPufflingBtn');if(race)race.onclick=()=>{if(requirePuffling())window.openMultiplayer();};
    refresh();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(bindButtons,0));else setTimeout(bindButtons,0);
  [150,500,1200].forEach(ms=>setTimeout(bindButtons,ms));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  window.addEventListener('storage',ev=>{if(ev.key==='skyPuffPufflings')refresh();});
  window.addEventListener('race:pufflingAcquired',refresh);
  window.addEventListener('puffling:starterChosen',refresh);

  window.SkyPuffRaceEligibility={eligible,ownedIds,refresh,requirePuffling,syncServerInventory,goToPufflings};
})();
