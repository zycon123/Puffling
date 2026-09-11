/* Puffling — Race My Puffling network transport v0.4
 * WebSocket transport with local fallback before a race and automatic reconnect during live races.
 * Ranked identity is server-verified: the client never sends an authoritative MMR value.
 */
(function(){
  const listeners=new Map();
  let socket=null;
  let state='offline';
  let room='';
  let playerId='';
  let authToken='';
  let lastSentAt=0;
  let manualClose=false;
  let reconnectTimer=null;
  let reconnectDeadline=0;
  let reconnectAttempt=0;
  let connectedOnce=false;
  let activeUrl='';
  const MIN_POSITION_INTERVAL=66;
  const RECONNECT_WINDOW_MS=11000;
  const RETRY_DELAYS=[300,700,1200,1800,2500,3000];

  function emit(type,payload){const set=listeners.get(type);if(!set)return;set.forEach(fn=>{try{fn(payload)}catch(e){console.error('[RaceTransport]',e)}});}
  function on(type,fn){if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(fn);return()=>listeners.get(type)?.delete(fn);}
  function endpoint(){try{return localStorage.getItem('skyPuffRaceWsUrl')||window.SKY_PUFF_RACE_WS_URL||'';}catch(e){return window.SKY_PUFF_RACE_WS_URL||'';}}
  function storedAuthToken(){try{return String(localStorage.getItem('pufflingAccountAuthToken')||'');}catch(e){return '';}}
  function setAuthToken(token,{persist=true}={}){authToken=String(token||'');if(persist){try{if(authToken)localStorage.setItem('pufflingAccountAuthToken',authToken);else localStorage.removeItem('pufflingAccountAuthToken');}catch(e){}}return authToken;}
  function setState(next,extra={}){state=next;emit('state',{state,room,playerId,reconnectDeadline,...extra});}
  function clearReconnect(){if(reconnectTimer){clearTimeout(reconnectTimer);reconnectTimer=null;}}
  function sendRaw(msg){if(socket&&socket.readyState===WebSocket.OPEN){socket.send(JSON.stringify(msg));return true;}return false;}
  function handleMessage(ev){try{const m=JSON.parse(ev.data);if(!m||!m.type)return;if(m.room)room=String(m.room);emit(m.type,m);}catch(e){}}
  function scheduleReconnect(){clearReconnect();if(manualClose||!activeUrl)return;if(!reconnectDeadline)reconnectDeadline=Date.now()+RECONNECT_WINDOW_MS;if(Date.now()>=reconnectDeadline){setState('reconnect_failed');emit('reconnect_failed',{room,playerId});return;}const delay=RETRY_DELAYS[Math.min(reconnectAttempt,RETRY_DELAYS.length-1)];reconnectAttempt++;reconnectTimer=setTimeout(()=>openSocket(activeUrl,true),delay);}
  function openSocket(url,isReconnect=false){
    clearReconnect();if(manualClose)return;
    try{
      socket=new WebSocket(url);setState(isReconnect?'reconnecting':'connecting',{attempt:reconnectAttempt});
      const timeout=setTimeout(()=>{if(socket&&socket.readyState!==WebSocket.OPEN){try{socket.close()}catch(e){}}},3500);
      socket.onopen=()=>{clearTimeout(timeout);connectedOnce=true;reconnectAttempt=0;setState('online',{resumed:isReconnect});sendRaw({type:'race:hello',room,playerId,protocol:3,resume:isReconnect,authToken});};
      socket.onmessage=handleMessage;socket.onerror=()=>{};
      socket.onclose=()=>{clearTimeout(timeout);socket=null;if(manualClose){setState('offline');return;}if(connectedOnce){setState('reconnecting');scheduleReconnect();}else setState('connect_failed');};
    }catch(e){socket=null;if(connectedOnce){setState('reconnecting');scheduleReconnect();}else setState('connect_failed');}
  }
  function connect(opts={}){
    room=opts.room||room||'';playerId=opts.playerId||playerId||('p_'+Math.random().toString(36).slice(2,10));
    authToken=String(opts.authToken||authToken||storedAuthToken()||'');
    activeUrl=opts.url||endpoint();manualClose=false;reconnectAttempt=0;reconnectDeadline=0;connectedOnce=false;
    if(!activeUrl){setState('local');return Promise.resolve({mode:'local',room,playerId,authenticated:!!authToken});}
    return new Promise(resolve=>{
      let settled=false;const off=on('state',m=>{if(settled)return;if(m.state==='online'){settled=true;off();resolve({mode:'online',room,playerId,authenticated:!!authToken});}if(m.state==='connect_failed'){settled=true;off();manualClose=true;try{socket?.close()}catch(e){}socket=null;setState('local');resolve({mode:'local',room,playerId,authenticated:!!authToken});}});
      openSocket(activeUrl,false);
      setTimeout(()=>{if(settled)return;settled=true;off();manualClose=true;try{socket?.close()}catch(e){}socket=null;setState('local');resolve({mode:'local',room,playerId,authenticated:!!authToken});},4200);
    });
  }
  function sendPosition(data){const t=performance.now();if(t-lastSentAt<MIN_POSITION_INTERVAL)return false;lastSentAt=t;return sendRaw({type:'race:position',room,playerId,t:Date.now(),...data});}
  function sendAttack(data){return sendRaw({type:'race:attack',room,playerId,t:Date.now(),...data});}
  function sendFinish(data){return sendRaw({type:'race:finish',room,playerId,t:Date.now(),...data});}
  function sendReady(data={}){return sendRaw({type:'race:ready',room,playerId,t:Date.now(),...data});}
  function disconnect(){manualClose=true;clearReconnect();reconnectDeadline=0;reconnectAttempt=0;if(socket){try{socket.close(1000,'leave race')}catch(e){}}socket=null;setState('offline');}
  function snapshot(){return{state,room,playerId,authenticated:!!authToken,online:state==='online',reconnecting:state==='reconnecting',reconnectDeadline,endpoint:endpoint(),protocolVersion:3};}
  window.SkyPuffRaceTransport={connect,disconnect,on,sendPosition,sendAttack,sendFinish,sendReady,snapshot,setAuthToken,protocolVersion:3};
})();
