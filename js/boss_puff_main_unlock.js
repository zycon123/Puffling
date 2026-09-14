(function(){
const KEY='skyPuffBossRushWinsV1',USE='skyPuffUseBossPuffMain',IDS=['storm','candy','ice','galaxy','solar','void','thunder','crystal','inferno','cosmic'];
function readWins(){try{return {...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return {}}}
let cachedWins=readWins();
let cachedAllWon=IDS.every(id=>!!cachedWins[id]);
let cachedUseMain=localStorage.getItem(USE)==='1';
function wins(){return {...cachedWins}}
function allWon(){return cachedAllWon}
function refreshCache(){cachedWins=readWins();cachedAllWon=IDS.every(id=>!!cachedWins[id]);cachedUseMain=localStorage.getItem(USE)==='1'}
function text(){const l=typeof lang==='string'?lang:'en';const M={no:['BRUK BOSS ORBUFF I HOVEDSPILLET','Boss Orbuff låses opp i hovedspillet når alle 10 bossene er beseiret i Boss Rush.','Boss Orbuff er nå låst opp i hovedspillet! ✨'],en:['USE BOSS ORBUFF IN MAIN GAME','Boss Orbuff unlocks in the main game after defeating all 10 bosses in Boss Rush.','Boss Orbuff is now unlocked in the main game! ✨'],de:['BOSS ORBUFF IM HAUPTSPIEL NUTZEN','Boss Orbuff wird nach Siegen über alle 10 Bosse im Boss Rush freigeschaltet.','Boss Orbuff ist jetzt im Hauptspiel freigeschaltet! ✨'],es:['USAR BOSS ORBUFF EN JUEGO PRINCIPAL','Boss Orbuff se desbloquea tras derrotar a los 10 jefes en Boss Rush.','¡Boss Orbuff ya está desbloqueado en el juego principal! ✨'],fr:['UTILISER BOSS ORBUFF DANS LE JEU PRINCIPAL','Boss Orbuff se débloque après avoir vaincu les 10 boss dans Boss Rush.','Boss Orbuff est maintenant débloqué dans le jeu principal ! ✨']};return M[l]||M.en}
function addToggle(){if(!cachedAllWon||document.getElementById('bossPuffMainToggle'))return;const host=document.querySelector('#start .card')||document.getElementById('start');if(!host)return;const b=document.createElement('button');b.id='bossPuffMainToggle';b.className='secondary';b.style.marginTop='8px';function sync(){b.textContent=(cachedUseMain?'✓ ':'')+text()[0]}b.onclick=()=>{cachedUseMain=!cachedUseMain;localStorage.setItem(USE,cachedUseMain?'1':'0');sync()};sync();host.appendChild(b)}
window.skyPuffBossRushProgress={record:function(id){if(!IDS.includes(id))return;const before=cachedAllWon;cachedWins[id]=true;cachedAllWon=IDS.every(x=>!!cachedWins[x]);localStorage.setItem(KEY,JSON.stringify(cachedWins));if(!before&&cachedAllWon){cachedUseMain=true;localStorage.setItem(USE,'1');showToast(text()[2]);addToggle()}},allWon,wins,refresh:refreshCache,ids:[...IDS]};
function hook(){if(typeof drawPlayer!=='function'||!window.skyPuffBossCreator){setTimeout(hook,250);return}const old=drawPlayer;drawPlayer=function(){const useMain=!bossRushMode&&cachedAllWon&&cachedUseMain;if(useMain){const was=bossRushMode;bossRushMode=true;try{return old()}finally{bossRushMode=was}}return old()};addToggle()}
hook();
window.addEventListener('storage',e=>{if(e.key===KEY||e.key===USE){refreshCache();addToggle()}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshCache();addToggle()}});
})();