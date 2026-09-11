const crypto=require('crypto');
const { Pool }=require('pg');

const PRODUCT_DIAMONDS=Object.freeze({
  'puffling.diamonds.25':25,
  'puffling.diamonds.75':75,
  'puffling.diamonds.250':250,
  'puffling.diamonds.600':600
});

function cleanPlayerId(v){return String(v||'').replace(/[^A-Za-z0-9_-]/g,'').slice(0,40);}
function cleanTransaction(v){return String(v||'').replace(/[^A-Za-z0-9._:-]/g,'').slice(0,180);}
function b64url(buf){return Buffer.from(buf).toString('base64url');}
function timingSafe(a,b){try{const A=Buffer.from(a),B=Buffer.from(b);return A.length===B.length&&crypto.timingSafeEqual(A,B);}catch{return false;}}

module.exports=function createIapStore(opts={}){
  const databaseUrl=String(opts.databaseUrl||process.env.DATABASE_URL||'').trim();
  const walletSecret=String(opts.walletSecret||process.env.PUFFLING_WALLET_SECRET||'').trim();
  const providerMode=String(opts.providerMode||process.env.PUFFLING_IAP_PROVIDER_MODE||'disabled').trim().toLowerCase();
  const pool=databaseUrl?new Pool({connectionString:databaseUrl,ssl:databaseUrl.includes('localhost')?false:{rejectUnauthorized:false},max:4}):null;
  let ready=false;

  function sign(playerId){
    if(!walletSecret)throw new Error('wallet_secret_missing');
    const body=b64url(JSON.stringify({v:1,p:playerId}));
    const sig=b64url(crypto.createHmac('sha256',walletSecret).update(body).digest());
    return `${body}.${sig}`;
  }
  function verifyToken(token){
    if(!walletSecret)return null;
    const [body,sig]=String(token||'').split('.');if(!body||!sig)return null;
    const expected=b64url(crypto.createHmac('sha256',walletSecret).update(body).digest());
    if(!timingSafe(sig,expected))return null;
    try{const data=JSON.parse(Buffer.from(body,'base64url').toString('utf8'));const p=cleanPlayerId(data?.p);return data?.v===1&&p?p:null;}catch{return null;}
  }
  async function init(){
    if(!pool)return false;
    await pool.query(`CREATE TABLE IF NOT EXISTS puffling_wallets(
      player_id varchar(40) PRIMARY KEY,
      diamonds integer NOT NULL DEFAULT 0 CHECK(diamonds>=0),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS puffling_iap_transactions(
      transaction_id varchar(180) PRIMARY KEY,
      player_id varchar(40) NOT NULL REFERENCES puffling_wallets(player_id),
      platform varchar(16) NOT NULL,
      product_id varchar(80) NOT NULL,
      diamonds integer NOT NULL CHECK(diamonds>0),
      provider_payload jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    )`);
    ready=true;return true;
  }
  async function ensureWallet(playerId){
    const id=cleanPlayerId(playerId);if(!id)throw new Error('invalid_player');
    await pool.query('INSERT INTO puffling_wallets(player_id) VALUES($1) ON CONFLICT(player_id) DO NOTHING',[id]);
    return id;
  }
  async function issueWallet(playerId){
    if(!pool||!walletSecret)throw new Error('wallet_unavailable');
    const id=await ensureWallet(playerId);
    const q=await pool.query('SELECT diamonds FROM puffling_wallets WHERE player_id=$1',[id]);
    return {playerId:id,walletToken:sign(id),diamondBalance:Number(q.rows[0]?.diamonds||0)};
  }
  async function balance(token){
    if(!pool)throw new Error('database_unavailable');
    const id=verifyToken(token);if(!id)throw new Error('unauthorized');
    await ensureWallet(id);const q=await pool.query('SELECT diamonds FROM puffling_wallets WHERE player_id=$1',[id]);
    return {playerId:id,diamondBalance:Number(q.rows[0]?.diamonds||0)};
  }
  async function verifyProviderPurchase({platform,productId,transactionId,verificationData}){
    const expected=PRODUCT_DIAMONDS[productId];if(!expected)throw new Error('unknown_product');
    if(!['ios','android'].includes(platform))throw new Error('invalid_platform');
    if(!transactionId||!verificationData)throw new Error('invalid_purchase_payload');
    // Production remains fail-closed until direct Apple/Google verification credentials are configured.
    if(providerMode!=='apple_google')throw new Error('provider_not_configured');
    throw new Error('provider_verifier_not_implemented');
  }
  async function grantVerified(token,payload){
    if(!pool)throw new Error('database_unavailable');
    const playerId=verifyToken(token);if(!playerId)throw new Error('unauthorized');
    const productId=String(payload?.productId||'').slice(0,80);
    const transactionId=cleanTransaction(payload?.transactionId);
    const platform=String(payload?.platform||'').toLowerCase();
    const diamonds=PRODUCT_DIAMONDS[productId];if(!diamonds)throw new Error('unknown_product');
    if(Number(payload?.expectedDiamonds)!==diamonds)throw new Error('amount_mismatch');
    const verified=await verifyProviderPurchase({platform,productId,transactionId,verificationData:payload?.verificationData});
    const client=await pool.connect();
    try{
      await client.query('BEGIN');
      await client.query('INSERT INTO puffling_wallets(player_id) VALUES($1) ON CONFLICT(player_id) DO NOTHING',[playerId]);
      const dup=await client.query('SELECT player_id,product_id,diamonds FROM puffling_iap_transactions WHERE transaction_id=$1 FOR UPDATE',[transactionId]);
      if(dup.rowCount){
        if(dup.rows[0].player_id!==playerId||dup.rows[0].product_id!==productId)throw new Error('transaction_conflict');
        const bal=await client.query('SELECT diamonds FROM puffling_wallets WHERE player_id=$1',[playerId]);
        await client.query('COMMIT');
        return {ok:true,duplicate:true,playerId,productId,transactionId,diamonds,diamondBalance:Number(bal.rows[0]?.diamonds||0)};
      }
      await client.query('INSERT INTO puffling_iap_transactions(transaction_id,player_id,platform,product_id,diamonds,provider_payload) VALUES($1,$2,$3,$4,$5,$6)',[transactionId,playerId,platform,productId,diamonds,verified||null]);
      const bal=await client.query('UPDATE puffling_wallets SET diamonds=diamonds+$2,updated_at=now() WHERE player_id=$1 RETURNING diamonds',[playerId,diamonds]);
      await client.query('COMMIT');
      return {ok:true,duplicate:false,playerId,productId,transactionId,diamonds,diamondBalance:Number(bal.rows[0]?.diamonds||0)};
    }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
  }
  async function close(){await pool?.end();}
  return {PRODUCT_DIAMONDS,init,issueWallet,balance,grantVerified,verifyToken,status:()=>({database:!!pool,walletSecret:!!walletSecret,providerMode,ready}),close};
};
