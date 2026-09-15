import fs from 'node:fs';

const source=fs.readFileSync('render.yaml','utf8');
const fail=message=>{console.error(`❌ Render Blueprint validation: ${message}`);process.exitCode=1};

function secretIsExternal(key){
  const escaped=key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return new RegExp(`- key: ${escaped}\\s+sync: false`).test(source);
}

if(!source.includes('healthCheckPath: /health'))fail('production service must use /health');
if(!source.includes('autoDeployTrigger: checksPass'))fail('production deploys must wait for required checks');
if(/\bautoDeploy:\s*true\b/.test(source))fail('deprecated immediate autoDeploy bypasses the checks-pass gate');
for(const key of ['DATABASE_URL','PUFFLING_AUTH_SECRET','PUFFLING_WALLET_SECRET']){
  if(!secretIsExternal(key))fail(`${key} must remain a sync-disabled Render secret`);
}
if(!/- key: PUFFLING_IAP_PROVIDER_MODE\s+value: disabled/.test(source))fail('real-money IAP must remain fail-closed in the Blueprint');

if(!process.exitCode)console.log('✅ Render Blueprint keeps auth, wallet and database secrets external and deploys behind checks');
