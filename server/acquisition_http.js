const crypto=require('crypto');
module.exports=function createAcquisitionHttp(auth,store){
 const REWARDS={common:['ember','volt','frost','wind'],epic:['stormwing'],legendary:['aurora']};
 function json(res,status,body){res.writeHead(status,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(body));}
 function bearer(req){const h=String(req.headers?.authorization||'');return h.startsWith('Bearer ')?h.slice(7):'';}
 async function body(req){let raw='',size=0;for await(const c of req){size+=c.length;if(size>32768)throw new Error('body_too_large');raw+=c.toString();}return raw?JSON.parse(raw):{};}
 function pick(list){return list[crypto.randomInt(0,list.length)];}
 function roll(){const drop=crypto.randomInt(0,10000);if(drop>=3500)return null;const rarity=crypto.randomInt(0,10000);if(rarity<100)return pick(REWARDS.legendary);if(rarity<500)return pick(REWARDS.epic);return pick(REWARDS.common);}
 return async function handle(req,res){
  const path=String(req.url||'').split('?')[0];if(path!=='/api/acquisition/boss'||req.method!=='POST')return false;
  const verified=auth.verify(bearer(req));if(!verified.ok)return json(res,401,{ok:false,error:'auth_required'}),true;
  if(!store.status().ready)return json(res,503,{ok:false,error:'acquisition_unavailable'}),true;
  try{
   const data=await body(req),bossRef=String(data?.bossRef||'').slice(0,96);
   if(!bossRef||!/^[A-Za-z0-9:_+.-]{1,96}$/.test(bossRef))return json(res,400,{ok:false,error:'invalid_reward'}),true;
   const grantId=store.bossGrantId(verified.accountId,bossRef);
   const existing=await store.getGrant(grantId);
   if(existing)return json(res,200,{ok:true,applied:false,duplicate:true,grantId,pufflingId:existing.pufflingId||null,noDrop:!existing.pufflingId,serverAuthoritative:true}),true;
   const pufflingId=roll();
   const result=await store.grant(null,{grantId,accountId:verified.accountId,pufflingId:pufflingId||'NONE',source:'boss',sourceRef:bossRef});
   json(res,201,{ok:true,...result,pufflingId:pufflingId||null,noDrop:!pufflingId,serverAuthoritative:true});return true;
  }catch(e){const code=String(e?.message||e);json(res,code==='invalid_grant'?400:500,{ok:false,error:code==='invalid_grant'?'invalid_reward':'server_error'});return true;}
 };
};