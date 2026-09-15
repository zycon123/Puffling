import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root=process.cwd();
const gamePath=path.join(root,'game.js');
const indexPath=path.join(root,'index.html');
const stablePath=path.join(root,'beta42.html');
const fail=msg=>{console.error(`❌ ${msg}`);process.exitCode=1};
const ok=msg=>console.log(`✅ ${msg}`);

for(const file of [gamePath,indexPath,stablePath])if(!fs.existsSync(file))fail(`${path.basename(file)} is missing`);
if(process.exitCode)process.exit(process.exitCode);

const game=fs.readFileSync(gamePath,'utf8');
const index=fs.readFileSync(indexPath,'utf8');
const stable=fs.readFileSync(stablePath,'utf8');
const partsMatch=game.match(/const\s+parts\s*=\s*\[([\s\S]*?)\]/);
if(!partsMatch)fail('Could not find ordered module list in game.js');
const modules=partsMatch?[...partsMatch[1].matchAll(/['"]([^'"]+\.js)['"]/g)].map(m=>m[1]):[];
if(!modules.length)fail('Module loader list is empty');
const duplicateModules=modules.filter((m,i)=>modules.indexOf(m)!==i);
if(duplicateModules.length)fail(`Duplicate active modules: ${[...new Set(duplicateModules)].join(', ')}`);
if(modules.some(m=>/part\d|part5_/i.test(m)))fail('Legacy part*.js file is still in active loader');

function checkSyntax(rel){try{execFileSync(process.execPath,['--check',path.join(root,rel)],{stdio:'pipe'});ok(`Syntax: ${rel}`)}catch(err){fail(`Syntax error in ${rel}: ${String(err.stderr||err.message).trim()}`)}}
for(const rel of modules){if(!fs.existsSync(path.join(root,rel)))fail(`Loader references missing module: ${rel}`);else checkSyntax(rel)}
checkSyntax('game.js');
checkSyntax('audio_theme.js');
checkSyntax('scripts/validate-runtime-models.mjs');
checkSyntax('scripts/validate-onboarding.mjs');
checkSyntax('scripts/validate-orbuff-branding.mjs');

const jsDir=path.join(root,'js');
const allJs=fs.readdirSync(jsDir).filter(f=>f.endsWith('.js')).map(f=>`js/${f}`).sort();
for(const rel of allJs){if(!modules.includes(rel))checkSyntax(rel)}
ok(`Syntax checked ${allJs.length+5} JavaScript entry files`);

