import fs from 'node:fs';
import vm from 'node:vm';

const fail=message=>{console.error(`❌ Native IAP bridge validation: ${message}`);process.exit(1);};
const read=file=>fs.readFileSync(file,'utf8');
const pkg=JSON.parse(read('package.json'));
const game=read('game.js');
const bridgeSource=read('js/native_iap_bridge.js');
const patchSource=read('scripts/patch-native-purchases.mjs');
const androidWorkflow=read('.github/workflows/build-android-release.yml');
const iosWorkflow=read('.github/workflows/build-ios-release.yml');

if(pkg.dependencies?.['@capgo/native-purchases']!=='8.7.0')fail('@capgo/native-purchases must be pinned to 8.7.0');
if(!String(pkg.scripts?.postinstall||'').includes('patch-native-purchases.mjs'))fail('postinstall does not apply the iOS safety patch');
if(!game.includes("'js/native_iap_bridge.js'"))fail('game loader does not include native_iap_bridge.js');
if(game.indexOf("'js/native_iap_bridge.js'")>game.indexOf("'js/diamond_iap_store.js'"))fail('native IAP bridge loads after Diamond store');

for(const token of [
  "puffling.diamonds.25","puffling.diamonds.75","puffling.diamonds.250","puffling.diamonds.600",
  "autoAcknowledgePurchases:false","isConsumable:false","consumePurchase","acknowledgePurchase",
  "getPurchases","onlyCurrentEntitlements:false","jwsRepresentation","purchaseToken","PufflingIAP"
])if(!bridgeSource.includes(token))fail(`bridge missing ${token}`);
if(!patchSource.includes("expectedVersion='8.7.0'")||!patchSource.includes('ORBUFF_SERVER_VERIFICATION_PATCH'))fail('native-purchases patch is not version-pinned and marked');
if(!patchSource.includes('startTransactionUpdatesListener')||!patchSource.includes('await transaction.finish()'))fail('patch does not target the StoreKit transaction update auto-finish path');
for(const [name,workflow] of [['Android',androidWorkflow],['iOS',iosWorkflow]]){
  if(!workflow.includes('scripts/patch-native-purchases.mjs'))fail(`${name} workflow does not trigger for native purchase safety patch changes`);
  if(!workflow.includes('Verify native purchase safety patch'))fail(`${name} workflow does not explicitly verify the installed safety patch`);
}

function makeContext(platform){
  const calls=[];
  const receipts=[];
  const store=new Map();
  const localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
  const plugin={
    async isBillingSupported(){calls.push(['supported']);return {isBillingSupported:true};},
    async getProducts(options){calls.push(['products',options]);return {products:options.productIdentifiers.map(id=>({identifier:id,priceString:'kr 10,00',currencyCode:'NOK',title:'Diamonds'}))};},
    async purchaseProduct(options){calls.push(['purchase',options]);return platform==='android'
      ?{productIdentifier:options.productIdentifier,transactionId:'GPA.TEST',purchaseToken:'play-token',purchaseState:'1'}
      :{productIdentifier:options.productIdentifier,transactionId:'200000000001',jwsRepresentation:'ios-jws'};},
    async getPurchases(options){calls.push(['pending',options]);return {purchases:[]};},
    async consumePurchase(options){calls.push(['consume',options]);},
    async acknowledgePurchase(options){calls.push(['ack',options]);},
    async addListener(name){calls.push(['listener',name]);return {remove:async()=>{}};}
  };
  const window={Capacitor:{getPlatform:()=>platform,isPluginAvailable:name=>name==='NativePurchases',Plugins:{NativePurchases:plugin}},localStorage,console};window.window=window;
  const context={window,localStorage,console,setTimeout,clearTimeout};vm.createContext(context);vm.runInContext(bridgeSource,context,{filename:'native_iap_bridge.js'});
  return {window,calls,receipts};
}

for(const platform of ['android','ios']){
  const {window,calls}=makeContext(platform);
  const api=window.PufflingIAP;if(!api)fail(`${platform} bridge API missing`);
  if(api.isAvailable!==true)fail(`${platform} bridge did not report native plugin availability`);
  const products=await api.loadProducts(['puffling.diamonds.25']);
  if(products[0]?.displayPrice!=='kr 10,00')fail(`${platform} localized store price mapping failed`);
  const result=await api.purchase('puffling.diamonds.25');
  if(result?.status!=='purchased'||!result?.verificationData)fail(`${platform} native purchase result normalization failed`);
  const purchaseCall=calls.find(row=>row[0]==='purchase')?.[1];
  if(purchaseCall?.autoAcknowledgePurchases!==false||purchaseCall?.isConsumable!==false)fail(`${platform} purchase can be finalized before server verification`);
  await api.finishTransaction(result);
  if(platform==='android'){
    const consume=calls.find(row=>row[0]==='consume')?.[1];if(consume?.purchaseToken!=='play-token')fail('Android verified consumable is not consumed with purchaseToken');
  }else{
    const ack=calls.find(row=>row[0]==='ack')?.[1];if(ack?.purchaseToken!=='200000000001')fail('iOS verified transaction is not finished with transactionId');
  }
}

const webStore=new Map();const webLocalStorage={getItem:k=>webStore.get(k)||null,setItem:(k,v)=>webStore.set(k,String(v))};
const webWindow={localStorage:webLocalStorage,console};webWindow.window=webWindow;const webContext={window:webWindow,localStorage:webLocalStorage,console,setTimeout,clearTimeout};vm.createContext(webContext);vm.runInContext(bridgeSource,webContext,{filename:'native_iap_bridge.js'});
if(webWindow.PufflingIAP?.isAvailable!==false)fail('web build does not fail closed');

console.log('✅ Native IAP bridge validated: Capacitor 8 plugin pin, StoreKit safety patch, Play consumable finishing, iOS manual finish and web fail-closed behavior');
