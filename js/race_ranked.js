/* Puffling — Ranked Quick Race v1.0
 * Quick Race only. Friend races and local/test ghosts never change MMR.
 */
(function(){
  const KEY='pufflingQuickRaceRankV1';
  const START_RATING=1000;
  const MIN_RATING=600;
  const TIERS=[
    {name:'Bronze',min:0,icon:'🟤'},
    {name:'Silver',min:1000,icon:'⚪'},
    {name:'Gold',min:1200,icon:'🟡'},
    {name:'Platinum',min:1400,icon:'🔷'},
    {name:'Diamond',min:1600,icon:'💎'},
    {name:'Master',min:1800,icon:'👑'},
    {name:'Champion',min:2000,icon:'🏆'}
  ];
  let currentMode='idle';
  let currentRoom='';
  let opponentRating=START_RATING;
  let lastUpdate=null;
  let transportBound=false;

  function finite(v,fallback=0){const n=Number(v);return Number.isFinite(n)?n:fallback;}
  function normalize(raw={}){
    const rating=Math.max(MIN_RATING,Math.round(finite(raw.rating,START_RATING)));
    return {
      rating,
      wins:Math.max(0,Math.floor(finite(raw.wins,0))),
      losses:Math.max(0,Math.floor(finite(raw.losses,0))),
      games:Math.max(0,Math.floor(finite(raw.games,0))),
      streak:Math.max(0,Math.floor(finite(raw.streak,0))),
      bestRating:Math.max(rating,Math.round(finite(raw.bestRating,rating))),
      lastDelta:Math.round(finite(raw.lastDelta,0)),
      lastRaceId:String(raw.lastRaceId||''),
      lastOpponentRating:Math.max(MIN_RATING,Math.round(finite(raw.lastOpponentRating,START_RATING)))
    };
  }
  function load(){
    try{return normalize(JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return normalize();}
  }
  function saveState(state){const s=normalize(state);try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}return s;}
  function rankFor(rating){
    const r=Math.max(0,Math.round(finite(rating,START_RATING)));
    let index=0;for(let i=0;i<TIERS.length;i++)if(r>=TIERS[i].min)index=i;
    const tier=TIERS[index],next=TIERS[index+1]||null;
    if(!next)return {...tier,division:'',label:`${tier.icon} ${tier.name}`,progress:1,nextMin:null,nextName:null};
    const span=Math.max(1,next.min-tier.min),within=Math.max(0,Math.min(span-1,r-tier.min));
    const third=span/3;const division=within<third?'III':within<third*2?'II':'I';
    return {...tier,division,label:`${tier.icon} ${tier.name} ${division}`,progress:Math.max(0,Math.min(1,within/span)),nextMin:next.min,nextName:next.name};
  }
  function profile(){const state=load(),rank=rankFor(state.rating);return {...state,rank};}
  function expectedScore(own,opp){return 1/(1+10**((opp-own)/400));}
  function recordResult(opts={}){
    const mode=String(opts.mode||'');const raceId=String(opts.raceId||'');
    if(mode!=='quick')return {applied:false,reason:'unranked-mode',profile:profile()};
    if(!opts.authoritative)return {applied:false,reason:'server-required',profile:profile()};
    if(!raceId)return {applied:false,reason:'missing-race-id',profile:profile()};
    const before=load();if(before.lastRaceId===raceId)return {applied:false,reason:'duplicate-result',profile:{...before,rank:rankFor(before.rating)}};
    const opp=Math.max(MIN_RATING,Math.min(3000,Math.round(finite(opts.opponentRating,START_RATING))));
    const won=!!opts.won,expected=expectedScore(before.rating,opp),k=before.games<10?40:28;
    const raw=Math.round(k*((won?1:0)-expected));
    const magnitude=Math.min(36,Math.max(8,Math.abs(raw)||8));
    const delta=won?magnitude:-magnitude;
    const after=saveState({
      ...before,
      rating:Math.max(MIN_RATING,before.rating+delta),
      wins:before.wins+(won?1:0),
      losses:before.losses+(won?0:1),
      games:before.games+1,
      streak:won?before.streak+1:0,
      bestRating:Math.max(before.bestRating,before.rating+delta),
      lastDelta:delta,
      lastRaceId:raceId,
      lastOpponentRating:opp
    });
    const result={applied:true,won,delta,before:{...before,rank:rankFor(before.rating)},after:{...after,rank:rankFor(after.rating)},opponentRating:opp,raceId,at:Date.now()};
    lastUpdate=result;
    try{window.dispatchEvent(new CustomEvent('race:rankUpdate',{detail:result}));}catch(e){}
    render();
    return result;
  }
  function mineId(){try{return window.SkyPuffRaceTransport?.snapshot?.().playerId||'';}catch(e){return '';}}
  function captureOpponent(players){
    const mine=mineId();const p=Array.isArray(players)?players.find(x=>x&&x.playerId!==mine):null;
    if(p&&Number.isFinite(Number(p.rankRating)))opponentRating=Math.max(MIN_RATING,Math.round(Number(p.rankRating)));
  }
  function resultRankHtml(){
    if(currentMode!=='quick')return '';
    if(lastUpdate&&Date.now()-lastUpdate.at<15000){
      const u=lastUpdate,a=u.after;const sign=u.delta>0?'+':'';
      return `<div id="raceRankResult" style="margin-top:14px;padding:12px;border-radius:15px;background:rgba(255,255,255,.72);font-weight:900"><div style="font-size:15px">${a.rank.label}</div><div style="margin-top:4px">MMR <b>${a.rating}</b> <span style="font-weight:1000">(${sign}${u.delta})</span></div><div style="font-size:11px;opacity:.72;margin-top:3px">Ranked Quick Race • ${a.wins}W / ${a.losses}L${a.streak>1?` • 🔥 ${a.streak} streak`:''}</div></div>`;
    }
    return '<div id="raceRankResult" style="margin-top:14px;padding:12px;border-radius:15px;background:rgba(255,255,255,.72);font-size:12px;font-weight:900">Rank unchanged — live Race server is required for ranked results.</div>';
  }
  function decorateResult(){
    if(typeof document==='undefined')return;const body=document.getElementById('raceResultBody');if(!body)return;
    body.querySelector('#raceRankResult')?.remove();const html=resultRankHtml();if(html)body.insertAdjacentHTML('beforeend',html);
  }
  function ensureCard(){
    const card=document.querySelector('#multiplayerMenu .card');if(!card)return null;
    let box=document.getElementById('raceRankPanel');
    if(!box){
      box=document.createElement('div');box.id='raceRankPanel';
      box.style.cssText='margin:10px 0 12px;padding:12px 14px;border-radius:17px;background:rgba(255,255,255,.78);border:1px solid rgba(63,136,190,.2);box-shadow:0 7px 20px rgba(37,94,137,.08)';
      const quick=document.getElementById('quickMatchBtn');if(quick)quick.insertAdjacentElement('beforebegin',box);else card.appendChild(box);
    }
    return box;
  }
  function render(){
    if(typeof document==='undefined')return;const p=profile(),box=ensureCard();if(!box)return;
    const next=p.rank.nextMin?`${Math.max(0,p.rank.nextMin-p.rating)} MMR to ${p.rank.nextName}`:'Top rank';
    box.innerHTML=`<div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><div><div style="font-size:11px;font-weight:1000;letter-spacing:.8px;opacity:.62">QUICK RACE RANK</div><div style="font-size:21px;font-weight:1000;margin-top:2px">${p.rank.label}</div></div><div style="text-align:right"><div style="font-size:19px;font-weight:1000">${p.rating}</div><div style="font-size:10px;font-weight:900;opacity:.64">MMR</div></div></div><div style="height:7px;background:rgba(40,80,120,.12);border-radius:999px;margin-top:9px;overflow:hidden"><div style="height:100%;width:${Math.round(p.rank.progress*100)}%;background:linear-gradient(90deg,#63b7ff,#9b75ff);border-radius:999px"></div></div><div style="display:flex;justify-content:space-between;gap:8px;margin-top:7px;font-size:10px;font-weight:900;opacity:.72"><span>${p.wins}W • ${p.losses}L${p.streak?` • 🔥${p.streak}`:''}</span><span>${next}</span></div>`;
  }
  function patchTransportConnect(){
    const T=window.SkyPuffRaceTransport;if(!T?.connect||T.connect.__rankWrapped)return;
    const base=T.connect;const wrapped=function(opts={}){return base.call(this,{...opts,rankRating:profile().rating});};wrapped.__rankWrapped=true;T.connect=wrapped;
  }
  function bindTransport(){
    if(transportBound)return;const T=window.SkyPuffRaceTransport;if(!T)return;transportBound=true;
    T.on('race:matched',m=>{currentMode=m?.mode==='quick'?'quick':'friend';currentRoom=String(m?.room||'');opponentRating=START_RATING;captureOpponent(m?.players);render();});
    T.on('race:opponentJoined',m=>{if(currentMode==='quick')captureOpponent(m?.player?[m.player]:m?.players);});
    T.on('race:resumed',m=>{captureOpponent(m?.players);});
    T.on('race:result',m=>{
      if(currentMode!=='quick'||!m?.winnerId)return;captureOpponent(m?.players);
      const mine=mineId();recordResult({mode:'quick',authoritative:true,raceId:String(m.room||currentRoom),won:m.winnerId===mine,opponentRating});
      setTimeout(decorateResult,0);
    });
  }
  function patchGameHooks(){
    if(typeof window.startMultiplayerRace==='function'&&!window.startMultiplayerRace.__rankWrapped){
      const base=window.startMultiplayerRace;const wrapped=function(type){currentMode=type==='random'?'quick':'friend';currentRoom='';opponentRating=START_RATING;lastUpdate=null;return base.apply(this,arguments);};wrapped.__rankWrapped=true;window.startMultiplayerRace=wrapped;
    }
    if(window.SkyPuffRaceUI?.showResult&&!window.SkyPuffRaceUI.showResult.__rankWrapped){
      const base=window.SkyPuffRaceUI.showResult;const wrapped=function(){const out=base.apply(this,arguments);decorateResult();return out;};wrapped.__rankWrapped=true;window.SkyPuffRaceUI.showResult=wrapped;
    }
    if(typeof window.openMultiplayer==='function'&&!window.openMultiplayer.__rankWrapped){
      const base=window.openMultiplayer;const wrapped=function(){const out=base.apply(this,arguments);setTimeout(render,0);return out;};wrapped.__rankWrapped=true;window.openMultiplayer=wrapped;
    }
  }
  function init(){patchTransportConnect();bindTransport();patchGameHooks();render();}
  window.SkyPuffQuickRank={profile,rankFor,recordResult,render,decorateResult,get lastUpdate(){return lastUpdate;},START_RATING,MIN_RATING,version:1};
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,40));else setTimeout(init,40);
  }else{patchTransportConnect();bindTransport();patchGameHooks();}
})();
