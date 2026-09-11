module.exports=function createAcquisitionHttp(auth,store){
 function json(res,status,body){res.writeHead(status,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(body));}
 function bearer(req){const h=String(req.headers?.authorization||'');return h.startsWith('Bearer ')?h.slice(7):'';}
 async function body(req){let raw='',size=0;for await(const c of req){size+=c.length;if(size>32768)throw new Error('body_too_large');raw+=c.toString();}return raw?JSON.parse(raw):{};}
 return async function handle(req,res){
  const path=String(req.url||'').split('?')[0];if(path!=='/api/acquisition/boss'||req.method!=='POST')return false;
  const verified=auth.verify(bearer(req));if(!verified.ok)return json(res,401,{ok:false,error:'auth_required'}),true;
  if(!store.status().ready)return json(res,503,{ok:false,error:'acquisition_unavailable'}),true;
  try{
   await body(req);
   json(res,403,{ok:false,error:'boss_proof_required',serverAuthoritative:false});return true;
  }catch(e){const code=String(e?.message||e);json(res,code==='body_too_large'?413:400,{ok:false,error:'invalid_request'});return true;}
 };
};