function hasScript(src){const escaped=src.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return new RegExp(`<script[^>]+src=["']${escaped}(?:\\?[^"']*)?["'][^>]*>`,'i').test(index)}
for(const rel of ['audio_theme.js','game.js']){if(!hasScript(rel))fail(`index.html does not load ${rel}`);else ok(`index.html loads ${rel}`)}
const audioPos=index.search(/audio_theme\.js(?:\?[^"']*)?/i),gamePos=index.search(/game\.js(?:\?[^"']*)?/i);
if(audioPos<0||gamePos<0||audioPos>gamePos)fail('audio_theme.js must load before game.js');else ok('Bootstrap script order');

const requiredIds=['game','start','playBtn','pauseBtn','gameOver','shop','upgrades','bossBarWrap','bossBar','bossRushMenu','multiplayerMenu','leaderboardMenu','audioSettings','bgMusic','toast'];
for(const id of requiredIds)if(!index.includes(`id="${id}"`)&&!index.includes(`id='${id}'`))fail(`Missing required DOM id: ${id}`);
for(const id of ['gameOver','shop','upgrades'])if(!new RegExp(`id=["']${id}["'][^>]*style=["'][^"']*display\\s*:\\s*none`,'i').test(index))fail(`${id} overlay must be hidden in initial HTML`);else ok(`${id} overlay starts hidden`);
if(!/function\s+finishLoading\s*\(\)[\s\S]*__skyPuffModulesReady\s*=\s*true[\s\S]*sky-puff-ready/.test(game))fail('Public ready signal must be emitted by the completed module loader');else ok('Main menu readiness waits for every module');
if(/dispatchEvent\s*\(\s*new\s+Event\s*\(\s*['"]sky-puff-ready/.test(fs.readFileSync(path.join(root,'js/renderer_runtime.js'),'utf8')))fail('Renderer must not expose the menu before later modules finish loading');else ok('Renderer core cannot release the startup splash early');
if(!/style\.css\?v=/i.test(index)||!/game\.js\?v=/i.test(index))fail('Cache-busting version is missing from critical assets');else ok('Critical assets are cache-busted in index.html');
if(!index.includes('RAINBOW BOOST')||index.includes('id="boostLabel">RAINBOW PUFF'))fail('First-paint HUD still uses legacy Rainbow Puff copy');else ok('First-paint HUD uses Rainbow Boost');

if(!/location\.replace\s*\(\s*['"]\.\/(?:index|orbuff-v[0-9]+)\.html\?/i.test(stable))fail('Stable loader must redirect directly to versioned index.html');
if(/document\.(?:open|write|close)\s*\(/i.test(stable))fail('Stable loader must not rebuild the app with document.write');
if(!/<title>Orbuff Beta<\/title>/i.test(stable))fail('Stable loader title must use Orbuff branding');
if(!/href=['"]\.\/(?:index|orbuff-v[0-9]+)\.html\?/i.test(stable))fail('Stable loader must include a manual direct-link fallback');
if(!/index\.html\?entry=beta42-v31/.test(stable))fail('Stable beta entry is not pinned to the current active Orbuff build');
if(!process.exitCode)ok('Stable direct-loader checks passed');

const forbidden=['beta39.html','js/polished_puff_renderer.js','js/boss_puff_creator.js','js/auto_diagnostics.js','js/i18n_audio_core.js','js/fusion_crystal_runtime.js'];
for(const rel of forbidden)if(fs.existsSync(path.join(root,rel)))fail(`Obsolete file still present: ${rel}`);
if(!process.exitCode)ok('No obsolete experiment files remain');

const requiredActive=['js/boss_pattern_override.js','js/boss_movement_fix.js','js/boss_transition_fix.js','js/post_boss_guard.js','js/rainbow_puff_hint.js','js/boss_puff_creator_v2.js','js/boss_puff_main_unlock.js','js/late_game_bosses.js','js/late_boss_persistence_fix.js','js/boss_rush_all_defeated.js','js/orbvault_progression.js','js/puffling_nursery_vault.js','js/orbuff_energy.js','js/orbvault_status_ui.js','js/race_active_orbuff_guard.js','js/orbuff_game_guide.js','js/orbuff_menu_localization.js','js/diamond_mystery_shop.js','js/steal_my_puffling_menu.js','js/puffling_rebrand.js','js/smoke_check.js'];
for(const rel of requiredActive)if(!modules.includes(rel))fail(`Required regression/system module is not active: ${rel}`);
const orderPairs=[['js/late_game_bosses.js','js/late_boss_persistence_fix.js'],['js/late_boss_persistence_fix.js','js/boss_rush_all_defeated.js'],['js/orbvault_progression.js','js/puffling_nursery_vault.js'],['js/puff_fusion_core.js','js/puffling_nursery_vault.js'],['js/orbuff_energy.js','js/orbvault_status_ui.js'],['js/race_puffling_eligibility.js','js/race_active_orbuff_guard.js'],['js/steal_my_puff_ui.js','js/steal_my_puffling_menu.js'],['js/puffling_rebrand.js','js/smoke_check.js']];
for(const [a,b] of orderPairs)if(modules.indexOf(a)<0||modules.indexOf(b)<0||modules.indexOf(a)>=modules.indexOf(b))fail(`Loader order invalid: ${a} must load before ${b}`);
const menuCleanupPath=path.join(root,'js/main_menu_cleanup.js');
const menuCleanup=fs.existsSync(menuCleanupPath)?fs.readFileSync(menuCleanupPath,'utf8'):'';
for(const token of ['spMainNav','spMenuHub','pufflingsHubBtn','modesHubBtn','moreHubBtn'])if(!menuCleanup.includes(token))fail(`Compact main menu is missing ${token}`);
if(/menuCollectionGroup|menuMoreGroup/.test(menuCleanup))fail('Legacy crowded main-menu groups are still active');else ok('Compact categorized main navigation');
if(!menuCleanup.includes("['gameGuideBtn','📖','Spillguide']"))fail('Spillguide is not reachable from the visible More menu');else ok('Spillguide is reachable from the visible More menu');
const firstPaintIds=['menuPrimaryGroup','spMainNav','pufflingsHubBtn','modesHubBtn','moreHubBtn'];
for(const id of firstPaintIds)if(!index.includes(`id="${id}"`)&&!index.includes(`id='${id}'`))fail(`Compact first paint is missing DOM id: ${id}`);
if(!/#start\s+\.menuActions\s*\{[^}]*display\s*:\s*none\s*!important/i.test(index))fail('Legacy main-menu actions are not hidden before first paint');else ok('Legacy actions hidden before first paint');
const compactNavPos=index.search(/id=["']spMainNav["']/i);
if(compactNavPos<0||gamePos<0||compactNavPos>gamePos)fail('Compact navigation must be present before game.js loads');else ok('Compact navigation is rendered in initial HTML');

const betaUiPath=path.join(root,'js/beta_release_ui.js');
const betaUiSource=fs.existsSync(betaUiPath)?fs.readFileSync(betaUiPath,'utf8'):'';
if(!betaUiSource.includes("previous.version!==version"))fail('Runtime error log must discard errors from older beta builds');else ok('Stale runtime errors clear on a new build');

const languageUiPath=path.join(root,'js/leaderboard_language_ui.js');
const languageUiSource=fs.existsSync(languageUiPath)?fs.readFileSync(languageUiPath,'utf8'):'';
if(!languageUiSource.includes('if(menuHintEl)menuHintEl.innerHTML'))fail('Removed menu hint must be null-guarded during language setup');else ok('Language setup tolerates removed optional menu hint');

const nurseryPath=path.join(root,'js/puffling_nursery_vault.js');
const nurserySource=fs.existsSync(nurseryPath)?fs.readFileSync(nurseryPath,'utf8'):'';
for(const token of ['vaultSlots','for(let i=0;i<maxVault();i++)','TOM PLASS','beginVaultSelection','placeInVault','vaultPicker'])if(!nurserySource.includes(token))fail(`OrbVault UI is missing ${token}`);
for(const token of ['STANDARD_IDS','vaultChoices','VANLIG'])if(!nurserySource.includes(token))fail(`OrbVault common-first picker is missing ${token}`);
const fusionSource=fs.readFileSync(path.join(root,'js/puff_fusion_core.js'),'utf8');
if(!fusionSource.includes('MAX_VAULT_SLOTS=8')||!fusionSource.includes('slice(0,MAX_VAULT_SLOTS)'))fail('Collection core still truncates OrbVault protection below 8 slots');
const menuBetaPath=path.join(root,'js/menu_beta_cleanup.js');
const menuBetaSource=fs.existsSync(menuBetaPath)?fs.readFileSync(menuBetaPath,'utf8'):'';
if(/Dobbelttrykk|Double-tap|Doppeltippen|Doble toque|Double-tapez/.test(menuBetaSource))fail('Obsolete Rainbow Puff main-menu hint is still active');else ok('Dynamic 3→8 OrbVault UI/protection and clean main-menu hint state');

if(!process.exitCode){ok(`Loader references ${modules.length} named modules`);ok('Static Orbuff build validation passed')}
