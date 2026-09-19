import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'index.html',
  'style.css',
  'game.js',
  'js/desktop_controls.js',
  'js/desktop_presentation.js',
  'js/desktop_store_policy.js',
  'desktop/main.cjs',
  'electron-builder.yml'
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  throw new Error(`Desktop release is missing required files: ${missing.join(', ')}`);
}

const main = fs.readFileSync(path.join(root, 'desktop/main.cjs'), 'utf8');
const config = fs.readFileSync(path.join(root, 'electron-builder.yml'), 'utf8');
const game = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const controls = fs.readFileSync(path.join(root, 'js/desktop_controls.js'), 'utf8');
const presentation = fs.readFileSync(path.join(root, 'js/desktop_presentation.js'), 'utf8');
const storePolicy = fs.readFileSync(path.join(root, 'js/desktop_store_policy.js'), 'utf8');
const desktopWidth = fs.readFileSync(path.join(root, 'js/desktop_game_width.js'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const inputPos=game.indexOf("'js/input_missions_boss_spawn.js'");
const controlsPos=game.indexOf("'js/desktop_controls.js'");
const presentationPos=game.indexOf("'js/desktop_presentation.js'");
const gameplayPos=game.indexOf("'js/gameplay_update.js'");
const diamondStorePos=game.indexOf("'js/diamond_iap_store.js'");
const storePolicyPos=game.indexOf("'js/desktop_store_policy.js'");
const menuCleanupPos=game.indexOf("'js/menu_beta_cleanup.js'");

const checks = [
  ['contextIsolation enabled', /contextIsolation:\s*true/.test(main)],
  ['nodeIntegration disabled', /nodeIntegration:\s*false/.test(main)],
  ['sandbox enabled', /sandbox:\s*true/.test(main)],
  ['external links denied in-app', /setWindowOpenHandler/.test(main) && /action:\s*'deny'/.test(main)],
  ['fullscreen keyboard support', /F11/.test(main) && /Escape/.test(main)],
  ['Steam-safe Windows app id', /com\.zyconstudios\.orbuff/.test(config)],
  ['packaged game entry', /index\.html/.test(config)],
  ['packaged stylesheet', /style\.css/.test(config)],
  ['desktop controls loaded after base input', inputPos>=0&&controlsPos>inputPos],
  ['desktop controls loaded before gameplay loop', gameplayPos>=0&&controlsPos<gameplayPos],
  ['desktop presentation loaded after controls', presentationPos>controlsPos],
  ['desktop presentation loaded before gameplay loop', presentationPos<gameplayPos],
  ['keyboard A/D support', controls.includes("case 'KeyA'")&&controls.includes("case 'KeyD'")],
  ['keyboard arrows support', controls.includes("case 'ArrowLeft'")&&controls.includes("case 'ArrowRight'")],
  ['Rainbow Boost keyboard action', controls.includes("case 'Space'")&&controls.includes('doBoost()')],
  ['pause/back keyboard actions', controls.includes("case 'Escape'")&&controls.includes("case 'KeyP'")],
  ['Gamepad API support', controls.includes('navigator.getGamepads')&&controls.includes('gamepadconnected')],
  ['gamepad action/back/start buttons', controls.includes('pressedEdge(pad,0)')&&controls.includes('pressedEdge(pad,1)')&&controls.includes('pressedEdge(pad,9)')],
  ['menu focus navigation', controls.includes('function navigateFocus')&&controls.includes('focus({preventScroll:false})')],
  ['widescreen PC frame', presentation.includes('orbuffDesktopFrame')&&presentation.includes('@media (min-width:1100px)')],
  ['desktop live run status', presentation.includes('orbuffDesktopHeight')&&presentation.includes('orbuffDesktopCoins')&&presentation.includes('orbuffDesktopHealth')],
  ['desktop mode status', presentation.includes('function currentMode')&&presentation.includes('bossArena')&&presentation.includes('multiplayerMode')],
  ['620px gameplay balance preserved', desktopWidth.includes('MAX_DESKTOP_WIDTH=620')],
  ['PC store policy loaded after mobile Diamond store', diamondStorePos>=0&&storePolicyPos>diamondStorePos],
  ['PC store policy loaded before later menu cleanup', menuCleanupPos>=0&&storePolicyPos<menuCleanupPos],
  ['PC SKU detection is Electron file build only', storePolicy.includes("location.protocol==='file:'")&&storePolicy.includes('/Electron/i')],
  ['mobile IAP hidden on packaged PC', storePolicy.includes('openDiamondStore')&&storePolicy.includes("style.display='none'")],
  ['mobile purchase API blocked on packaged PC', storePolicy.includes("reason:'pc_mobile_iap_disabled'")&&storePolicy.includes('mobileIapAllowed:false')],
  ['Mystery Shop balance remains available', storePolicy.includes('existing balance')&&storePolicy.includes('mysteryShopMenu')],
  ['desktop start script', typeof pkg.scripts?.['desktop:start'] === 'string'],
  ['Windows distribution script', typeof pkg.scripts?.['desktop:dist:win'] === 'string']
];

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
}

if (failed.length) {
  throw new Error(`Desktop validation failed: ${failed.map(([name]) => name).join(', ')}`);
}

console.log('Orbuff desktop release validation passed.');
