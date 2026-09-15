/* Orbuff — paid Diamond wallet client v1.1 */
(function(){
 const ID_KEY='pufflingWalletIdV1',KEY_KEY='pufflingWalletClientKeyV1',TOKEN_KEY='pufflingWalletTokenV1',PAID_KEY='pufflingPaidDiamondsCacheV1';
 let state='idle',lastError='',inflight=null,accountLinked=false;
 const rand=()=>{try{return crypto.randomUUID().replace(/-/g,'')}catch(e){return Math.random().toString(36).slice(2)+Date.now().toString(36)+Math.random().toString(36).slice(2)}};
 function apiBase(){return String(window.skyPuffConfig?.gameApiUrl||'https://puffling-race-server.onrender.com').replace(/\/$/,'');}
 function ensureCreds(){
  let id=localStorage.getItem(ID_KEY),key=localStorage.getItem(KEY_KEY);
  if(!id){id='w_'+rand()+rand();localStorage.setItem(ID_KEY,id);}
  if(!key){key=rand()+rand()+rand();localStorage.setItem(KEY_KEY,key);}
  return {walletId:id,clientKey:key};
 }
 function token(){return localStorage.getItem(TOKEN_KEY)||'';}
 function paidBalance(){const n=Number(localStorage.getItem(PAID_KEY));return Number.isFinite(n)?Math.max(0,Math.floor(n)):0;}
 function acceptServerBalance(v){const n=Math.max(0,Math.floor(Number(v)||0));localStorage.setItem(PAID_KEY,String(n));window.dispatchEvent?.(new CustomEvent('puffling:wallet',{detail:{state,paidDiamondBalance:n,accountLinked}}));return n;}
 function status(){return {state,ready:state==='ready',paidDiamondBalance:paidBalance(),hasToken:!!token(),accountLinked,lastError,apiBase:apiBase()};}
 async function request(path,opts={}){
  const headers={'content-type':'application/json',...(opts.headers||{})};if(opts.auth!==false&&token())headers.authorization=`Bearer ${token()}`;if(opts.accountToken)headers.authorization=`Bearer ${opts.accountToken}`;
  const res=await fetch(apiBase()+path,{method:opts.method||'GET',headers,body:opts.body?JSON.stringify(opts.body):undefined});
  const data=await res.json().catch(()=>({ok:false,error:`http_${res.status}`}));if(!res.ok||data?.ok===false)throw new Error(String(data?.error||`http_${res.status}`));return data;
 }
 async function accountIdentity(){
  const transport=window.SkyPuffRaceTransport;if(!transport?.ensureGuestIdentity)return null;
  try{return await transport.ensureGuestIdentity();}catch(e){throw e;}
 }
 async function connectAccountWallet(){
  const identity=await accountIdentity();if(!identity?.token||!identity?.accountId)return null;
  const data=await request('/wallet/account-session',{method:'POST',auth:false,accountToken:identity.token});
  if(!data?.walletToken||!data?.walletId)throw new Error('wallet_token_missing');
  localStorage.setItem(ID_KEY,String(data.walletId));localStorage.removeItem(KEY_KEY);localStorage.setItem(TOKEN_KEY,String(data.walletToken));accountLinked=data.accountLinked===true;acceptServerBalance(data.paidDiamondBalance);return data;
 }
 async function connectLegacyWallet(){
  const creds=ensureCreds();const data=await request('/wallet/session',{method:'POST',auth:false,body:creds});if(!data.walletToken)throw new Error('wallet_token_missing');localStorage.setItem(TOKEN_KEY,String(data.walletToken));accountLinked=data.accountLinked===true;acceptServerBalance(data.paidDiamondBalance);return data;
 }
 async function init(force=false){
  if(inflight&&!force)return inflight;if(state==='ready'&&!force)return status();
  inflight=(async()=>{state='connecting';lastError='';try{
    let linked=null;try{linked=await connectAccountWallet();}catch(e){lastError=String(e?.message||e);if(!/account_endpoint_missing|auth_unavailable|account_recovery_unavailable/.test(lastError))throw e;}
    if(!linked){await connectLegacyWallet();}
    state='ready';lastError='';window.dispatchEvent?.(new CustomEvent('puffling:wallet',{detail:status()}));return status();
  }catch(e){state='unavailable';accountLinked=false;lastError=String(e?.message||e);return status();}finally{inflight=null;}})();return inflight;
 }
 async function refreshBalance(){if(state!=='ready')await init();if(state!=='ready')return status();try{const data=await request('/wallet/balance');accountLinked=data.accountLinked===true||accountLinked;acceptServerBalance(data.paidDiamondBalance);lastError='';return status();}catch(e){lastError=String(e?.message||e);if(lastError==='wallet_disabled'){state='unavailable';accountLinked=false;}return status();}}
 async function spend(amount,reason='mystery_box'){
  const n=Math.max(0,Math.floor(Number(amount)||0));if(!n)return {ok:true,spent:0,paidDiamondBalance:paidBalance()};if(state!=='ready')await init();if(state!=='ready')return {ok:false,error:lastError||'wallet_unavailable'};
  try{const data=await request('/wallet/spend',{method:'POST',body:{amount:n,reason}});acceptServerBalance(data.paidDiamondBalance);lastError='';return data;}catch(e){lastError=String(e?.message||e);if(lastError==='wallet_disabled'){state='unavailable';accountLinked=false;}return {ok:false,error:lastError};}
 }
 function clearLocal(){for(const key of [ID_KEY,KEY_KEY,TOKEN_KEY,PAID_KEY])try{localStorage.removeItem(key);}catch(e){}state='idle';lastError='';accountLinked=false;}
 window.PufflingDiamondWallet={init,status,token,paidBalance,acceptServerBalance,refreshBalance,spend,apiBase,clearLocal};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>init(),80));else setTimeout(()=>init(),80);
})();
