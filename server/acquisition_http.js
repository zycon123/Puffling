module.exports=function createAcquisitionHttp(auth,store){
 function json(res,status,body){res.writeHead(status,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(body));}
 function bearer(req){const h=String(req.headers?.authorization||'');return h.startsWith('Bearer ')?h.slice(7):'';}
 async function body(req){let raw='',size=0;for await(const c of req){size+=c.length;if(size>32768)throw new Error('body_too_large');raw+=c.toString();}return raw?JSON.parse(raw):{};}
 return async function handle(req,res){
  const path=String(req.url||'').split('?')[0];if(path!=='/api/acquisition/boss'||req.method!=='POST')return false;
  const verified=auth.verify(bearer(req));if(!verified.ok)return json(res,401,{ok:false,error:'auth_required'}),true;
  if(!store.status().ready)return json(res,503,{ok:false,error:'acquisition_unavailable'}),true;
  try{
   const data=await body(req),bossRef=String(data?.bossRef||'').slice(0,96),pufflingId=String(data?.pufflingId||'').slice(0,64);
   if(!bossRef||!pufflingId)return json(res,400,{ok:false,error:'invalid_reward'}),true;
   const grantId=store.bossGrantId(verified.accountId,bossRef);
   const result=await store.grant(null,{grantId,accountId:verified.accountId,pufflingId,source:'boss',sourceRef:bossRef});
   json(res,result.applied?201:200,{ok:true,...result,serverAuthoritative:true});return true;
  }catch(e){const code=String(e?.message||e);json(res,code==='invalid_grant'?400:500,{ok:false,error:code==='invalid_grant'?'invalid_reward':'server_error'});return true;}
 };
};
