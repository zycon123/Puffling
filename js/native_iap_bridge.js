/* Orbuff — Capacitor native IAP bridge v1.0
 * Adapts @capgo/native-purchases to the existing PufflingIAP contract.
 * Purchases remain fail-closed until the Orbuff server reports providerReady=true.
 */
(function(){
  const PRODUCT_IDS=new Set([
    'puffling.diamonds.25',
    'puffling.diamonds.75',
    'puffling.diamonds.250',
    'puffling.diamonds.600'
  ]);
  const RECEIPT_KEY='pufflingIapReceiptsV1';
  const pending=new Map();
  let listenersStarted=false;

  function capacitor(){return window.Capacitor||null;}
  function platform(){try{return String(capacitor()?.getPlatform?.()||'web').toLowerCase();}catch(e){return 'web';}}
  function nativePlugin(){try{return capacitor()?.Plugins?.NativePurchases||null;}catch(e){return null;}}
  function nativeReady(){
    const c=capacitor(),p=nativePlugin(),pf=platform();
    if(!['ios','android'].includes(pf)||!p)return false;
    try{return typeof c?.isPluginAvailable==='function'?!!c.isPluginAvailable('NativePurchases'):true;}catch(e){return false;}
  }
  function knownReceipts(){
    try{const rows=JSON.parse(localStorage.getItem(RECEIPT_KEY)||'[]');return new Set(Array.isArray(rows)?rows.map(String):[]);}catch(e){return new Set();}
  }
  function txId(tx){return String(tx?.transactionId||tx?.orderId||tx?.purchaseToken||'');}
  function normalize(tx){
    const pf=platform();
    const productId=String(tx?.productIdentifier||tx?.productId||'');
    const transactionId=txId(tx);
    const purchaseToken=String(tx?.purchaseToken||'');
    const verificationData=tx?.jwsRepresentation||tx?.receipt||purchaseToken||null;
    let status='purchased';
    if(pf==='android'&&String(tx?.purchaseState??'1')!=='1')status='pending';
    if(tx?.revocationDate||tx?.subscriptionState==='revoked')status='revoked';
    return {
      status,
      productId,
      transactionId,
      purchaseToken,
      verificationData,
      signedTransaction:tx?.jwsRepresentation||'',
      receipt:tx?.receipt||''
    };
  }
  function keep(row){return PRODUCT_IDS.has(row.productId)&&!!row.transactionId&&!!row.verificationData;}
  function isCancelError(error){return /cancel/i.test(String(error?.message||error||''));}
  function isPendingError(error){return /pending/i.test(String(error?.message||error||''));}
  function alreadyFinishedError(error){return /already finished|transaction not found/i.test(String(error?.message||error||''));}

  async function ensureListeners(){
    if(listenersStarted||platform()!=='ios'||!nativeReady())return;
    const p=nativePlugin();listenersStarted=true;
    try{
      if(typeof p.addListener==='function'){
        await p.addListener('transactionUpdated',tx=>{const row=normalize(tx);if(keep(row)&&row.status==='purchased')pending.set(row.transactionId,row);});
        await p.addListener('transactionVerificationFailed',event=>console.warn('Orbuff StoreKit transaction verification failed',event?.transactionId||'',event?.error||''));
      }
    }catch(e){listenersStarted=false;console.warn('Orbuff IAP listeners unavailable',String(e?.message||e));}
  }

  async function billingSupported(){
    if(!nativeReady())return false;
    try{const result=await nativePlugin().isBillingSupported();return result?.isBillingSupported===true;}catch(e){return false;}
  }

  async function loadProducts(productIds){
    if(!await billingSupported())return [];
    await ensureListeners();
    const ids=(Array.isArray(productIds)?productIds:[]).map(String).filter(id=>PRODUCT_IDS.has(id));
    if(!ids.length)return [];
    const result=await nativePlugin().getProducts({productIdentifiers:ids,productType:'inapp'});
    const rows=Array.isArray(result?.products)?result.products:[];
    return rows.map(row=>({
      productId:String(row?.identifier||row?.productIdentifier||''),
      displayPrice:String(row?.priceString||row?.displayPrice||''),
      localizedPrice:String(row?.priceString||row?.displayPrice||''),
      currencyCode:String(row?.currencyCode||''),
      title:String(row?.title||'')
    })).filter(row=>PRODUCT_IDS.has(row.productId));
  }

  async function purchase(productId){
    const id=String(productId||'');
    if(!PRODUCT_IDS.has(id))throw new Error('unknown_product');
    if(!await billingSupported())throw new Error('billing_unavailable');
    await ensureListeners();
    try{
      const tx=await nativePlugin().purchaseProduct({
        productIdentifier:id,
        productType:'inapp',
        quantity:1,
        isConsumable:false,
        autoAcknowledgePurchases:false
      });
      const row=normalize(tx);
      if(!keep(row))throw new Error('invalid_native_purchase_result');
      if(row.status==='purchased')pending.set(row.transactionId,row);
      return row;
    }catch(e){
      if(isCancelError(e))return {status:'cancelled',productId:id};
      if(isPendingError(e))return {status:'pending',productId:id};
      throw e;
    }
  }

  async function getPendingPurchases(){
    if(!nativeReady())return [];
    await ensureListeners();
    const known=knownReceipts();
    const out=new Map();
    for(const row of pending.values())if(keep(row)&&!known.has(row.transactionId))out.set(row.transactionId,row);
    try{
      const result=await nativePlugin().getPurchases({productType:'inapp',onlyCurrentEntitlements:false});
      for(const tx of Array.isArray(result?.purchases)?result.purchases:[]){
        const row=normalize(tx);
        if(row.status==='purchased'&&keep(row)&&!known.has(row.transactionId))out.set(row.transactionId,row);
      }
    }catch(e){console.warn('Orbuff IAP pending-purchase scan failed',String(e?.message||e));}
    return [...out.values()];
  }

  async function finishTransaction(payload={}){
    if(!nativeReady())throw new Error('native_iap_unavailable');
    const p=nativePlugin(),pf=platform();
    const transactionId=String(payload.transactionId||'');
    if(!transactionId)throw new Error('transaction_id_missing');
    if(pf==='android'){
      const token=String(payload.purchaseToken||'');
      if(!token)throw new Error('purchase_token_missing');
      await p.consumePurchase({purchaseToken:token});
    }else if(pf==='ios'){
      try{await p.acknowledgePurchase({purchaseToken:transactionId});}
      catch(e){if(!alreadyFinishedError(e))throw e;}
    }else throw new Error('unsupported_platform');
    pending.delete(transactionId);
  }

  const bridge={
    platform:platform(),
    getPlatform:platform,
    loadProducts,
    purchase,
    getPendingPurchases,
    finishTransaction,
    version:'capgo-native-purchases-8.7.0/orbuff-adapter-1'
  };
  Object.defineProperty(bridge,'isAvailable',{enumerable:true,get:()=>nativeReady()});
  window.PufflingIAP=bridge;
  ensureListeners().catch(()=>{});
})();
