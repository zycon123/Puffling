/* Sky Puff — Unique Fusion Puffling abilities v0.1 */
(function(){
 let auroraReady=0,tempestReady=0,neonReady=0;
 const active=()=>window.SkyPuffPufflingGameplay?.active?.()||'';
 const now=()=>performance.now();
 function toast(s){if(typeof showToast==='function')showToast(s)}
 function tick(){
  try{
   const id=active(),t=now();
   // Aurora: emergency recovery when falling dangerously low.
   if(id==='aurora'&&typeof running!=='undefined'&&running&&typeof player!=='undefined'&&player&&typeof H!=='undefined'&&player.y>H-75&&player.vy>2&&t>=auroraReady){
    player.vy=-11.5; invuln=Math.max(typeof invuln==='number'?invuln:0,42); auroraReady=t+14000; toast('AURORA RESCUE! ❄️🌈');
   }
   // Tempest: periodic wind surge while climbing.
   if(id==='tempest'&&typeof running!=='undefined'&&running&&typeof player!=='undefined'&&player&&player.vy<0&&t>=tempestReady){
    player.vy-=2.4; tempestReady=t+5200;
   }
   // Neon Storm: rare rainbow overcharge pulse during boss combat.
   if(id==='neonstorm'&&typeof boss!=='undefined'&&boss&&t>=neonReady&&typeof rainbowOvercharge!=='undefined'){
    rainbowOvercharge=Math.max(rainbowOvercharge,150); neonReady=t+12000; toast('NEON OVERCHARGE! 🌈⚡');
   }
  }catch(e){}
  requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
 window.SkyPuffFusionAbilities={active};
})();
