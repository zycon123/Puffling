import {createServer} from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.ORBUFF_PLAYWRIGHT_MODULE?pathToFileURL(process.env.ORBUFF_PLAYWRIGHT_MODULE).href:'playwright');
const root=process.cwd();
const server=createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return}
  try{const target=fs.statSync(file).isDirectory()?path.join(file,'index.html'):file;res.setHeader('Content-Type',target.endsWith('.js')?'text/javascript':target.endsWith('.css')?'text/css':target.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(target))}catch{res.writeHead(404).end()}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:1280,height:900}});
  // All game API requests are isolated: these tests must never mutate real player accounts.
  await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  await context.addInitScript(()=>{
    window.__testPad=null;Object.defineProperty(navigator,'getGamepads',{value:()=>window.__testPad?[window.__testPad]:[]});
  });
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=`http://127.0.0.1:${server.address().port}/`;
  await page.goto(url);
  const open=page.locator('#start [data-pc-settings-open]');await open.waitFor({state:'visible',timeout:30000});await open.click();
  const dialog=page.getByRole('dialog');await dialog.waitFor({state:'visible'});
  const left=page.locator('[data-pc-key="left"][data-slot="0"]');await left.click();await page.keyboard.press('j');assert.equal(await left.textContent(),'J');
  await page.locator('[data-pc-key="right"][data-slot="0"]').click();await page.keyboard.press('j');assert.match(await page.locator('#pcSettingsStatus').textContent(),/already assigned/);
  await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),true,'Escape cancels capture before closing settings');
  await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);
  await page.reload();await open.waitFor({state:'visible'});await open.click();assert.equal(await left.textContent(),'J','binding survives reload');
  await page.locator('#pcVolume').focus();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'pcGraphics');
  await page.locator('#pcSettingsBack').focus();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'pcMusicToggle');
  await page.locator('[data-pc-button="boost"]').selectOption('2');
  await page.evaluate(()=>{window.__testPad={index:0,id:'Xbox test controller',connected:true,mapping:'standard',axes:[0,0],buttons:Array.from({length:16},()=>({pressed:false}))};window.dispatchEvent(new Event('gamepadconnected'))});
  assert.match(await page.locator('#pcControllerStatus').textContent(),/Xbox/);
  await page.locator('#pcMusicToggle').focus();await page.evaluate(()=>window.__testPad.axes[1]=1);
  await page.waitForFunction(()=>document.activeElement.id==='pcVolume');await page.evaluate(()=>window.__testPad.axes[1]=0);
  await page.evaluate(()=>window.__testPad.buttons[1].pressed=true);await dialog.waitFor({state:'hidden'});await page.evaluate(()=>window.__testPad.buttons[1].pressed=false);
  await open.click();await page.locator('#pcResetControls').click();assert.equal(await left.textContent(),'A');assert.equal(await page.locator('[data-pc-button="boost"]').inputValue(),'0');
  await page.evaluate(()=>{running=true;paused=false;OrbuffPcSettings.close();OrbuffPcSettings.open()});assert.equal(await page.evaluate(()=>paused),true);
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>paused),true,'closing settings leaves game paused');
  assert.equal(await page.evaluate(()=>W),620,'desktop width unchanged');
  assert.deepEqual(errors,[],'full game loads without page errors');
  await context.close();
  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await mobile.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  const phone=await mobile.newPage();await phone.goto(url);await phone.waitForFunction(()=>!!window.OrbuffPcSettings);assert.equal(await phone.locator('#start [data-pc-settings-open]').isVisible(),false,'PC settings do not alter touch menu');
  assert.equal(await phone.evaluate(()=>W),390,'mobile width unchanged');
  await mobile.close();
  console.log('PASS browser PC settings: full-game boot, rebind/conflict/cancel, reload, focus trap, controller navigation, reset, pause safety, 620px and mobile layout.');
}finally{await browser.close();server.close()}
