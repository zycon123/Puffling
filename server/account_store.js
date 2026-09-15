const crypto=require('crypto');
function cleanAccountId(value){const s=String(value||'').trim();return /^[A-Za-z0-9:_-]{3,96}$/.test(s)?s:'';}
function cleanRecoveryKey(value){const s=String(value||'').trim();return /^[A-Za-z0-9_-]{24,160}$/.test(s)?s:'';}
function hashRecoveryKey(value){return crypto.createHash('sha256').update(String(value||'')).digest('hex');}
function timingSafe(a,b){try{const A=Buffer.from(String(a||'')),B=Buffer.from(String(b||''));return A.length===B.length&&crypto.timingSafeEqual(A,B);}catch{return false;}}

module.exports=function createAccountStore(opts={}){
  const pool=opts.pool||null;
  let ready=false;

  async function init(){
    if(!pool)return false;
    await pool.query(`CREATE TABLE IF NOT EXISTS puffling_deleted_accounts(
      account_id varchar(96) PRIMARY KEY,
      deleted_at timestamptz NOT NULL DEFAULT now()
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS puffling_accounts(
      account_id varchar(96) PRIMARY KEY,
      recovery_key_hash char(64) NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      recovered_at timestamptz,
      recovery_rotated_at timestamptz NOT NULL DEFAULT now()
    )`);
    ready=true;
    return true;
  }

  async function deletedAccountIds(){
    if(!pool||!ready)return [];
    const q=await pool.query('SELECT account_id FROM puffling_deleted_accounts ORDER BY deleted_at');
    return q.rows.map(r=>cleanAccountId(r.account_id)).filter(Boolean);
  }

  async function isDeleted(accountId){
    const id=cleanAccountId(accountId);
    if(!id||!pool||!ready)return false;
    const q=await pool.query('SELECT 1 FROM puffling_deleted_accounts WHERE account_id=$1',[id]);
    return q.rowCount>0;
  }

  async function setRecoveryKey(accountId,recoveryKey,{createOnly=false}={}){
    const id=cleanAccountId(accountId),key=cleanRecoveryKey(recoveryKey);
    if(!id||!key)throw new Error('invalid_recovery_credentials');
    if(!pool||!ready)throw new Error('account_recovery_unavailable');
    if(await isDeleted(id))throw new Error('account_deleted');
    const hash=hashRecoveryKey(key);
    if(createOnly){
      const q=await pool.query(`INSERT INTO puffling_accounts(account_id,recovery_key_hash)
        VALUES($1,$2) ON CONFLICT(account_id) DO NOTHING RETURNING account_id`,[id,hash]);
      if(!q.rowCount)throw new Error('account_exists');
    }else{
      await pool.query(`INSERT INTO puffling_accounts(account_id,recovery_key_hash,recovery_rotated_at)
        VALUES($1,$2,now())
        ON CONFLICT(account_id) DO UPDATE SET recovery_key_hash=EXCLUDED.recovery_key_hash,recovery_rotated_at=now()`,[id,hash]);
    }
    return{ok:true,accountId:id};
  }

  async function registerAccount(accountId,recoveryKey){return setRecoveryKey(accountId,recoveryKey,{createOnly:true});}

  async function recoverAccount(accountId,recoveryKey){
    const id=cleanAccountId(accountId),key=cleanRecoveryKey(recoveryKey);
    if(!id||!key||!pool||!ready)throw new Error('invalid_recovery_credentials');
    if(await isDeleted(id))throw new Error('invalid_recovery_credentials');
    const q=await pool.query('SELECT recovery_key_hash FROM puffling_accounts WHERE account_id=$1',[id]);
    if(!q.rowCount||!timingSafe(q.rows[0].recovery_key_hash,hashRecoveryKey(key)))throw new Error('invalid_recovery_credentials');
    await pool.query('UPDATE puffling_accounts SET recovered_at=now() WHERE account_id=$1',[id]);
    return{ok:true,accountId:id};
  }

  async function deleteAccount(accountId){
    const id=cleanAccountId(accountId);
    if(!id)throw new Error('invalid_account');
    if(!pool||!ready)throw new Error('account_delete_unavailable');
    const client=await pool.connect();
    const removed={};
    const targets=[
      ['puffling_acquisition_grants','account_id=$1'],
      ['puffling_boss_sessions','account_id=$1'],
      ['puffling_trade_results','account_a=$1 OR account_b=$1'],
      ['puffling_inventory_migrations','account_id=$1'],
      ['puffling_inventory','account_id=$1'],
      ['puffling_rank_profiles','account_id=$1'],
      ['puffling_scores','account_id=$1'],
      ['puffling_accounts','account_id=$1']
    ];
    try{
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[`account-delete:${id}`]);
      const walletTable=await client.query('SELECT to_regclass($1) AS name',['public.puffling_wallets']);
      if(walletTable.rows[0]?.name){
        const wallet=await client.query('UPDATE puffling_wallets SET account_id=NULL,active=false,updated_at=now() WHERE account_id=$1',[id]);
        removed.puffling_wallet_account_link=wallet.rowCount||0;
      }else removed.puffling_wallet_account_link=0;
      for(const [table,where] of targets){
        const exists=await client.query('SELECT to_regclass($1) AS name',[`public.${table}`]);
        if(!exists.rows[0]?.name){removed[table]=0;continue;}
        const q=await client.query(`DELETE FROM ${table} WHERE ${where}`,[id]);
        removed[table]=q.rowCount||0;
      }
      await client.query(`INSERT INTO puffling_deleted_accounts(account_id,deleted_at)
        VALUES($1,now())
        ON CONFLICT(account_id) DO UPDATE SET deleted_at=EXCLUDED.deleted_at`,[id]);
      await client.query('COMMIT');
      return{ok:true,accountId:id,deleted:true,removed};
    }catch(e){
      try{await client.query('ROLLBACK');}catch{}
      throw e;
    }finally{client.release();}
  }

  return{init,deletedAccountIds,isDeleted,registerAccount,setRecoveryKey,recoverAccount,deleteAccount,status:()=>({ready,database:!!pool,tombstones:true,recovery:true}),cleanAccountId,cleanRecoveryKey,version:3};
};
