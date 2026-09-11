import fs from 'node:fs';

const root=process.cwd();
const read=rel=>fs.readFileSync(`${root}/${rel}`,'utf8');
const fail=msg=>{console.error(`❌ ${msg}`);process.exitCode=1;};
const ok=msg=>console.log(`✅ ${msg}`);

const smoke=read('js/smoke_check.js');
const nursery=read('js/puffling_nursery_vault.js');
const diagnostics=read('js/diagnostics_support.js');
const runtime=read('scripts/validate-runtime-models.mjs');
const simulation=read('scripts/validate-launch-simulation.mjs');
const render=read('render.yaml');
const loader=read('game.js');
const race=read('js/steal_my_puff_core.js');
const progress=read('js/race_progress_sync.js');
const ranked=read('js/race_ranked.js');
const raceMenu=read('js/steal_my_puffling_menu.js');
const saveIntegrity=read('js/save_integrity.js');
const iap=read('js/diamond_iap_store.js');
const walletClient=read('js/diamond_wallet_client.js');
const iapServer=read('server/iap_store.js');
const iapHttp=read('server/iap_http.js');
const leaderboardStore=read('server/leaderboard_store.js');
const leaderboardHttp=read('server/leaderboard_http.js');
const bootstrap=read('server/bootstrap.js');
const raceServer=read('server/index.js');
const beta=read('js/beta_config.js');

if(smoke.includes("'SkyPuffSteal'")||smoke.includes('steal:box-weight'))fail('Smoke Check still depends on retired Steal My Puffling API');
else ok('Smoke Check no longer depends on retired Steal API');
for(const token of ['SkyPuffRace','SkyPuffRaceProgress','SkyPuffQuickRank','PufflingDiamondWallet','PufflingDiamondStore','PufflingSaveIntegrity','expected-100-total','PufflingExpansion36','SkyPuffUniqueTraits','leaderboard:api-base-missing'])if(!smoke.includes(token))fail(`Smoke Check missing current launch invariant: ${token}`);
if(!process.exitCode)ok('Smoke Check covers Race, rank, save integrity, leaderboard, wallet, IAP and 100-Puffling systems');

if(!saveIntegrity.includes('Number.isFinite')||!saveIntegrity.includes('playerName')||!saveIntegrity.includes('persist()'))fail('Core save integrity guard is incomplete');
else ok('Corrupt numeric/cosmetic save values are repaired and persisted');
if(!simulation.includes('Full launch simulation passed')||!simulation.includes('Mystery Shop')||!simulation.includes('integrityLocked'))fail('Integrated launch gameplay simulation is missing required flows');
else ok('CI contains an integrated launch gameplay journey simulation');
for(const token of ["document.title='Puffling'","Førstemann til 1500 m vinner","PUFFLING • 5.26 BETA"]){if(!loader.includes(token))fail(`Early first-paint launch normalization missing: ${token}`);}
if(raceMenu.includes('Sky Puff — Race My Puffling'))fail('Shared Race invite still exposes retired Sky Puff branding');
else ok('First-paint branding, Race rule copy and shared invite are normalized to Puffling');

if(!nursery.includes('allPuffs().filter(p=>!p.starterOnly)'))fail('Starter Pufflings can leak into Nursery egg pools');
else ok('Starter Pufflings are exclusive to starter selection');
if(/mot Steal My Puffling/.test(nursery))fail('Vault UI still describes retired Steal protection');
else ok('Vault copy matches current Fusion protection behavior');

if(!runtime.includes('Puffling catalog must contain 100 entries'))fail('Runtime regression suite still expects the old catalog size');
else ok('Runtime regression suite validates the 100-Puffling catalog');
for(const code of ['PFL-SMOKE-001','PFL-SAVE-001','PFL-RUNTIME-001','PFL-AC-001','PFL-AI-001','PFL-LAUNCH-101','PFL-LAUNCH-102','PFL-LAUNCH-103','PFL-LAUNCH-104','PFL-LAUNCH-105'])if(!diagnostics.includes(code))fail(`Diagnostics missing code ${code}`);
if(!diagnostics.includes('rankServerAuthoritative')||!diagnostics.includes('tradeServerInventory'))fail('Diagnostics can incorrectly report competitive launch readiness');
else ok('System & Support explicitly surfaces competitive profile/inventory launch blockers');

for(const token of ['name: puffling-race-server','rootDir: server','healthCheckPath: /health','autoDeploy: true','key: DATABASE_URL','sync: false'])if(!render.includes(token))fail(`Render blueprint missing: ${token}`);
if(/^databases:/m.test(render)||render.includes('fromDatabase:'))fail('Render blueprint can recreate/reconnect the expired Free Postgres database');
else ok('Render blueprint requires the external Neon DATABASE_URL and cannot recreate Render Free Postgres');

