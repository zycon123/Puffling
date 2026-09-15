const assert=require('assert');
const createAccountStore=require('./account_store');

(async()=>{
  const accounts=new Map(),deleted=new Set();
  const pool={
    async query(sql,args=[]){
      const s=String(sql).trim();
      if(/^CREATE TABLE/i.test(s))return{rows:[],rowCount:0};
      if(/^SELECT 1 FROM puffling_deleted_accounts/i.test(s))return{rows:deleted.has(args[0])?[{one:1}]:[],rowCount:deleted.has(args[0])?1:0};
      if(/^INSERT INTO puffling_accounts\(account_id,recovery_key_hash\)/i.test(s)&&/DO NOTHING RETURNING/i.test(s)){
        if(accounts.has(args[0]))return{rows:[],rowCount:0};accounts.set(args[0],{hash:args[1],recovered:false});return{rows:[{account_id:args[0]}],rowCount:1};
      }
      if(/^INSERT INTO puffling_accounts\(account_id,recovery_key_hash,recovery_rotated_at\)/i.test(s)){
        accounts.set(args[0],{hash:args[1],recovered:false});return{rows:[],rowCount:1};
      }
      if(/^SELECT recovery_key_hash FROM puffling_accounts/i.test(s)){const row=accounts.get(args[0]);return{rows:row?[{recovery_key_hash:row.hash}]:[],rowCount:row?1:0};}
      if(/^UPDATE puffling_accounts SET recovered_at/i.test(s)){const row=accounts.get(args[0]);if(row)row.recovered=true;return{rows:[],rowCount:row?1:0};}
      if(/^SELECT account_id FROM puffling_deleted_accounts/i.test(s))return{rows:[...deleted].map(account_id=>({account_id})),rowCount:deleted.size};
      throw new Error('unexpected pool query: '+s);
    },
    async connect(){return{
      async query(sql,args=[]){
        const s=String(sql).trim();
        if(['BEGIN','COMMIT','ROLLBACK'].includes(s)||/^SELECT pg_advisory_xact_lock/i.test(s))return{rows:[],rowCount:0};
        if(/^SELECT to_regclass/i.test(s)){const table=String(args[0]||'').replace(/^public\./,'');return{rows:[{name:table}],rowCount:1};}
        if(/^UPDATE puffling_wallets/i.test(s))return{rows:[],rowCount:0};
        if(/^DELETE FROM puffling_accounts/i.test(s)){const existed=accounts.delete(args[0]);return{rows:[],rowCount:existed?1:0};}
        if(/^DELETE FROM /i.test(s))return{rows:[],rowCount:0};
        if(/^INSERT INTO puffling_deleted_accounts/i.test(s)){deleted.add(args[0]);return{rows:[],rowCount:1};}
        throw new Error('unexpected client query: '+s);
      },release(){}
    };}
  };
  const store=createAccountStore({pool});assert.equal(await store.init(),true);
  const accountId='guest_recovery_test',key1='A'.repeat(32),key2='B'.repeat(32);
  await store.registerAccount(accountId,key1);
  const recovered=await store.recoverAccount(accountId,key1);assert.equal(recovered.accountId,accountId);assert.equal(accounts.get(accountId).recovered,true);
  let wrong=false;try{await store.recoverAccount(accountId,'C'.repeat(32));}catch(e){wrong=e.message==='invalid_recovery_credentials';}assert.equal(wrong,true,'wrong recovery key was accepted');
  await store.setRecoveryKey(accountId,key2);
  let oldRejected=false;try{await store.recoverAccount(accountId,key1);}catch(e){oldRejected=e.message==='invalid_recovery_credentials';}assert.equal(oldRejected,true,'rotated-out recovery key still worked');
  assert.equal((await store.recoverAccount(accountId,key2)).ok,true);
  await store.deleteAccount(accountId);
  let deletedRejected=false;try{await store.recoverAccount(accountId,key2);}catch(e){deletedRejected=e.message==='invalid_recovery_credentials';}assert.equal(deletedRejected,true,'deleted account was recoverable');
  assert.equal(await store.isDeleted(accountId),true);
  console.log('✅ Guest account recovery, key rotation and deletion lockout passed');
})().catch(err=>{console.error(err);process.exitCode=1;});
