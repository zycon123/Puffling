const createLeaderboardStore=require('./leaderboard_store');
const fail=m=>{throw new Error(m)};
(async()=>{
  const calls=[];
  const pool={query:async(sql,args=[])=>{
    calls.push({sql,args});
    if(/^SELECT identity_key/i.test(sql.trim()))return {rows:[{identity_key:'guest_test_account',height:4321},{identity_key:'legacy:42',height:2100}]};
    return {rows:[],rowCount:1};
  }};
  const store=createLeaderboardStore({pool});
  if(!await store.init()||!store.status().ready)fail('Leaderboard store did not initialize');
  const legacyAnonymize=calls.find(x=>/^UPDATE puffling_scores SET player_name='Orbuff Player'/i.test(x.sql.trim()));
  if(!legacyAnonymize)fail('Legacy public leaderboard names were not anonymized during init');

  const expectedAlias=store.publicAlias('guest_test_account');
  const submitted=await store.submit({name:'<Alice>✨',height:1234.9,runSignature:'abcdef12',version:'5.26-beta.99',accountId:'guest_test_account'});
  if(submitted.name!==expectedAlias||submitted.height!==1234||submitted.accountLinked!==true||submitted.publicAlias!==true)fail('Public alias/account linkage normalization failed');
  const insert=calls.find(x=>/^INSERT INTO puffling_scores/i.test(x.sql.trim()));
  if(!insert||insert.args[0]!=='Orbuff Player'||insert.args[1]!==1234||insert.args[2]!=='abcdef12'||insert.args[4]!=='guest_test_account')fail('Anonymized linked score was not written');

  try{await store.submit({name:'Bad',height:1500,runSignature:'not-a-signature'});fail('Invalid signature was accepted');}catch(e){if(e.message!=='invalid_signature')throw e;}
  try{await store.submit({name:'Bad',height:3000000,runSignature:'12345678'});fail('Impossible height was accepted');}catch(e){if(e.message!=='invalid_height')throw e;}

  const rows=await store.list(2);
  if(rows.length!==2||rows[0].name!==expectedAlias||rows[0].height!==4321||!/^Orbuff-[A-F0-9]{6}$/.test(rows[1].name))fail('Public leaderboard alias listing failed');
  const status=store.status();
  if(!status.publicAliases||status.userGeneratedNames!==false)fail('Leaderboard status does not report public alias protection');
  console.log('✅ Persistent leaderboard aliases, authenticated account linkage and listing passed');
})().catch(e=>{console.error('❌ Leaderboard check failed:',e.message||e);process.exitCode=1;});
