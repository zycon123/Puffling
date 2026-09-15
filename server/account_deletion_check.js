const assert=require('assert');
const {Readable}=require('stream');
const createAccountAuth=require('./account_auth');
const createAccountStore=require('./account_store');
const createAccountHttp=require('./account_http');

(async()=>{
  const statements=[];
  const client={
    async query(sql,args=[]){
      statements.push({sql:String(sql),args});
      if(/to_regclass/.test(sql))return{rows:[{name:String(args[0]||'').replace(/^public\./,'')}],rowCount:1};
      if(/^DELETE /i.test(String(sql).trim()))return{rows:[],rowCount:1};
      return{rows:[],rowCount:1};
    },
    release(){}
  };
  const pool={
    async query(){return{rows:[],rowCount:0};},
    async connect(){return client;}
  };
  const store=createAccountStore({pool});
  assert.equal(await store.init(),true);
  const auth=createAccountAuth({secret:'a'.repeat(64),ttlSeconds:3600});
  const accountId='guest_store_delete_test';
  const token=auth.issue(accountId,{kind:'guest'});
  assert.equal(auth.verify(token).ok,true);
  const handler=createAccountHttp(auth,null,store);
  const payload=JSON.stringify({confirm:'DELETE'});
  const req=Readable.from([payload]);
  req.method='DELETE';req.url='/api/account/me';req.headers={authorization:`Bearer ${token}`};
  const response={status:0,headers:{},body:'',writeHead(status,headers){this.status=status;this.headers=headers||{};},end(body=''){this.body=String(body);}};
  const handled=await handler(req,response);
  assert.equal(handled,true);
  assert.equal(response.status,200);
  const body=JSON.parse(response.body);
  assert.equal(body.ok,true);assert.equal(body.deleted,true);assert.equal(body.accountId,accountId);
  const after=auth.verify(token);
  assert.equal(after.ok,false);assert.equal(after.error,'account_deleted');
  const deletes=statements.filter(x=>/^DELETE /i.test(x.sql.trim()));
  assert.equal(deletes.length,6);
  assert(statements.some(x=>/puffling_deleted_accounts/.test(x.sql)&&/INSERT INTO/.test(x.sql)),'deleted-account tombstone missing');
  console.log('account deletion check ok');
})().catch(err=>{console.error(err);process.exitCode=1;});
