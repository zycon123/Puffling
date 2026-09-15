const APP_BUNDLE_ID='com.zyconstudios.orbuff';
const ANDROID_PACKAGE_ID='com.zyconstudios.orbuff';
const GOOGLE_SCOPE='https://www.googleapis.com/auth/androidpublisher';

function text(value){return String(value??'').trim();}
function numericId(value){const n=Number(value);return Number.isSafeInteger(n)&&n>0?n:null;}
function safeJson(value){try{return JSON.parse(String(value||''));}catch{return null;}}
function decodeJwtPayload(value){
  try{
    const parts=String(value||'').split('.');
    if(parts.length!==3)return null;
    return JSON.parse(Buffer.from(parts[1],'base64url').toString('utf8'));
  }catch{return null;}
}
function parseAppleRoots(raw){
  if(Array.isArray(raw))return raw.map(v=>Buffer.isBuffer(v)?v:Buffer.from(String(v),'base64')).filter(b=>b.length>0);
  const s=text(raw);if(!s)return [];
  let values=[];
  if(s.startsWith('[')){
    const parsed=safeJson(s);if(!Array.isArray(parsed))return [];
    values=parsed;
  }else values=s.split(/[;,\s]+/g).filter(Boolean);
  try{return values.map(v=>Buffer.from(String(v),'base64')).filter(b=>b.length>0);}catch{return [];}
}
function parseGoogleCredentials(raw){
  if(raw&&typeof raw==='object')return raw;
  const parsed=safeJson(raw);
  return parsed&&typeof parsed==='object'?parsed:null;
}
function googleCredentialsValid(value){return !!(value&&text(value.client_email)&&text(value.private_key));}
function environmentLabel(value){return String(value||'').toLowerCase();}

