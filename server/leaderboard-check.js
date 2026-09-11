const createLeaderboardStore=require('./leaderboard_store');
const fail=m=>{throw new Error(m)};
(async()=>{
  const calls=[];
  const pool={query:async(sql,args=[])=>{calls.push({sql,args});if(/^SELECT player_name/i.test(sql.trim()))return {rows:[{name:'Alice',height:4321},{name:'Bob',height:2100}]};return {rows:[],rowCount:1};}};
  const store=createLeaderboardStore({pool});
  if(!await store.init()||!store.status().ready)fail('Leaderboard store did not initialize');
  const submitted=await store.submit({name:'<Alice>✨',height:1234.9,runSignature:'abcdef12',version:'5.26-beta.99'});
  if(submitted.name!=='Alice'||submitted.height!==1234)fail('Score normalization failed');
  const insert=calls.find(x=>/^INSERT INTO puffling_scores/i.test(x.sql.trim()));if(!insert||insert.args[0]!=='Alice'||insert.args[1]!==1234||insert.args[2]!=='abcdef12')fail('Normalized score was not written');
  try{await store.submit({name:'Bad',height:1500,runSignature:'not-a-signature'});fail('Invalid signature was accepted');}catch(e){if(e.message!=='invalid_signature')throw e;}
  try{await store.submit({name:'Bad',height:3000000,runSignature:'12345678'});fail('Impossible height was accepted');}catch(e){if(e.message!=='invalid_height')throw e;}
  const rows=await store.list(2);if(rows.length!==2||rows[0].name!=='Alice'||rows[0].height!==4321)fail('Leaderboard result normalization failed');
  console.log('✅ Persistent leaderboard normalization, validation and listing passed');
})().catch(e=>{console.error('❌ Leaderboard check failed:',e.message||e);process.exitCode=1;});
