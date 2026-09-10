/* Sky Puff — Race My Puffling ghost interpolation v0.2
 * Visual-only opponent ghost. Never participates in collisions or gameplay state.
 */
(function(){
  const BUFFER_MS=90;
  const STALE_MS=900;
  const MAX_SAMPLES=16;
  const samples=[];
  let attackPulseUntil=0;
  let lastSample=null;

  function now(){return typeof performance!=='undefined'?performance.now():Date.now();}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function lerp(a,b,t){return a+(b-a)*t;}
  function finiteOrNull(v){if(v===null||v===undefined||v==='')return null;const n=Number(v);return Number.isFinite(n)?n:null;}
  function lerpMaybe(a,b,t){if(Number.isFinite(a)&&Number.isFinite(b))return lerp(a,b,t);return Number.isFinite(b)?b:Number.isFinite(a)?a:null;}
  function reset(){samples.length=0;lastSample=null;attackPulseUntil=0;}
  function push(raw){
    if(!raw)return;
    const s={
      receivedAt:now(),
      x:Number(raw.x)||0,
      y:finiteOrNull(raw.y),
      worldY:finiteOrNull(raw.worldY),
      height:Math.max(0,Number(raw.height)||0),
      state:String(raw.state||'jumping'),
      pufflingId:raw.pufflingId||null,
      skin:raw.skin||null,
      evolutionStage:Math.max(0,Math.min(2,Number(raw.evolutionStage)||0))
    };
    samples.push(s);
    while(samples.length>MAX_SAMPLES)samples.shift();
  }
  function sample(){
    if(!samples.length)return null;
    const t=now()-BUFFER_MS;
    while(samples.length>2&&samples[1].receivedAt<t)samples.shift();
    const a=samples[0],b=samples[1]||a;
    if(now()-b.receivedAt>STALE_MS)return null;
    if(a===b){lastSample={...b};return lastSample;}
    const span=Math.max(1,b.receivedAt-a.receivedAt);
    const f=clamp((t-a.receivedAt)/span,0,1);
    lastSample={
      receivedAt:lerp(a.receivedAt,b.receivedAt,f),
      x:lerp(a.x,b.x,f),
      y:lerpMaybe(a.y,b.y,f),
      worldY:lerpMaybe(a.worldY,b.worldY,f),
      height:lerp(a.height,b.height,f),
      state:f<.5?a.state:b.state,
      pufflingId:b.pufflingId||a.pufflingId,
      skin:b.skin||a.skin,
      evolutionStage:b.evolutionStage||a.evolutionStage||0
    };
    return lastSample;
  }
  function pufflingInfo(id){
    try{
      const direct=window.SkyPuffPufflingGameplay?.getPuff?.(id);if(direct)return direct;
      const F=window.SkyPuffFusion;
      return [...Object.values(F?.BASE||{}),...Object.values(F?.FUSIONS||{})].find(p=>p.id===id)||null;
    }catch(e){return null;}
  }
  function ghostBodyColor(s){
    try{
      if(s?.skin&&typeof skins!=='undefined'&&skins[s.skin]?.body)return skins[s.skin].body;
    }catch(e){}
    return '#dff5ff';
  }
  function screenYFor(s){
    try{
      if(Number.isFinite(s.worldY)&&typeof cameraY==='number')return s.worldY-cameraY;
      if(Number.isFinite(s.y)&&typeof player!=='undefined')return player.y+(s.y-player.y);
      if(typeof player!=='undefined'&&typeof score==='number')return player.y-(s.height-score)*10;
    }catch(e){}
    return null;
  }
  function drawGhost(){
    try{
      if(typeof multiplayerMode==='undefined'||!multiplayerMode)return;
      if(!window.SkyPuffRaceNetwork?.isOnline?.())return;
      if(typeof ctx==='undefined'||typeof player==='undefined'||typeof score!=='number'||typeof H==='undefined')return;
      const s=sample();if(!s)return;
      const y=screenYFor(s);if(!Number.isFinite(y)||y<-90||y>H+90)return;
      const p=pufflingInfo(s.pufflingId);
      const pulse=attackPulseUntil>now()?1.13:1;
      const phase=now()/150;
      const animY=s.state==='jumping'?-5-Math.abs(Math.sin(phase))*4:s.state==='falling'?3+Math.abs(Math.sin(phase))*3:Math.sin(phase)*2;
      const rot=s.state==='jumping'?-0.06:s.state==='falling'?.06:0;
      ctx.save();
      ctx.translate(s.x,y+animY);ctx.rotate(rot);ctx.scale(pulse,pulse);
      ctx.globalAlpha=.42;
      ctx.fillStyle=ghostBodyColor(s);ctx.strokeStyle='rgba(120,220,255,.9)';ctx.lineWidth=3;
      ctx.shadowColor='rgba(90,210,255,.75)';ctx.shadowBlur=18;
      ctx.beginPath();
      ctx.arc(-17,3,18,0,Math.PI*2);ctx.arc(-2,-9,22,0,Math.PI*2);ctx.arc(19,1,20,0,Math.PI*2);ctx.arc(0,9,25,0,Math.PI*2);
      ctx.fill();ctx.stroke();ctx.shadowBlur=0;
      ctx.globalAlpha=.72;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-7,-15,9,5,-.3,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=.92;ctx.fillStyle='#183b56';ctx.font='700 10px system-ui';ctx.textAlign='center';ctx.fillText('RIVAL',0,-40);
      if(p?.icon){ctx.globalAlpha=.96;ctx.font='20px Arial';ctx.fillText(p.icon,0,8);}
      if(s.evolutionStage>0){ctx.globalAlpha=.9;ctx.font='11px system-ui';ctx.fillText(s.evolutionStage>=2?'★★':'★',0,34);}
      ctx.restore();
    }catch(e){/* visual layer must never break gameplay */}
  }
  function installDrawHook(){
    const base=window.draw;
    if(typeof base!=='function'||base.__raceGhostWrapped)return false;
    function wrapped(){base.apply(this,arguments);drawGhost();}
    wrapped.__raceGhostWrapped=true;window.draw=wrapped;return true;
  }

  window.addEventListener('race:ghost',ev=>push(ev.detail));
  window.addEventListener('race:start',reset);
  window.addEventListener('race:reset',reset);
  window.addEventListener('race:incomingAttack',()=>{attackPulseUntil=now()+420;});
  if(!installDrawHook())setTimeout(installDrawHook,0);

  window.SkyPuffRaceGhost={BUFFER_MS,push,sample,reset,draw:drawGhost,status:()=>({samples:samples.length,last:lastSample?{...lastSample}:null})};
})();
