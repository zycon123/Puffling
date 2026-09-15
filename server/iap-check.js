const crypto=require('crypto');
const createIapStore=require('./iap_store');
function fail(msg){throw new Error(msg);}
const state={wallets:new Map(),transactions:new Map(),ledger:[]};
function walletByAccount(accountId){for(const [wallet_id,row] of state.wallets)if(row.accountId===accountId&&row.active!==false)return{wallet_id,...row};return null;}
const pool={
 async query(sql,p=[]){
  const s=String(sql).trim();
  if(/^CREATE TABLE|^ALTER TABLE|^CREATE UNIQUE INDEX/i.test(s))return{rowCount:0,rows:[]};
  if(s.startsWith('SELECT client_key_hash,paid_diamonds,active,account_id')){const row=state.wallets.get(p[0]);return{rowCount:row?1:0,rows:row?[{client_key_hash:row.hash,paid_diamonds:row.paid,active:row.active!==false,account_id:row.accountId||null}]:[]};}
  if(s.startsWith('INSERT INTO puffling_wallets(wallet_id,client_key_hash,active)')){state.wallets.set(p[0],{hash:p[1],paid:0,active:true,accountId:null});return{rowCount:1,rows:[]};}
  if(s.startsWith('SELECT wallet_id,paid_diamonds FROM puffling_wallets WHERE account_id')){const row=walletByAccount(p[0]);return{rowCount:row?1:0,rows:row?[{wallet_id:row.wallet_id,paid_diamonds:row.paid}]:[]};}
  if(s.startsWith('INSERT INTO puffling_wallets(wallet_id,client_key_hash,account_id,active)')){if(!walletByAccount(p[2]))state.wallets.set(p[0],{hash:p[1],paid:0,active:true,accountId:p[2]});return{rowCount:1,rows:[]};}
  if(s.startsWith('SELECT paid_diamonds,account_id FROM puffling_wallets WHERE wallet_id')){const row=state.wallets.get(p[0]);const ok=row&&row.active!==false;return{rowCount:ok?1:0,rows:ok?[{paid_diamonds:row.paid,account_id:row.accountId||null}]:[]};}
  if(s.startsWith('SELECT wallet_id,product_id,diamonds FROM puffling_iap_transactions')){const row=state.transactions.get(p[0]);return{rowCount:row?1:0,rows:row?[row]:[]};}
  if(s.startsWith('SELECT paid_diamonds FROM puffling_wallets')){const row=state.wallets.get(p[0]);const activeOnly=/active=true/i.test(s);const ok=row&&(!activeOnly||row.active!==false);return{rowCount:ok?1:0,rows:ok?[{paid_diamonds:row.paid}]:[]};}
  throw new Error('unexpected pool query: '+s);
 },
 async connect(){return{release(){},async query(sql,p=[]){
  const s=String(sql).trim();
  if(['BEGIN','COMMIT','ROLLBACK'].includes(s))return{rowCount:0,rows:[]};
  if(s.startsWith('UPDATE puffling_wallets SET paid_diamonds=paid_diamonds-$2')){const row=state.wallets.get(p[0]);if(!row||row.active===false||row.paid<p[1])return{rowCount:0,rows:[]};row.paid-=p[1];return{rowCount:1,rows:[{paid_diamonds:row.paid}]};}
  if(s.startsWith('SELECT active FROM puffling_wallets')){const row=state.wallets.get(p[0]);return{rowCount:row?1:0,rows:row?[{active:row.active!==false}]:[]};}
  if(s.startsWith('INSERT INTO puffling_wallet_ledger')){state.ledger.push({walletId:p[0],delta:p[1],reason:p[2],refId:p[3]||null});return{rowCount:1,rows:[]};}
  if(s.startsWith('SELECT wallet_id FROM puffling_wallets')){const row=state.wallets.get(p[0]);const ok=row&&(!/active=true/i.test(s)||row.active!==false);return{rowCount:ok?1:0,rows:ok?[{wallet_id:p[0]}]:[]};}
  if(s.startsWith('SELECT wallet_id,product_id,diamonds FROM puffling_iap_transactions')){const row=state.transactions.get(p[0]);return{rowCount:row?1:0,rows:row?[row]:[]};}
  if(s.startsWith('SELECT paid_diamonds FROM puffling_wallets')){const row=state.wallets.get(p[0]);const ok=row&&(!/active=true/i.test(s)||row.active!==false);return{rowCount:ok?1:0,rows:ok?[{paid_diamonds:row.paid}]:[]};}
  if(s.startsWith('INSERT INTO puffling_iap_transactions')){state.transactions.set(p[0],{wallet_id:p[1],platform:p[2],product_id:p[3],diamonds:p[4],provider_payload:p[5]});return{rowCount:1,rows:[]};}
  if(s.startsWith('UPDATE puffling_wallets SET paid_diamonds=paid_diamonds+$2')){const row=state.wallets.get(p[0]);if(!row||row.active===false)return{rowCount:0,rows:[]};row.paid+=p[1];return{rowCount:1,rows:[{paid_diamonds:row.paid}]};}
  throw new Error('unexpected client query: '+s);
 }};}
};
(async()=>{
 const secret='test-secret-'+crypto.randomBytes(16).toString('hex');
 const disabled=createIapStore({pool,walletSecret:secret,providerMode:'disabled'});await disabled.init();
 if(disabled.status().providerReady)fail('disabled provider reported ready');
 if(!disabled.status().accountWallets)fail('account wallet capability missing');
 const products=disabled.PRODUCT_DIAMONDS;if(JSON.stringify(products)!==JSON.stringify({'puffling.diamonds.25':25,'puffling.diamonds.75':75,'puffling.diamonds.250':250,'puffling.diamonds.600':600}))fail('product catalog mismatch');
 const key='client-key-'+crypto.randomBytes(24).toString('hex');const session=await disabled.issueWallet('wallet_test_1',key);if(!session.walletToken||session.paidDiamondBalance!==0)fail('legacy wallet session failed');if(disabled.verifyToken(session.walletToken)!=='wallet_test_1')fail('wallet token signature failed');
 let wrong=false;try{await disabled.issueWallet('wallet_test_1','different-key-'+crypto.randomBytes(24).toString('hex'));}catch(e){wrong=e.message==='wallet_key_mismatch';}if(!wrong)fail('wallet key mismatch was not blocked');
 state.wallets.get('wallet_test_1').paid=100;const spent=await disabled.spend(session.walletToken,25,'mystery_box');if(spent.paidDiamondBalance!==75||state.ledger.at(-1)?.delta!==-25)fail('paid Diamond spend failed');
 let locked=false;try{await disabled.grantVerified(session.walletToken,{platform:'ios',productId:'puffling.diamonds.25',expectedDiamonds:25,transactionId:'tx_disabled',verificationData:'signed'});}catch(e){locked=e.message==='provider_not_configured';}if(!locked)fail('disabled IAP provider did not fail closed');
 const linked1=await disabled.issueAccountWallet('guest_wallet_recovery');if(!linked1.walletToken||!linked1.accountLinked)fail('account-linked wallet was not created');state.wallets.get(linked1.walletId).paid=44;
 const linked2=await disabled.issueAccountWallet('guest_wallet_recovery');if(linked2.walletId!==linked1.walletId||linked2.paidDiamondBalance!==44||!linked2.accountLinked)fail('account-linked wallet did not recover');
 if((await disabled.balance(linked2.walletToken)).paidDiamondBalance!==44)fail('recovered account wallet balance mismatch');
 state.wallets.get(linked1.walletId).active=false;let disabledWallet=false;try{await disabled.balance(linked1.walletToken);}catch(e){disabledWallet=e.message==='wallet_disabled';}if(!disabledWallet)fail('disabled account wallet token remained usable');
 state.wallets.get(linked1.walletId).active=true;
 let verifierCalls=0;const verifier=async input=>{verifierCalls++;return{valid:true,provider:input.platform,platform:input.platform,productId:input.productId,transactionId:input.transactionId,environment:'sandbox',rawRef:'verified'};};
 const enabled=createIapStore({pool,walletSecret:secret,providerMode:'apple_google',providerVerifier:verifier});await enabled.init();if(!enabled.status().providerReady)fail('injected provider verifier did not report ready');
 const grant=await enabled.grantVerified(session.walletToken,{platform:'ios',productId:'puffling.diamonds.25',expectedDiamonds:25,transactionId:'tx_1',verificationData:'signed-transaction'});if(!grant.ok||grant.duplicate||grant.paidDiamondBalance!==100||verifierCalls!==1)fail('verified IAP grant failed');
 const duplicate=await enabled.grantVerified(session.walletToken,{platform:'ios',productId:'puffling.diamonds.25',expectedDiamonds:25,transactionId:'tx_1',verificationData:'already-finalized-proof'});if(!duplicate.ok||!duplicate.duplicate||duplicate.paidDiamondBalance!==100)fail('IAP transaction idempotency failed');
 if(verifierCalls!==1)fail('known transaction unnecessarily re-contacted provider after finalization');
 const bad=createIapStore({pool,walletSecret:secret,providerMode:'apple_google',providerVerifier:async input=>({valid:true,platform:input.platform,productId:'wrong.product',transactionId:input.transactionId})});await bad.init();let mismatch=false;try{await bad.grantVerified(session.walletToken,{platform:'ios',productId:'puffling.diamonds.25',expectedDiamonds:25,transactionId:'tx_bad',verificationData:'signed'});}catch(e){mismatch=e.message==='provider_product_mismatch';}if(!mismatch)fail('provider product mismatch was not rejected');
 console.log('✅ Paid-Diamond wallet, account recovery, disablement, provider verification and duplicate protection passed');
})().catch(e=>{console.error('❌ IAP wallet check:',e);process.exit(1);});
