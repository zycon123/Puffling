import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'www');
const files = ['index.html', 'style.css', 'game.js', 'audio_theme.js', 'orbuff.bundle.js'];
const dirs = ['js'];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const file of files) {
  const src = path.join(root, file);
  if (!existsSync(src)) throw new Error(`Missing mobile web asset: ${file}`);
  await cp(src, path.join(out, file));
}

for (const dir of dirs) {
  const src = path.join(root, dir);
  if (!existsSync(src)) throw new Error(`Missing mobile web directory: ${dir}`);
  await cp(src, path.join(out, dir), { recursive: true });
}

console.log(`Prepared Orbuff mobile web assets in ${out}`);
