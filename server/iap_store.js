const crypto=require('crypto');
const { Pool }=require('pg');

const PRODUCT_DIAMONDS=Object.freeze({
  'puffling.diamonds.25':25,
  'puffling.diamonds.75':75,
  'puffling.diamonds.250':250,
  'puffling.diamonds.600':600
});

function cleanWalletId(v){return String(v||'').replace(/[^A-Za-z0-9_-]/g,'').slice(0,64);}
function cleanTransaction(v){return String(v||'').replace(/[^A-Za-z0-9._:-]/g,'').slice(0,180);}
function cleanReason(v){return String(v||'').replace(/[^A-Za-z0-9._:-]/g,'').slice(0,48)||'spend';}
function b64url(buf){return Buffer.from(buf).toString('base64url');}
function timingSafe(a,b){try{const A=Buffer.from(String(a||'')),B=Buffer.from(String(b||''));return A.length===B.length&&crypto.timingSafeEqual(A,B);}catch{return false;}}
function hashClientKey(key){return crypto.createHash('sha256').update(String(key||'')).digest('hex');}
function secureDatabaseUrl(value){
  const url=String(value||'').trim();
  if(!url||/localhost|127\.0\.0\.1/.test(url))return url;
  return url.replace(/([?&])sslmode=require(?=(&|$))/i,'$1sslmode=verify-full');
}

