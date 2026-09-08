import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const gamePath = path.join(root, 'game.js');
const indexPath = path.join(root, 'index.html');

const fail = (msg) => {
  console.error(`❌ ${msg}`);
  process.exitCode = 1;
};

const ok = (msg) => console.log(`✅ ${msg}`);

if (!fs.existsSync(gamePath)) fail('game.js is missing');
if (!fs.existsSync(indexPath)) fail('index.html is missing');
if (process.exitCode) process.exit(process.exitCode);

const game = fs.readFileSync(gamePath, 'utf8');
const index = fs.readFileSync(indexPath, 'utf8');

const partsMatch = game.match(/const\s+parts\s*=\s*\[([\s\S]*?)\]/);
if (!partsMatch) fail('Could not find ordered module list in game.js');

const modules = partsMatch
  ? [...partsMatch[1].matchAll(/['"]([^'"]+\.js)['"]/g)].map((m) => m[1])
  : [];

if (!modules.length) fail('Module loader list is empty');
if (modules.some((m) => /part\d|part5_/i.test(m))) fail('Legacy part*.js file is still in active loader');

for (const rel of modules) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    fail(`Loader references missing module: ${rel}`);
    continue;
  }
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    ok(`Syntax: ${rel}`);
  } catch (err) {
    fail(`Syntax error in ${rel}: ${String(err.stderr || err.message).trim()}`);
  }
}

for (const rel of ['audio_theme.js', 'game.js']) {
  if (!index.includes(`src="${rel}"`) && !index.includes(`src='${rel}'`)) {
    fail(`index.html does not load ${rel}`);
  }
}

if (index.indexOf('audio_theme.js') > index.indexOf('game.js')) {
  fail('audio_theme.js must load before game.js');
} else {
  ok('Bootstrap script order');
}

const requiredIds = [
  'game','start','playBtn','pauseBtn','gameOver','shop','upgrades',
  'bossBarWrap','bossBar','bossRushMenu','multiplayerMenu','leaderboardMenu',
  'audioSettings','bgMusic','toast'
];
for (const id of requiredIds) {
  if (!index.includes(`id="${id}"`) && !index.includes(`id='${id}'`)) {
    fail(`Missing required DOM id: ${id}`);
  }
}

if (!process.exitCode) {
  ok(`Loader references ${modules.length} named modules`);
  ok('Static Sky Puff build validation passed');
}
