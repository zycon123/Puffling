/* Sky Puff — Visible Puffling follower v0.3 */
(function(){
  let el=null;
  const aura={ember:'🔥',volt:'⚡',frost:'❄️',prism:'🌈',shadow:'🌑',wind:'💨',thunderflame:'⚡',aurora:'✨',eclipse:'🌘',tempest:'🌪️',neonstorm:'🌈'};
  function ensure(){
    if(el)return el;
    el=document.createElement('div');
    el.id='pufflingFollower';
    el.style.cssText='position:fixed;z-index:6;display:none;pointer-events:none;transform:translate(-50%,-50%);border-radius:50%;background:rgba(255,255,255,.88);box-shadow:0 5px 14px rgba(0,0,0,.22);align-items:center;justify-content:center;transition:opacity .18s ease,width .2s ease,height .2s ease,box-shadow .2s ease';
    document.body.appendChild(el);return el;
  }
  function tick(t){
    const d=ensure(),G=window.SkyPuffPufflingGameplay,E=window.SkyPuffPufflingEvolution;
    try{
      const id=G?.active?.(),p=G?.getPuff?.(id);
      if(!p||typeof running==='undefined'||!running||typeof player==='undefined'||!player){d.style.display='none';requestAnimationFrame(tick);return;}
      const stage=E?.stageFor?.(id)||0,size=stage===2?46:stage===1?41:36,core=stage===2?24:stage===1?21:19;
      d.style.width=size+'px';d.style.height=size+'px';
      d.style.boxShadow=stage===2?'0 0 18px rgba(255,255,255,.95),0 5px 16px rgba(0,0,0,.25)':stage===1?'0 0 12px rgba(255,255,255,.75),0 5px 15px rgba(0,0,0,.23)':'0 5px 14px rgba(0,0,0,.22)';
      d.innerHTML=`<span style="font-size:${core}px">${p.icon||'☁️'}</span><span style="position:absolute;right:-7px;top:-8px;font-size:${stage===2?15:stage===1?13:11}px">${aura[id]||'✨'}</span>${stage?`<span style="position:absolute;left:-6px;bottom:-7px;font-size:${stage===2?13:11}px">${stage===2?'👑':'✦'}</span>`:''}`;
      const bob=Math.sin(t/260)*5;
      const side=(typeof player.vx==='number'&&player.vx<0)?34:-34;
      d.style.left=`${Math.max(20,Math.min(innerWidth-20,player.x+side))}px`;
      d.style.top=`${Math.max(20,Math.min(innerHeight-20,player.y-10+bob))}px`;
      d.style.display='flex';
    }catch(e){d.style.display='none'}
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
