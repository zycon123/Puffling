import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root=process.cwd();
const strict=process.argv.includes('--strict');
const require=createRequire(import.meta.url);
const appId=String(process.env.ORBUFF_STEAM_APP_ID||'').trim();
const depotId=String(process.env.ORBUFF_STEAM_DEPOT_ID||'').trim();

const exists=rel=>fs.existsSync(path.join(root,rel));
const read=rel=>exists(rel)?fs.readFileSync(path.join(root,rel),'utf8'):'';
const positiveId=value=>/^\d+$/.test(value)&&Number(value)>0;

const pkg=JSON.parse(read('package.json')||'{}');
const builder=read('electron-builder.yml');
const runtime=read('desktop/steam_runtime.cjs');
const renderer=read('js/steam_runtime.js');
const appBuild=read('steam/app_build.vdf');
const depotBuild=read('steam/depot_build_windows.vdf');

let bindingInstalled=false;
try{require.resolve('steamworks.js');bindingInstalled=true;}catch(e){}

const checks=[
  {name:'Steam runtime files present',ok:exists('desktop/steam_runtime.cjs')&&exists('desktop/preload.cjs')&&exists('js/steam_runtime.js'),required:true},
  {name:'SteamPipe templates present',ok:exists('steam/app_build.vdf')&&exists('steam/depot_build_windows.vdf'),required:true},
  {name:'Steam runtime does not hardcode Spacewar App ID',ok:!runtime.includes('init(480)'),required:true},
  {name:'Steam App ID placeholder retained in template',ok:appBuild.includes('ORBUFF_STEAM_APP_ID'),required:true},
  {name:'Steam Depot ID placeholder retained in templates',ok:appBuild.includes('ORBUFF_STEAM_DEPOT_ID')&&depotBuild.includes('ORBUFF_STEAM_DEPOT_ID'),required:true},
  {name:'Cloud conflict guard tracks local progress',ok:renderer.includes('__orbuffSteamLocalPersistAt')&&renderer.includes('remote_newer_than_local')&&renderer.includes('unversioned_local_progress_present'),required:true},
  {name:'Cloud restore reloads only after actual restore',ok:renderer.includes('restored?.restored===true'),required:true},
  {name:'Steam prepare script registered',ok:typeof pkg.scripts?.['steam:prepare']==='string',required:true},
  {name:'Steam release validator registered',ok:typeof pkg.scripts?.['steam:release:validate']==='string',required:true},
  {name:'Steam native binding installed',ok:bindingInstalled,required:strict},
  {name:'Steam App ID supplied',ok:positiveId(appId),required:strict},
  {name:'Steam Depot ID supplied',ok:positiveId(depotId),required:strict},
  {name:'App and Depot IDs differ',ok:positiveId(appId)&&positiveId(depotId)&&appId!==depotId,required:strict},
  {name:'Windows package exists',ok:exists('dist/desktop'),required:strict},
  {name:'Steam config generated',ok:exists('dist/steam-config/app_build.vdf')&&exists('dist/steam-config/depot_build_windows.vdf'),required:strict},
  {name:'electron-builder currently packages native binding',ok:!/!node_modules\/\*\*\/\*/.test(builder)||/node_modules\/steamworks\.js/.test(builder),required:strict}
];

let failed=0;
for(const check of checks){
  const level=check.ok?'PASS':check.required?'FAIL':'WARN';
  console.log(`${level}  ${check.name}`);
  if(!check.ok&&check.required)failed++;
}
console.log(strict?'Mode: STRICT STEAM RELEASE':'Mode: READINESS');
if(!strict&&!bindingInstalled)console.log('INFO  steamworks.js is not installed yet; standalone Windows builds remain valid.');
if(!strict&&/!node_modules\/\*\*\/\*/.test(builder)&&!/node_modules\/steamworks\.js/.test(builder))console.log('INFO  electron-builder excludes node_modules; native Steam binding packaging must be fixed before strict release.');
if(failed)throw new Error(`Steam release validation failed with ${failed} blocking check(s).`);
console.log(strict?'Steam release gate passed.':'Steam readiness structure passed.');
