/* Orbuff — Race My Orbuff eligibility gate v1.3
 * Race mode is unavailable until the player owns at least one Orbuff.
 * Online Race syncs authoritative inventory before joining.
 * Legacy Puffling identifiers remain for save/API compatibility.
 */
(function(){
  const baseOpen=typeof window.openMultiplayer==='function'?window.openMultiplayer:null;
  const baseQuick=typeof window.quickMatch==='function'?window.quickMatch:null;
  const baseStart=typeof window.startMultiplayerRace==='function'?window.startMultiplayerRace:null;
  if(!baseStart)return;

  const COPY={
    no:{need:'Du må skaffe deg minst én Orbuff før du kan spille Race My Orbuff.',hint:'Velg en gratis starter-Orbuff først. Deretter låses Race My Orbuff opp automatisk.',cta:'VELG STARTER-ORBUFF',locked:'🔒 RACE MY ORBUFF — VELG EN ORBUFF FØRST',syncFail:'Kunne ikke bekrefte Orbuff-samlingen med serveren. Race ble stoppet for å beskytte inventory.'},
    en:{need:'You need to own at least one Orbuff before you can play Race My Orbuff.',hint:'Choose a free starter Orbuff first. Race My Orbuff will then unlock automatically.',cta:'CHOOSE STARTER ORBUFF',locked:'🔒 RACE MY ORBUFF — CHOOSE AN ORBUFF FIRST',syncFail:'Could not verify your Orbuff collection with the server. Race was stopped to protect inventory.'},
    de:{need:'Du brauchst mindestens einen Orbuff, bevor du Race My Orbuff spielen kannst.',hint:'Wähle zuerst einen kostenlosen Starter-Orbuff. Danach wird Race My Orbuff automatisch freigeschaltet.',cta:'STARTER-ORBUFF WÄHLEN',locked:'🔒 RACE MY ORBUFF — ZUERST ORBUFF WÄHLEN',syncFail:'Die Orbuff-Sammlung konnte nicht mit dem Server bestätigt werden. Das Rennen wurde zum Schutz des Inventars gestoppt.'},
    es:{need:'Necesitas al menos un Orbuff antes de jugar Race My Orbuff.',hint:'Elige primero un Orbuff inicial gratis. Race My Orbuff se desbloqueará automáticamente.',cta:'ELEGIR ORBUFF INICIAL',locked:'🔒 RACE MY ORBUFF — ELIGE UN ORBUFF',syncFail:'No se pudo verificar tu colección de Orbuffs con el servidor. La carrera se detuvo para proteger el inventario.'},
    fr:{need:'Vous devez posséder au moins un Orbuff avant de jouer à Race My Orbuff.',hint:'Choisissez d’abord un Orbuff de départ gratuit. Race My Orbuff sera ensuite débloqué automatiquement.',cta:'CHOISIR UN ORBUFF DE DÉPART',locked:'🔒 RACE MY ORBUFF — CHOISISSEZ UN ORBUFF',syncFail:'Impossible de vérifier votre collection d’Orbuffs avec le serveur. La course a été arrêtée pour protéger l’inventaire.'}
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
    el('racePufflingRequiredCta').onclick=goToOrbuffs;
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
    if(race){race.disabled=!ok;race.style.opacity=ok?'':'0.55';race.textContent=ok?'RACE MY ORBUFF 🏁':t.locked;}
    const friendPanel=el('raceFriendLobbyPanel');if(friendPanel&&!ok)friendPanel.style.display='none';
    return ok;
  }
  function deny(){
    const t=tr();
    if(baseOpen)baseOpen();
    if(typeof multiplayerMode!=='undefined')multiplayerMode=false;
    if(typeof multiplayerState!=='undefined')multiplayerState='locked_orbuff_required';
    if(typeof running!=='undefined')running=false;
    if(el('multiplayerHud'))el('multiplayerHud').style.display='none';
    if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='flex';
    if(typeof multiplayerStatusEl!=='undefined'&&multiplayerStatusEl)multiplayerStatusEl.textContent=t.need;
    refresh();
    if(typeof showToast==='function')showToast('🔒 '+t.need);
    window.dispatchEvent(new CustomEvent('race:orbuffRequired'));
    window.dispatchEvent(new CustomEvent('race:pufflingRequired'));
    return false;
  }
  function requireOrbuff(){return eligible()?true:deny();}
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
  function goToOrbuffs(){
    try{window.SkyPuffRaceTransport?.disconnect?.();}catch(e){}
    if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='none';
    if(window.SkyPuffStarterChoice?.eligible?.()){window.SkyPuffStarterChoice.open();return;}
    const start=typeof startEl!=='undefined'?startEl:el('start');if(start)start.style.display='flex';
    if(window.SkyPuffMenuCleanup?.openHub){window.SkyPuffMenuCleanup.openHub('pufflings');return;}
    setTimeout(()=>el('pufflingsHubBtn')?.click(),0);
  }

  window.openMultiplayer=function(){if(!eligible())return deny();const result=baseOpen?.apply(this,arguments);refresh();return result;};
  if(baseQuick)window.quickMatch=function(){if(!requireOrbuff())return;return baseQuick.apply(this,arguments);};
  window.startMultiplayerRace=async function(){if(!requireOrbuff())return false;if(!await syncServerInventory())return false;return baseStart.apply(this,arguments);};

  function bindButtons(){
    const mp=typeof multiplayerBtnEl!=='undefined'?multiplayerBtnEl:el('multiplayerBtn');if(mp)mp.onclick=()=>window.openMultiplayer();
    const quick=typeof quickMatchBtnEl!=='undefined'?quickMatchBtnEl:el('quickMatchBtn');if(quick)quick.onclick=()=>{if(requireOrbuff())window.quickMatch?.();};
    const create=typeof createRoomBtnEl!=='undefined'?createRoomBtnEl:el('createRoomBtn');if(create)create.onclick=()=>{if(requireOrbuff())(window.OrbuffRaceMode||window.PufflingRaceMode)?.hostRoom?.();};
    const join=typeof joinRoomBtnEl!=='undefined'?joinRoomBtnEl:el('joinRoomBtn');if(join)join.onclick=()=>{if(requireOrbuff())(window.OrbuffRaceMode||window.PufflingRaceMode)?.joinRoom?.();};
    const race=el('raceMyPufflingBtn');if(race)race.onclick=()=>{if(requireOrbuff())window.openMultiplayer();};
    refresh();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(bindButtons,0));else setTimeout(bindButtons,0);
  [150,500,1200].forEach(ms=>setTimeout(bindButtons,ms));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  window.addEventListener('storage',ev=>{if(ev.key==='skyPuffPufflings')refresh();});
  window.addEventListener('race:pufflingAcquired',refresh);
  window.addEventListener('race:orbuffAcquired',refresh);
  window.addEventListener('puffling:starterChosen',refresh);
  window.addEventListener('orbuff:starterChosen',refresh);

  const api={eligible,ownedIds,refresh,requireOrbuff,requirePuffling:requireOrbuff,syncServerInventory,goToOrbuffs,goToPufflings:goToOrbuffs};
  window.OrbuffRaceEligibility=api;
  window.SkyPuffRaceEligibility=api;
})();
