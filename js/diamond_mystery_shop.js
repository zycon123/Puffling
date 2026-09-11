/* Puffling — Diamond Mystery Shop + Mystery Vault v0.4 */
(function(){
 const KEY='skyPuffDiamonds',BOX_KEY='skyPuffMysteryBoxesV1';
 const COST=25;
 const bundles=[{count:1,cost:25},{count:3,cost:75},{count:10,cost:250}];
 const eggFusionChances=[
  {tier:'rare',label:'Rare Puffling Egg',weight:70},
  {tier:'epic',label:'Epic Puffling Egg',weight:25},
  {tier:'legendary',label:'Legendary Puffling Egg',weight:5}
 ];
 const get=()=>{const n=Number(localStorage.getItem(KEY));return Number.isFinite(n)?Math.max(0,Math.floor(n)):0;};
 const set=v=>{localStorage.setItem(KEY,String(Math.max(0,Math.floor(v))));refresh();};
 const add=n=>{set(get()+Math.max(0,Math.floor(n)));return get();};
 function spend(n){n=Math.max(0,Math.floor(n));if(get()<n)return false;set(get()-n);return true;}
 const boxCount=()=>{const n=Number(localStorage.getItem(BOX_KEY));return Number.isFinite(n)?Math.max(0,Math.floor(n)):0;};
 function setBoxes(v){const n=Math.max(0,Math.floor(Number(v)||0));localStorage.setItem(BOX_KEY,String(n));refresh();return n;}
 function addBoxes(n){return setBoxes(boxCount()+Math.max(0,Math.floor(Number(n)||0)));}
 function takeBoxes(n){n=Math.max(0,Math.floor(Number(n)||0));const have=boxCount();if(have<n)return false;setBoxes(have-n);return true;}
 const rewards=[
  {id:'coins500',label:'500 Coins',weight:38,type:'coins',amount:500},
  {id:'fusionCrystal',label:'Fusion Crystal',weight:26,type:'item',amount:1},
  {id:'rareEgg',label:'Rare Puffling Egg',weight:18,type:'egg',tier:'rare'},
  {id:'epicEgg',label:'Epic Puffling Egg',weight:11,type:'egg',tier:'epic'},
  {id:'legendaryEgg',label:'Legendary Puffling Egg',weight:6,type:'egg',tier:'legendary'},
  {id:'legendaryPuff',label:'Random Legendary Puffling',weight:1,type:'legendaryPuff'}
 ];
 function weightedRoll(list){const total=list.reduce((n,x)=>n+(Number(x.weight)||0),0);let x=Math.random()*total;for(const item of list){x-=Number(item.weight)||0;if(x<0)return item;}return list[0];}
 function roll(){return weightedRoll(rewards);}
 function rollFusionEgg(){return weightedRoll(eggFusionChances);}
 function addEgg(tier,count=1){
  if(window.SkyPuffNurseryVault?.addEgg){window.SkyPuffNurseryVault.addEgg(tier,count);return true;}
  try{const k='skyPuffPendingEggsV1',v=JSON.parse(localStorage.getItem(k)||'{}');v[tier]=(v[tier]||0)+Math.max(1,count|0);localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}
 }
 function grant(r){const F=window.SkyPuffFusion;
  if(r.type==='coins'){if(typeof save!=='undefined'){save.bank=(save.bank||0)+r.amount;persist?.();refreshMenu?.();}}
  else if(r.type==='egg')addEgg(r.tier,1);
  else if(r.type==='legendaryPuff'&&F){const leg=[...Object.values(F.BASE||{}),...Object.values(F.FUSIONS||{})].filter(p=>p.rarity==='legendary'&&!p.starterOnly).map(p=>p.id),id=leg[Math.floor(Math.random()*leg.length)];if(id)F.add(id,1);window.SkyPuffFusionUI?.renderDex?.();}
  else{try{const k='skyPuffItemsV1',v=JSON.parse(localStorage.getItem(k)||'{}');v[r.id]=(v[r.id]||0)+(r.amount||1);localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
 }
 function result(text){const out=document.getElementById('diamondBoxResult');if(out)out.textContent=text||'';}
 function buyBoxes(count){
  const bundle=bundles.find(x=>x.count===Number(count));if(!bundle)return false;
  if(!spend(bundle.cost)){result(`Du trenger ${bundle.cost} diamanter 💎`);return false;}
  addBoxes(bundle.count);result(`🔐 ${bundle.count} Mystery Box${bundle.count===1?'':'er'} lagt i Mystery Vault.`);if(typeof showToast==='function')showToast(`+${bundle.count} Mystery Box${bundle.count===1?'':'er'} 🔐`);refresh();return true;
 }
 function openBox(){
  if(!takeBoxes(1)){result('Mystery Vault er tomt.');return null;}
  const r=roll();grant(r);result(r.type==='egg'?`🎁 ${r.label}! Lagt i Nursery 🥚`:`🎁 ${r.label}!`);if(typeof showToast==='function')showToast(`Mystery Box: ${r.label}!`);refresh();return r;
 }
 function combineBoxes(){
  if(boxCount()<3){result('Du trenger 3 uåpnede Mystery Boxer for å lage et egg.');return null;}
  if(!takeBoxes(3))return null;
  const egg=rollFusionEgg();addEgg(egg.tier,1);result(`✨ 3 Mystery Boxer ble til ${egg.label}! Egget ligger i Nursery.`);if(typeof showToast==='function')showToast(`🥚 ${egg.label} lagt i Nursery!`);refresh();return egg;
 }
 function ensure(){
  if(document.getElementById('mysteryShopMenu'))return;
  const style=document.createElement('style');style.id='mysteryVaultCss';style.textContent=`#mysteryBoxBundles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}#mysteryBoxBundles button{min-width:0!important;margin:0!important;padding:10px 4px!important;font-size:11px!important}.mysteryVaultBox{margin:14px 0;padding:13px;border-radius:17px;background:linear-gradient(145deg,rgba(223,239,255,.96),rgba(240,228,255,.94));border:2px solid rgba(104,112,210,.18)}.mysteryVaultCount{font-size:27px;font-weight:1000;margin:4px 0 9px}.mysteryVaultActions{display:grid;grid-template-columns:1fr 1fr;gap:7px}.mysteryVaultActions button{min-width:0!important;margin:0!important;padding:10px 5px!important;font-size:11px!important}@media(max-width:420px){#mysteryBoxBundles{grid-template-columns:1fr}.mysteryVaultActions{grid-template-columns:1fr}}`;
  document.head.appendChild(style);
  const el=document.createElement('div');el.id='mysteryShopMenu';el.className='overlay';el.style.display='none';el.innerHTML=`<div class="card" style="max-width:540px;max-height:92dvh;overflow-y:auto"><h1 style="font-size:34px">Mystery Shop 💎</h1><div style="font-size:24px;font-weight:1000;margin:8px 0">💎 <span id="diamondBalance">0</span></div><div class="small" style="margin-bottom:10px">Kjøpte Mystery Boxer lagres uåpnet i Mystery Vault.</div><div id="mysteryBoxBundles"><button class="gold" data-buy-boxes="1">1 BOX<br>${bundles[0].cost} 💎</button><button class="gold" data-buy-boxes="3">3 BOXER<br>${bundles[1].cost} 💎</button><button class="gold" data-buy-boxes="10">10 BOXER<br>${bundles[2].cost} 💎</button></div><div class="mysteryVaultBox"><div style="font-size:12px;font-weight:1000;letter-spacing:.7px;opacity:.68">🔐 MYSTERY VAULT</div><div class="mysteryVaultCount">🎁 x<span id="mysteryBoxCount">0</span></div><div class="small" style="margin-bottom:9px">Åpne én vanlig Mystery Box, eller kombiner 3 uåpnede boxer til ett garantert Puffling-egg.</div><div class="mysteryVaultActions"><button id="openMysteryBox" class="secondary">ÅPNE 1 BOX</button><button id="combineMysteryBoxes" class="gold">3 BOXER → 🥚</button></div></div><div id="diamondBoxResult" style="margin:12px 0;font-weight:900;min-height:18px"></div><div style="text-align:left;background:rgba(255,255,255,.6);padding:12px;border-radius:14px;font-size:12px;line-height:1.55"><b>Vanlig Mystery Box</b><br>500 Coins — 38%<br>Fusion Crystal — 26%<br>Rare Puffling Egg — 18%<br>Epic Puffling Egg — 11%<br>Legendary Puffling Egg — 6%<br>Random Legendary Puffling — 1%<br><br><b>3 Boxer → garantert egg</b><br>Rare Puffling Egg — 70%<br>Epic Puffling Egg — 25%<br>Legendary Puffling Egg — 5%</div><div class="small" style="margin-top:10px;opacity:.72">Betalingspakker med ekte penger er ikke aktivert for tilfeldige rewards i denne betaen.</div><button id="closeMysteryShop" class="secondary" style="margin-top:12px">TILBAKE</button></div>`;document.body.appendChild(el);
  el.querySelectorAll('[data-buy-boxes]').forEach(b=>b.onclick=()=>buyBoxes(Number(b.dataset.buyBoxes)));
  document.getElementById('openMysteryBox').onclick=openBox;document.getElementById('combineMysteryBoxes').onclick=combineBoxes;
  document.getElementById('closeMysteryShop').onclick=()=>{el.style.display='none';document.getElementById('start').style.display='flex';};
  const btn=document.createElement('button');btn.id='mysteryShopBtn';btn.className='gold';btn.textContent='MYSTERY SHOP 💎';btn.onclick=open;const more=document.getElementById('menuMoreGrid')||document.querySelector('#start .menuActions');more?.appendChild(btn);refresh();
 }
 function refresh(){
  const d=document.getElementById('diamondBalance');if(d)d.textContent=get();
  const b=document.getElementById('mysteryBoxCount');if(b)b.textContent=boxCount();
  const openBtn=document.getElementById('openMysteryBox');if(openBtn)openBtn.disabled=boxCount()<1;
  const combineBtn=document.getElementById('combineMysteryBoxes');if(combineBtn)combineBtn.disabled=boxCount()<3;
 }
 function open(){ensure();document.getElementById('start').style.display='none';document.getElementById('mysteryShopMenu').style.display='flex';result('');refresh();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,20));else setTimeout(ensure,20);
 window.SkyPuffDiamonds={get,set,add,spend};
 window.SkyPuffMysteryShop={open,roll,rewards,cost:COST,bundles,boxCount,setBoxes,addBoxes,takeBoxes,buyBoxes,openBox,combineBoxes,rollFusionEgg,eggFusionChances};
})();
