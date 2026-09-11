import fs from 'node:fs';

const root=process.cwd();
const read=rel=>fs.readFileSync(`${root}/${rel}`,'utf8');
const fail=msg=>{console.error(`❌ ${msg}`);process.exitCode=1;};
const ok=msg=>console.log(`✅ ${msg}`);

const smoke=read('js/smoke_check.js');
const nursery=read('js/puffling_nursery_vault.js');
const diagnostics=read('js/diagnostics_support.js');
const runtime=read('scripts/validate-runtime-models.mjs');
const render=read('render.yaml');
const race=read('js/steal_my_puff_core.js');
const progress=read('js/race_progress_sync.js');
const ranked=read('js/race_ranked.js');
const iap=read('js/diamond_iap_store.js');
const raceServer=read('server/index.js');
const beta=read('js/beta_config.js');

if(smoke.includes("'SkyPuffSteal'")||smoke.includes('steal:box-weight'))fail('Smoke Check still depends on retired Steal My Puffling API');
else ok('Smoke Check no longer depends on retired Steal API');
for(const token of ['SkyPuffRace','SkyPuffRaceProgress','SkyPuffQuickRank','PufflingDiamondStore','expected-100-total','PufflingExpansion36','SkyPuffUniqueTraits']){
  if(!smoke.includes(token))fail(`Smoke Check missing current launch invariant: ${token}`);
}
if(!process.exitCode)ok('Smoke Check covers current Race, rank, IAP and 100-Puffling systems');

if(!nursery.includes('allPuffs().filter(p=>!p.starterOnly)'))fail('Starter Pufflings can leak into Nursery egg pools');
else ok('Starter Pufflings are exclusive to starter selection');
if(/mot Steal My Puffling/.test(nursery))fail('Vault UI still describes retired Steal protection');
else ok('Vault copy matches current Fusion protection behavior');

if(!runtime.includes('Puffling catalog must contain 100 entries'))fail('Runtime regression suite still expects the old catalog size');
else ok('Runtime regression suite validates the 100-Puffling catalog');
for(const code of ['PFL-SMOKE-001','PFL-SAVE-001','PFL-RUNTIME-001','PFL-AC-001','PFL-AI-001','PFL-LAUNCH-101','PFL-LAUNCH-102','PFL-LAUNCH-103']){
  if(!diagnostics.includes(code))fail(`Diagnostics missing code ${code}`);
}
if(!process.exitCode)ok('System & Support exposes actionable error and launch codes');

for(const token of ['name: puffling-race-server','rootDir: server','healthCheckPath: /health','autoDeploy: true']){
  if(!render.includes(token))fail(`Render blueprint missing: ${token}`);
}
if(!process.exitCode)ok('Render blueprint is ready for Race/Trade server deployment');

if(!race.includes('const GOAL_METERS=1500')||!race.includes('const MAX_ATTACKS=3')||!race.includes('const ATTACK_COOLDOWN_MS=4000'))fail('Race launch constants changed unexpectedly');
else ok('Race goal, attack count and cooldown are pinned');
if(!progress.includes("CustomEvent('race:progress'")||!progress.includes("getElementById('multiplayerHud')"))fail('Shared Race progress/HUD compatibility layer is missing');
else ok('Race live progress source and legacy HUD guard are active');

for(const token of ['pufflingQuickRaceRankV1','server-required','duplicate-result','Silver','Champion'])if(!ranked.includes(token))fail(`Ranked Quick Race missing invariant: ${token}`);
if(!raceServer.includes('rankRating')||!raceServer.includes('players:[...room.players.values()].map(playerPublic)'))fail('Race server does not relay authoritative MMR/player profiles');
else ok('Ranked Quick Race is server-result-only with authoritative opponent MMR');

for(const token of ['puffling.diamonds.25','puffling.diamonds.75','puffling.diamonds.250','puffling.diamonds.600','targetEur:1','targetEur:3','targetEur:9','targetEur:16','verificationData','diamondBalance',"['ios','android'].includes(platform())"]){if(!iap.includes(token))fail(`Diamond IAP scaffold missing invariant: ${token}`);}
if(!iap.includes('loadProducts')||!iap.includes('finishTransaction'))fail('Diamond IAP native bridge contract is incomplete');
else ok('Diamond IAP scaffold requires native billing, requested EUR targets and authoritative verification');

if(!beta.includes("SKY_PUFF_RACE_WS_URL='wss://puffling-race-server.onrender.com'"))fail('Production Race/Trade WebSocket endpoint is not configured in beta');
else ok('Production Race/Trade WebSocket endpoint is configured');
if(!beta.includes("SKY_PUFF_IAP_VERIFY_URL=''"))fail('Beta should keep paid IAP disabled until the production verifier is deployed');
else ok('Real-money IAP remains fail-closed until verifier deployment');
if(!/SKY_PUFF_VERSION='5\.26-beta\.\d+'/.test(beta))fail('Beta version format is invalid');
else ok('Build has an explicit beta release version');

if(process.exitCode)process.exit(process.exitCode);
console.log('✅ Static launch-readiness checks passed');
