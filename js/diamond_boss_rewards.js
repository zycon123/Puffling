/* Sky Puff — Diamond boss rewards v0.1 */
(function(){
 let last=null;
 function tick(){try{
  if(typeof boss!=='undefined'){
   if(boss)last={id:boss.id,tier:boss.tier||1,at:boss.at||0};
   else if(last&&typeof running!=='undefined'&&running){const won=typeof bossDefeated!=='undefined'&&bossDefeated;if(won&&window.SkyPuffDiamonds){let amount=1;if(last.at>=10000)amount=2;if(last.at>=17000)amount=3;if(last.at>=24000)amount=4;window.SkyPuffDiamonds.add(amount);if(typeof showToast==='function')showToast(`Boss reward: +${amount} 💎`);}last=null;}
  }
 }catch(e){}requestAnimationFrame(tick)}
 requestAnimationFrame(tick);
})();