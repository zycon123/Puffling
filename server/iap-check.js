const crypto=require('crypto');
const createIapStore=require('./iap_store');
function fail(msg){throw new Error(msg);}
const state={wallets:new Map(),transactions:new Map(),ledger:[]};
const pool={
 async query(sql,p=[]){
  if(sql.startsWith('CREATE TABLE'))return{rowCount:0,rows:[]};
  if(sql.startsWith('SELECT client_key_hash,paid_diamonds')){const row=state.wallets.get(p[0]);return{rowCount:row?1:0,rows:row?[{client_key_hash:row.hash,paid_diamonds:row.paid}]:[]};}
  if(sql.startsWith('INSERT INTO puffling_wallets(wallet_id,client_key_hash)')){state.wallets.set(p[0],{hash:p[1],paid:0});return{rowCount:1,rows:[]};}
  if(sql.startsWith('SELECT paid_diamonds FROM puffling_wallets')){const row=state.wallets.get(p[0]);return{rowCount:row?1:0,rows:row?[{paid_diamonds:row.paid}]:[]};}
  throw new Error('unexpected pool query: '+sql);
 },
 async connect(){return{release(){},async query(sql,p=[]){
  if(['BEGIN','COMMIT','ROLLBACK'].includes(sql))return{rowCount:0,rows:[]};
  if(sql.startsWith('UPDATE puffling_wallets SET paid_diamonds=paid_diamonds-$2')){const row=state.wallets.get(p[0]);if(!row||row.paid<p[1])return{rowCount:0,rows:[]};row.paid-=p[1];return{rowCount:1,rows:[{paid_diamonds:row.paid}]};}
  if(sql.startsWith('INSERT INTO puffling_wallet_ledger')){state.ledger.push({walletId:p[0],delta:p[1],reason:p[2],refId:p[3]||null});return{rowCount:1,rows:[]};}
  if(sql.startsWith('SELECT wallet_id FROM puffling_wallets')){return{rowCount:state.wallets.has(p[0])?1:0,rows:state.wallets.has(p[0])?[{wallet_id:p[0]}]:[]};}
  if(sql.startsWith('SELECT wallet_id,product_id,diamonds FROM puffling_iap_transactions')){const row=state.transactions.get(p[0]);return{rowCount:row?1:0,rows:row?[row]:[]};}
  if(sql.startsWith('SELECT paid_diamonds FROM puffling_wallets')){const row=state.wallets.get(p[0]);return{rowCount:row?1:0,rows:row?[{paid_diamonds:row.paid}]:[]};}
  if(sql.startsWith('INSERT INTO puffling_iap_transactions')){state.transactions.set(p[0],{wallet_id:p[1],platform:p[2],product_id:p[3],diamonds:p[4],provider_payload:p[5]});return{rowCount:1,rows:[]};}
  if(sql.startsWith('UPDATE puffling_wallets SET paid_diamonds=paid_diamonds+$2')){const row=state.wallets.get(p[0]);row.paid+=p[1];return{rowCount:1,rows:[{paid_diamonds:row.paid}]};}
  throw new Error('unexpected client query: '+sql);
 }};}
};
(async()=>{
 const secret='test-secret-'+crypto.randomBytes(16).toString('hex');
 const disabled=createIapStore({pool,walletSecret:secret,providerMode:'disabled'});await disabled.init();
 if(disabled.status().providerReady)fail('disabled provider reported ready');
 const products=disabled.PRODUCT_DIAMONDS;if(JSON.stringify(products)!==JSON.stringify({'puffling.diamonds.25':25,'puffling.diamonds.75':75,'puffling.diamonds.250':250,'puffling.diamonds.600':600}))fail('product catalog mismatch');
 const key='client-key-'+crypto.randomBytes(24).toString('hex');const session=await disabled.issueWallet('wallet_test_1',key);if(!session.walletToken||session.paidDiamondBalance!==0)fail('wallet session failed');if(disabled.verifyToken(session.walletToken)!=='wallet_test_1')fail('wallet token signature failed');
 let wrong=false;try{await disabled.issueWallet('wallet_test_1','different-key-'+crypto.randomBytes(24).toString('hex'));}catch(e){wrong=e.message==='wallet_key_mismatch';}if(!wrong)fail('wallet key mismatch was not blocked');
 state.wallets.get('wallet_test_1').paid=100;const spent=await disabled.spend(session.walletToken,25,'mystery_box');if(spent.paidDiamondBalance!==75||state.ledger.at(-1)?.delta!==-25)fail('paid Diamond spend failed');
 let locked=false;try{await disabled.grantVerified(session.walletToken,{platform:'ios',productId:'puffling.diamonds.25',expectedDiamonds:25,transactionId:'tx_disabled',verificationData:'signed'});}catch(e){locked=e.message==='provider_not_configured';}if(!locked)fail('disabled IAP provider did not fail closed');
 const verifier=async input=>({valid:true,provider:input.platform,platform:input.platform,productId:input.productId,transactionId:input.transactionId,environment:'sandbox',rawRef:'verified'});
 const enabled=createIapStore({pool,walletSecret:secret,providerMode:'apple_google',providerVerifier:verifier});await enabled.init();if(!enabled.status().providerReady)fail('injected provider verifier did not report ready');
 const grant=await enabled.grantVerified(session.walletToken,{platform:'ios',productId:'puffling.diamonds.25',expectedDiamonds:25,transactionId:'tx_1',verificationData:'signed-transaction'});if(!grant.ok||grant.duplicate||grant.paidDiamondBalance!==100)fail('verified IAP grant failed');
 const duplicate=await enabled.grantVerified(session.walletToken,{platform:'ios',productId:'puffling.diamonds.25',expectedDiamonds:25,transactionId:'tx_1',verificationData:'signed-transaction'});if(!duplicate.ok||!duplicate.duplicate||duplicate.paidDiamondBalance!==100)fail('IAP transaction idempotency failed');
 const bad=createIapStore({pool,walletSecret:secret,providerMode:'apple_google',providerVerifier:async input=>({valid:true,platform:input.platform,productId:'wrong.product',transactionId:input.transactionId})});await bad.init();let mismatch=false;try{await bad.grantVerified(session.walletToken,{platform:'ios',productId:'puffling.diamonds.25',expectedDiamonds:25,transactionId:'tx_bad',verificationData:'signed'});}catch(e){mismatch=e.message==='provider_product_mismatch';}if(!mismatch)fail('provider product mismatch was not rejected');
 console.log('✅ Paid-Diamond wallet, provider readiness, verified grant and duplicate protection passed');
})().catch(e=>{console.error('❌ IAP wallet check:',e);process.exit(1);});
