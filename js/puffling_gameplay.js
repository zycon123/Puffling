/* Puffling — gameplay integration v0.2 */
(function(){
  const ACTIVE_KEY='skyPuffActivePuffling';
  let windLatch=false,frostUsed=false;
  function F(){return window.SkyPuffFusion}
  function active(){try{return localStorage.getItem(ACTIVE_KEY)||''}catch(e){return ''}}
  function setActive(id){const f=F(),s=f&&f.load();if(!f||!s||!(s.owned[id]>0))return false;localStorage.setItem(ACTIVE_KEY,id);refreshHud();return true}
  function getPuff(id){const f=F();if(!f)return null;return [...Object.values(f.BASE||{}),...Object.values(f.FUSIONS||{})].find(p=>p.id===id)||null}
  function ensureHud(){if(document.getElementById('activePufflingHud'))return;const d=document.createElement('div');d.id='activePufflingHud';d.style.cssText='position:fixed;left:12px;bottom:14px;z-index:7;display:none;background:rgba(24,49,82,.72);color:#fff;padding:7px 10px;border-radius:14px;font:800 12px system-ui;backdrop-filter:blur(5px);pointer-events:none';document.body.appendChild(d)}
  function refreshHud(){ensureHud();const d=document.getElementById('activePufflingHud'),p=getPuff(active());if(!d)return;d.innerHTML=p?`${p.icon||'☁️'} ${p.name}`:'☁️ Ingen aktiv Puffling';d.style.display=(typeof running!=='undefined'&&running)?'block':'none'}
  function resetRunState(){windLatch=false;frostUsed=false}
  function applyPassives(dt){const id=active(),ability=getPuff(id)?.ability;if(!id||typeof running==='undefined'||!running)return;const s=Math.min((dt||16.67)/16.67,1.6);
    if((ability==='rainbowGain'||ability==='rainbowChain')&&typeof boost==='number'){boost=Math.min(100,boost+.055*s);if(typeof boostEl!=='undefined'&&boostEl)boostEl.style.width=boost+'%';}
    if((ability==='jumpControl'||ability==='stormJump')&&typeof player!=='undefined'&&player&&!windLatch&&player.vy<-10.35&&player.vy>-10.9){player.vy*=1.06;windLatch=true;}if(typeof player!=='undefined'&&player&&player.vy>-2)windLatch=false;
  }
  const oldUpdate=window.update;
  if(typeof oldUpdate==='function')window.update=function(dt){oldUpdate(dt);applyPassives(dt);refreshHud()};
  const oldReset=window.reset;
  if(typeof oldReset==='function')window.reset=function(){const r=oldReset.apply(this,arguments);resetRunState();refreshHud();return r};
  const oldAbsorb=window.absorbHit;
  if(typeof oldAbsorb==='function')window.absorbHit=function(){const id=active(),ability=getPuff(id)?.ability;if(!frostUsed&&(ability==='freeze'||ability==='rescuePlatform')){frostUsed=true;if(typeof invuln!=='undefined')invuln=Math.max(invuln,70);if(typeof showToast==='function')showToast(`${getPuff(id)?.name||'Puffling'} reddet deg! ❄️`);return true;}return oldAbsorb.apply(this,arguments)};
  window.SkyPuffPufflingGameplay={active,setActive,getPuff,refreshHud,runHeightReward:false};
  ensureHud();
})();