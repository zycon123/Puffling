/* Puffling — Puff Fusion Core v0.4 */
(function(){
  const BASE = {
    starterpuff:{id:'starterpuff',name:'Starter Puff',icon:'☁️',rarity:'common',ability:'starter',value:.35,palette:['#eef8ff','#8fc7e8'],mark:'○',starterOnly:true},
    starterspark:{id:'starterspark',name:'Starter Spark',icon:'✨',rarity:'common',ability:'starter',value:.35,palette:['#fff6bc','#e7bd54'],mark:'✦',starterOnly:true},
    starterdrop:{id:'starterdrop',name:'Starter Drop',icon:'💧',rarity:'common',ability:'starter',value:.35,palette:['#dff7ff','#67b8de'],mark:'◇',starterOnly:true},
    ember:{id:'ember',name:'Ember Puff',icon:'🔥',rarity:'common',ability:'blastDamage',value:1.10},
    volt:{id:'volt',name:'Volt Puff',icon:'⚡',rarity:'common',ability:'chainShot',value:1},
    frost:{id:'frost',name:'Frost Puff',icon:'❄️',rarity:'common',ability:'freeze',value:0.8},
    prism:{id:'prism',name:'Prism Puff',icon:'🌈',rarity:'rare',ability:'rainbowGain',value:1.15},
    shadow:{id:'shadow',name:'Shadow Puff',icon:'🌑',rarity:'rare',ability:'airDash',value:1},
    wind:{id:'wind',name:'Wind Puff',icon:'💨',rarity:'common',ability:'jumpControl',value:1.10}
  };
  const FUSIONS = {
    'ember+volt':{id:'thunderflame',name:'Thunderflame',icon:'🔥⚡',rarity:'epic',ability:'chainBlast'},
    'frost+prism':{id:'aurora',name:'Aurora Puff',icon:'❄️🌈',rarity:'epic',ability:'rescuePlatform'},
    'ember+shadow':{id:'eclipse',name:'Eclipse Puff',icon:'🌑🔥',rarity:'legendary',ability:'phaseDash'},
    'volt+wind':{id:'tempest',name:'Tempest Puff',icon:'💨⚡',rarity:'epic',ability:'stormJump'},
    'prism+volt':{id:'neonstorm',name:'Neon Storm',icon:'🌈⚡',rarity:'legendary',ability:'rainbowChain'}
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
    return {owned,vault,discovered};
  }
  function load(){try{return normalize(JSON.parse(localStorage.getItem('skyPuffPufflings')||'null'));}catch(e){return normalize(null);}}
  function save(s){const n=normalize(s);localStorage.setItem('skyPuffPufflings',JSON.stringify(n));try{const active=localStorage.getItem('skyPuffActivePuffling');if(active&&!(n.owned[active]>0))localStorage.removeItem('skyPuffActivePuffling');}catch(e){}return n;}
  function add(id,count=1){const s=load(),inc=Math.max(0,Math.floor(+count||0));if(!id||inc<=0)return s;s.owned[id]=(s.owned[id]||0)+inc;if(!s.discovered.includes(id))s.discovered.push(id);return save(s);}
  function availableCount(s,id){return Math.max(0,(s.owned[id]||0)-(s.vault.includes(id)?1:0));}
  function canFuse(a,b){const s=load(),recipe=FUSIONS[key(a,b)];if(!recipe)return false;return a===b?availableCount(s,a)>=2:availableCount(s,a)>0&&availableCount(s,b)>0;}
  function fuse(a,b){const recipe=FUSIONS[key(a,b)];if(!recipe)return {ok:false,reason:'unknown_recipe'};const s=load();if(a===b?availableCount(s,a)<2:availableCount(s,a)<=0||availableCount(s,b)<=0)return {ok:false,reason:'protected_or_missing'};s.owned[a]--;s.owned[b]--;s.owned[recipe.id]=(s.owned[recipe.id]||0)+1;if(!s.discovered.includes(recipe.id))s.discovered.push(recipe.id);const state=save(s);return {ok:true,puffling:recipe,state};}
  window.SkyPuffFusion={BASE,FUSIONS,STARTER_IDS,key,load,save,add,canFuse,fuse,normalize,availableCount:(id)=>availableCount(load(),id)};
})();