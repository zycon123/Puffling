import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'index.html',
  'style.css',
  'game.js',
  'js/desktop_controls.js',
  'js/pc_settings.js',
  'js/desktop_presentation.js',
  'js/desktop_store_policy.js',
  'js/steam_runtime.js',
  'desktop/main.cjs',
  'desktop/preload.cjs',
  'desktop/steam_runtime.cjs',
  'electron-builder.yml',
  'steam/app_build.vdf',
  'steam/depot_build_windows.vdf',
  'steam/README.md',
  'scripts/prepare-steam-build.mjs',
  'scripts/validate-steam-release.mjs'
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) throw new Error(`Desktop release is missing required files: ${missing.join(', ')}`);

const main = fs.readFileSync(path.join(root, 'desktop/main.cjs'), 'utf8');
const preload = fs.readFileSync(path.join(root, 'desktop/preload.cjs'), 'utf8');
const steamMain = fs.readFileSync(path.join(root, 'desktop/steam_runtime.cjs'), 'utf8');
const config = fs.readFileSync(path.join(root, 'electron-builder.yml'), 'utf8');
const game = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const controls = fs.readFileSync(path.join(root, 'js/desktop_controls.js'), 'utf8');
const presentation = fs.readFileSync(path.join(root, 'js/desktop_presentation.js'), 'utf8');
const storePolicy = fs.readFileSync(path.join(root, 'js/desktop_store_policy.js'), 'utf8');
const steamRenderer = fs.readFileSync(path.join(root, 'js/steam_runtime.js'), 'utf8');
const desktopWidth = fs.readFileSync(path.join(root, 'js/desktop_game_width.js'), 'utf8');
const achievements = fs.readFileSync(path.join(root, 'js/achievements.js'), 'utf8');
const stateContent = fs.readFileSync(path.join(root, 'js/state_content.js'), 'utf8');
const appBuild = fs.readFileSync(path.join(root, 'steam/app_build.vdf'), 'utf8');
const depotBuild = fs.readFileSync(path.join(root, 'steam/depot_build_windows.vdf'), 'utf8');
const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
const steamPrepare = fs.readFileSync(path.join(root, 'scripts/prepare-steam-build.mjs'), 'utf8');
const steamReleaseValidator = fs.readFileSync(path.join(root, 'scripts/validate-steam-release.mjs'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const inputPos=game.indexOf("'js/input_missions_boss_spawn.js'");
const controlsPos=game.indexOf("'js/desktop_controls.js'");
const presentationPos=game.indexOf("'js/desktop_presentation.js'");
const gameplayPos=game.indexOf("'js/gameplay_update.js'");
const diamondStorePos=game.indexOf("'js/diamond_iap_store.js'");
const storePolicyPos=game.indexOf("'js/desktop_store_policy.js'");
const steamRendererPos=game.indexOf("'js/steam_runtime.js'");
const menuCleanupPos=game.indexOf("'js/menu_beta_cleanup.js'");

const checks = [
  ['contextIsolation enabled', /contextIsolation:\s*true/.test(main)],
  ['nodeIntegration disabled', /nodeIntegration:\s*false/.test(main)],
  ['sandbox enabled', /sandbox:\s*true/.test(main)],
  ['preload configured', /preload:\s*path\.join\(__dirname,\s*'preload\.cjs'\)/.test(main)],
  ['external links denied in-app', /setWindowOpenHandler/.test(main) && /action:\s*'deny'/.test(main)],
  ['fullscreen keyboard support', /F11/.test(main) && /Escape/.test(main)],
  ['Steam-safe Windows app id', /com\.zyconstudios\.orbuff/.test(config)],
  ['packaged Steam bridge files', /desktop\/preload\.cjs/.test(config) && /desktop\/steam_runtime\.cjs/.test(config) && /steam\/\*\*/.test(config)],
  ['desktop controls loaded after base input', inputPos>=0&&controlsPos>inputPos],
  ['desktop controls loaded before gameplay loop', gameplayPos>=0&&controlsPos<gameplayPos],
  ['desktop presentation loaded after controls', presentationPos>controlsPos],
  ['desktop presentation loaded before gameplay loop', presentationPos<gameplayPos],
  ['keyboard A/D support', controls.includes("left:['KeyA','ArrowLeft']")&&controls.includes("right:['KeyD','ArrowRight']")],
  ['keyboard arrows support', controls.includes("'ArrowLeft'")&&controls.includes("'ArrowRight'")],
  ['Rainbow Boost keyboard action', controls.includes("boost:['Space']")&&controls.includes('doBoost()')],
  ['pause/back keyboard actions', controls.includes("event.code==='Escape'")&&controls.includes("pause:['KeyP']")],
  ['Gamepad API support', controls.includes('navigator.getGamepads')&&controls.includes('gamepadconnected')],
  ['menu focus navigation', controls.includes('function navigateFocus')&&controls.includes('focus({preventScroll:false})')],
  ['widescreen PC frame', presentation.includes('orbuffDesktopFrame')&&presentation.includes('@media (min-width:1100px)')],
  ['620px gameplay balance preserved', desktopWidth.includes('MAX_DESKTOP_WIDTH=620')],
  ['PC store policy loaded after mobile Diamond store', diamondStorePos>=0&&storePolicyPos>diamondStorePos],
  ['Steam renderer loaded after PC store policy', steamRendererPos>storePolicyPos],
  ['Steam renderer loaded before later menu cleanup', menuCleanupPos>=0&&steamRendererPos<menuCleanupPos],
  ['Steam bridge uses contextBridge', preload.includes('contextBridge.exposeInMainWorld')&&preload.includes("'OrbuffSteam'")],
  ['Steam IPC has no generic arbitrary invoke', !preload.includes('ipcRenderer.send') && preload.includes('orbuff:steam:status')],
  ['Steam runtime is optional', steamMain.includes("require('steamworks.js')")&&steamMain.includes('steamworks_module_missing')],
  ['Steam App ID is not hardcoded', steamMain.includes('ORBUFF_STEAM_APP_ID')&&!/init\(480\)/.test(steamMain)],
  ['Steam achievements mapped', steamMain.includes('ORB_SKY_LEGEND')&&steamMain.includes('ORB_TREASURE_HUNTER')],
  ['Steam stats supported', steamMain.includes('client.stats?.setInt')&&steamMain.includes('client.stats?.store')],
  ['Steam cloud mirror uses userData', steamMain.includes("app.getPath('userData')")&&steamMain.includes('orbuff-save.json')],
  ['Renderer snapshots scoped storage only', steamRenderer.includes("STORAGE_PREFIXES=['skyPuff','orbuff','puffling']")],
  ['Achievement event sync', achievements.includes('orbuff:achievement-unlocked')&&steamRenderer.includes('orbuff:achievement-unlocked')],
  ['SteamPipe App ID placeholder present', appBuild.includes('ORBUFF_STEAM_APP_ID')],
  ['SteamPipe Depot ID placeholder present', appBuild.includes('ORBUFF_STEAM_DEPOT_ID')&&depotBuild.includes('ORBUFF_STEAM_DEPOT_ID')],
  ['Steam credentials ignored', gitignore.includes('steam/credentials.vdf')&&gitignore.includes('steam_appid.txt')],
  ['SteamPipe prepare requires env IDs', steamPrepare.includes('ORBUFF_STEAM_APP_ID')&&steamPrepare.includes('ORBUFF_STEAM_DEPOT_ID')&&steamPrepare.includes('replaceAll')],
  ['Steam prepare script registered', typeof pkg.scripts?.['steam:prepare'] === 'string'],
  ['Steam readiness script registered', typeof pkg.scripts?.['steam:readiness'] === 'string'],
  ['Steam strict release script registered', typeof pkg.scripts?.['steam:release:validate'] === 'string'],
  ['Cloud restore tracks local progress', steamRenderer.includes('__orbuffSteamLocalPersistAt')&&steamRenderer.includes('remote_newer_than_local')],
  ['Cloud restore preserves ambiguous local progress', steamRenderer.includes('unversioned_local_progress_present')&&steamRenderer.includes("action:'keep-local'")],
  ['Steam release gate exists', steamReleaseValidator.includes('--strict')&&steamReleaseValidator.includes('Steam native binding installed')],
  ['core persist event emitted', stateContent.includes("CustomEvent('orbuff:persist')")],
  ['Steam save/stat sync listens to persist', steamRenderer.includes("addEventListener('orbuff:persist'")&&steamRenderer.includes('scheduleSteamProgressSync')],
  ['Steam stats are debounced', steamRenderer.includes('statTimer')&&steamRenderer.includes('setTimeout(()=>syncAchievements(),900)')],
  ['desktop Steam identity is active-only', presentation.includes('orbuffDesktopSteamStatus')&&presentation.includes("if(!steamState.active)")&&presentation.includes("'orbuff:steam-status'")],
  ['desktop start script', typeof pkg.scripts?.['desktop:start'] === 'string'],
  ['Windows distribution script', typeof pkg.scripts?.['desktop:dist:win'] === 'string']
];

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
if (failed.length) throw new Error(`Desktop validation failed: ${failed.map(([name]) => name).join(', ')}`);
console.log('Orbuff desktop release validation passed.');
