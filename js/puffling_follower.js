/* Sky Puff — Visible Puffling follower v0.1 */
(function(){
  let el=null;
  function ensure(){
    if(el)return el;
    el=document.createElement('div');
    el.id='pufflingFollower';
    el.style.cssText='position:fixed;z-index:6;display:none;pointer-events:none;transform:translate(-50%,-50%);font-size:28px;filter:drop-shadow(0 4px 5px rgba(0,0,0,.25));transition:opacity .18s ease';
    document.body.appendChild(el);return el;
  }
  function tick(t){
    const d=ensure(),G=window.SkyPuffPufflingGameplay;
    try{
      const id=G?.active?.(),p=G?.getPuff?.(id);
      if(!p||typeof running==='undefined'||!running||typeof player==='undefined'||!player){d.style.display='none';requestAnimationFrame(tick);return;}
      d.textContent=p.icon||'☁️';
      const bob=Math.sin(t/260)*5;
      const side=(typeof player.vx==='number'&&player.vx<0)?32:-32;
      d.style.left=`${Math.max(18,Math.min(innerWidth-18,player.x+side))}px`;
      d.style.top=`${Math.max(18,Math.min(innerHeight-18,player.y-10+bob))}px`;
      d.style.display='block';
    }catch(e){d.style.display='none'}
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
