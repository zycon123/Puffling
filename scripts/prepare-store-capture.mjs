import fs from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const source=await fs.readFile(path.join(root,'index.html'),'utf8');
if(!source.includes('<script src="game.js'))throw new Error('Could not find the Orbuff runtime loader');
if(source.includes('store-capture-bootstrap.js'))throw new Error('Production index.html must never load the capture helper');
const capture=source.replace('</body>','<script src="scripts/store-capture-bootstrap.js"></script></body>');
await fs.writeFile(path.join(root,'store-capture.html'),capture);
console.log('Prepared local-only store-capture.html.');
