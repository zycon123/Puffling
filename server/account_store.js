function cleanAccountId(value){const s=String(value||'').trim();return /^[A-Za-z0-9:_-]{3,96}$/.test(s)?s:'';}

module.exports=function createAccountStore(opts={}){
  const pool=opts.pool||null;
  let ready=false;

  async function init(){
    if(!pool)return false;
    await pool.query(`CREATE TABLE IF NOT EXISTS puffling_deleted_accounts(
      account_id varchar(96) PRIMARY KEY,
      deleted_at timestamptz NOT NULL DEFAULT now()
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
      ['puffling_rank_profiles','account_id=$1']
    ];
    try{
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[`account-delete:${id}`]);
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

  return{init,deletedAccountIds,isDeleted,deleteAccount,status:()=>({ready,database:!!pool,tombstones:true}),cleanAccountId,version:1};
};
