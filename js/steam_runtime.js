/* Orbuff — Steam bridge renderer adapter v1.0 */
(function(){
  const bridge=window.OrbuffSteam;
  const STORAGE_PREFIXES=['skyPuff','orbuff','puffling'];
  const ACHIEVEMENT_KEYS=['achSkyLegend','achCloudBreaker','achSkyImmortal','achEventMaster','achBossHunter','achBossVeteran','achTreasureHunter'];
  let steamStatus={active:false,configured:false,error:'bridge_unavailable'};
  let saveTimer=null;
  let restoring=false;

  function isPackagedPc(){
    try{return location.protocol==='file:'&&/Electron/i.test(navigator.userAgent||'')}catch(e){return false}
  }
  function allowedKey(key){
    const k=String(key||'');
    return STORAGE_PREFIXES.some(prefix=>k.startsWith(prefix));
  }
  function snapshot(){
    const out={};
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(key&&allowedKey(key))out[key]=localStorage.getItem(key);
    }
    return out;
  }
  function restore(data){
    if(!data||typeof data!=='object')return false;
    restoring=true;
    try{
      for(const [key,value] of Object.entries(data)){
        if(!allowedKey(key)||typeof value!=='string')continue;
        localStorage.setItem(key,value);
      }
      return true;
    }finally{restoring=false;}
  }
  async function refreshStatus(){
    if(!bridge||!isPackagedPc())return steamStatus;
    try{steamStatus=await bridge.status();}catch(e){steamStatus={active:false,configured:false,error:String(e?.message||e)};}
    window.dispatchEvent(new CustomEvent('orbuff:steam-status',{detail:steamStatus}));
    return steamStatus;
  }
  async function saveCloudNow(){
    if(!bridge||!isPackagedPc()||restoring)return {ok:false,reason:'inactive'};
    try{
      const result=await bridge.saveCloudSnapshot(snapshot());
      if(result?.ok&&result.savedAt)originalSetItem.call(localStorage,'__orbuffSteamCloudAppliedAt',String(result.savedAt));
      return result;
    }catch(e){return {ok:false,reason:String(e?.message||e)};}
  }
  function scheduleCloudSave(){
    if(!bridge||!isPackagedPc()||restoring)return;
    clearTimeout(saveTimer);
    saveTimer=setTimeout(()=>saveCloudNow(),350);
  }
  async function restoreCloudOnce(){
    if(!bridge||!isPackagedPc())return {ok:false,reason:'inactive'};
    try{
      const result=await bridge.loadCloudSnapshot();
      if(result?.ok&&result.exists&&result.data){
        const appliedAt=String(localStorage.getItem('__orbuffSteamCloudAppliedAt')||'');
        const remoteAt=String(result.savedAt||'');
        const shouldRestore=!appliedAt||(remoteAt&&remoteAt>appliedAt);
        if(shouldRestore){
          const changed=restore(result.data);
          if(changed){
            originalSetItem.call(localStorage,'__orbuffSteamCloudAppliedAt',remoteAt||new Date().toISOString());
            sessionStorage.setItem('orbuffSteamCloudRestored','1');
          }
        }
      }
      return result;
    }catch(e){return {ok:false,reason:String(e?.message||e)};}
  }
  async function syncAchievements(){
    if(!bridge||!steamStatus.active)return;
    try{
      for(const key of ACHIEVEMENT_KEYS){
        if(save?.[key])await bridge.unlockAchievement(key);
      }
      await bridge.setStat('BEST_HEIGHT',Number(save?.best||0));
      await bridge.setStat('TOTAL_HEIGHT',Number(save?.total||0));
      await bridge.setStat('BOSS_WINS',Number(save?.bossWins||0));
      await bridge.setStat('TREASURES',Number(save?.treasuresCollected||0));
    }catch(e){}
  }
  async function unlockAchievement(key){
    if(!bridge||!steamStatus.active)return {ok:false,reason:'steam_inactive'};
    try{return await bridge.unlockAchievement(key);}catch(e){return {ok:false,reason:String(e?.message||e)};}
  }

  const originalSetItem=Storage.prototype.setItem;
  if(isPackagedPc()){
    Storage.prototype.setItem=function(key,value){
      originalSetItem.call(this,key,value);
      if(this===localStorage&&allowedKey(key)&&key!=='__orbuffSteamCloudAppliedAt')scheduleCloudSave();
    };
    addEventListener('beforeunload',()=>{try{saveCloudNow()}catch(e){}});
    addEventListener('orbuff:achievement-unlocked',event=>unlockAchievement(event?.detail?.key));
    addEventListener('sky-puff-ready',()=>{refreshStatus().then(syncAchievements);scheduleCloudSave();});
  }

  async function init(){
    if(!bridge||!isPackagedPc())return;
    if(sessionStorage.getItem('orbuffSteamCloudRestored')!=='1'){
      const restored=await restoreCloudOnce();
      if(restored?.exists)location.reload();
    }
    await refreshStatus();
    await syncAchievements();
    scheduleCloudSave();
  }

  window.OrbuffSteamRuntime={
    status:()=>({...steamStatus}),
    refreshStatus,
    saveCloudNow,
    syncAchievements,
    unlockAchievement,
    openOverlay:(section='achievements')=>bridge?.openOverlay?.(section),
    configured:()=>!!steamStatus.configured,
    active:()=>!!steamStatus.active
  };

  init();
})();
