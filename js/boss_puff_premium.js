(function(){
 const premiumCatalog=[];
 const groups=[
  ['headwear',['Royal Crown','Neon Crown','Dragon Horns','Crystal Horns','Galaxy Helm','Storm Helm','Ice Tiara','Fire Tiara','Angel Wings','Devil Horns','Cyber Visor','Pirate Hat','Samurai Helm','Knight Helm','Space Helmet','Wizard Crown','Flower Crown','Candy Crown','Golden Halo','Meteor Crown']],
  ['aura',['Solar Flare','Lunar Glow','Black Hole','Electric Storm','Frozen Mist','Inferno','Emerald Pulse','Ruby Pulse','Sapphire Pulse','Diamond Spark','Cosmic Dust','Pixel Burst','Retro Wave','Royal Glow','Ghost Mist','Dragon Fire','Aurora Max','Starfall','Rainbow Nova','Void Energy']],
  ['eyes',['Laser Eyes','Heart Eyes','Galaxy Eyes','Fire Eyes','Ice Eyes','Lightning Eyes','Star Eyes','Pixel Eyes','Robot Eyes','Cat Eyes','Dragon Eyes','Sleepy Glow','Diamond Eyes','Golden Eyes','Void Eyes','Retro Shades','Monocle','Royal Eyes','Storm Eyes','Candy Eyes']],
  ['face',['Hero Smile','Boss Grin','Battle Face','Cute Face','Mischief','Shocked','Focused','Sleepy','Royal Smile','Cyber Face','Dragon Face','Ghost Face','Pixel Face','Retro Face','Galaxy Face','Fire Face','Ice Face','Storm Face','Candy Face','Legend Face']],
  ['body',['Royal Puff','Dragon Puff','Galaxy Puff','Cyber Puff','Crystal Puff','Fire Puff','Ice Puff','Storm Puff','Candy Puff','Neon Puff','Shadow Puff','Golden Puff','Diamond Puff','Knight Puff','Wizard Puff','Angel Puff','Demon Puff','Pixel Puff','Retro Puff','Legend Puff']]
 ];
 groups.forEach(([type,names])=>names.forEach((name,i)=>premiumCatalog.push({id:`premium_${type}_${String(i+1).padStart(2,'0')}`,type,name,sku:`skypuff.creator.${type}.${String(i+1).padStart(2,'0')}`,premium:true})));
 const txt={
  no:{title:'Premium Creator',intro:'100 eksklusive accessories og stiler. Kjøp aktiveres når betalingsløsningen er koblet til.',open:'PREMIUM CREATOR',buy:'KJØP',soon:'Betaling er ikke aktivert i beta ennå.',back:'TILBAKE'},
  en:{title:'Premium Creator',intro:'100 exclusive accessories and styles. Purchases activate when the payment provider is connected.',open:'PREMIUM CREATOR',buy:'BUY',soon:'Payments are not enabled in the beta yet.',back:'BACK'},
  de:{title:'Premium Creator',intro:'100 exklusive Accessoires und Stile. Käufe werden nach Anbindung der Zahlung aktiviert.',open:'PREMIUM CREATOR',buy:'KAUFEN',soon:'Zahlungen sind in der Beta noch nicht aktiviert.',back:'ZURÜCK'},
  es:{title:'Premium Creator',intro:'100 accesorios y estilos exclusivos. Las compras se activarán al conectar el sistema de pago.',open:'PREMIUM CREATOR',buy:'COMPRAR',soon:'Los pagos aún no están activados en la beta.',back:'VOLVER'},
  fr:{title:'Premium Creator',intro:'100 accessoires et styles exclusifs. Les achats seront activés après connexion du paiement.',open:'PREMIUM CREATOR',buy:'ACHETER',soon:'Les paiements ne sont pas encore activés dans la bêta.',back:'RETOUR'}
 };
 let overlay=null;
 function T(){return txt[typeof lang==='string'?lang:'en']||txt.en;}
 async function purchase(item){
  const provider=window.skyPuffPremiumPurchaseProvider;
  if(provider&&typeof provider.purchase==='function'){
   try{const result=await provider.purchase(item.sku,item);if(result&&result.ok){showToast('Premium unlocked ✨');return true;}}catch(e){console.warn('Premium purchase failed',e);}
  }
  showToast(T().soon);return false;
 }
 function ensure(){
  if(overlay)return;
  overlay=document.createElement('div');overlay.id='bossPuffPremium';overlay.className='overlay';overlay.style.display='none';overlay.style.zIndex='30';
  const card=document.createElement('div');card.className='card';card.style.cssText='width:min(92vw,440px);max-height:90vh;overflow:auto';
  const title=document.createElement('h1');title.style.fontSize='30px';
  const intro=document.createElement('div');intro.className='small';intro.style.marginBottom='12px';
  const tabs=document.createElement('div');tabs.style.cssText='display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:10px 0';
  const list=document.createElement('div');list.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:left';
  const back=document.createElement('button');back.className='secondary';back.style.marginTop='14px';back.onclick=()=>{overlay.style.display='none';const creator=document.getElementById('bossPuffCreator');if(creator)creator.style.display='flex';};
  card.append(title,intro,tabs,list,back);overlay.appendChild(card);document.body.appendChild(overlay);overlay._r={title,intro,tabs,list,back};
 }
 function render(type='headwear'){
  ensure();const t=T();overlay._r.title.textContent='✨ '+t.title;overlay._r.intro.textContent=t.intro;overlay._r.back.textContent=t.back;overlay._r.tabs.innerHTML='';overlay._r.list.innerHTML='';
  ['headwear','aura','eyes','face','body'].forEach(g=>{const b=document.createElement('button');b.className='secondary';b.style.cssText='width:auto;padding:8px 10px;font-size:12px';b.textContent=g.toUpperCase();b.onclick=()=>render(g);overlay._r.tabs.appendChild(b);});
  premiumCatalog.filter(x=>x.type===type).forEach(item=>{const b=document.createElement('button');b.className='secondary';b.style.cssText='min-height:68px;padding:8px;font-size:12px';b.innerHTML=`<strong>🔒 ${item.name}</strong><br><span style="opacity:.75">PREMIUM • ${item.sku.split('.').pop()}</span>`;b.onclick=()=>purchase(item);overlay._r.list.appendChild(b);});
 }
 function open(){render('headwear');const creator=document.getElementById('bossPuffCreator');if(creator)creator.style.display='none';overlay.style.display='flex';}
 function addButton(){
  const creator=document.getElementById('bossPuffCreator');if(!creator)return false;const card=creator.querySelector('.card');if(!card)return false;
  let b=document.getElementById('bossPuffPremiumBtn');if(!b){b=document.createElement('button');b.id='bossPuffPremiumBtn';b.className='gold';b.style.marginTop='10px';b.onclick=open;const back=card.querySelector('button.secondary:last-child');if(back)card.insertBefore(b,back);else card.appendChild(b);}b.textContent='✨ '+T().open;return true;
 }
 let tries=0;const timer=setInterval(()=>{tries++;if(addButton()||tries>80)clearInterval(timer);},250);
 if(typeof languageSelectEl!=='undefined'&&languageSelectEl)languageSelectEl.addEventListener('change',()=>setTimeout(addButton,0));
 window.skyPuffPremiumCreator={catalog:premiumCatalog,open,purchase,productCount:premiumCatalog.length,setPurchaseProvider(provider){window.skyPuffPremiumPurchaseProvider=provider;}};
})();