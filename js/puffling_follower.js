/* Puffling — Visible Puffling follower v0.5 */
(function(){
  let el=null,lastVisualKey='';
  function ensure(){
    if(el)return el;
    el=document.createElement('div');
    el.id='pufflingFollower';
    el.style.cssText='position:fixed;z-index:6;display:none;pointer-events:none;transform:translate(-50%,-50%);align-items:center;justify-content:center;transition:opacity .18s ease;will-change:left,top';
    document.body.appendChild(el);return el;
  }
  function setVisual(d,id,p){
    const stage=window.SkyPuffPufflingEvolution?.stageFor?.(id)||0;
    const key=id+':'+stage;
    if(key===lastVisualKey)return;
    lastVisualKey=key;
    d.innerHTML=window.SkyPuffVisuals?.art?.(id,stage)||`<span style="font-size:23px">${p?.icon||'☁️'}</span>`;
  }
  function screenX(gameX){
    try{const r=canvas.getBoundingClientRect();return r.left+Number(gameX||0);}catch(e){return Number(gameX||0);}
  }
  function tick(t){
    const d=ensure(),G=window.SkyPuffPufflingGameplay;
    try{
      const id=G?.active?.(),p=G?.getPuff?.(id);
      if(!p||typeof running==='undefined'||!running||typeof player==='undefined'||!player){d.style.display='none';requestAnimationFrame(tick);return;}
      setVisual(d,id,p);
      const bob=Math.sin(t/280)*4;
      const side=(typeof player.vx==='number'&&player.vx<0)?36:-36;
      const x=screenX(player.x+side);
      d.style.left=`${Math.max(22,Math.min(innerWidth-22,x))}px`;
      d.style.top=`${Math.max(22,Math.min(innerHeight-22,player.y-12+bob))}px`;
      d.style.display='flex';
    }catch(e){d.style.display='none'}
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
