const crypto=require('crypto');
const createIapStore=require('./iap_store');

function fail(msg){throw new Error(msg);}
const state={wallets:new Map(),ledger:[]};
const pool={
  async query(sql,p=[]){
    if(sql.startsWith('CREATE TABLE'))return {rowCount:0,rows:[]};
    if(sql.startsWith('SELECT client_key_hash,paid_diamonds')){
      const row=state.wallets.get(p[0]);return {rowCount:row?1:0,rows:row?[{client_key_hash:row.hash,paid_diamonds:row.paid}]:[]};
    }
    if(sql.startsWith('INSERT INTO puffling_wallets(wallet_id,client_key_hash)')){state.wallets.set(p[0],{hash:p[1],paid:0});return {rowCount:1,rows:[]};}
    if(sql.startsWith('SELECT paid_diamonds FROM puffling_wallets')){const row=state.wallets.get(p[0]);return {rowCount:row?1:0,rows:row?[{paid_diamonds:row.paid}]:[]};}
    throw new Error('unexpected pool query: '+sql);
  },
  async connect(){
    return {release(){},async query(sql,p=[]){
      if(['BEGIN','COMMIT','ROLLBACK'].includes(sql))return {rowCount:0,rows:[]};
      if(sql.startsWith('UPDATE puffling_wallets SET paid_diamonds=paid_diamonds-$2')){
        const row=state.wallets.get(p[0]);if(!row||row.paid<p[1])return {rowCount:0,rows:[]};row.paid-=p[1];return {rowCount:1,rows:[{paid_diamonds:row.paid}]};
      }
      if(sql.startsWith('INSERT INTO puffling_wallet_ledger')){state.ledger.push({walletId:p[0],delta:p[1],reason:p[2]});return {rowCount:1,rows:[]};}
      throw new Error('unexpected client query: '+sql);
    }};
  }
};

(async()=>{
  const secret='test-secret-'+crypto.randomBytes(16).toString('hex');
  const store=createIapStore({pool,walletSecret:secret,providerMode:'disabled'});
  await store.init();
  const products=store.PRODUCT_DIAMONDS;
  if(JSON.stringify(products)!==JSON.stringify({'puffling.diamonds.25':25,'puffling.diamonds.75':75,'puffling.diamonds.250':250,'puffling.diamonds.600':600}))fail('product catalog mismatch');
  const key='client-key-'+crypto.randomBytes(24).toString('hex');
  const session=await store.issueWallet('wallet_test_1',key);
  if(!session.walletToken||session.paidDiamondBalance!==0)fail('wallet session failed');
  if(store.verifyToken(session.walletToken)!=='wallet_test_1')fail('wallet token signature failed');
  let wrong=false;try{await store.issueWallet('wallet_test_1','different-key-'+crypto.randomBytes(24).toString('hex'));}catch(e){wrong=e.message==='wallet_key_mismatch';}if(!wrong)fail('wallet key mismatch was not blocked');
  state.wallets.get('wallet_test_1').paid=100;
  const spent=await store.spend(session.walletToken,25,'mystery_box');
  if(spent.paidDiamondBalance!==75||state.ledger.at(-1)?.delta!==-25)fail('paid Diamond spend failed');
  let insufficient=false;try{await store.spend(session.walletToken,250,'mystery_box');}catch(e){insufficient=e.message==='insufficient_paid_diamonds';}if(!insufficient)fail('overspend was not rejected');
  let providerLocked=false;try{await store.grantVerified(session.walletToken,{platform:'ios',productId:'puffling.diamonds.25',expectedDiamonds:25,transactionId:'tx_1',verificationData:'receipt'});}catch(e){providerLocked=e.message==='provider_not_configured';}if(!providerLocked)fail('IAP provider did not fail closed');
  console.log('✅ Persistent paid-Diamond wallet, signed session, spend guard and fail-closed IAP verified');
})().catch(e=>{console.error('❌ IAP wallet check:',e);process.exit(1);});
