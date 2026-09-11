const assert=require('assert');
const createHttp=require('./trade_inventory_http');
function req(method,url,token,payload){const chunks=payload?[Buffer.from(JSON.stringify(payload))]:[];return{method,url,headers:{authorization:token?`Bearer ${token}`:''},async *[Symbol.asyncIterator](){for(const c of chunks)yield c;}};}
function res(){return{status:0,headers:null,body:'',writeHead(s,h){this.status=s;this.headers=h;},end(v=''){this.body+=v;}};}
(async()=>{
 const auth={verify(token){return token==='good'?{ok:true,accountId:'acct_a',claims:{kind:'guest'}}:{ok:false,error:'invalid_token'};}};
 let migrated=false;const inventory={owned:{ember:2,shadow:1},vault:['shadow']};
 const store={status:()=>({ready:true}),snapshot:async id=>{assert.equal(id,'acct_a');return inventory;},migrateLegacy:async(id,owned,vault)=>{assert.equal(id,'acct_a');assert.deepEqual(owned,{ember:2,shadow:1});assert.deepEqual(vault,['shadow']);if(migrated)return{applied:false,duplicate:true,version:1};migrated=true;return{applied:true,duplicate:false,version:1,count:2,protectedCount:1};}};
 const handle=createHttp(auth,store);
 let r=res();await handle(req('GET','/api/trade/inventory',''),r);assert.equal(r.status,401,'inventory read must require auth');
 r=res();await handle(req('POST','/api/trade/inventory/migrate','good',{owned:{ember:2,shadow:1},vault:['shadow']}),r);assert.equal(r.status,201);let b=JSON.parse(r.body);assert.equal(b.applied,true);assert.deepEqual(b.vault,['shadow']);
 r=res();await handle(req('POST','/api/trade/inventory/migrate','good',{owned:{ember:2,shadow:1},vault:['shadow']}),r);assert.equal(r.status,200);assert.equal(JSON.parse(r.body).duplicate,true,'migration must be one-time/idempotent');
 r=res();await handle(req('GET','/api/trade/inventory','good'),r);assert.equal(r.status,200);b=JSON.parse(r.body);assert.deepEqual(b.owned,inventory.owned);assert.deepEqual(b.vault,inventory.vault);
 console.log('Trade inventory HTTP checks passed');
})().catch(e=>{console.error(e);process.exit(1);});
