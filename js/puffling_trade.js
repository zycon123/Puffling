/* Puffling — secure two-player Puffling Trade v1.0 */
(function(){
 const PLAYER_KEY='pufflingTradePlayerIdV1';
 let ws=null,room='',myOffer='',theirOffer='',theirPlayer='',connected=false,myAccepted=false,theirAccepted=false,pendingTx='';
 const el=id=>document.getElementById(id);
 const F=()=>window.SkyPuffFusion;
 function endpoint(){try{return localStorage.getItem('skyPuffRaceWsUrl')||window.SKY_PUFF_RACE_WS_URL||'';}catch(e){return window.SKY_PUFF_RACE_WS_URL||'';}}
 function playerId(){try{let id=localStorage.getItem(PLAYER_KEY);if(!id){id='trade_'+Math.random().toString(36).slice(2,10);localStorage.setItem(PLAYER_KEY,id);}return id;}catch(e){return 'trade_'+Math.random().toString(36).slice(2,10);}}
 function cleanCode(v){return String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);}
 function newCode(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let out='';for(let i=0;i<6;i++)out+=chars[Math.floor(Math.random()*chars.length)];return out;}
 function allPuffs(){const f=F();return f?[...Object.values(f.BASE||{}),...Object.values(f.FUSIONS||{})]:[];}
 function puff(id){return allPuffs().find(p=>p.id===id)||null;}
 function tradeable(){const f=F(),s=f?.load?.();if(!f||!s)return[];return allPuffs().filter(p=>!p.starterOnly&&f.availableCount(p.id)>0).map(p=>({p,count:s.owned[p.id]||0,available:f.availableCount(p.id)})).sort((a,b)=>String(a.p.name).localeCompare(String(b.p.name)));}
 function status(text,bad=false){const e=el('tradeStatus');if(e){e.textContent=text||'';e.style.color=bad?'#a73535':'#35516b';}}
 function send(m){if(ws&&ws.readyState===WebSocket.OPEN){ws.send(JSON.stringify(m));return true;}return false;}
 function closeSocket(){if(ws){try{ws.close(1000,'leave trade')}catch(e){}}ws=null;connected=false;pendingTx='';}
 function renderOfferSelectors(){
  const select=el('tradeMySelect');if(!select)return;const current=select.value||myOffer;const choices=tradeable();
  select.innerHTML='<option value="">Velg Puffling…</option>'+choices.map(({p,count,available})=>`<option value="${p.id}">${p.icon||'☁️'} ${p.name} — eier x${count}${available!==count?` • ${available} kan trades`:''}</option>`).join('');
  if(choices.some(x=>x.p.id===current))select.value=current;else if(myOffer&&!choices.some(x=>x.p.id===myOffer)){myOffer='';send({type:'trade:cancel'});}
 }
 function render(){
  renderOfferSelectors();
  const mine=puff(myOffer),theirs=puff(theirOffer);
  const my=el('tradeMyOffer');if(my)my.innerHTML=mine?`${mine.icon||'☁️'} <b>${mine.name}</b><br><small>Din tilbudte kopi</small>`:'Velg en Puffling du vil tilby.';
  const other=el('tradeTheirOffer');if(other)other.innerHTML=theirs?`${theirs.icon||'☁️'} <b>${theirs.name}</b><br><small>Motspillerens tilbud</small>`:'Venter på motspillerens tilbud…';
  const accept=el('tradeAcceptBtn');if(accept){accept.disabled=!connected||!myOffer||!theirOffer||myAccepted||!!pendingTx;accept.textContent=myAccepted?'GODKJENT ✓':'GODKJENN BYTTE';}
  const badge=el('tradeAcceptState');if(badge)badge.textContent=`Du: ${myAccepted?'✓':'—'}   •   Motspiller: ${theirAccepted?'✓':'—'}`;
  const code=el('tradeRoomCode');if(code)code.textContent=room||'------';
 }
 function applyState(m){
  const mineId=playerId(),players=Array.isArray(m?.players)?m.players:[];const mine=players.find(p=>p.playerId===mineId),other=players.find(p=>p.playerId!==mineId);
  if(mine){myOffer=mine.offer?.pufflingId||'';myAccepted=!!mine.accepted;}
  if(other){theirPlayer=other.playerId||theirPlayer;theirOffer=other.offer?.pufflingId||'';theirAccepted=!!other.accepted;}
  render();
 }
 function canPrepare(m){
  const mine=(m?.transfers||[]).find(t=>t.from===playerId());if(!mine||!mine.pufflingId)return false;
  const p=puff(mine.pufflingId);return !!p&&!p.starterOnly&&(F()?.availableCount?.(mine.pufflingId)||0)>0;
 }
 function applyCommit(m){
  const mineId=playerId(),transfers=Array.isArray(m?.transfers)?m.transfers:[];
  const outgoing=transfers.find(t=>t.from===mineId),incoming=transfers.find(t=>t.to===mineId);
  if(!outgoing||!incoming||!m.txId)return;
  const f=F(),progress=window.SkyPuffPufflingProgress;if(!f?.tradeTransfer)return;
  const res=f.tradeTransfer(outgoing.pufflingId,incoming.pufflingId,String(m.txId));
  if(!res.ok){send({type:'trade:applyStatus',txId:m.txId,ok:false,reason:res.reason});status('Trade kunne ikke lagres lokalt. Ingen ny trade bør gjøres før samlingen er kontrollert.',true);return;}
  if(!res.duplicate){
    if(res.outgoingRemaining===0)progress?.reset?.(outgoing.pufflingId);
    if(res.incomingWasNew)progress?.reset?.(incoming.pufflingId);
  }
  send({type:'trade:applyStatus',txId:m.txId,ok:true});
  const p=puff(incoming.pufflingId);status(`✅ Trade fullført! Du mottok ${p?.name||incoming.pufflingId}. XP fra avsenderen ble ikke overført.`);
  myOffer='';theirOffer='';myAccepted=false;theirAccepted=false;pendingTx='';
  window.SkyPuffFusionUI?.renderDex?.();render();
 }
 function handle(raw){
  let m;try{m=JSON.parse(raw.data)}catch(e){return;}if(!m?.type)return;
  if(m.type==='trade:matched'){room=m.room||room;connected=true;applyState(m);status((m.players||[]).length>=2?'Venn koblet til. Velg Pufflings.':'Venter på venn…');}
  else if(m.type==='trade:opponentJoined'){theirPlayer=m.player?.playerId||'';connected=true;status('Venn koblet til. Velg Pufflings.');render();}
  else if(m.type==='trade:state')applyState(m);
  else if(m.type==='trade:prepare'){pendingTx=String(m.txId||'');const ok=canPrepare(m);send({type:'trade:prepared',txId:pendingTx,ok});status(ok?'Begge har godkjent — verifiserer samlingen…':'Pufflingen er ikke lenger tilgjengelig.',!ok);render();}
  else if(m.type==='trade:commit')applyCommit(m);
  else if(m.type==='trade:canceled'){pendingTx='';status('Trade ble endret eller avbrutt. Begge må godkjenne på nytt.');}
  else if(m.type==='trade:opponentLeft'){theirPlayer='';theirOffer='';theirAccepted=false;pendingTx='';status('Motspilleren forlot trade-rommet.');render();}
  else if(m.type==='trade:error'){
    pendingTx='';const text=({room_full:'Trade-rommet er fullt.',invalid_room:'Ugyldig trade-kode.',starter_locked:'Starter Pufflings kan ikke trades.',offers_required:'Begge må velge en Puffling først.',inventory_changed:'En tilbudt Puffling er ikke lenger tilgjengelig.',client_apply_failed:'Motspilleren fikk en lokal lagringsfeil.'})[m.code]||'Trade-serveren avviste handlingen.';status(text,true);render();
  }
 }
 function connect(code){
  closeSocket();room=cleanCode(code);myOffer='';theirOffer='';myAccepted=false;theirAccepted=false;theirPlayer='';render();
  const url=endpoint();if(!url){status('Trade krever live Puffling-server. Serveradressen er ikke konfigurert ennå.',true);return;}
  status(`Kobler til trade-rom ${room}…`);try{ws=new WebSocket(url);}catch(e){status('Kunne ikke åpne trade-serveren.',true);return;}
  ws.onopen=()=>send({type:'trade:hello',room,playerId:playerId(),protocol:1});ws.onmessage=handle;ws.onerror=()=>{};ws.onclose=()=>{connected=false;if(el('pufflingTradeMenu')?.style.display!=='none')status('Forbindelsen til trade-serveren ble lukket.',true);render();};
 }
 function setOffer(id){
  id=String(id||'');const p=puff(id);if(!id||!p){myOffer='';send({type:'trade:cancel'});render();return;}
  if(p.starterOnly||F().availableCount(id)<1){status('Denne Pufflingen kan ikke trades.',true);render();return;}
  myOffer=id;myAccepted=false;theirAccepted=false;pendingTx='';send({type:'trade:offer',pufflingId:id,availableCount:F().availableCount(id)});render();
 }
 function accept(){if(!connected||!myOffer||!theirOffer)return;send({type:'trade:accept'});}
 function ensure(){
  if(el('pufflingTradeMenu'))return;
  const style=document.createElement('style');style.id='pufflingTradeCss';style.textContent=`#pufflingTradeMenu{align-items:flex-start;overflow-y:auto;padding:12px}#pufflingTradeMenu .tradeCard{width:min(94vw,620px);margin:auto;max-height:calc(100dvh - 24px);overflow-y:auto}.tradeCode{font-size:36px;font-weight:1000;letter-spacing:5px;color:#285e7f;margin:5px 0 10px}.tradeConnect{display:grid;grid-template-columns:1fr 1fr;gap:8px}.tradeConnect input,.tradeOffer select{width:100%;box-sizing:border-box;padding:12px;border:0;border-radius:12px;background:#fff}.tradeOffers{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 0}.tradeOffer{padding:12px;border-radius:16px;background:rgba(255,255,255,.68);min-height:92px}.tradeOfferTitle{font-size:11px;font-weight:1000;opacity:.65;margin-bottom:7px}.tradeWarning{font-size:11px;line-height:1.45;background:rgba(255,241,190,.8);padding:10px;border-radius:13px;margin:10px 0}@media(max-width:460px){.tradeConnect,.tradeOffers{grid-template-columns:1fr}.tradeCode{font-size:31px}}`;
  document.head.appendChild(style);
  const menu=document.createElement('div');menu.id='pufflingTradeMenu';menu.className='overlay';menu.style.display='none';menu.innerHTML=`<div class="card tradeCard"><h1 style="font-size:34px">Trade Pufflings 🔄</h1><div class="small">Bytt én Puffling mot én Puffling. Begge spillere må godkjenne før serveren fullfører byttet.</div><div class="tradeWarning"><b>Trade-regler:</b> Starter Pufflings og Vault-beskyttede kopier kan ikke trades. XP/evolution følger ikke den tradede kopien. Hvis mottakeren ikke eide Pufflingen fra før starter den på Level 1 / 0 XP.</div><div class="tradeConnect"><button id="tradeCreateBtn" class="gold">LAG TRADE-KODE</button><div style="display:grid;grid-template-columns:1fr auto;gap:6px"><input id="tradeJoinInput" maxlength="6" placeholder="KODE"><button id="tradeJoinBtn" class="secondary" style="margin:0;min-width:78px">BLI MED</button></div></div><div style="margin-top:12px;text-align:center"><div class="small">TRADE-KODE</div><div id="tradeRoomCode" class="tradeCode">------</div><div id="tradeStatus" class="small" style="font-weight:900;min-height:20px">Lag eller bli med i et trade-rom.</div></div><div class="tradeOffers"><div class="tradeOffer"><div class="tradeOfferTitle">DIN PUFFLING</div><select id="tradeMySelect"><option value="">Velg Puffling…</option></select><div id="tradeMyOffer" class="small" style="margin-top:9px"></div></div><div class="tradeOffer"><div class="tradeOfferTitle">MOTSPILLER</div><div id="tradeTheirOffer" class="small"></div></div></div><div id="tradeAcceptState" class="small" style="text-align:center;font-weight:900;margin-bottom:7px"></div><button id="tradeAcceptBtn" class="gold">GODKJENN BYTTE</button><button id="tradeCancelBtn" class="secondary">NULLSTILL TILBUD</button><button id="closePufflingTrade" class="secondary">TILBAKE</button></div>`;document.body.appendChild(menu);
  el('tradeCreateBtn').onclick=()=>connect(newCode());el('tradeJoinBtn').onclick=()=>{const c=cleanCode(el('tradeJoinInput').value);if(c.length!==6)return status('Skriv inn en gyldig 6-tegns trade-kode.',true);connect(c);};el('tradeJoinInput').oninput=e=>e.target.value=cleanCode(e.target.value);el('tradeMySelect').onchange=e=>setOffer(e.target.value);el('tradeAcceptBtn').onclick=accept;el('tradeCancelBtn').onclick=()=>{myOffer='';myAccepted=false;theirAccepted=false;pendingTx='';send({type:'trade:cancel'});render();};el('closePufflingTrade').onclick=()=>{closeSocket();menu.style.display='none';el('start').style.display='flex';};
  let btn=el('tradePufflingBtn');if(!btn){btn=document.createElement('button');btn.id='tradePufflingBtn';btn.className='secondary';btn.textContent='TRADE PUFFLINGS 🔄';btn.onclick=open;const host=el('menuMoreGrid')||document.querySelector('#start .menuActions');host?.appendChild(btn);}render();
 }
 function open(){ensure();el('start').style.display='none';el('pufflingTradeMenu').style.display='flex';status('Lag eller bli med i et trade-rom.');render();}
 window.PufflingTrade={open,ensure,tradeable,connect,setOffer,accept,endpoint,playerId};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,80));else setTimeout(ensure,80);
})();
