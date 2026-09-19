import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const appId=String(process.env.ORBUFF_STEAM_APP_ID||'').trim();
const depotId=String(process.env.ORBUFF_STEAM_DEPOT_ID||'').trim();

if(!/^\d+$/.test(appId)||Number(appId)<=0)throw new Error('ORBUFF_STEAM_APP_ID must be a positive numeric Steam App ID.');
if(!/^\d+$/.test(depotId)||Number(depotId)<=0)throw new Error('ORBUFF_STEAM_DEPOT_ID must be a positive numeric Steam Depot ID.');

const sourceDir=path.join(root,'steam');
const outDir=path.join(root,'dist','steam-config');
fs.mkdirSync(outDir,{recursive:true});

for(const name of ['app_build.vdf','depot_build_windows.vdf']){
  const source=fs.readFileSync(path.join(sourceDir,name),'utf8');
  const rendered=source
    .replaceAll('ORBUFF_STEAM_APP_ID',appId)
    .replaceAll('ORBUFF_STEAM_DEPOT_ID',depotId);
  if(/ORBUFF_STEAM_(?:APP|DEPOT)_ID/.test(rendered))throw new Error(`Unresolved Steam placeholder in ${name}`);
  fs.writeFileSync(path.join(outDir,name),rendered,'utf8');
}

console.log(`Prepared SteamPipe config for App ${appId}, Depot ${depotId} in dist/steam-config`);
