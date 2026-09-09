/* Sky Puff — Diamond Mystery Shop v0.2 */
(function(){
 const KEY='skyPuffDiamonds';
 const COST=25;
 const get=()=>Math.max(0,+localStorage.getItem(KEY)||0);
 const set=v=>{localStorage.setItem(KEY,String(Math.max(0,Math.floor(v))));refresh();};
 const add=n=>{set(get()+Math.max(0,Math.floor(n)));return get();};
 function spend(n){n=Math.max(0,Math.floor(n));if(get()<n)return false;set(get()-n);return true;}
 const rewards=[
  {id:'coins500',label:'500 Coins',weight:35,type:'coins',amount:500},
  {id:'fusionCrystal',label:'Fusion Crystal',weight:24,type:'item',amount:1},
  {id:'rareEgg',label:'Rare Puffling Egg',weight:18,type:'egg',tier:'rare'},
  {id:'epicEgg',label:'Epic Puffling Egg',weight:10,type:'egg',tier:'epic'},
  {id:'vaultShield',label:'Vault Shield',weight:7,type:'item',amount:1},
  {id:'legendaryEgg',label:'Legendary Puffling Egg',weight:5,type:'egg',tier:'legendary'},
  {id:'legendaryPuff',label:'Random Legendary Puffling',weight:1,type:'legendaryPuff'}
 ];
 function roll(){let x=Math.random()*100;for(const r of rewards){x-=r.weight;if(x<0)return r;}return rewards[0];}
 function grant(r){const F=window.SkyPuffFusion;
  if(r.type==='coins'){if(typeof save!=='undefined'){save.bank=(save.bank||0)+r.amount;persist?.();refreshMenu?.();}}
  else if(r.type==='egg'){if(window.SkyPuffNurseryVault?.addEgg)window.SkyPuffNurseryVault.addEgg(r.tier,1);else{try{const k='skyPuffPendingEggsV1',v=JSON.parse(localStorage.getItem(k)||'{}');v[r.tier]=(v[r.tier]||0)+1;localStorage.setItem(k,JSON.stringify(v));}catch(e){}}}
  else if(r.type==='legendaryPuff'&&F){const leg=['eclipse','neonstorm'],id=leg[Math.floor(Math.random()*leg.length)];F.add(id,1);window.SkyPuffFusionUI?.renderDex?.();}
  else{try{const k='skyPuffItemsV1',v=JSON.parse(localStorage.getItem(k)||'{}');v[r.id]=(v[r.id]||0)+(r.amount||1);localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
 }
 function ensure(){if(document.getElementById('mysteryShopMenu'))return;const el=document.createElement('div');el.id='mysteryShopMenu';el.className='overlay';el.style.display='none';el.innerHTML=`<div class="card" style="max-width:520px"><h1 style="font-size:34px">Mystery Shop 💎</h1><div style="font-size:24px;font-weight:1000;margin:8px 0">💎 <span id="diamondBalance">0</span></div><div class="small" style="margin-bottom:12px">Mystery Box koster ${COST} diamanter. Egg legges i Nursery og klekkes når du vil.</div><button id="buyDiamondBox" class="gold">KJØP MYSTERY BOX • ${COST} 💎</button><div id="diamondBoxResult" style="margin:14px 0;font-weight:900"></div><div style="text-align:left;background:rgba(255,255,255,.6);padding:12px;border-radius:14px;font-size:12px;line-height:1.55"><b>Drop-sjanser</b><br>500 Coins — 35%<br>Fusion Crystal — 24%<br>Rare Puffling Egg — 18%<br>Epic Puffling Egg — 10%<br>Vault Shield — 7%<br>Legendary Puffling Egg — 5%<br>Random Legendary Puffling — 1%</div><button id="closeMysteryShop" class="secondary" style="margin-top:12px">TILBAKE</button></div>`;document.body.appendChild(el);
  document.getElementById('buyDiamondBox').onclick=buy;document.getElementById('closeMysteryShop').onclick=()=>{el.style.display='none';document.getElementById('start').style.display='flex';};
  const btn=document.createElement('button');btn.id='mysteryShopBtn';btn.className='gold';btn.textContent='MYSTERY SHOP 💎';btn.onclick=open;const more=document.getElementById('menuMoreGrid')||document.querySelector('#start .menuActions');more?.appendChild(btn);refresh();}
 function refresh(){const e=document.getElementById('diamondBalance');if(e)e.textContent=get();}
 function open(){ensure();document.getElementById('start').style.display='none';document.getElementById('mysteryShopMenu').style.display='flex';refresh();}
 function buy(){const out=document.getElementById('diamondBoxResult');if(!spend(COST)){if(out)out.textContent=`Du trenger ${COST} diamanter 💎`;return;}const r=roll();grant(r);if(out)out.textContent=r.type==='egg'?`🎁 ${r.label}! Lagt i Nursery 🥚`:`🎁 ${r.label}!`;if(typeof showToast==='function')showToast(`Mystery Box: ${r.label}!`);refresh();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,20));else setTimeout(ensure,20);
 window.SkyPuffDiamonds={get,set,add,spend};window.SkyPuffMysteryShop={open,roll,rewards,cost:COST};
})();