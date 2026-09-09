/* Sky Puff — Unique Fusion Puffling abilities v0.2 (level-scaled) */
(function(){
 let auroraReady=0,tempestReady=0,neonReady=0;
 const active=()=>window.SkyPuffPufflingGameplay?.active?.()||'';
 const prog=()=>window.SkyPuffPufflingProgress;
 const level=id=>prog()?.get?.(id)?.level||1;
 const t01=id=>Math.max(0,Math.min(1,(level(id)-1)/19));
 const now=()=>performance.now();
 function toast(s){if(typeof showToast==='function')showToast(s)}
 function tick(){
  try{
   const id=active(),t=now(),scale=t01(id);
   if(id==='aurora'&&typeof running!=='undefined'&&running&&typeof player!=='undefined'&&player&&typeof H!=='undefined'&&player.y>H-75&&player.vy>2&&t>=auroraReady){
    const rescueVy=-11.5-scale*2.2;
    const inv=42+Math.round(scale*24);
    const cd=14000-scale*3500;
    player.vy=rescueVy; invuln=Math.max(typeof invuln==='number'?invuln:0,inv); auroraReady=t+cd; toast(`AURORA RESCUE! ❄️🌈 Lv.${level(id)}`);
   }
   if(id==='tempest'&&typeof running!=='undefined'&&running&&typeof player!=='undefined'&&player&&player.vy<0&&t>=tempestReady){
    player.vy-=2.4+scale*1.6;
    tempestReady=t+(5200-scale*1400);
   }
   if(id==='neonstorm'&&typeof boss!=='undefined'&&boss&&t>=neonReady&&typeof rainbowOvercharge!=='undefined'){
    rainbowOvercharge=Math.max(rainbowOvercharge,150+Math.round(scale*90));
    neonReady=t+(12000-scale*2500);
    toast(`NEON OVERCHARGE! 🌈⚡ Lv.${level(id)}`);
   }
  }catch(e){}
  requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
 window.SkyPuffFusionAbilities={active,level};
})();
