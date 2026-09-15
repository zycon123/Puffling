const { Pool }=require('pg');

function secureDatabaseUrl(value){
  const url=String(value||'').trim();
  if(!url||/localhost|127\.0\.0\.1/.test(url))return url;
  return url.replace(/([?&])sslmode=require(?=(&|$))/i,'$1sslmode=verify-full');
}
function cleanName(value){return String(value||'').trim().replace(/[^\p{L}\p{N} _.-]/gu,'').slice(0,16)||'Puffling';}
function cleanSignature(value){const s=String(value||'').toLowerCase().trim();return /^[a-f0-9]{8,64}$/.test(s)?s:'';}
function cleanVersion(value){return String(value||'').replace(/[^A-Za-z0-9._+-]/g,'').slice(0,40)||'unknown';}
function cleanAccountId(value){const s=String(value||'').trim();return /^[A-Za-z0-9:_-]{3,96}$/.test(s)?s:null;}

module.exports=function createLeaderboardStore(opts={}){
  const databaseUrl=secureDatabaseUrl(opts.databaseUrl??process.env.DATABASE_URL??'');
  const pool=opts.pool||(databaseUrl?new Pool({connectionString:databaseUrl,max:3}):null);
  let ready=false,submits=0;
  async function init(){
    if(!pool)return false;
    await pool.query(`CREATE TABLE IF NOT EXISTS puffling_scores(
      id bigserial PRIMARY KEY,
      player_name varchar(16) NOT NULL,
      height integer NOT NULL CHECK(height>0 AND height<=2000000),
      run_signature varchar(64) NOT NULL,
      version varchar(40) NOT NULL,
      account_id varchar(96),
      created_at timestamptz NOT NULL DEFAULT now()
    )`);
    await pool.query('ALTER TABLE puffling_scores ADD COLUMN IF NOT EXISTS account_id varchar(96)');
    await pool.query('CREATE INDEX IF NOT EXISTS puffling_scores_height_idx ON puffling_scores(height DESC)');
    await pool.query('CREATE INDEX IF NOT EXISTS puffling_scores_created_idx ON puffling_scores(created_at DESC)');
    await pool.query('CREATE INDEX IF NOT EXISTS puffling_scores_account_idx ON puffling_scores(account_id) WHERE account_id IS NOT NULL');
    ready=true;return true;
  }
  async function submit(input={}){
    if(!pool||!ready)throw new Error('leaderboard_unavailable');
    const name=cleanName(input.name),height=Math.floor(Number(input.height)||0),runSignature=cleanSignature(input.runSignature),version=cleanVersion(input.version),accountId=cleanAccountId(input.accountId);
    if(height<1||height>2000000)throw new Error('invalid_height');
    if(!runSignature)throw new Error('invalid_signature');
    await pool.query('INSERT INTO puffling_scores(player_name,height,run_signature,version,account_id) VALUES($1,$2,$3,$4,$5)',[name,height,runSignature,version,accountId]);
    submits++;
    if(submits%100===0)pool.query("DELETE FROM puffling_scores WHERE created_at < now() - interval '180 days'").catch(()=>{});
    return {ok:true,name,height,accountLinked:!!accountId};
  }
  async function list(limit=20){
    if(!pool||!ready)throw new Error('leaderboard_unavailable');
    const n=Math.max(1,Math.min(50,Math.floor(Number(limit)||20)));
    const q=await pool.query(`SELECT player_name AS name, MAX(height)::int AS height
      FROM puffling_scores
      WHERE created_at >= now() - interval '180 days'
      GROUP BY player_name
      ORDER BY height DESC, player_name ASC
      LIMIT $1`,[n]);
    return q.rows.map(row=>({name:String(row.name||'Puffling'),height:Number(row.height)||0}));
  }
  async function close(){if(!opts.pool)await pool?.end();}
  return {init,submit,list,status:()=>({ready,database:!!pool,accountLinked:true}),close,cleanName,cleanSignature,cleanAccountId,version:2};
};
