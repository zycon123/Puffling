/* Puffling — Race My Puffling multiplayer entry v1.2
 * Compatibility filename retained for the current beta loader.
 */
(function(){
 let lobbyMode='idle';
 let transportBound=false;
 let hostCode='';

 const copy={
  no:{race:'RACE MY PUFFLING 🏁',intro:'Førstemann til 1500m. Spill mot en venn med vennekode eller finn en motstander.',host:'LAG VENNEKODE',join:'BLI MED',placeholder:'VENNEKODE',waiting:'Venter på venn…',share:'Send denne koden til vennen din',copy:'KOPIER KODE',copied:'KOPIERT ✓',shareBtn:'DEL KODE',joining:'Kobler til rom',joined:'Venn koblet til ✓',ready:'Begge er klare — racet starter snart!',invalid:'Skriv inn en gyldig 6-tegns vennekode',copyFail:'Kunne ikke kopiere automatisk',back:'TILBAKE'},
  en:{race:'RACE MY PUFFLING 🏁',intro:'First to 1500m. Race a friend with a code or find an opponent.',host:'CREATE FRIEND CODE',join:'JOIN',placeholder:'FRIEND CODE',waiting:'Waiting for friend…',share:'Send this code to your friend',copy:'COPY CODE',copied:'COPIED ✓',shareBtn:'SHARE CODE',joining:'Connecting to room',joined:'Friend connected ✓',ready:'Both players are ready — race starting soon!',invalid:'Enter a valid 6-character friend code',copyFail:'Could not copy automatically',back:'BACK'},
  de:{race:'RACE MY PUFFLING 🏁',intro:'Wer zuerst 1500 m erreicht, gewinnt. Spiele per Freundescode oder finde einen Gegner.',host:'FREUNDESCODE ERSTELLEN',join:'BEITRETEN',placeholder:'FREUNDESCODE',waiting:'Warte auf Freund…',share:'Sende diesen Code an deinen Freund',copy:'CODE KOPIEREN',copied:'KOPIERT ✓',shareBtn:'CODE TEILEN',joining:'Verbindung zu Raum',joined:'Freund verbunden ✓',ready:'Beide sind bereit — das Rennen startet gleich!',invalid:'Gib einen gültigen 6-stelligen Freundescode ein',copyFail:'Code konnte nicht automatisch kopiert werden',back:'ZURÜCK'},
  es:{race:'RACE MY PUFFLING 🏁',intro:'El primero en llegar a 1500 m gana. Compite con un amigo mediante código o busca rival.',host:'CREAR CÓDIGO',join:'UNIRSE',placeholder:'CÓDIGO',waiting:'Esperando a tu amigo…',share:'Envía este código a tu amigo',copy:'COPIAR CÓDIGO',copied:'COPIADO ✓',shareBtn:'COMPARTIR',joining:'Conectando a la sala',joined:'Amigo conectado ✓',ready:'Ambos están listos — ¡la carrera empieza pronto!',invalid:'Introduce un código válido de 6 caracteres',copyFail:'No se pudo copiar automáticamente',back:'VOLVER'},
  fr:{race:'RACE MY PUFFLING 🏁',intro:'Le premier à 1500 m gagne. Affrontez un ami avec un code ou trouvez un adversaire.',host:'CRÉER UN CODE',join:'REJOINDRE',placeholder:'CODE AMI',waiting:'En attente de votre ami…',share:'Envoyez ce code à votre ami',copy:'COPIER LE CODE',copied:'COPIÉ ✓',shareBtn:'PARTAGER',joining:'Connexion au salon',joined:'Ami connecté ✓',ready:'Les deux joueurs sont prêts — départ imminent !',invalid:'Entrez un code ami valide à 6 caractères',copyFail:'Impossible de copier automatiquement',back:'RETOUR'}
 };
 function tr(){return copy[typeof lang==='string'?lang:'no']||copy.en;}
 function cleanCode(v){return String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);}
 function newCode(){
  if(typeof randomRoomCode==='function')return randomRoomCode();
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<6;i++)s+=chars[Math.floor(Math.random()*chars.length)];return s;
 }
 function el(id){return document.getElementById(id);}
 function ensureFriendPanel(){
  const card=document.querySelector('#multiplayerMenu .card');if(!card)return null;
  let panel=el('raceFriendLobbyPanel');
  if(!panel){
   panel=document.createElement('div');panel.id='raceFriendLobbyPanel';
   panel.style.cssText='display:none;margin:12px 0 4px;padding:15px;border-radius:18px;background:rgba(238,248,255,.92);border:1px solid rgba(83,164,220,.2);box-shadow:0 8px 24px rgba(30,90,135,.10)';
   panel.innerHTML='<div id="raceFriendLobbyLabel" style="font-size:12px;font-weight:900;letter-spacing:.8px;opacity:.68"></div><div id="raceFriendLobbyCode" style="font-size:clamp(34px,11vw,48px);font-weight:1000;letter-spacing:5px;margin:5px 0 8px;color:#245a7a;user-select:all"></div><div id="raceFriendLobbyState" class="small" style="font-weight:850;margin-bottom:11px"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button id="raceCopyCodeBtn" class="secondary" type="button" style="margin:0;min-width:0"></button><button id="raceShareCodeBtn" class="gold" type="button" style="margin:0;min-width:0"></button></div>';
   const status=el('multiplayerStatus');if(status)status.insertAdjacentElement('afterend',panel);else card.appendChild(panel);
   el('raceCopyCodeBtn').onclick=copyCode;
   el('raceShareCodeBtn').onclick=shareCode;
  }
  return panel;
 }
 function setPanel(code,state,visible=true){
  const t=tr(),panel=ensureFriendPanel();if(!panel)return;
  panel.style.display=visible?'block':'none';
  el('raceFriendLobbyLabel').textContent=t.share;
  el('raceFriendLobbyCode').textContent=code||'------';
  el('raceFriendLobbyState').textContent=state||'';
  el('raceCopyCodeBtn').textContent=t.copy;
  el('raceShareCodeBtn').textContent=t.shareBtn;
 }
 function styleBaseMenu(){
  const t=tr(),card=document.querySelector('#multiplayerMenu .card');if(!card)return;
  const h=card.querySelector('h1');if(h){h.textContent=t.race;h.style.fontSize='clamp(28px,8vw,38px)';}
  const quick=typeof quickMatchBtnEl!=='undefined'?quickMatchBtnEl:el('quickMatchBtn');if(quick)quick.textContent=typeof lang==='string'&&lang==='no'?'FINN MOTSTANDER':'QUICK MATCH';
  const create=typeof createRoomBtnEl!=='undefined'?createRoomBtnEl:el('createRoomBtn');if(create)create.textContent=t.host;
  const join=typeof joinRoomBtnEl!=='undefined'?joinRoomBtnEl:el('joinRoomBtn');if(join)join.textContent=t.join;
  const input=typeof roomCodeInputEl!=='undefined'?roomCodeInputEl:el('roomCodeInput');if(input){input.placeholder=t.placeholder;input.maxLength=6;input.setAttribute('autocomplete','off');input.setAttribute('autocapitalize','characters');input.oninput=()=>{input.value=cleanCode(input.value);};}
  if(typeof roomCodeDisplayEl!=='undefined'&&roomCodeDisplayEl){roomCodeDisplayEl.style.display='none';roomCodeDisplayEl.textContent='';}
  const close=typeof closeMultiplayerEl!=='undefined'?closeMultiplayerEl:el('closeMultiplayer');if(close)close.textContent=t.back;
 }
 async function copyCode(){
  if(!hostCode)return;const t=tr(),btn=el('raceCopyCodeBtn');
  let ok=false;
  try{await navigator.clipboard.writeText(hostCode);ok=true;}catch(e){
   try{const ta=document.createElement('textarea');ta.value=hostCode;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();ok=document.execCommand('copy');ta.remove();}catch(_){}
  }
  if(btn){btn.textContent=ok?t.copied:t.copyFail;setTimeout(()=>{if(btn)btn.textContent=t.copy;},1300);}
  if(typeof showToast==='function')showToast(ok?`${t.copied} ${hostCode}`:t.copyFail);
 }
 async function shareCode(){
  if(!hostCode)return;const t=tr();
  const text=`Puffling — Race My Puffling\n${t.placeholder}: ${hostCode}`;
  if(navigator.share){try{await navigator.share({title:'Race My Puffling',text,url:location.href});return;}catch(e){if(e&&e.name==='AbortError')return;}}
  await copyCode();
 }
 function keepLobbyVisible(){
  if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='flex';
  const hud=typeof multiplayerHudEl!=='undefined'?multiplayerHudEl:el('multiplayerHud');if(hud)hud.style.display='none';
 }
 function hostRoom(){
  const t=tr();hostCode=newCode();lobbyMode='host';
  multiplayerRoom=hostCode;multiplayerState='waiting';
  if(typeof multiplayerStatusEl!=='undefined'&&multiplayerStatusEl)multiplayerStatusEl.textContent=t.waiting;
  setPanel(hostCode,t.waiting,true);
  if(typeof startMultiplayerRace==='function'){
   startMultiplayerRace('friend');
   setTimeout(()=>{keepLobbyVisible();setPanel(hostCode,t.waiting,true);if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.waiting;},0);
  }
 }
 function joinRoom(){
  const t=tr(),input=typeof roomCodeInputEl!=='undefined'?roomCodeInputEl:el('roomCodeInput');
  const code=cleanCode(input?.value);
  if(code.length!==6){if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.invalid;if(input)input.focus();return;}
  hostCode='';lobbyMode='join';multiplayerRoom=code;multiplayerState='connecting';setPanel('', '',false);
  if(multiplayerStatusEl)multiplayerStatusEl.textContent=`${t.joining} ${code}…`;
  if(typeof startMultiplayerRace==='function'){
   startMultiplayerRace('friend');
   setTimeout(()=>{keepLobbyVisible();if(multiplayerStatusEl)multiplayerStatusEl.textContent=`${t.joining} ${code}…`;},0);
  }
 }
 function bindTransport(){
  if(transportBound)return;const T=window.SkyPuffRaceTransport;if(!T)return;transportBound=true;
  T.on('race:opponentJoined',()=>{
   const t=tr();if(lobbyMode==='host'){setPanel(hostCode,t.joined,true);if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.joined;}
  });
  T.on('race:ready',()=>{
   const t=tr();if(lobbyMode==='host')setPanel(hostCode,t.ready,true);if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.ready;
  });
  T.on('race:matched',m=>{
   const t=tr();
   if(lobbyMode==='join'&&Array.isArray(m?.players)&&m.players.length>=1){if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.joined;}
  });
  T.on('race:start',()=>{
   lobbyMode='racing';
   if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='none';
   setPanel('', '',false);
   const hud=typeof multiplayerHudEl!=='undefined'?multiplayerHudEl:el('multiplayerHud');if(hud)hud.style.display='block';
  });
  T.on('race:error',m=>{
   if(lobbyMode!=='host'&&lobbyMode!=='join')return;
   const msg=m?.code==='room_full'?'Rommet er fullt.':m?.code==='resume_expired'?'Rommet finnes ikke lenger.':'Kunne ikke koble til rommet.';
   if(multiplayerStatusEl)multiplayerStatusEl.textContent=msg;
  });
 }
 function ensure(){
  styleBaseMenu();ensureFriendPanel();bindTransport();
  let b=el('stealMyPufflingBtn')||el('raceMyPufflingBtn');
  if(!b){b=document.createElement('button');b.className='gold';}
  b.id='raceMyPufflingBtn';b.textContent=tr().race;
  b.onclick=()=>{if(typeof openMultiplayer==='function')openMultiplayer();setTimeout(()=>{styleBaseMenu();if(multiplayerStatusEl)multiplayerStatusEl.textContent=tr().intro;},0);};
  const card=document.querySelector('#multiplayerMenu .card');if(card){const close=el('closeMultiplayer');if(b.parentElement!==card)card.insertBefore(b,close||null);b.style.marginTop='12px';}
  const create=typeof createRoomBtnEl!=='undefined'?createRoomBtnEl:el('createRoomBtn');if(create)create.onclick=hostRoom;
  const join=typeof joinRoomBtnEl!=='undefined'?joinRoomBtnEl:el('joinRoomBtn');if(join)join.onclick=joinRoom;
 }
 function removeLegacyCopy(){
  const old=el('stealMyPuffResult');if(old)old.remove();
  document.querySelectorAll('button').forEach(btn=>{if(/STEAL MY PUFFLING|STJEL PUFFLING/i.test(btn.textContent||''))btn.style.display='none';});
 }
 const originalOpen=typeof openMultiplayer==='function'?openMultiplayer:null;
 if(originalOpen){
  openMultiplayer=function(){lobbyMode='idle';hostCode='';originalOpen();styleBaseMenu();setPanel('', '',false);if(multiplayerStatusEl)multiplayerStatusEl.textContent=tr().intro;};
  const mp=typeof multiplayerBtnEl!=='undefined'?multiplayerBtnEl:el('multiplayerBtn');if(mp)mp.onclick=openMultiplayer;
 }
 function open(){if(typeof openMultiplayer==='function')openMultiplayer();setTimeout(()=>el('raceMyPufflingBtn')?.focus(),50);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{ensure();removeLegacyCopy();},100));else setTimeout(()=>{ensure();removeLegacyCopy();},100);
 window.PufflingRaceMode={ensure,open,hostRoom,joinRoom};
 window.PufflingStealMode={ensure,open};
})();