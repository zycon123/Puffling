(function(){
 let repairs=0,lastRepair=null,lastIssue=null,lastLoopPulse=performance.now(),watchdog=null;
 function log(issue,repair){lastIssue={issue,at:new Date().toISOString()};if(repair){repairs++;lastRepair={repair,at:new Date().toISOString()};try{localStorage.skyPuffAutoRepairLog=JSON.stringify({repairs,lastRepair,lastIssue});}catch(e){}console.warn('Sky Puff AI Diagnostics:',issue,'→',repair);}}
 function finite(n){return Number.isFinite(n)}
 function repairPlayer(){if(!player)return false;let fixed=false;if(!finite(player.x)){player.x=W/2;fixed=true;}if(!finite(player.y)){player.y=H*.68;fixed=true;}if(!finite(player.vx)){player.vx=0;fixed=true;}if(!finite(player.vy)){player.vy=-8;fixed=true;}if(!finite(player.hp)||player.hp<0){player.hp=Math.max(1,3+(save&&save.upHealth||0));if(hpEl)hpEl.textContent=player.hp;fixed=true;}if(fixed)log('Invalid player state','Player values restored');return fixed;}
 function repairBoss(){if(!boss)return false;let fixed=false;if(!finite(boss.x)){boss.x=W/2;fixed=true;}if(!finite(boss.y)){boss.y=Math.max(120,H*.2);fixed=true;}if(!finite(boss.hp)||boss.hp<=0){boss.hp=Math.max(1,boss.maxHp||100);fixed=true;}if(!finite(boss.maxHp)||boss.maxHp<=0){boss.maxHp=Math.max(1,boss.hp||100);fixed=true;}if(fixed)log('Invalid boss state','Boss values restored');return fixed;}
 function repairWorld(){if(running&&!bossArena&&Array.isArray(platforms)&&platforms.length===0){try{let y=(player&&finite(player.y)?player.y:H*.7)+80;for(let i=0;i<18;i++){y-=75+Math.random()*30;addPlatform(y);}log('World had no platforms','Platform field regenerated');return true;}catch(e){}}return false;}
 function repairOverlays(){if(!running&&startEl&&gameOverEl&&startEl.style.display==='none'&&gameOverEl.style.display==='none'&&(!pauseMenuEl||pauseMenuEl.style.display==='none')&&(!shopEl||shopEl.style.display==='none')&&(!upgradesEl||upgradesEl.style.display==='none')&&(!leaderboardMenuEl||leaderboardMenuEl.style.display==='none')&&(!bossRushMenuEl||bossRushMenuEl.style.display==='none')&&(!multiplayerMenuEl||multiplayerMenuEl.style.display==='none')&&(!diagnosticsMenuEl||diagnosticsMenuEl.style.display==='none')){try{showMainMenu();log('No visible menu while game stopped','Main menu restored');return true;}catch(e){}}return false;}
 function check(){try{repairPlayer();repairBoss();repairWorld();repairOverlays();}catch(e){lastIssue={issue:String(e.message||e),at:new Date().toISOString()};}}
 const originalLoop=typeof loop==='function'?loop:null;
 if(originalLoop){loop=function(t){lastLoopPulse=performance.now();return originalLoop(t);};}
 watchdog=setInterval(()=>{
   check();
   if(running&&!paused&&!document.hidden&&performance.now()-lastLoopPulse>2500){
     lastIssue={issue:'Main animation loop appears stalled; waiting for browser RAF recovery to avoid duplicate loops',at:new Date().toISOString()};
     console.warn('Sky Puff AI Diagnostics: main loop heartbeat delayed; no forced RAF restart');
   }
 },1500);
 try{const old=JSON.parse(localStorage.skyPuffAutoRepairLog||'null');if(old){repairs=old.repairs||0;lastRepair=old.lastRepair||null;lastIssue=old.lastIssue||null;}}catch(e){}
 window.skyPuffAIDiagnostics={get repairs(){return repairs},get lastRepair(){return lastRepair},get lastIssue(){return lastIssue},runCheck:check,clearLog(){repairs=0;lastRepair=null;lastIssue=null;localStorage.removeItem('skyPuffAutoRepairLog');},stop(){if(watchdog){clearInterval(watchdog);watchdog=null;}}};
})();