/* Sky Puff — Race My Puffling network transport v0.1
 * Provides a safe WebSocket-ready transport with local fallback.
 */
(function(){
  const listeners=new Map();
  let socket=null;
  let state='offline';
  let room='';
  let playerId='';
  let lastSentAt=0;
  const MIN_POSITION_INTERVAL=66; // ~15 Hz

  function emit(type,payload){
    const set=listeners.get(type);if(!set)return;
    set.forEach(fn=>{try{fn(payload)}catch(e){console.error('[RaceTransport]',e)}});
  }
  function on(type,fn){if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(fn);return()=>listeners.get(type)?.delete(fn);}
  function endpoint(){
    try{return localStorage.getItem('skyPuffRaceWsUrl')||window.SKY_PUFF_RACE_WS_URL||'';}catch(e){return window.SKY_PUFF_RACE_WS_URL||'';}
  }
  function sendRaw(msg){
    if(socket&&socket.readyState===WebSocket.OPEN){socket.send(JSON.stringify(msg));return true;}
    return false;
  }
  function connect(opts={}){
    room=opts.room||room||'';playerId=opts.playerId||playerId||('p_'+Math.random().toString(36).slice(2,10));
    const url=opts.url||endpoint();
    if(!url){state='local';emit('state',{state,room,playerId});return Promise.resolve({mode:'local',room,playerId});}
    return new Promise(resolve=>{
      try{
        socket=new WebSocket(url);state='connecting';emit('state',{state,room,playerId});
        const timeout=setTimeout(()=>{if(state==='connecting'){try{socket.close()}catch(e){}state='local';emit('state',{state,room,playerId});resolve({mode:'local',room,playerId});}},3500);
        socket.onopen=()=>{clearTimeout(timeout);state='online';sendRaw({type:'race:hello',room,playerId,protocol:1});emit('state',{state,room,playerId});resolve({mode:'online',room,playerId});};
        socket.onmessage=ev=>{try{const m=JSON.parse(ev.data);if(m&&m.type)emit(m.type,m);}catch(e){}};
        socket.onerror=()=>{};
        socket.onclose=()=>{if(state==='online'){state='reconnecting';emit('state',{state,room,playerId});}else if(state!=='local'){state='local';emit('state',{state,room,playerId});}};
      }catch(e){state='local';emit('state',{state,room,playerId});resolve({mode:'local',room,playerId});}
    });
  }
  function sendPosition(data){const now=performance.now();if(now-lastSentAt<MIN_POSITION_INTERVAL)return false;lastSentAt=now;return sendRaw({type:'race:position',room,playerId,t:Date.now(),...data});}
  function sendAttack(data){return sendRaw({type:'race:attack',room,playerId,t:Date.now(),...data});}
  function sendFinish(data){return sendRaw({type:'race:finish',room,playerId,t:Date.now(),...data});}
  function sendReady(data={}){return sendRaw({type:'race:ready',room,playerId,t:Date.now(),...data});}
  function disconnect(){if(socket){try{socket.close(1000,'leave race')}catch(e){}}socket=null;state='offline';emit('state',{state,room,playerId});}
  function snapshot(){return{state,room,playerId,online:state==='online',endpoint:endpoint()};}
  window.SkyPuffRaceTransport={connect,disconnect,on,sendPosition,sendAttack,sendFinish,sendReady,snapshot,protocolVersion:1};
})();
