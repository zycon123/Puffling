/* Sky Puff — Visible Puffling follower v0.2 */
(function(){
  let el=null;
  const aura={ember:'🔥',volt:'⚡',frost:'❄️',prism:'🌈',shadow:'🌑',wind:'💨',thunderflame:'⚡',aurora:'✨',eclipse:'🌘',tempest:'🌪️',neonstorm:'🌈'};
  function ensure(){
    if(el)return el;
    el=document.createElement('div');
    el.id='pufflingFollower';
    el.style.cssText='position:fixed;z-index:6;display:none;pointer-events:none;transform:translate(-50%,-50%);width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.88);box-shadow:0 5px 14px rgba(0,0,0,.22);font-size:21px;align-items:center;justify-content:center;transition:opacity .18s ease';
    document.body.appendChild(el);return el;
  }
  function tick(t){
    const d=ensure(),G=window.SkyPuffPufflingGameplay;
    try{
      const id=G?.active?.(),p=G?.getPuff?.(id);
      if(!p||typeof running==='undefined'||!running||typeof player==='undefined'||!player){d.style.display='none';requestAnimationFrame(tick);return;}
      d.innerHTML=`<span style="font-size:19px">${p.icon||'☁️'}</span><span style="position:absolute;right:-7px;top:-8px;font-size:11px">${aura[id]||'✨'}</span>`;
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
