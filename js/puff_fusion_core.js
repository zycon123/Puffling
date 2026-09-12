/* Orbuff — Fusion Core v0.7
 * Legacy storage keys and Puffling response fields are retained for beta save/API compatibility.
 */
(function(){
  const BASE = {
    starterpuff:{id:'starterpuff',name:'Starter Orbuff',icon:'☁️',rarity:'common',ability:'starter',value:.35,palette:['#eef8ff','#8fc7e8'],mark:'○',starterOnly:true},
    starterspark:{id:'starterspark',name:'Spark Orbuff',icon:'✨',rarity:'common',ability:'starter',value:.35,palette:['#fff6bc','#e7bd54'],mark:'✦',starterOnly:true},
    starterdrop:{id:'starterdrop',name:'Drop Orbuff',icon:'💧',rarity:'common',ability:'starter',value:.35,palette:['#dff7ff','#67b8de'],mark:'◇',starterOnly:true},
    ember:{id:'ember',name:'Ember Orbuff',icon:'🔥',rarity:'common',ability:'blastDamage',value:1.10},
    volt:{id:'volt',name:'Volt Orbuff',icon:'⚡',rarity:'common',ability:'chainShot',value:1},
    frost:{id:'frost',name:'Frost Orbuff',icon:'❄️',rarity:'common',ability:'freeze',value:0.8},
    prism:{id:'prism',name:'Prism Orbuff',icon:'🌈',rarity:'rare',ability:'rainbowGain',value:1.15},
    shadow:{id:'shadow',name:'Shadow Orbuff',icon:'🌑',rarity:'rare',ability:'airDash',value:1},
    wind:{id:'wind',name:'Wind Orbuff',icon:'💨',rarity:'common',ability:'jumpControl',value:1.10}
  };
  const FUSIONS = {
    'ember+volt':{id:'thunderflame',name:'Thunderflame Orbuff',icon:'🔥⚡',rarity:'epic',ability:'chainBlast'},
    'frost+prism':{id:'aurora',name:'Aurora Orbuff',icon:'❄️🌈',rarity:'epic',ability:'rescuePlatform'},
    'ember+shadow':{id:'eclipse',name:'Eclipse Orbuff',icon:'🌑🔥',rarity:'legendary',ability:'phaseDash'},
    'volt+wind':{id:'tempest',name:'Tempest Orbuff',icon:'💨⚡',rarity:'epic',ability:'stormJump'},
    'prism+volt':{id:'neonstorm',name:'Neon Storm Orbuff',icon:'🌈⚡',rarity:'legendary',ability:'rainbowChain'}
  };
  const STARTER_IDS=['starterpuff','starterspark','starterdrop'];
  const key=(a,b)=>[a,b].sort().join('+');
  function normalize(raw){
    const s=raw&&typeof raw==='object'?raw:{};
    const owned={};for(const [id,n] of Object.entries(s.owned&&typeof s.owned==='object'?s.owned:{})){const v=Math.max(0,Math.floor(+n||0));if(v>0)owned[id]=v;}
    const discovered=[...new Set((Array.isArray(s.discovered)?s.discovered:[]).filter(id=>typeof id==='string'))];
    for(const id of STARTER_IDS)if(!discovered.includes(id))discovered.push(id);
    for(const id of Object.keys(owned))if(!discovered.includes(id))discovered.push(id);
    const vault=[...new Set((Array.isArray(s.vault)?s.vault:[]).filter(id=>owned[id]>0))].slice(0,3);
    const tradeReceipts=[...new Set((Array.isArray(s.tradeReceipts)?s.tradeReceipts:[]).filter(id=>typeof id==='string'&&id.length<=80))].slice(-50);
    return {owned,vault,discovered,tradeReceipts};
  }
  function load(){try{return normalize(JSON.parse(localStorage.getItem('skyPuffPufflings')||'null'));}catch(e){return normalize(null);}}
  function save(s){const n=normalize(s);localStorage.setItem('skyPuffPufflings',JSON.stringify(n));try{const active=localStorage.getItem('skyPuffActivePuffling');if(active&&!(n.owned[active]>0))localStorage.removeItem('skyPuffActivePuffling');}catch(e){}return n;}
  function add(id,count=1){const s=load(),inc=Math.max(0,Math.floor(+count||0));if(!id||inc<=0)return s;s.owned[id]=(s.owned[id]||0)+inc;if(!s.discovered.includes(id))s.discovered.push(id);return save(s);}
  function availableCountFrom(s,id){return Math.max(0,(s.owned[id]||0)-(s.vault.includes(id)?1:0));}
  function availableCount(id){return availableCountFrom(load(),id);}
  function remove(id,count=1){const s=load(),dec=Math.max(0,Math.floor(+count||0));if(!id||dec<=0)return {ok:false,reason:'invalid'};if(availableCountFrom(s,id)<dec)return {ok:false,reason:'protected_or_missing',state:s};s.owned[id]=(s.owned[id]||0)-dec;if(s.owned[id]<=0)delete s.owned[id];const state=save(s);return {ok:true,state,remaining:state.owned[id]||0};}
  function canFuse(a,b,opts={}){const s=load(),recipe=FUSIONS[key(a,b)];if(!recipe)return false;if(opts.crystal){return a===b?availableCountFrom(s,a)>=1:availableCountFrom(s,a)>0&&availableCountFrom(s,b)>0;}return a===b?availableCountFrom(s,a)>=2:availableCountFrom(s,a)>0&&availableCountFrom(s,b)>0;}
  function fuse(a,b,opts={}){const recipe=FUSIONS[key(a,b)];if(!recipe)return {ok:false,reason:'unknown_recipe'};const s=load(),crystal=!!opts.crystal;if(!canFuse(a,b,{crystal}))return {ok:false,reason:'protected_or_missing'};if(crystal){s.owned[a]--;if(s.owned[a]<=0)delete s.owned[a];}else{s.owned[a]--;s.owned[b]--;if(s.owned[a]<=0)delete s.owned[a];if(s.owned[b]<=0)delete s.owned[b];}s.owned[recipe.id]=(s.owned[recipe.id]||0)+1;if(!s.discovered.includes(recipe.id))s.discovered.push(recipe.id);const state=save(s);return {ok:true,orbuff:recipe,puffling:recipe,state,crystalUsed:crystal,preservedParent:crystal?b:null};}
  function tradeTransfer(outgoing,incoming,txId){
    outgoing=String(outgoing||'');incoming=String(incoming||'');txId=String(txId||'').slice(0,80);
    const s=load();
    if(!outgoing||!incoming||!txId)return {ok:false,reason:'invalid_trade',state:s};
    if(STARTER_IDS.includes(outgoing)||STARTER_IDS.includes(incoming))return {ok:false,reason:'starter_locked',state:s};
    if(s.tradeReceipts.includes(txId))return {ok:true,duplicate:true,state:s,outgoingRemaining:s.owned[outgoing]||0,incomingWasNew:false};
    if(availableCountFrom(s,outgoing)<1)return {ok:false,reason:'protected_or_missing',state:s};
    const incomingWasNew=(s.owned[incoming]||0)===0;
    s.owned[outgoing]=(s.owned[outgoing]||0)-1;if(s.owned[outgoing]<=0)delete s.owned[outgoing];
    s.owned[incoming]=(s.owned[incoming]||0)+1;
    if(!s.discovered.includes(incoming))s.discovered.push(incoming);
    s.tradeReceipts=[...(s.tradeReceipts||[]),txId].slice(-50);
    const state=save(s);
    return {ok:true,duplicate:false,state,outgoingRemaining:state.owned[outgoing]||0,incomingWasNew};
  }
  const api={BASE,FUSIONS,STARTER_IDS,key,load,save,add,remove,canFuse,fuse,normalize,availableCount,tradeTransfer,crystalFusion:true};
  window.OrbuffFusion=api;
  window.SkyPuffFusion=api;
})();