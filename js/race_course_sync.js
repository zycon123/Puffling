/* Puffling — server-seeded Race course sync v1.0 */
(function(){
  const C=window.SkyPuffRaceCourse,T=window.SkyPuffRaceTransport;
  if(!C||!T)return;
  let roomSeed='';
  function remember(m){if(m?.courseSeed)roomSeed=String(m.courseSeed);return roomSeed;}
  function rebuild(seed){
    seed=String(seed||roomSeed||'');if(!seed)return false;
    roomSeed=seed;C.activate(seed);C.begin(typeof H==='number'?H*.82:692);
    if(typeof reset==='function')reset();
    try{multiplayerOpponentScore=0;}catch(e){}
    window.dispatchEvent(new CustomEvent('race:courseReady',{detail:{courseSeed:seed,courseVersion:C.version}}));
    return true;
  }
  T.on('race:matched',remember);
  T.on('race:notStarted',remember);
  T.on('race:resumed',remember);
  T.on('race:resume',remember);
  T.on('race:start',m=>rebuild(remember(m)));
  T.on('race:result',()=>setTimeout(()=>C.deactivate(),0));
  T.on('reconnect_failed',()=>C.deactivate());

  if(typeof window.startMultiplayerRace==='function'&&!window.startMultiplayerRace.__courseWrapped){
    const base=window.startMultiplayerRace;
    const wrapped=function(){C.deactivate();roomSeed='';return base.apply(this,arguments);};
    wrapped.__courseWrapped=true;window.startMultiplayerRace=wrapped;
  }
  if(typeof window.finishMultiplayerRace==='function'&&!window.finishMultiplayerRace.__courseWrapped){
    const base=window.finishMultiplayerRace;
    const wrapped=function(){const out=base.apply(this,arguments);setTimeout(()=>C.deactivate(),0);return out;};
    wrapped.__courseWrapped=true;window.finishMultiplayerRace=wrapped;
  }
  window.SkyPuffRaceCourseSync={rebuild,remember,get seed(){return roomSeed;}};
})();