module.exports=function createIapStore(opts={}){
  const databaseUrl=secureDatabaseUrl(opts.databaseUrl??process.env.DATABASE_URL??'');
  const walletSecret=String(opts.walletSecret??process.env.PUFFLING_WALLET_SECRET??'').trim();
  const providerMode=String(opts.providerMode??process.env.PUFFLING_IAP_PROVIDER_MODE??'disabled').trim().toLowerCase();
  const pool=opts.pool||((databaseUrl)?new Pool({connectionString:databaseUrl,max:4}):null);
  let ready=false;

  function sign(walletId){
    if(!walletSecret)throw new Error('wallet_secret_missing');
    const body=b64url(JSON.stringify({v:1,w:walletId}));
    const sig=b64url(crypto.createHmac('sha256',walletSecret).update(body).digest());
    return `${body}.${sig}`;
  }
  function verifyToken(token){
    if(!walletSecret)return null;
    const [body,sig]=String(token||'').split('.');if(!body||!sig)return null;
    const expected=b64url(crypto.createHmac('sha256',walletSecret).update(body).digest());
    if(!timingSafe(sig,expected))return null;
    try{const data=JSON.parse(Buffer.from(body,'base64url').toString('utf8'));const id=cleanWalletId(data?.w);return data?.v===1&&id?id:null;}catch{return null;}
  }
  async function init(){
    if(!pool)return false;
    await pool.query(`CREATE TABLE IF NOT EXISTS puffling_wallets(
      wallet_id varchar(64) PRIMARY KEY,
      client_key_hash char(64) NOT NULL,
      paid_diamonds integer NOT NULL DEFAULT 0 CHECK(paid_diamonds>=0),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS puffling_iap_transactions(
      transaction_id varchar(180) PRIMARY KEY,
      wallet_id varchar(64) NOT NULL REFERENCES puffling_wallets(wallet_id),
      platform varchar(16) NOT NULL,
      product_id varchar(80) NOT NULL,
      diamonds integer NOT NULL CHECK(diamonds>0),
      provider_payload jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS puffling_wallet_ledger(
      id bigserial PRIMARY KEY,
      wallet_id varchar(64) NOT NULL REFERENCES puffling_wallets(wallet_id),
      delta integer NOT NULL,
      reason varchar(48) NOT NULL,
      ref_id varchar(180),
      created_at timestamptz NOT NULL DEFAULT now()
    )`);
    ready=true;return true;
  }
  async function issueWallet(walletId,clientKey){
    if(!pool||!walletSecret)throw new Error('wallet_unavailable');
    const id=cleanWalletId(walletId),key=String(clientKey||'');
    if(!id||key.length<24||key.length>256)throw new Error('invalid_wallet_credentials');
    const keyHash=hashClientKey(key);
    const existing=await pool.query('SELECT client_key_hash,paid_diamonds FROM puffling_wallets WHERE wallet_id=$1',[id]);
    if(existing.rowCount){
      if(!timingSafe(existing.rows[0].client_key_hash,keyHash))throw new Error('wallet_key_mismatch');
      return {walletId:id,walletToken:sign(id),paidDiamondBalance:Number(existing.rows[0].paid_diamonds||0)};
    }
    await pool.query('INSERT INTO puffling_wallets(wallet_id,client_key_hash) VALUES($1,$2)',[id,keyHash]);
    return {walletId:id,walletToken:sign(id),paidDiamondBalance:0};
  }
  async function balance(token){
    if(!pool)throw new Error('database_unavailable');
    const id=verifyToken(token);if(!id)throw new Error('unauthorized');
    const q=await pool.query('SELECT paid_diamonds FROM puffling_wallets WHERE wallet_id=$1',[id]);
    if(!q.rowCount)throw new Error('wallet_not_found');
    return {walletId:id,paidDiamondBalance:Number(q.rows[0].paid_diamonds||0)};
  }
  async function spend(token,amount,reason='spend'){
    if(!pool)throw new Error('database_unavailable');
    const walletId=verifyToken(token);if(!walletId)throw new Error('unauthorized');
    const n=Math.max(0,Math.floor(Number(amount)||0));if(!n||n>10000)throw new Error('invalid_amount');
    const why=cleanReason(reason);
    const client=await pool.connect();
    try{
      await client.query('BEGIN');
      const q=await client.query('UPDATE puffling_wallets SET paid_diamonds=paid_diamonds-$2,updated_at=now() WHERE wallet_id=$1 AND paid_diamonds>=$2 RETURNING paid_diamonds',[walletId,n]);
      if(!q.rowCount)throw new Error('insufficient_paid_diamonds');
      await client.query('INSERT INTO puffling_wallet_ledger(wallet_id,delta,reason) VALUES($1,$2,$3)',[walletId,-n,why]);
      await client.query('COMMIT');
      return {ok:true,walletId,spent:n,paidDiamondBalance:Number(q.rows[0].paid_diamonds||0)};
    }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
  }
  async function verifyProviderPurchase({platform,productId,transactionId,verificationData}){
    const expected=PRODUCT_DIAMONDS[productId];if(!expected)throw new Error('unknown_product');
    if(!['ios','android'].includes(platform))throw new Error('invalid_platform');
    if(!transactionId||!verificationData)throw new Error('invalid_purchase_payload');
    // Production remains fail-closed until direct Apple/Google verification is implemented with store credentials.
    if(providerMode!=='apple_google')throw new Error('provider_not_configured');
    throw new Error('provider_verifier_not_implemented');
  }
  async function grantVerified(token,payload){
    if(!pool)throw new Error('database_unavailable');
    const walletId=verifyToken(token);if(!walletId)throw new Error('unauthorized');
    const productId=String(payload?.productId||'').slice(0,80);
    const transactionId=cleanTransaction(payload?.transactionId);
    const platform=String(payload?.platform||'').toLowerCase();
    const diamonds=PRODUCT_DIAMONDS[productId];if(!diamonds)throw new Error('unknown_product');
    if(Number(payload?.expectedDiamonds)!==diamonds)throw new Error('amount_mismatch');
    const verified=await verifyProviderPurchase({platform,productId,transactionId,verificationData:payload?.verificationData});
    const client=await pool.connect();
    try{
      await client.query('BEGIN');
      const exists=await client.query('SELECT wallet_id FROM puffling_wallets WHERE wallet_id=$1 FOR UPDATE',[walletId]);
      if(!exists.rowCount)throw new Error('wallet_not_found');
      const dup=await client.query('SELECT wallet_id,product_id,diamonds FROM puffling_iap_transactions WHERE transaction_id=$1 FOR UPDATE',[transactionId]);
      if(dup.rowCount){
        if(dup.rows[0].wallet_id!==walletId||dup.rows[0].product_id!==productId)throw new Error('transaction_conflict');
        const bal=await client.query('SELECT paid_diamonds FROM puffling_wallets WHERE wallet_id=$1',[walletId]);
        await client.query('COMMIT');
        return {ok:true,duplicate:true,walletId,productId,transactionId,diamonds,paidDiamondBalance:Number(bal.rows[0]?.paid_diamonds||0)};
      }
      await client.query('INSERT INTO puffling_iap_transactions(transaction_id,wallet_id,platform,product_id,diamonds,provider_payload) VALUES($1,$2,$3,$4,$5,$6)',[transactionId,walletId,platform,productId,diamonds,verified||null]);
      const bal=await client.query('UPDATE puffling_wallets SET paid_diamonds=paid_diamonds+$2,updated_at=now() WHERE wallet_id=$1 RETURNING paid_diamonds',[walletId,diamonds]);
      await client.query('INSERT INTO puffling_wallet_ledger(wallet_id,delta,reason,ref_id) VALUES($1,$2,$3,$4)',[walletId,diamonds,'iap_purchase',transactionId]);
      await client.query('COMMIT');
      return {ok:true,duplicate:false,walletId,productId,transactionId,diamonds,paidDiamondBalance:Number(bal.rows[0]?.paid_diamonds||0)};
    }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
  }
  async function close(){if(!opts.pool)await pool?.end();}
  return {PRODUCT_DIAMONDS,init,issueWallet,balance,spend,grantVerified,verifyToken,status:()=>({database:!!pool,walletSecret:!!walletSecret,providerMode,ready}),close};
};
