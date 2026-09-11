const crypto=require('crypto');

function b64url(input){return Buffer.from(input).toString('base64url');}
function cleanAccountId(value){const s=String(value||'').trim();return /^[A-Za-z0-9:_-]{3,96}$/.test(s)?s:'';}
function timingSafeEqual(a,b){const aa=Buffer.from(String(a)),bb=Buffer.from(String(b));return aa.length===bb.length&&crypto.timingSafeEqual(aa,bb);}

module.exports=function createAccountAuth(opts={}){
  const secret=String(opts.secret??process.env.PUFFLING_AUTH_SECRET??'').trim();
  const issuer=String(opts.issuer||'puffling-race');
  const ttlSeconds=Math.max(300,Math.min(86400,Number(opts.ttlSeconds||3600)));
  function enabled(){return secret.length>=32;}
  function sign(payload){return crypto.createHmac('sha256',secret).update(payload).digest('base64url');}
  function issue(accountId,extra={}){
    if(!enabled())throw new Error('auth_unavailable');
    const sub=cleanAccountId(accountId);if(!sub)throw new Error('invalid_account');
    const now=Math.floor(Date.now()/1000);
    const body=b64url(JSON.stringify({sub,iss:issuer,iat:now,exp:now+ttlSeconds,sid:crypto.randomBytes(12).toString('base64url'),...extra}));
    return `${body}.${sign(body)}`;
  }
  function verify(token){
    if(!enabled())return {ok:false,error:'auth_unavailable'};
    const raw=String(token||'');const parts=raw.split('.');if(parts.length!==2)return {ok:false,error:'invalid_token'};
    if(!timingSafeEqual(sign(parts[0]),parts[1]))return {ok:false,error:'invalid_signature'};
    let claims;try{claims=JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8'));}catch{return {ok:false,error:'invalid_token'};}
    const now=Math.floor(Date.now()/1000),accountId=cleanAccountId(claims.sub);
    if(!accountId||claims.iss!==issuer)return {ok:false,error:'invalid_claims'};
    if(!Number.isFinite(Number(claims.exp))||Number(claims.exp)<now)return {ok:false,error:'expired_token'};
    return {ok:true,accountId,claims};
  }
  return {enabled,issue,verify,cleanAccountId,issuer,ttlSeconds};
};
