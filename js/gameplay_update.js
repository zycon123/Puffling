function fireBossShot(angle,speed,r,type,life=180){bossShots.push({x:boss.x,y:boss.y+30,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,r,type,life});}
function fireAimedBossShot(speed,r,type,offset=0){const dx=player.x-boss.x,dy=player.y-boss.y;const angle=Math.atan2(dy,dx)+offset;fireBossShot(angle,speed,r,type);}
function bossAttackPattern(){
 const tier=Math.max(1,boss.tier||1),bonus=Math.min(.9,(tier-1)*.08);
 if(boss.id==='storm'){
  const speed=4.7+bonus;fireAimedBossShot(speed,11,'storm',-.16);fireAimedBossShot(speed,11,'storm',.16);if(tier>=3)fireAimedBossShot(speed+0.2,10,'storm',0);return;
 }
 if(boss.id==='candy'){
  const speed=4.35+bonus;fireAimedBossShot(speed,11,'candy',-.28);fireAimedBossShot(speed,11,'candy',.28);return;
 }
 if(boss.id==='ice'){
  const speed=3.8+bonus*.65;fireAimedBossShot(speed,15,'ice',0);if(tier>=2)fireAimedBossShot(speed*.92,12,'ice',tier%2?-.24:.24);return;
 }
 const speed=5.2+bonus;fireAimedBossShot(speed,12,'galaxy',0);setTimeout(()=>{if(running&&boss&&boss.id==='galaxy')fireAimedBossShot(speed+.25,11,'galaxy',tier>=3?.12:0);},120);
}
function update(dt){
 const s=Math.min(dt/16.67,1.6);
 if(screenShake>0)screenShake=Math.max(0,screenShake-.45*s);
 if(Math.abs(puffAnim)>.01)puffAnim*=Math.pow(.82,s); else puffAnim=0;
 if(bossFlash>0)bossFlash-=s;
 for(const sp of skySparkles){sp.tw+=.035*s;sp.y+=.03*s;if(sp.y>H+5)sp.y=-5;}
 const target=(pointerX-player.x)*.035;player.vx+=target*s;player.vx*=Math.pow(.86,s);player.vx=Math.max(-7.5,Math.min(7.5,player.vx));player.x+=player.vx*s;
 if(bossArena&&boss){player.y=bossArenaY;player.vy=0;}
 player.vy+=.42*s;if(!bossArena)player.y+=player.vy*s; else player.y=bossArenaY;player.rot=player.vx*.035;
 if(player.x<-player.r)player.x=W+player.r;if(player.x>W+player.r)player.x=-player.r;
 if(invuln>0)invuln-=s;if(shield>0)shield-=s;if(magnet>0)magnet-=s;if(mega>0)mega-=s;player.r=mega>0?38:28;
 if(!bossArena&&player.vy>0){for(const p of platforms){const py=p.y-cameraY,prev=(player.y-player.vy*s)+player.r,curr=player.y+player.r;if(!p.used&&prev<=py+4&&curr>=py&&player.x+player.r*.72>p.x&&player.x-player.r*.72<p.x+p.w){player.y=py-player.r;player.vy=-10.6;puffAnim=-1;boost=Math.min(100,boost+7);combo=Math.min(9,combo+1);bestCombo=Math.max(bestCombo,combo);comboTimer=80;if(p.breakable)p.used=true}}}
 const ceiling=H*.40;if(player.y<ceiling){const sh=ceiling-player.y;cameraY-=sh;player.y=ceiling;score=Math.max(score,Math.floor((-cameraY)/10));scoreEl.textContent=score}
 if(!bossArena&&score>=nextLifePickupAt){
   const targetPlatform=platforms.filter(p=>{const sy=p.y-cameraY;return !p.used&&sy>-120&&sy<160;}).sort((a,b)=>a.y-b.y)[0];
   const px=targetPlatform?targetPlatform.x+targetPlatform.w/2:40+Math.random()*(W-80);
   const py=targetPlatform?targetPlatform.y-48:cameraY-120;
   powerups.push({x:px,y:py,type:'life',taken:false,milestone:nextLifePickupAt});
   showToast(`Ekstra liv ved ${nextLifePickupAt} m! ❤️`);
   nextLifePickupAt+=500;
 }
 let minY=Infinity;for(const p of platforms){if(p.move)p.x+=Math.sin(performance.now()/650+p.phase)*.4*s;minY=Math.min(minY,p.y)}while(minY-cameraY>-140){minY-=70+Math.random()*38;addPlatform(minY)}
 for(const e of enemies){e.x+=e.vx*s;e.y+=Math.sin(performance.now()/300+e.phase)*.15*s;if(e.x<20||e.x>W-20)e.vx*=-1;const sy=e.y-cameraY;if(hitPlayer(e.x,sy,e.r)&&invuln<=0){if(shield>0){shield=0;invuln=55;showToast(tr('shieldSaved'))}else if(mega>0){invuln=35;showToast(tr('megaSmash'))}else{player.hp--;hpEl.textContent=player.hp;invuln=75;player.vy=-7;combo=1;if(player.hp<=0)return endGame()}}}
 for(const c of coinItems){const sy=c.y-cameraY;c.spin+=.08*s;const range=150+save.upMagnet*25;if(magnet>0&&!c.taken){const dx=player.x-c.x,dy=player.y-sy,d=Math.hypot(dx,dy);if(d<range){c.x+=dx*.08*s;c.y+=(dy*.08*s)}}if(!c.taken&&hitPlayer(c.x,sy,c.r)){c.taken=true;coins+=combo;coinsEl.textContent=coins;boost=Math.min(100,boost+10);combo=Math.min(9,combo+1);bestCombo=Math.max(bestCombo,combo);comboTimer=90}}
 for(const p of powerups){const sy=p.y-cameraY;if(!p.taken&&hitPlayer(p.x,sy,14)){p.taken=true;if(p.type==='shield'){shield=480;showToast(tr('shield'))}if(p.type==='magnet'){magnet=520+save.upMagnet*100;showToast(tr('magnet'))}if(p.type==='mega'){mega=420;showToast(tr('mega'))}if(p.type==='life'){const maxHp=6+save.upHealth;const before=player.hp;player.hp=Math.min(maxHp,player.hp+1);hpEl.textContent=player.hp;showToast(player.hp>before?'Ekstra liv! +1 ❤️':'Maks liv ❤️');}}}
 if(!boss&&!bossWarningActive){const stage=nextBossStage();if(stage)triggerBossWarning(stage);}
 if(boss){
  let bossSpeed=1.4;if(boss.id==='candy')bossSpeed=1.7;if(boss.id==='ice')bossSpeed=1.15;if(boss.id==='galaxy')bossSpeed=2.0;bossSpeed*=1+Math.min(.28,Math.max(0,(boss.tier||1)-1)*.035);
  boss.x+=boss.dir*bossSpeed*s;if(boss.x<55||boss.x>W-55)boss.dir*=-1;
  boss.shot+=s;const tier=Math.max(1,boss.tier||1);let cadence=92;if(boss.id==='storm')cadence=84;if(boss.id==='candy')cadence=98;if(boss.id==='ice')cadence=116;if(boss.id==='galaxy')cadence=78;cadence=Math.max(48,cadence-(tier-1)*5);
  if(boss.shot>cadence){boss.shot=0;bossAttackPattern();}
  if(hitPlayer(boss.x,boss.y,boss.r)&&invuln<=0){player.hp--;hpEl.textContent=player.hp;invuln=90;screenShake=10;if(player.hp<=0)return endGame();}
 }
 for(const shot of playerShots){shot.x+=shot.vx*s;shot.y+=shot.vy*s;shot.life-=s;if(boss&&Math.hypot(shot.x-boss.x,shot.y-boss.y)<shot.r+boss.r){shot.life=0;boss.hp-=shot.damage;bossFlash=7;screenShake=Math.max(screenShake,5);bossBar.style.width=Math.max(0,boss.hp/boss.maxHp*100)+'%';showToast(tr('bossHit'));for(let i=0;i<14;i++){particles.push({x:shot.x,y:shot.y,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,life:24,hue:(i*25)%360,size:3+Math.random()*4});}if(boss.hp<=0){if(bossRushMode){finishBossRushWin();return;}const defeatedId=boss.id,reward=boss.reward,bossName=boss.name,bossAt=boss.at||0,bossTier=boss.tier||1;lastBossTriggerAt=Math.max(lastBossTriggerAt,bossAt);if(bossTier===1)defeatedBosses[defeatedId]=true;bossDefeated=true;boss=null;bossSpawned=false;bossArena=false;player.vy=-10.8;puffAnim=1;bossWrap.style.display='none';stopBossMusic(true);running=true;save.bank+=reward;persist();if(bossTier===1)unlockBossCosmetic(defeatedId);showToast(tr('bossDefeated',{name:bossName,reward}));}}}
 playerShots=playerShots.filter(q=>q.life>0&&q.x>-30&&q.x<W+30&&q.y>-60&&q.y<H+60);
 for(const shot of bossShots){shot.x+=shot.vx*s;shot.y+=shot.vy*s;shot.life-=s;if(hitPlayer(shot.x,shot.y,shot.r)&&invuln<=0){shot.life=0;if(shield>0){shield=0;invuln=55;showToast(tr('shieldSaved'));}else if(mega>0){invuln=35;showToast(tr('megaSmash'));}else{player.hp--;hpEl.textContent=player.hp;invuln=75;player.vy=-6;combo=1;screenShake=8;if(player.hp<=0)return endGame();}}}
 bossShots=bossShots.filter(q=>q.life>0&&q.x>-40&&q.x<W+40&&q.y>-80&&q.y<H+80);
 if(comboTimer>0){comboTimer-=s;comboEl.textContent='COMBO x'+combo;comboEl.style.opacity=1;comboEl.style.transform='translateX(-50%) scale(1)'}else{combo=1;comboEl.style.opacity=0;comboEl.style.transform='translateX(-50%) scale(.8)'}
 boost=Math.min(100,boost+.035*s);boostEl.style.width=boost+'%';
 for(const q of particles){q.x+=q.vx*s;q.y+=q.vy*s;q.life-=s}particles=particles.filter(q=>q.life>0);
 platforms=platforms.filter(p=>p.y-cameraY<H+120&&!p.used);coinItems=coinItems.filter(c=>c.y-cameraY<H+100&&!c.taken);powerups=powerups.filter(p=>p.y-cameraY<H+100&&!p.taken);enemies=enemies.filter(e=>e.y-cameraY<H+130);
 checkMission();if(player.y-player.r>H+90)endGame();
}
function endGame(){
 if(!running)return;
 running=false;paused=false;
 if(typeof cancelBossWarning==='function')cancelBossWarning();else{bossWarningActive=false;bossPendingStage=null;if(bossWarningEl)bossWarningEl.style.display='none';}
 stopBossMusic(false);bossArena=false;bossArenaY=0;boss=null;bossSpawned=false;playerShots=[];bossShots=[];
 if(bossWrap)bossWrap.style.display='none';if(pauseMenuEl)pauseMenuEl.style.display='none';if(resumeCountdownEl)resumeCountdownEl.style.display='none';
 if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}if(multiplayerHudEl)multiplayerHudEl.style.display='none';multiplayerMode=false;multiplayerState='idle';
 const gain=Math.floor(coins*(1+save.upCoin*.15));save.bank+=gain;save.total+=score;save.best=Math.max(save.best,score);if(score<300)save.streak=0;persist();submitOnlineScore(score);finalScoreEl.textContent=score;finalCoinsEl.textContent=coins;finalComboEl.textContent=bestCombo;bankGainEl.textContent=gain;gameOverEl.style.display='flex';
}