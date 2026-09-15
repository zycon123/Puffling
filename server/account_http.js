const crypto=require('crypto');
function json(res,status,body){res.writeHead(status,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(body));return true;}
function bearer(req){const h=String(req.headers?.authorization||'');const m=h.match(/^Bearer\s+(.+)$/i);return m?m[1].trim():'';}
function readJson(req,maxBytes=4096){return new Promise((resolve,reject)=>{let raw='',size=0;req.on('data',chunk=>{size+=chunk.length;if(size>maxBytes){reject(new Error('payload_too_large'));req.destroy();return;}raw+=chunk;});req.on('end',()=>{if(!raw)return resolve({});try{resolve(JSON.parse(raw));}catch{reject(new Error('invalid_json'));}});req.on('error',reject);});}
function newRecoveryKey(){return crypto.randomBytes(24).toString('base64url');}
module.exports=function createAccountHttp(auth,rankedStore,accountStore){
  return async function handleAccount(req,res){
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/api/account/status'&&req.method==='GET')return json(res,200,{ok:true,enabled:auth.enabled(),issuer:auth.issuer,audience:auth.audience,ttlSeconds:auth.ttlSeconds,deletionReady:!!accountStore?.status?.().ready,recoveryReady:!!accountStore?.status?.().recovery});
    if(url.pathname==='/api/account/guest'&&req.method==='POST'){
      if(!auth.enabled())return json(res,503,{ok:false,error:'auth_unavailable'});
      if(!accountStore?.status?.().recovery)return json(res,503,{ok:false,error:'account_recovery_unavailable'});
      const accountId='guest_'+crypto.randomBytes(18).toString('base64url'),recoveryKey=newRecoveryKey();
      try{await accountStore.registerAccount(accountId,recoveryKey);const token=auth.issue(accountId,{kind:'guest'});return json(res,201,{ok:true,accountId,token,recoveryKey,expiresIn:auth.ttlSeconds,kind:'guest',recoveryAvailable:true});}catch(e){return json(res,503,{ok:false,error:String(e?.message||e)});}
    }
    if(url.pathname==='/api/account/recover'&&req.method==='POST'){
      if(!auth.enabled()||!accountStore?.status?.().recovery)return json(res,503,{ok:false,error:'account_recovery_unavailable'});
      let body;try{body=await readJson(req);}catch(e){return json(res,e.message==='payload_too_large'?413:400,{ok:false,error:e.message});}
      try{const out=await accountStore.recoverAccount(body.accountId,body.recoveryKey);const token=auth.issue(out.accountId,{kind:'guest',recovered:true});return json(res,200,{ok:true,accountId:out.accountId,token,expiresIn:auth.ttlSeconds,kind:'guest',recovered:true});}catch(e){const code=String(e?.message||'invalid_recovery_credentials');return json(res,code==='invalid_recovery_credentials'?401:503,{ok:false,error:code});}
    }
    if(url.pathname==='/api/account/recovery'&&req.method==='POST'){
      const verified=auth.verify(bearer(req));if(!verified.ok)return json(res,401,{ok:false,error:verified.error});
      if(!accountStore?.status?.().recovery)return json(res,503,{ok:false,error:'account_recovery_unavailable'});
      const recoveryKey=newRecoveryKey();
      try{await accountStore.setRecoveryKey(verified.accountId,recoveryKey);return json(res,200,{ok:true,accountId:verified.accountId,recoveryKey,rotated:true});}catch(e){return json(res,503,{ok:false,error:String(e?.message||'account_recovery_unavailable')});}
    }
    if(url.pathname==='/api/account/me'&&req.method==='GET'){
      const verified=auth.verify(bearer(req));if(!verified.ok)return json(res,401,{ok:false,error:verified.error});
      let profile=null;
      if(rankedStore){try{profile=await rankedStore.get(verified.accountId);}catch(e){}}
      return json(res,200,{ok:true,accountId:verified.accountId,kind:String(verified.claims?.kind||'guest'),profile,serverAuthoritative:true,deletionReady:!!accountStore?.status?.().ready,recoveryReady:!!accountStore?.status?.().recovery});
    }
    if(url.pathname==='/api/account/me'&&req.method==='DELETE'){
      const verified=auth.verify(bearer(req));if(!verified.ok)return json(res,401,{ok:false,error:verified.error});
      if(!accountStore?.status?.().ready)return json(res,503,{ok:false,error:'account_delete_unavailable'});
      let body;try{body=await readJson(req);}catch(e){return json(res,e.message==='payload_too_large'?413:400,{ok:false,error:e.message});}
      if(String(body?.confirm||'').toUpperCase()!=='DELETE')return json(res,400,{ok:false,error:'delete_confirmation_required'});
      try{
        const result=await accountStore.deleteAccount(verified.accountId);
        auth.revoke(verified.accountId);
        return json(res,200,{ok:true,deleted:true,accountId:verified.accountId,kind:String(verified.claims?.kind||'guest'),removed:result.removed||{}});
      }catch(e){return json(res,503,{ok:false,error:String(e?.message||'account_delete_failed')});}
    }
    return false;
  };
};
