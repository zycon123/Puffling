function json(res,status,body){res.writeHead(status,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(body));}
module.exports=function createRankedHttp(store){
  return async function handleRanked(req,res){
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/api/ranked/status'&&req.method==='GET'){
      return json(res,200,{ok:true,...store.status(),serverAuthoritative:false,version:store.version});
    }
    // Temporary diagnostics only. This endpoint does not mutate rank.
    if(url.pathname==='/api/ranked/profile'&&req.method==='GET'){
      const accountId=url.searchParams.get('accountId')||'';
      if(!store.cleanAccountId(accountId))return json(res,400,{ok:false,error:'invalid_account'});
      try{return json(res,200,{ok:true,profile:await store.get(accountId),serverAuthoritative:false});}
      catch(e){const code=String(e?.message||e);return json(res,code==='ranked_unavailable'?503:400,{ok:false,error:code});}
    }
    return false;
  };
};
