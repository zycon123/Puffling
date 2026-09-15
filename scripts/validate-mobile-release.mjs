import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'www/index.html',
  'www/style.css',
  'www/game.js',
  'www/audio_theme.js',
  'www/js/localization_core.js',
  'www/js/orbuff_game_guide.js',
  'www/js/orbuff_menu_localization.js',
  'capacitor.config.ts',
  'release.config.json',
  'scripts/configure-native-release.mjs'
];

for (const rel of required) {
  const info = await stat(path.join(root, rel));
  if (!info.isFile()) throw new Error(`Expected file missing from mobile release: ${rel}`);
}

const html = await readFile(path.join(root, 'www/index.html'), 'utf8');
const game = await readFile(path.join(root, 'www/game.js'), 'utf8');
const config = await readFile(path.join(root, 'capacitor.config.ts'), 'utf8');
const release = JSON.parse(await readFile(path.join(root, 'release.config.json'), 'utf8'));
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));

const checks = [
  [/<title>Orbuff/i.test(html), 'index title is Orbuff'],
  [/viewport-fit=cover/i.test(html), 'safe-area viewport support is enabled'],
  [/js\/orbuff_menu_localization\.js/.test(game), 'localized menu runtime is bundled'],
  [/js\/orbuff_game_guide\.js/.test(game), 'localized game guide runtime is bundled'],
  [/appId:\s*'com\.zyconstudios\.orbuff'/.test(config), 'native app id is com.zyconstudios.orbuff'],
  [/webDir:\s*'www'/.test(config), 'Capacitor uses prepared www directory'],
  [/allowMixedContent:\s*false/.test(config), 'Android clear mixed content is disabled'],
  [release.appName === 'Orbuff', 'release app name is Orbuff'],
  [release.appId === 'com.zyconstudios.orbuff', 'release app id matches Capacitor identity'],
  [/^\d+\.\d+\.\d+$/.test(String(release.version)), 'native version uses three numeric components'],
  [pkg.version === release.version, 'package and native release versions match'],
  [Number.isInteger(release.buildNumber) && release.buildNumber > 0, 'native build number is a positive integer']
];

for (const [ok, label] of checks) {
  if (!ok) throw new Error(`Mobile release validation failed: ${label}`);
  console.log(`OK: ${label}`);
}

console.log(`Orbuff mobile release ${release.version} (${release.buildNumber}) validated.`);
