/* Orbuff — Steam bridge renderer adapter v1.1 */
(function(){
  const bridge=window.OrbuffSteam;
  const STORAGE_PREFIXES=['skyPuff','orbuff','puffling'];
  const ACHIEVEMENT_KEYS=['achSkyLegend','achCloudBreaker','achSkyImmortal','achEventMaster','achBossHunter','achBossVeteran','achTreasureHunter'];
  const META={
    localPersistAt:'__orbuffSteamLocalPersistAt',
    cloudAppliedAt:'__orbuffSteamCloudAppliedAt',
    cloudSavedAt:'__orbuffSteamCloudSavedAt',
    conflictDecision:'__orbuffSteamConflictDecision'
  };
  let steamStatus={active:false,configured:false,error:'bridge_unavailable'};
  let saveTimer=null;
  let statTimer=null;
  let restoring=false;

  function isPackagedPc(){
    try{return location.protocol==='file:'&&/Electron/i.test(navigator.userAgent||'')}catch(e){return false}
  }
  function allowedKey(key){
    const k=String(key||'');
    return STORAGE_PREFIXES.some(prefix=>k.startsWith(prefix));
  }
  function isoNow(){return new Date().toISOString()}
  function validIso(value){
    const s=String(value||'');
    return s&&Number.isFinite(Date.parse(s))?s:'';
  }
  function hasMaterialLocalProgress(){
    const keys=['skyPuffBest','skyPuffTotal','skyPuffBank','skyPuffBossWins','skyPuffTreasuresCollected'];
    return keys.some(key=>Number(localStorage.getItem(key)||0)>0);
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
        originalSetItem.call(localStorage,key,value);
      }
      return true;
    }finally{restoring=false;}
  }
  function markLocalProgress(at=isoNow()){
    const value=validIso(at)||isoNow();
    originalSetItem.call(localStorage,META.localPersistAt,value);
    return value;
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
      if(result?.ok&&result.savedAt){
        originalSetItem.call(localStorage,META.cloudSavedAt,String(result.savedAt));
        originalSetItem.call(localStorage,META.cloudAppliedAt,String(result.savedAt));
      }
      return result;
    }catch(e){return {ok:false,reason:String(e?.message||e)};}
  }
  function scheduleCloudSave(){
    if(!bridge||!isPackagedPc()||restoring)return;
    clearTimeout(saveTimer);
    saveTimer=setTimeout(()=>saveCloudNow(),350);
  }
  function resolveCloudDecision(result){
    const remoteAt=validIso(result?.savedAt);
    const localAt=validIso(localStorage.getItem(META.localPersistAt));
    const appliedAt=validIso(localStorage.getItem(META.cloudAppliedAt));
    const localHasProgress=hasMaterialLocalProgress();

    if(!result?.exists||!result?.data)return {action:'none',reason:'no_remote_snapshot',remoteAt,localAt,appliedAt};
    if(!remoteAt)return {action:'keep-local',reason:'remote_timestamp_missing',remoteAt,localAt,appliedAt};
    if(localAt){
      if(Date.parse(remoteAt)>Date.parse(localAt))return {action:'restore-cloud',reason:'remote_newer_than_local',remoteAt,localAt,appliedAt};
      return {action:'keep-local',reason:'local_same_or_newer',remoteAt,localAt,appliedAt};
    }
    if(localHasProgress)return {action:'keep-local',reason:'unversioned_local_progress_present',remoteAt,localAt,appliedAt};
    if(appliedAt&&Date.parse(remoteAt)<=Date.parse(appliedAt))return {action:'keep-local',reason:'remote_already_applied',remoteAt,localAt,appliedAt};
    return {action:'restore-cloud',reason:'clean_local_profile',remoteAt,localAt,appliedAt};
  }
  async function restoreCloudOnce(){
    if(!bridge||!isPackagedPc())return {ok:false,reason:'inactive'};
    try{
      const result=await bridge.loadCloudSnapshot();
      const decision=resolveCloudDecision(result);
      originalSetItem.call(localStorage,META.conflictDecision,JSON.stringify({...decision,at:isoNow()}));
      if(decision.action==='restore-cloud'){
        const changed=restore(result.data);
        if(changed){
          const applied=decision.remoteAt||isoNow();
          originalSetItem.call(localStorage,META.cloudAppliedAt,applied);
          originalSetItem.call(localStorage,META.localPersistAt,applied);
          sessionStorage.setItem('orbuffSteamCloudRestored','1');
          window.dispatchEvent(new CustomEvent('orbuff:steam-cloud-decision',{detail:{...decision,restored:true}}));
          return {...result,decision,restored:true};
        }
      }
      if(decision.action==='keep-local'&&result?.exists){
        scheduleCloudSave();
      }
      window.dispatchEvent(new CustomEvent('orbuff:steam-cloud-decision',{detail:{...decision,restored:false}}));
      return {...result,decision,restored:false};
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
      window.dispatchEvent(new CustomEvent('orbuff:steam-progress-synced',{detail:{at:Date.now()}}));
    }catch(e){}
  }
  function scheduleSteamProgressSync(){
    if(!bridge||!isPackagedPc()||!steamStatus.active)return;
    clearTimeout(statTimer);
    statTimer=setTimeout(()=>syncAchievements(),900);
  }
  async function unlockAchievement(key){
    if(!bridge||!steamStatus.active)return {ok:false,reason:'steam_inactive'};
    try{return await bridge.unlockAchievement(key);}catch(e){return {ok:false,reason:String(e?.message||e)};}
  }

  const originalSetItem=Storage.prototype.setItem;
  if(isPackagedPc()){
    Storage.prototype.setItem=function(key,value){
      originalSetItem.call(this,key,value);
      if(this===localStorage&&allowedKey(key))scheduleCloudSave();
    };
    addEventListener('beforeunload',()=>{try{saveCloudNow()}catch(e){}});
    addEventListener('orbuff:achievement-unlocked',event=>{unlockAchievement(event?.detail?.key);scheduleSteamProgressSync();});
    addEventListener('orbuff:persist',()=>{
      if(!restoring)markLocalProgress();
      scheduleCloudSave();
      scheduleSteamProgressSync();
    });
    addEventListener('sky-puff-ready',()=>{refreshStatus().then(syncAchievements);scheduleCloudSave();});
  }

  async function init(){
    if(!bridge||!isPackagedPc())return;
    if(sessionStorage.getItem('orbuffSteamCloudRestored')!=='1'){
      const restored=await restoreCloudOnce();
      if(restored?.restored===true){location.reload();return;}
    }
    await refreshStatus();
    await syncAchievements();
    scheduleCloudSave();
  }

  window.OrbuffSteamRuntime={
    status:()=>({...steamStatus}),
    refreshStatus,
    saveCloudNow,
    restoreCloudOnce,
    resolveCloudDecision,
    syncAchievements,
    scheduleSteamProgressSync,
    unlockAchievement,
    openOverlay:(section='achievements')=>bridge?.openOverlay?.(section),
    configured:()=>!!steamStatus.configured,
    active:()=>!!steamStatus.active,
    cloudMeta:()=>({
      localPersistAt:validIso(localStorage.getItem(META.localPersistAt)),
      cloudAppliedAt:validIso(localStorage.getItem(META.cloudAppliedAt)),
      cloudSavedAt:validIso(localStorage.getItem(META.cloudSavedAt)),
      lastDecision:localStorage.getItem(META.conflictDecision)||''
    })
  };

  init();
})();
