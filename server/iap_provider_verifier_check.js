const createProviderVerifier=require('./iap_provider_verifier');
function fail(message){throw new Error(message);}
function fakeJws(payload){return `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;}
const Environment={SANDBOX:'Sandbox',PRODUCTION:'Production'};
class FakeSignedDataVerifier{
  constructor(roots,online,environment,bundleId,appAppleId){this.environment=environment;this.bundleId=bundleId;this.appAppleId=appAppleId;this.roots=roots;this.online=online;}
  async verifyAndDecodeTransaction(jws){
    const payload=JSON.parse(Buffer.from(String(jws).split('.')[1],'base64url').toString('utf8'));
    if(payload.environment!==this.environment)throw new Error('wrong_environment');
    if(payload.bundleId!==this.bundleId)throw new Error('wrong_bundle');
    return payload;
  }
}
class FakeGoogleAuth{
  constructor(options){this.options=options;}
  async getClient(){return{getAccessToken:async()=>({token:'test-google-access'})};}
}
const baseOptions={
  bundleId:'com.zyconstudios.orbuff',
  appAppleId:1234567890,
  appleRootCertificates:[Buffer.from('fake-root')],
  googlePackageName:'com.zyconstudios.orbuff',
  googleCredentials:{client_email:'iap@test.invalid',private_key:'-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----\n'},
  appleLib:{SignedDataVerifier:FakeSignedDataVerifier,Environment},
  GoogleAuth:FakeGoogleAuth
};
(async()=>{
  const missing=createProviderVerifier({env:{}});
  if(missing.ready||missing.status().appleConfigured||missing.status().googleConfigured)fail('missing provider configuration did not fail closed');

  let googleRequest=null;
  const verifier=createProviderVerifier({...baseOptions,fetchFn:async(url,options)=>{
    googleRequest={url,options};
    return{ok:true,status:200,json:async()=>({purchaseState:0,consumptionState:0,acknowledgementState:0,orderId:'GPA.1234-5678',purchaseTimeMillis:'1789500000000',purchaseType:0})};
  }});
  if(!verifier.ready)fail('complete provider configuration did not report ready');
  const status=verifier.status();
  if(!status.appleConfigured||!status.googleConfigured||status.appleRootCertificates!==1)fail('provider readiness details are wrong');

  const applePayload={environment:'Sandbox',bundleId:'com.zyconstudios.orbuff',productId:'puffling.diamonds.75',transactionId:'200000000001',originalTransactionId:'200000000001',purchaseDate:1789500000000};
  const apple=await verifier.verify({platform:'ios',productId:'puffling.diamonds.75',transactionId:'200000000001',verificationData:fakeJws(applePayload)});
  if(!apple.valid||apple.provider!=='apple'||apple.productId!=='puffling.diamonds.75'||apple.transactionId!=='200000000001'||apple.environment!=='Sandbox')fail('Apple verified transaction mapping failed');

  const revokedPayload={...applePayload,transactionId:'200000000002',revocationDate:1789501000000};
  const revoked=await verifier.verify({platform:'ios',productId:'puffling.diamonds.75',transactionId:'200000000002',verificationData:fakeJws(revokedPayload)});
  if(revoked.valid||!revoked.revoked||!revoked.refunded)fail('Apple revoked transaction was accepted');

  let appleMismatch=false;try{await verifier.verify({platform:'ios',productId:'puffling.diamonds.25',transactionId:'200000000001',verificationData:fakeJws(applePayload)});}catch(e){appleMismatch=e.message==='apple_product_mismatch';}
  if(!appleMismatch)fail('Apple product mismatch was not rejected');

  const google=await verifier.verify({platform:'android',productId:'puffling.diamonds.25',transactionId:'GPA.1234-5678',verificationData:'purchase-token-1'});
  if(!google.valid||google.provider!=='google_play'||google.environment!=='test'||google.originalTransactionId!=='GPA.1234-5678')fail('Google verified purchase mapping failed');
  if(!googleRequest?.url.includes('/applications/com.zyconstudios.orbuff/purchases/products/puffling.diamonds.25/tokens/purchase-token-1'))fail('Google Android Publisher request path is wrong');
  if(googleRequest?.options?.headers?.authorization!=='Bearer test-google-access')fail('Google Android Publisher bearer auth is missing');

  const rejected=createProviderVerifier({...baseOptions,fetchFn:async()=>({ok:true,status:200,json:async()=>({purchaseState:1,consumptionState:0,orderId:'GPA.CANCELLED'})})});
  let cancelled=false;try{await rejected.verify({platform:'android',productId:'puffling.diamonds.25',transactionId:'GPA.CANCELLED',verificationData:'cancelled-token'});}catch(e){cancelled=e.message==='google_purchase_not_purchased';}
  if(!cancelled)fail('cancelled Google purchase was not rejected');

  const consumed=createProviderVerifier({...baseOptions,fetchFn:async()=>({ok:true,status:200,json:async()=>({purchaseState:0,consumptionState:1,orderId:'GPA.CONSUMED'})})});
  let alreadyConsumed=false;try{await consumed.verify({platform:'android',productId:'puffling.diamonds.25',transactionId:'GPA.CONSUMED',verificationData:'consumed-token'});}catch(e){alreadyConsumed=e.message==='google_purchase_already_consumed';}
  if(!alreadyConsumed)fail('already-consumed Google purchase was accepted as a new grant');

  console.log('✅ Apple JWS and Google Play purchase provider verification passed with fail-closed configuration');
})().catch(error=>{console.error('❌ IAP provider verifier check:',error);process.exit(1);});
