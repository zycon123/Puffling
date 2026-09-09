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

const jsDir=path.join(root,'js');
const allJs=fs.readdirSync(jsDir).filter(f=>f.endsWith('.js')).map(f=>`js/${f}`).sort();
for(const rel of allJs){if(!modules.includes(rel))checkSyntax(rel)}
ok(`Syntax checked ${allJs.length+3} JavaScript entry files`);

function hasScript(src){const escaped=src.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return new RegExp(`<script[^>]+src=["']${escaped}(?:\\?[^"']*)?["'][^>]*>`,'i').test(index)}
for(const rel of ['audio_theme.js','game.js']){if(!hasScript(rel))fail(`index.html does not load ${rel}`);else ok(`index.html loads ${rel}`)}
const audioPos=index.search(/audio_theme\.js(?:\?[^"']*)?/i),gamePos=index.search(/game\.js(?:\?[^"']*)?/i);
if(audioPos<0||gamePos<0||audioPos>gamePos)fail('audio_theme.js must load before game.js');else ok('Bootstrap script order');

const requiredIds=['game','start','playBtn','pauseBtn','gameOver','shop','upgrades','bossBarWrap','bossBar','bossRushMenu','multiplayerMenu','leaderboardMenu','audioSettings','bgMusic','toast'];
for(const id of requiredIds)if(!index.includes(`id="${id}"`)&&!index.includes(`id='${id}'`))fail(`Missing required DOM id: ${id}`);
if(!/id=["']gameOver["'][^>]*style=["'][^"']*display\s*:\s*none/i.test(index))fail('gameOver overlay must be hidden in initial HTML');else ok('Game-over overlay starts hidden');
if(!/style\.css\?v=/i.test(index)||!/game\.js\?v=/i.test(index))fail('Cache-busting version is missing from critical assets');else ok('Critical assets are cache-busted in index.html');

if(!/cache\s*:\s*['"]no-store['"]/i.test(stable))fail('Stable loader must fetch index.html with no-store');
if(!/Date\.now\(\)/.test(stable))fail('Stable loader must generate a unique asset nonce');
for(const asset of ['game.js','audio_theme.js','style.css'])if(!stable.includes(asset))fail(`Stable loader does not refresh ${asset}`);
if(!/<title>Puffling Beta<\/title>/i.test(stable))fail('Stable loader title must use Puffling branding');
if(!process.exitCode)ok('Stable loader cache-safety checks passed');

const forbidden=['beta39.html','js/polished_puff_renderer.js','js/boss_puff_creator.js','js/auto_diagnostics.js','js/i18n_audio_core.js'];
for(const rel of forbidden)if(fs.existsSync(path.join(root,rel)))fail(`Obsolete file still present: ${rel}`);
if(!process.exitCode)ok('No obsolete experiment files remain');

const requiredActive=['js/boss_pattern_override.js','js/boss_movement_fix.js','js/boss_transition_fix.js','js/post_boss_guard.js','js/rainbow_puff_hint.js','js/boss_puff_creator_v2.js','js/boss_puff_main_unlock.js','js/late_game_bosses.js','js/late_boss_persistence_fix.js','js/boss_rush_all_defeated.js','js/puffling_nursery_vault.js','js/diamond_mystery_shop.js','js/steal_my_puffling_menu.js','js/puffling_rebrand.js','js/smoke_check.js'];
for(const rel of requiredActive)if(!modules.includes(rel))fail(`Required regression/system module is not active: ${rel}`);
const orderPairs=[['js/late_game_bosses.js','js/late_boss_persistence_fix.js'],['js/late_boss_persistence_fix.js','js/boss_rush_all_defeated.js'],['js/puff_fusion_core.js','js/puffling_nursery_vault.js'],['js/steal_my_puff_ui.js','js/steal_my_puffling_menu.js'],['js/puffling_rebrand.js','js/smoke_check.js']];
for(const [a,b] of orderPairs)if(modules.indexOf(a)<0||modules.indexOf(b)<0||modules.indexOf(a)>=modules.indexOf(b))fail(`Loader order invalid: ${a} must load before ${b}`);
const menuCleanupPath=path.join(root,'js/main_menu_cleanup.js');
const menuCleanup=fs.existsSync(menuCleanupPath)?fs.readFileSync(menuCleanupPath,'utf8'):'';
for(const token of ['spMainNav','spMenuHub','pufflingsHubBtn','modesHubBtn','moreHubBtn'])if(!menuCleanup.includes(token))fail(`Compact main menu is missing ${token}`);
if(/menuCollectionGroup|menuMoreGroup/.test(menuCleanup))fail('Legacy crowded main-menu groups are still active');else ok('Compact categorized main navigation');

const nurseryPath=path.join(root,'js/puffling_nursery_vault.js');
const nurserySource=fs.existsSync(nurseryPath)?fs.readFileSync(nurseryPath,'utf8'):'';
for(const token of ['vaultSlots','for(let i=0;i<MAX_VAULT;i++)','TOM PLASS'])if(!nurserySource.includes(token))fail(`Vault UI is missing ${token}`);
const menuBetaPath=path.join(root,'js/menu_beta_cleanup.js');
const menuBetaSource=fs.existsSync(menuBetaPath)?fs.readFileSync(menuBetaPath,'utf8'):'';
if(/Dobbelttrykk|Double-tap|Doppeltippen|Doble toque|Double-tapez/.test(menuBetaSource))fail('Obsolete Rainbow Puff main-menu hint is still active');else ok('Three-slot Vault UI and clean main menu hint state');

if(!process.exitCode){ok(`Loader references ${modules.length} named modules`);ok('Static Puffling build validation passed')}
