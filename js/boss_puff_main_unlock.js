(function(){
const KEY='skyPuffBossRushWinsV1',USE='skyPuffUseBossPuffMain',IDS=['storm','candy','ice','galaxy'];
function readWins(){try{return {...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return {}}}
let cachedWins=readWins();
let cachedAllWon=IDS.every(id=>!!cachedWins[id]);
let cachedUseMain=localStorage.getItem(USE)==='1';
function wins(){return {...cachedWins}}
function allWon(){return cachedAllWon}
function refreshCache(){cachedWins=readWins();cachedAllWon=IDS.every(id=>!!cachedWins[id]);cachedUseMain=localStorage.getItem(USE)==='1'}
function text(){const l=typeof lang==='string'?lang:'en';const M={no:['BRUK BOSS PUFF I HOVEDSPILLET','Boss Puff låses opp i hovedspillet når alle 4 bossene er beseiret i Boss Rush.','Boss Puff er nå låst opp i hovedspillet! ✨'],en:['USE BOSS PUFF IN MAIN GAME','Boss Puff unlocks in the main game after defeating all 4 bosses in Boss Rush.','Boss Puff is now unlocked in the main game! ✨'],de:['BOSS PUFF IM HAUPTSPIEL NUTZEN','Boss Puff wird nach Siegen über alle 4 Bosse im Boss Rush freigeschaltet.','Boss Puff ist jetzt im Hauptspiel freigeschaltet! ✨'],es:['USAR BOSS PUFF EN JUEGO PRINCIPAL','Boss Puff se desbloquea tras derrotar a los 4 jefes en Boss Rush.','¡Boss Puff ya está desbloqueado en el juego principal! ✨'],fr:['UTILISER BOSS PUFF DANS LE JEU PRINCIPAL','Boss Puff se débloque après avoir vaincu les 4 boss dans Boss Rush.','Boss Puff est maintenant débloqué dans le jeu principal ! ✨']};return M[l]||M.en}
function addToggle(){if(!cachedAllWon||document.getElementById('bossPuffMainToggle'))return;const host=document.querySelector('#start .card')||document.getElementById('start');if(!host)return;const b=document.createElement('button');b.id='bossPuffMainToggle';b.className='secondary';b.style.marginTop='8px';function sync(){b.textContent=(cachedUseMain?'✓ ':'')+text()[0]}b.onclick=()=>{cachedUseMain=!cachedUseMain;localStorage.setItem(USE,cachedUseMain?'1':'0');sync()};sync();host.appendChild(b)}
window.skyPuffBossRushProgress={record:function(id){if(!IDS.includes(id))return;const before=cachedAllWon;cachedWins[id]=true;cachedAllWon=IDS.every(x=>!!cachedWins[x]);localStorage.setItem(KEY,JSON.stringify(cachedWins));if(!before&&cachedAllWon){cachedUseMain=true;localStorage.setItem(USE,'1');showToast(text()[2]);addToggle()}},allWon,wins,refresh:refreshCache};
function hook(){if(typeof drawPlayer!=='function'||!window.skyPuffBossCreator){setTimeout(hook,250);return}const old=drawPlayer;drawPlayer=function(){const useMain=!bossRushMode&&cachedAllWon&&cachedUseMain;if(useMain){const was=bossRushMode;bossRushMode=true;try{return old()}finally{bossRushMode=was}}return old()};addToggle()}
hook();
window.addEventListener('storage',e=>{if(e.key===KEY||e.key===USE){refreshCache();addToggle()}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshCache();addToggle()}});
})();