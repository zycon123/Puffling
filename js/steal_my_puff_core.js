/* Sky Puff — Race My Puffling foundation v1.1
 * Compatibility note: filename is retained so older beta loaders keep working.
 * The API is exposed as window.SkyPuffRace; SkyPuffSteal is intentionally retired.
 */
(function(){
  const GOAL_METERS=1500;
  const MAX_ATTACKS=3;
  const ATTACK_COOLDOWN_MS=4000;
  const STATUS_IMMUNITY_MS=1200;
  const CHECKPOINTS=[0,300,600,900,1200];
  const TYPES=['wind','ice','gravity','vision','control','bounce','platform','shock','boostSteal'];

  const ABILITIES={
    wind:{id:'gustBlast',name:'Gust Blast',description:'Skyver rivalen sidelengs med et kort vindkast.',duration:900,strength:.55,icon:'💨',visualEffect:'wind'},
    ice:{id:'frozenFeet',name:'Frozen Feet',description:'Senker rivalens bevegelse en kort stund.',duration:2000,strength:.35,icon:'❄️',visualEffect:'ice'},
    gravity:{id:'heavyCloud',name:'Heavy Cloud',description:'Gjør rivalens neste hopp tyngre.',duration:2400,strength:.28,icon:'🌑',visualEffect:'gravity'},
    vision:{id:'darkMist',name:'Dark Mist',description:'Dekker deler av rivalens sikt med mørke skyer.',duration:1800,strength:.45,icon:'🌫️',visualEffect:'mist'},
    control:{id:'confusion',name:'Confusion',description:'Gjør sidebevegelsen mindre presis.',duration:1400,strength:.25,icon:'🌀',visualEffect:'confusion'},
    bounce:{id:'bounceCurse',name:'Bounce Curse',description:'Gjør rivalens neste landing ekstra sprettende.',duration:2200,strength:.35,icon:'🟣',visualEffect:'bounce'},
    platform:{id:'cloudBreak',name:'Cloud Break',description:'Gjør en kommende plattform ustabil uten å blokkere løpet.',duration:1800,strength:.3,icon:'☁️',visualEffect:'platform'},
    shock:{id:'thunderPop',name:'Thunder Pop',description:'Avbryter rivalens bevegelse svært kort.',duration:500,strength:1,icon:'⚡',visualEffect:'shock'},
    boostSteal:{id:'puffDrain',name:'Puff Drain',description:'Bremser rivalens momentum og gir deg et lite boost.',duration:1000,strength:.22,icon:'✨',visualEffect:'drain'}
  };

  function hash(text){let h=2166136261;for(const ch of String(text||'puffling')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function allPufflings(){const F=window.SkyPuffFusion;if(!F)return [];return [...Object.values(F.BASE||{}),...Object.values(F.FUSIONS||{})];}
  function abilityFor(puffling){const p=typeof puffling==='string'?allPufflings().find(x=>x.id===puffling):puffling;const idx=hash(p?.id||p?.name||'puffling')%TYPES.length;const type=TYPES[idx],base=ABILITIES[type];return {...base,type,cooldown:ATTACK_COOLDOWN_MS,rarityModifier:1,pufflingId:p?.id||null};}
  function abilityMap(){const out={};allPufflings().forEach(p=>{out[p.id]=abilityFor(p)});return out;}
  function createState(opts={}){return {
    active:true,startedAt:opts.startedAt||Date.now(),finishedAt:0,winner:null,
    goal:GOAL_METERS,youHeight:0,rivalHeight:0,youCheckpoint:0,rivalCheckpoint:0,
    attacksRemaining:MAX_ATTACKS,lastAttackAt:0,attacksUsed:0,attacksHit:0,
    selectedPufflingId:opts.selectedPufflingId||null,ability:abilityFor(opts.selectedPufflingId),
    activeEffects:[],immuneUntil:0,falls:0,rivalFalls:0
  };}
  let state=null;
  function start(opts={}){state=createState(opts);emit('race:start',snapshot());return snapshot();}
  function snapshot(){return state?JSON.parse(JSON.stringify(state)):null;}
  function checkpointFor(height){let cp=0;for(const x of CHECKPOINTS)if(height>=x)cp=x;return cp;}
  function updateHeights(you,rival){if(!state||!state.active)return snapshot();state.youHeight=Math.max(0,+you||0);state.rivalHeight=Math.max(0,+rival||0);state.youCheckpoint=checkpointFor(state.youHeight);state.rivalCheckpoint=checkpointFor(state.rivalHeight);if(state.youHeight>=GOAL_METERS)finish('you');else if(state.rivalHeight>=GOAL_METERS)finish('rival');return snapshot();}
  function canAttack(now=Date.now()){return !!(state&&state.active&&state.attacksRemaining>0&&now-state.lastAttackAt>=ATTACK_COOLDOWN_MS);}
  function attack(now=Date.now()){
    if(!canAttack(now))return {ok:false,reason:state?.attacksRemaining<=0?'empty':'cooldown',remaining:state?.attacksRemaining||0,cooldownLeft:Math.max(0,ATTACK_COOLDOWN_MS-(now-(state?.lastAttackAt||0)))};
    state.lastAttackAt=now;state.attacksRemaining--;state.attacksUsed++;
    const ability=state.ability||abilityFor(state.selectedPufflingId);
    emit('race:attack',{ability,remaining:state.attacksRemaining,at:now});
    return {ok:true,ability,remaining:state.attacksRemaining,cooldownLeft:ATTACK_COOLDOWN_MS};
  }
  function receiveEffect(effect,now=Date.now()){
    if(!state||!state.active)return {ok:false,reason:'inactive'};
    if(now<state.immuneUntil)return {ok:false,reason:'immune'};
    const e={...effect,startTime:now,duration:Math.max(200,Math.min(4000,+effect.duration||1000)),sourcePlayer:effect.sourcePlayer||'rival'};
    const strong=['shock','gravity','control'].includes(e.type);
    if(strong&&state.activeEffects.some(x=>['shock','gravity','control'].includes(x.type)))return {ok:false,reason:'strong_effect_active'};
    state.activeEffects.push(e);emit('race:effectStart',e);return {ok:true,effect:e};
  }
  function receiveAttack(abilityOrId,meta={},now=Date.now()){
    let ability=null;
    if(abilityOrId&&typeof abilityOrId==='object')ability=abilityOrId;
    else ability=Object.values(ABILITIES).find(a=>a.id===abilityOrId)||ABILITIES[meta?.abilityType]||null;
    if(!ability)return {ok:false,reason:'unknown_ability'};
    const effect={...ability,type:ability.type||meta?.abilityType||Object.keys(ABILITIES).find(k=>ABILITIES[k].id===ability.id)||'control',sourcePlayer:meta?.playerId||'rival'};
    const res=receiveEffect(effect,now);
    if(res.ok&&state)state.attacksHit++;
    emit('race:attackReceived',{ability:effect,result:res});
    return res;
  }
  function tickEffects(now=Date.now()){
    if(!state)return [];
    const ended=[];state.activeEffects=state.activeEffects.filter(e=>{if(now-e.startTime>=e.duration){ended.push(e);return false;}return true;});
    if(ended.length){state.immuneUntil=Math.max(state.immuneUntil,now+STATUS_IMMUNITY_MS);ended.forEach(e=>emit('race:effectEnd',e));}
    return state.activeEffects.slice();
  }
  function recordFall(side='you'){if(!state)return 0;if(side==='you')state.falls++;else state.rivalFalls++;return side==='you'?state.youCheckpoint:state.rivalCheckpoint;}
  function finish(winner){if(!state||!state.active)return snapshot();state.active=false;state.finishedAt=Date.now();state.winner=winner;emit('race:finish',snapshot());return snapshot();}
  function reset(){state=null;emit('race:reset',null);}
  function emit(name,detail){try{window.dispatchEvent(new CustomEvent(name,{detail}));}catch(e){}}

  window.SkyPuffRace={GOAL_METERS,MAX_ATTACKS,ATTACK_COOLDOWN_MS,STATUS_IMMUNITY_MS,CHECKPOINTS,TYPES,ABILITIES,allPufflings,abilityFor,abilityMap,start,snapshot,updateHeights,canAttack,attack,receiveEffect,receiveAttack,tickEffects,recordFall,finish,reset,requiresServerAuthority:true};
  try{delete window.SkyPuffSteal;}catch(e){window.SkyPuffSteal=undefined;}
})();