module.exports=function createBossSessionHttp(auth,store){
 function json(res,status,body){res.writeHead(status,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(body));}
 function bearer(req){const h=String(req.headers?.authorization||'');return h.startsWith('Bearer ')?h.slice(7):'';}
 async function body(req){let raw='',size=0;for await(const c of req){size+=c.length;if(size>16384)throw new Error('body_too_large');raw+=c.toString();}return raw?JSON.parse(raw):{};}
 return async function handle(req,res){
  const path=String(req.url||'').split('?')[0];if(!path.startsWith('/api/boss/session'))return false;
  const verified=auth.verify(bearer(req));if(!verified.ok)return json(res,401,{ok:false,error:'auth_required'}),true;
  if(!store.statusInfo().ready)return json(res,503,{ok:false,error:'boss_session_unavailable'}),true;
  try{
   if(path==='/api/boss/session/start'&&req.method==='POST'){
    const data=await body(req),bossRef=String(data?.bossRef||'').slice(0,96);
    if(!/^[A-Za-z0-9:_+.-]{1,96}$/.test(bossRef))return json(res,400,{ok:false,error:'invalid_boss'}),true;
    const session=await store.issue(verified.accountId,bossRef);return json(res,201,{ok:true,...session,serverIssued:true}),true;
   }
   if(path==='/api/boss/session/status'&&req.method==='POST'){
    const data=await body(req),session=await store.status(verified.accountId,String(data?.sessionId||''));
    if(!session)return json(res,404,{ok:false,error:'session_not_found'}),true;
    return json(res,200,{ok:true,...session}),true;
   }
   return json(res,405,{ok:false,error:'method_not_allowed'}),true;
  }catch(e){return json(res,String(e?.message||e)==='body_too_large'?413:400,{ok:false,error:'invalid_request'}),true;}
 };
};