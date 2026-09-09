/* Sky Puff — Puffling gameplay integration v0.1 */
(function(){
  const ACTIVE_KEY='skyPuffActivePuffling';
  const RUN_KEY='skyPuffPufflingRunRewardV1';
  const baseIds=['ember','volt','frost','prism','shadow','wind'];
  let lastScore=0,windLatch=false,frostUsed=false;
  function F(){return window.SkyPuffFusion}
  function active(){try{return localStorage.getItem(ACTIVE_KEY)||''}catch(e){return ''}}
  function setActive(id){const f=F(),s=f&&f.load();if(!f||!s||!(s.owned[id]>0))return false;localStorage.setItem(ACTIVE_KEY,id);refreshHud();return true}
  function getPuff(id){const f=F();if(!f)return null;return [...Object.values(f.BASE||{}),...Object.values(f.FUSIONS||{})].find(p=>p.id===id)||null}
  function ensureHud(){if(document.getElementById('activePufflingHud'))return;const d=document.createElement('div');d.id='activePufflingHud';d.style.cssText='position:fixed;left:12px;bottom:14px;z-index:7;display:none;background:rgba(24,49,82,.72);color:#fff;padding:7px 10px;border-radius:14px;font:800 12px system-ui;backdrop-filter:blur(5px);pointer-events:none';document.body.appendChild(d)}
  function refreshHud(){ensureHud();const d=document.getElementById('activePufflingHud'),p=getPuff(active());if(!d)return;d.innerHTML=p?`${p.icon||'☁️'} ${p.name}`:'☁️ Ingen aktiv Puffling';d.style.display=(typeof running!=='undefined'&&running)?'block':'none'}
  function awardRunPuffling(){const f=F();if(!f)return null;const id=baseIds[Math.floor(Math.random()*baseIds.length)];f.add(id,1);if(!active())setActive(id);const p=getPuff(id);if(typeof showToast==='function')showToast(`Ny Puffling funnet! ${p?.icon||'☁️'} ${p?.name||id}`);window.SkyPuffFusionUI?.renderDex?.();return id}
  function resetRunFlag(){try{sessionStorage.removeItem(RUN_KEY)}catch(e){}lastScore=0;windLatch=false;frostUsed=false}
  function checkRunReward(){if(typeof score==='undefined'||typeof running==='undefined'||!running)return;let claimed=false;try{claimed=sessionStorage.getItem(RUN_KEY)==='1'}catch(e){}if(!claimed&&score>=600&&lastScore<600){awardRunPuffling();try{sessionStorage.setItem(RUN_KEY,'1')}catch(e){}}lastScore=score}
  function applyPassives(dt){const id=active();if(!id||typeof running==='undefined'||!running)return;const s=Math.min((dt||16.67)/16.67,1.6);
    if((id==='prism'||id==='neonstorm')&&typeof boost==='number'){boost=Math.min(100,boost+.055*s);if(typeof boostEl!=='undefined'&&boostEl)boostEl.style.width=boost+'%';}
    if((id==='wind'||id==='tempest')&&typeof player!=='undefined'&&player&&!windLatch&&player.vy<-10.35&&player.vy>-10.9){player.vy*=1.06;windLatch=true;}if(typeof player!=='undefined'&&player&&player.vy>-2)windLatch=false;
  }
  const oldUpdate=window.update;
  if(typeof oldUpdate==='function')window.update=function(dt){oldUpdate(dt);checkRunReward();applyPassives(dt);refreshHud()};
  const oldReset=window.reset;
  if(typeof oldReset==='function')window.reset=function(){const r=oldReset.apply(this,arguments);resetRunFlag();refreshHud();return r};
  const oldAbsorb=window.absorbHit;
  if(typeof oldAbsorb==='function')window.absorbHit=function(){if(!frostUsed&&(active()==='frost'||active()==='aurora')){frostUsed=true;if(typeof invuln!=='undefined')invuln=Math.max(invuln,70);if(typeof showToast==='function')showToast('Frost Puff reddet deg! ❄️');return true;}return oldAbsorb.apply(this,arguments)};
  window.SkyPuffPufflingGameplay={active,setActive,getPuff,awardRunPuffling,refreshHud};
  ensureHud();
})();
