const crypto=require('crypto');
function json(res,status,body){res.writeHead(status,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(body));return true;}
function bearer(req){const h=String(req.headers?.authorization||'');const m=h.match(/^Bearer\s+(.+)$/i);return m?m[1].trim():'';}
module.exports=function createAccountHttp(auth,rankedStore){
  return async function handleAccount(req,res){
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/api/account/status'&&req.method==='GET')return json(res,200,{ok:true,enabled:auth.enabled(),issuer:auth.issuer,audience:auth.audience,ttlSeconds:auth.ttlSeconds});
    if(url.pathname==='/api/account/guest'&&req.method==='POST'){
      if(!auth.enabled())return json(res,503,{ok:false,error:'auth_unavailable'});
      const accountId='guest_'+crypto.randomBytes(18).toString('base64url');
      try{const token=auth.issue(accountId,{kind:'guest'});return json(res,201,{ok:true,accountId,token,expiresIn:auth.ttlSeconds,kind:'guest'});}catch(e){return json(res,503,{ok:false,error:String(e?.message||e)});}
    }
    if(url.pathname==='/api/account/me'&&req.method==='GET'){
      const verified=auth.verify(bearer(req));if(!verified.ok)return json(res,401,{ok:false,error:verified.error});
      let profile=null;
      if(rankedStore){try{profile=await rankedStore.get(verified.accountId);}catch(e){}}
      return json(res,200,{ok:true,accountId:verified.accountId,kind:String(verified.claims?.kind||'guest'),profile,serverAuthoritative:true});
    }
    return false;
  };
};