module.exports=function createIapProviderVerifier(opts={}){
  const env=opts.env||process.env;
  const bundleId=text(opts.bundleId??env.ORBUFF_APPLE_BUNDLE_ID??APP_BUNDLE_ID)||APP_BUNDLE_ID;
  const appAppleId=numericId(opts.appAppleId??env.ORBUFF_APPLE_APP_ID);
  const appleRootCertificates=parseAppleRoots(opts.appleRootCertificates??env.ORBUFF_APPLE_ROOT_CERTIFICATES_BASE64);
  const appleOnlineChecks=String(opts.appleOnlineChecks??env.ORBUFF_APPLE_ONLINE_CHECKS??'true').toLowerCase()!=='false';
  const googlePackageName=text(opts.googlePackageName??env.ORBUFF_GOOGLE_PACKAGE_NAME??ANDROID_PACKAGE_ID)||ANDROID_PACKAGE_ID;
  const googleCredentials=parseGoogleCredentials(opts.googleCredentials??env.ORBUFF_GOOGLE_SERVICE_ACCOUNT_JSON);
  const appleConfigured=!!(bundleId&&appAppleId&&appleRootCertificates.length);
  const googleConfigured=!!(googlePackageName&&googleCredentialsValid(googleCredentials));
  const ready=appleConfigured&&googleConfigured;
  let appleLib=opts.appleLib||null;
  let GoogleAuth=opts.GoogleAuth||null;
  const fetchFn=opts.fetchFn||global.fetch;
  let appleVerifiers=null;
  let googleAuth=null;
  let googleClientPromise=null;

  function loadApple(){
    if(!appleLib)appleLib=require('@apple/app-store-server-library');
    return appleLib;
  }
  function loadGoogleAuth(){
    if(!GoogleAuth)({GoogleAuth}=require('google-auth-library'));
    return GoogleAuth;
  }
  function buildAppleVerifiers(){
    if(appleVerifiers)return appleVerifiers;
    if(!appleConfigured)throw new Error('apple_provider_not_configured');
    const {SignedDataVerifier,Environment}=loadApple();
    appleVerifiers={
      sandbox:new SignedDataVerifier(appleRootCertificates,appleOnlineChecks,Environment.SANDBOX,bundleId),
      production:new SignedDataVerifier(appleRootCertificates,appleOnlineChecks,Environment.PRODUCTION,bundleId,appAppleId),
      Environment
    };
    return appleVerifiers;
  }
  async function googleAccessToken(){
    if(!googleConfigured)throw new Error('google_provider_not_configured');
    if(!googleAuth){const Auth=loadGoogleAuth();googleAuth=new Auth({credentials:googleCredentials,scopes:[GOOGLE_SCOPE]});}
    if(!googleClientPromise)googleClientPromise=googleAuth.getClient();
    const client=await googleClientPromise;
    const access=await client.getAccessToken();
    const token=typeof access==='string'?access:text(access?.token);
    if(!token)throw new Error('google_access_token_missing');
    return token;
  }
  async function verifyApple({productId,transactionId,verificationData}){
    if(!appleConfigured)throw new Error('apple_provider_not_configured');
    const unsigned=decodeJwtPayload(verificationData);
    const hinted=environmentLabel(unsigned?.environment);
    const verifiers=buildAppleVerifiers();
    const verifier=hinted.includes('sandbox')?verifiers.sandbox:hinted.includes('production')?verifiers.production:null;
    if(!verifier)throw new Error('apple_environment_missing');
    let decoded;
    try{decoded=await verifier.verifyAndDecodeTransaction(String(verificationData));}
    catch(e){const err=new Error('apple_transaction_verification_failed');err.cause=e;throw err;}
    const decodedTx=text(decoded?.transactionId);
    const decodedProduct=text(decoded?.productId);
    const decodedBundle=text(decoded?.bundleId);
    if(decodedBundle!==bundleId)throw new Error('apple_bundle_mismatch');
    if(decodedProduct!==productId)throw new Error('apple_product_mismatch');
    if(decodedTx!==transactionId)throw new Error('apple_transaction_mismatch');
    const revoked=decoded?.revocationDate!=null||decoded?.revocationReason!=null;
    return {
      valid:!revoked,
      provider:'apple',
      platform:'ios',
      productId:decodedProduct,
      transactionId:decodedTx,
      originalTransactionId:text(decoded?.originalTransactionId),
      environment:text(decoded?.environment)||hinted,
      purchaseTime:decoded?.purchaseDate??null,
      revoked,
      refunded:revoked,
      rawRef:decodedTx
    };
  }
  async function verifyGoogle({productId,transactionId,verificationData}){
    if(!googleConfigured)throw new Error('google_provider_not_configured');
    if(typeof fetchFn!=='function')throw new Error('google_fetch_unavailable');
    const purchaseToken=text(verificationData);if(!purchaseToken)throw new Error('google_purchase_token_missing');
    const accessToken=await googleAccessToken();
    const url=`https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(googlePackageName)}/purchases/products/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(purchaseToken)}`;
    const response=await fetchFn(url,{headers:{authorization:`Bearer ${accessToken}`,accept:'application/json'}});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(`google_provider_http_${response.status}`);
    if(Number(data?.purchaseState)!==0)throw new Error('google_purchase_not_purchased');
    if(Number(data?.consumptionState)!==0)throw new Error('google_purchase_already_consumed');
    const orderId=text(data?.orderId);
    if(orderId&&transactionId!==orderId&&transactionId!==purchaseToken)throw new Error('google_transaction_mismatch');
    return {
      valid:true,
      provider:'google_play',
      platform:'android',
      productId,
      transactionId,
      originalTransactionId:orderId,
      environment:Number(data?.purchaseType)===0?'test':'production',
      purchaseTime:data?.purchaseTimeMillis?Number(data.purchaseTimeMillis):null,
      revoked:false,
      refunded:false,
      rawRef:orderId||transactionId
    };
  }
  async function verify(input={}){
    const platform=text(input.platform).toLowerCase();
    if(platform==='ios')return verifyApple(input);
    if(platform==='android')return verifyGoogle(input);
    throw new Error('invalid_platform');
  }
  function status(){return {
    ready,
    appleConfigured,
    googleConfigured,
    appleRootCertificates:appleRootCertificates.length,
    appleAppIdConfigured:!!appAppleId,
    appleBundleId:bundleId,
    googlePackageName,
    googleServiceAccountConfigured:googleCredentialsValid(googleCredentials),
    onlineCertificateChecks:appleOnlineChecks
  };}
  return {ready,verify,status,verifyApple,verifyGoogle};
};
