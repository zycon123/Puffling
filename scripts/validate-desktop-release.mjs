import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'index.html',
  'styles.css',
  'game.js',
  'desktop/main.cjs',
  'electron-builder.yml'
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  throw new Error(`Desktop release is missing required files: ${missing.join(', ')}`);
}

const main = fs.readFileSync(path.join(root, 'desktop/main.cjs'), 'utf8');
const config = fs.readFileSync(path.join(root, 'electron-builder.yml'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const checks = [
  ['contextIsolation enabled', /contextIsolation:\s*true/.test(main)],
  ['nodeIntegration disabled', /nodeIntegration:\s*false/.test(main)],
  ['sandbox enabled', /sandbox:\s*true/.test(main)],
  ['external links denied in-app', /setWindowOpenHandler/.test(main) && /action:\s*'deny'/.test(main)],
  ['fullscreen keyboard support', /F11/.test(main) && /Escape/.test(main)],
  ['Steam-safe Windows app id', /com\.zyconstudios\.orbuff/.test(config)],
  ['packaged game entry', /index\.html/.test(config)],
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