if(!race.includes('const GOAL_METERS=1500')||!race.includes('const MAX_ATTACKS=3')||!race.includes('const ATTACK_COOLDOWN_MS=4000'))fail('Race launch constants changed unexpectedly');
else ok('Race goal, attack count and cooldown are pinned');
if(!progress.includes("CustomEvent('race:progress'")||!progress.includes("getElementById('multiplayerHud')"))fail('Shared Race progress/HUD compatibility layer is missing');
else ok('Race live progress source and legacy HUD guard are active');
for(const token of ['pufflingQuickRaceRankV1','server-required','duplicate-result','Silver','Champion'])if(!ranked.includes(token))fail(`Ranked Quick Race missing invariant: ${token}`);
for(const token of ['rankRating','race:positionRejected','HEIGHT_RATE_LIMIT','HEIGHT_START_ALLOWANCE','integrityLocked','integrityVersion','function makeRaceId(){ return `RACE_'])if(!raceServer.includes(token))fail(`Race server missing launch integrity/reconnect invariant: ${token}`);
if(!process.exitCode)ok('Race server relays MMR, rejects impossible movement and uses reconnect-safe room IDs');

for(const token of ['puffling.diamonds.25','puffling.diamonds.75','puffling.diamonds.250','puffling.diamonds.600','targetEur:1','targetEur:3','targetEur:9','targetEur:16','verificationData','paidDiamondBalance','walletReady','authorization',"['ios','android'].includes(platform())"]){if(!iap.includes(token))fail(`Diamond IAP scaffold missing invariant: ${token}`);}
if(!iap.includes('loadProducts')||!iap.includes('finishTransaction'))fail('Diamond IAP native bridge contract is incomplete');
else ok('Diamond IAP client requires native billing, signed wallet and authoritative paid balance');
for(const token of ['/wallet/session','/wallet/balance','/wallet/spend','pufflingWalletClientKeyV1','authorization'])if(!walletClient.includes(token))fail(`Diamond wallet client missing invariant: ${token}`);
for(const token of ['puffling_wallets','puffling_iap_transactions','puffling_wallet_ledger','client_key_hash','paid_diamonds','provider_not_configured','insufficient_paid_diamonds','sslmode=verify-full'])if(!iapServer.includes(token))fail(`Diamond wallet server missing invariant: ${token}`);
for(const token of ['/wallet/session','/wallet/balance','/wallet/spend','/iap/verify'])if(!iapHttp.includes(token))fail(`Diamond wallet HTTP API missing route: ${token}`);
if(!process.exitCode)ok('Persistent paid-Diamond wallet remains fail-closed with explicit verified TLS');

for(const token of ['puffling_scores','MAX(height)','180 days','invalid_signature'])if(!leaderboardStore.includes(token))fail(`Leaderboard store missing invariant: ${token}`);
for(const token of ['/leaderboard','/score','rate_limited','access-control-allow-origin'])if(!leaderboardHttp.includes(token))fail(`Leaderboard HTTP API missing invariant: ${token}`);
for(const token of ["require('./iap_store')","require('./leaderboard_store')","require('./leaderboard_http')","require('./index')"])if(!bootstrap.includes(token))fail(`Server bootstrap missing: ${token}`);
if(!process.exitCode)ok('Global leaderboard and Diamond wallet share the production Neon-backed server');

if(!beta.includes("SKY_PUFF_RACE_WS_URL='wss://puffling-race-server.onrender.com'"))fail('Production Race/Trade WebSocket endpoint is not configured');
if(!beta.includes("SKY_PUFF_GAME_API_URL='https://puffling-race-server.onrender.com'"))fail('Production game API endpoint is not configured');
if(!beta.includes('API_BASE=SKY_PUFF_GAME_API_URL'))fail('Global leaderboard does not default to production API');
if(!beta.includes("SKY_PUFF_IAP_VERIFY_URL=SKY_PUFF_GAME_API_URL+'/iap/verify'"))fail('IAP verifier route is not configured to production API');
if(!beta.includes("SKY_PUFF_VERSION='5.26-beta.99'"))fail('Launch-audit beta version was not bumped to 5.26-beta.99');
else ok('Production Race, leaderboard, wallet and verifier endpoints are configured in beta.99');

if(process.exitCode)process.exit(process.exitCode);
console.log('✅ Static launch-readiness checks passed');
