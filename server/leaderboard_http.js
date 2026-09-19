const {allowedOrigin}=require('./cors');
function json(res,status,payload,origin=''){
  const headers={'content-type':'application/json','cache-control':'no-store'};
  if(origin)headers['access-control-allow-origin']=origin;
  res.writeHead(status,headers);res.end(JSON.stringify(payload));return true;
}
function bearer(req){const h=String(req.headers?.authorization||'');const m=h.match(/^Bearer\s+(.+)$/i);return m?m[1].trim():'';}
function readJson(req,limit=16*1024){
  return new Promise((resolve,reject)=>{let size=0,body='';req.setEncoding('utf8');req.on('data',chunk=>{size+=Buffer.byteLength(chunk);if(size>limit){reject(new Error('body_too_large'));req.destroy();return;}body+=chunk;});req.on('end',()=>{if(!body)return resolve({});try{resolve(JSON.parse(body));}catch{reject(new Error('invalid_json'));}});req.on('error',reject);});
}
function clientKey(req){return String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim().slice(0,80);}
module.exports=function createLeaderboardHttp(store,auth){
  const rate=new Map();
  function allowSubmit(req){
    const key=clientKey(req),t=Date.now(),windowMs=60_000,max=8;let row=rate.get(key);
    if(!row||t-row.start>=windowMs){row={start:t,count:0};rate.set(key,row);}
    row.count++;
    if(rate.size>2000)for(const [k,v] of rate)if(t-v.start>windowMs*2)rate.delete(k);
    return row.count<=max;
  }
  return async function handle(req,res){
    let url;try{url=new URL(req.url,'http://localhost');}catch{return false;}
    const path=url.pathname;if(path!=='/leaderboard'&&path!=='/score')return false;
    const origin=allowedOrigin(req);
    if(req.method==='OPTIONS'){
      const headers={'access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type,authorization','access-control-max-age':'600'};
      if(origin)headers['access-control-allow-origin']=origin;res.writeHead(204,headers);res.end();return true;
    }
    try{
      if(req.method==='GET'&&path==='/leaderboard'){
        const rows=await store.list(url.searchParams.get('limit'));json(res,200,rows,origin);return true;
      }
      if(req.method==='POST'&&path==='/score'){
        if(!allowSubmit(req)){json(res,429,{ok:false,error:'rate_limited'},origin);return true;}
        let accountId=null;const token=bearer(req);
        if(token&&auth){const verified=auth.verify(token);if(!verified.ok){json(res,401,{ok:false,error:verified.error},origin);return true;}accountId=verified.accountId;}
        const body=await readJson(req),out=await store.submit({...body,accountId});json(res,201,out,origin);return true;
      }
      json(res,405,{ok:false,error:'method_not_allowed'},origin);return true;
    }catch(e){
      const code=String(e?.message||'server_error');
      const status=code==='leaderboard_unavailable'?503:['invalid_height','invalid_signature','invalid_json','body_too_large'].includes(code)?400:500;
      json(res,status,{ok:false,error:code},origin);return true;
    }
  };
};
