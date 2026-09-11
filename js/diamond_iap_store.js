/* Puffling — Diamond Store / native IAP scaffold v1.0
 * Real-money purchases are intentionally disabled in the web beta.
 * A native App Store / Google Play bridge AND server verification endpoint
 * must both be available before a purchase can grant diamonds.
 */
(function(){
  const RECEIPT_KEY='pufflingIapReceiptsV1';
  const CATALOG=[
    {id:'puffling.diamonds.100',diamonds:100,label:'100 Diamonds',tag:'Starter'},
    {id:'puffling.diamonds.300',diamonds:300,label:'300 Diamonds',tag:'Popular'},
    {id:'puffling.diamonds.750',diamonds:750,label:'750 Diamonds',tag:'Bonus'},
    {id:'puffling.diamonds.1600',diamonds:1600,label:'1 600 Diamonds',tag:'Great value'},
    {id:'puffling.diamonds.3500',diamonds:3500,label:'3 500 Diamonds',tag:'Best value'}
  ];
  let productMeta=new Map();
  let busy=false;

  function bridge(){return window.PufflingIAP||null;}
  function verifyUrl(){return String(window.skyPuffConfig?.iapVerifyUrl||window.SKY_PUFF_IAP_VERIFY_URL||'').trim();}
  function platform(){
    const b=bridge();
    try{return String(typeof b?.getPlatform==='function'?b.getPlatform():b?.platform||'web').toLowerCase();}catch(e){return 'web';}
  }
  function bridgeReady(){
    const b=bridge();
    if(!b||typeof b.purchase!=='function'||typeof b.loadProducts!=='function')return false;
    try{return typeof b.isAvailable==='function'?!!b.isAvailable():b.isAvailable!==false;}catch(e){return false;}
  }
  function canPurchase(){return bridgeReady()&&!!verifyUrl()&&['ios','android'].includes(platform());}
  function status(){return {bridgeReady:bridgeReady(),verifyReady:!!verifyUrl(),platform:platform(),canPurchase:canPurchase(),busy};}
  function receipts(){try{const v=JSON.parse(localStorage.getItem(RECEIPT_KEY)||'[]');return Array.isArray(v)?v.slice(-200):[];}catch(e){return [];}}
  function rememberReceipt(tx){const id=String(tx||'');if(!id)return;const arr=receipts();if(!arr.includes(id)){arr.push(id);try{localStorage.setItem(RECEIPT_KEY,JSON.stringify(arr.slice(-200)));}catch(e){}}}
  function hasReceipt(tx){return receipts().includes(String(tx||''));}
  function catalog(){return CATALOG.map(p=>({...p,...(productMeta.get(p.id)||{})}));}
  function setMessage(text,type='info'){
    const el=typeof document!=='undefined'?document.getElementById('diamondStoreStatus'):null;if(!el)return;
    el.textContent=text||'';el.dataset.type=type;
  }
  function render(){
    if(typeof document==='undefined')return;
    const list=document.getElementById('diamondStoreProducts');if(!list)return;
    const s=status();list.innerHTML='';
    catalog().forEach(p=>{
      const btn=document.createElement('button');btn.className='diamondIapPack';btn.disabled=!s.canPurchase||busy;
      const price=p.displayPrice||p.priceLabel||(s.platform==='web'?'Kun i app':'Pris lastes fra butikk');
      btn.innerHTML=`<span class="diamondIapAmount">💎 ${p.diamonds.toLocaleString('nb-NO')}</span><span class="diamondIapTag">${p.tag||''}</span><span class="diamondIapPrice">${price}</span>`;
      btn.onclick=()=>purchase(p.id);list.appendChild(btn);
    });
    const bal=document.getElementById('diamondStoreBalance');if(bal)bal.textContent=window.SkyPuffDiamonds?.get?.()??0;
    const state=document.getElementById('diamondStoreAvailability');if(state){
      if(s.canPurchase)state.textContent=`${s.platform==='ios'?'App Store':'Google Play'} klar`;
      else if(s.platform==='web')state.textContent='Kjøp med ekte penger er deaktivert i web-betaen.';
      else if(!s.bridgeReady)state.textContent='Butikkbro mangler i denne app-builden.';
      else if(!s.verifyReady)state.textContent='Kvitteringsverifisering er ikke koblet til ennå.';
      else state.textContent='Betaling er ikke tilgjengelig akkurat nå.';
    }
  }
  async function refreshProducts(){
    const b=bridge();if(!bridgeReady())return catalog();
    try{
      const rows=await b.loadProducts(CATALOG.map(p=>p.id));
      if(Array.isArray(rows))for(const row of rows){const id=String(row?.productId||row?.id||'');if(CATALOG.some(p=>p.id===id))productMeta.set(id,{displayPrice:String(row.displayPrice||row.localizedPrice||''),currencyCode:String(row.currencyCode||''),title:String(row.title||'')});}
    }catch(e){console.warn('Puffling IAP product metadata failed',e);}
    render();return catalog();
  }
  async function verifyPurchase(purchaseResult,product){
    const url=verifyUrl();if(!url)throw new Error('verification_not_configured');
    const payload={
      productId:product.id,
      expectedDiamonds:product.diamonds,
      platform:platform(),
      transactionId:String(purchaseResult?.transactionId||purchaseResult?.purchaseToken||''),
      verificationData:purchaseResult?.verificationData||purchaseResult?.receipt||purchaseResult?.purchaseToken||null,
      appVersion:String(window.SKY_PUFF_VERSION||window.skyPuffConfig?.version||''),
      playerId:String(localStorage.getItem('skyPuffRacePlayerId')||'')
    };
    if(!payload.transactionId||!payload.verificationData)throw new Error('invalid_purchase_payload');
    const res=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
    if(!res.ok)throw new Error(`verification_http_${res.status}`);
    const data=await res.json();
    if(!data?.ok)throw new Error(String(data?.error||'verification_rejected'));
    if(String(data.productId||'')!==product.id)throw new Error('verification_product_mismatch');
    if(String(data.transactionId||'')!==payload.transactionId)throw new Error('verification_transaction_mismatch');
    if(Number(data.diamonds)!==product.diamonds)throw new Error('verification_amount_mismatch');
    if(!Number.isFinite(Number(data.diamondBalance))||Number(data.diamondBalance)<0)throw new Error('verification_balance_missing');
    return {...data,transactionId:payload.transactionId};
  }
  async function purchase(productId){
    const product=CATALOG.find(p=>p.id===String(productId||''));if(!product)return {ok:false,reason:'unknown_product'};
    if(busy)return {ok:false,reason:'busy'};
    if(!canPurchase()){setMessage('Betaling er ikke aktivert i denne builden ennå.','warn');render();return {ok:false,reason:'not_ready'};}
    busy=true;render();setMessage('Åpner butikk…');
    try{
      const result=await bridge().purchase(product.id);
      const state=String(result?.status||'purchased').toLowerCase();
      if(['cancelled','canceled'].includes(state)){setMessage('Kjøpet ble avbrutt.');return {ok:false,reason:'cancelled'};}
      if(state==='pending'){setMessage('Kjøpet venter på godkjenning. Diamanter legges til når betalingen er bekreftet.');return {ok:false,reason:'pending'};}
      const tx=String(result?.transactionId||result?.purchaseToken||'');
      if(tx&&hasReceipt(tx)){setMessage('Denne transaksjonen er allerede behandlet.','warn');return {ok:false,reason:'duplicate_local'};}
      setMessage('Verifiserer kjøpet…');
      const verified=await verifyPurchase(result,product);
      if(hasReceipt(verified.transactionId)){setMessage('Denne transaksjonen er allerede behandlet.','warn');return {ok:false,reason:'duplicate_local'};}
      window.SkyPuffDiamonds?.set?.(Math.floor(Number(verified.diamondBalance)));
      rememberReceipt(verified.transactionId);
      setMessage(`Kjøp fullført! +${product.diamonds} 💎`,'success');
      if(typeof showToast==='function')showToast(`+${product.diamonds} Diamonds 💎`);
      try{await bridge().finishTransaction?.(verified.transactionId);}catch(e){console.warn('IAP finishTransaction failed',e);}
      window.dispatchEvent?.(new CustomEvent('puffling:iapPurchase',{detail:{productId:product.id,diamonds:product.diamonds,transactionId:verified.transactionId}}));
      return {ok:true,product,verified};
    }catch(e){
      const code=String(e?.message||e||'purchase_failed');console.error('Puffling IAP purchase failed',code);setMessage('Kjøpet kunne ikke fullføres. Ingen diamanter ble trukket eller lagt til.','error');return {ok:false,reason:code};
    }finally{busy=false;render();}
  }
  function ensure(){
    if(typeof document==='undefined'||document.getElementById('diamondStoreMenu'))return;
    const style=document.createElement('style');style.id='diamondIapCss';style.textContent=`#diamondStoreProducts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.diamondIapPack{display:flex!important;flex-direction:column;align-items:center;gap:3px;padding:12px 8px!important;min-height:82px}.diamondIapAmount{font-size:17px;font-weight:1000}.diamondIapTag{font-size:10px;opacity:.65;font-weight:900}.diamondIapPrice{font-size:12px;font-weight:1000;margin-top:3px}#diamondStoreStatus[data-type="error"]{color:#9c2635}#diamondStoreStatus[data-type="success"]{color:#187343}@media(max-width:420px){#diamondStoreProducts{grid-template-columns:1fr}}`;
    document.head.appendChild(style);
    const el=document.createElement('div');el.id='diamondStoreMenu';el.className='overlay';el.style.display='none';
    el.innerHTML=`<div class="card" style="max-width:520px;max-height:92dvh;overflow-y:auto"><h1 style="font-size:32px">Diamond Store 💎</h1><div style="font-size:22px;font-weight:1000">Saldo: 💎 <span id="diamondStoreBalance">0</span></div><div id="diamondStoreAvailability" class="small" style="margin:8px 0"></div><div id="diamondStoreProducts"></div><div id="diamondStoreStatus" class="small" style="min-height:18px;margin:8px 0"></div><div class="small" style="text-align:left;background:rgba(255,255,255,.6);padding:11px;border-radius:14px;line-height:1.5">Diamanter er forbruksvaluta og utløper ikke. Pris og valuta hentes fra App Store eller Google Play. Kjøpet verifiseres før saldoen oppdateres.</div><button id="closeDiamondStore" class="secondary" style="margin-top:12px">TILBAKE</button></div>`;
    document.body.appendChild(el);
    document.getElementById('closeDiamondStore').onclick=()=>{el.style.display='none';const ms=document.getElementById('mysteryShopMenu');if(ms)ms.style.display='flex';else document.getElementById('start').style.display='flex';};
    const addEntry=()=>{
      const menu=document.getElementById('mysteryShopMenu');if(!menu||menu.querySelector('#openDiamondStore'))return;
      const card=menu.querySelector('.card');if(!card)return;const btn=document.createElement('button');btn.id='openDiamondStore';btn.className='gold';btn.style.marginBottom='10px';btn.textContent='KJØP DIAMANTER 💎';btn.onclick=open;const bundles=menu.querySelector('#mysteryBoxBundles');if(bundles)bundles.insertAdjacentElement('beforebegin',btn);else card.appendChild(btn);
    };
    addEntry();setTimeout(addEntry,100);render();refreshProducts();
  }
  function open(){ensure();const mystery=document.getElementById('mysteryShopMenu');if(mystery)mystery.style.display='none';const el=document.getElementById('diamondStoreMenu');if(el)el.style.display='flex';setMessage('');render();refreshProducts();}

  window.PufflingDiamondStore={CATALOG,catalog,status,canPurchase,refreshProducts,purchase,open,render,version:1};
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,30));else setTimeout(ensure,30);
  }
})();
