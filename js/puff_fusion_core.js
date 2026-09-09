/* Sky Puff — Puff Fusion Core v0.1
 * Data-first foundation. Safe to load before UI/gameplay integration.
 */
(function(){
  const BASE = {
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
  const key=(a,b)=>[a,b].sort().join('+');
  const load=()=>{try{return JSON.parse(localStorage.getItem('skyPuffPufflings')||'null')||{owned:{},vault:[],discovered:[]};}catch(e){return {owned:{},vault:[],discovered:[]};}};
  const save=s=>localStorage.setItem('skyPuffPufflings',JSON.stringify(s));
  function add(id,count=1){const s=load();s.owned[id]=(s.owned[id]||0)+count;if(!s.discovered.includes(id))s.discovered.push(id);save(s);return s;}
  function canFuse(a,b){const s=load(), recipe=FUSIONS[key(a,b)];return !!recipe && (s.owned[a]||0)>0 && (s.owned[b]||0)>0;}
  function fuse(a,b){const recipe=FUSIONS[key(a,b)];if(!recipe||!canFuse(a,b))return {ok:false};const s=load();s.owned[a]--;s.owned[b]--;s.owned[recipe.id]=(s.owned[recipe.id]||0)+1;if(!s.discovered.includes(recipe.id))s.discovered.push(recipe.id);save(s);return {ok:true,puffling:recipe,state:s};}
  window.SkyPuffFusion={BASE,FUSIONS,key,load,save,add,canFuse,fuse};
})();
