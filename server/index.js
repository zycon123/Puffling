const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');

const PORT = Number(process.env.PORT || 10000);
const GOAL = 1500;
const MAX_ATTACKS = 3;
const ATTACK_COOLDOWN_MS = 4000;
const MAX_POSITION_HZ = 25;
const COUNTDOWN_MS = 4000;
const START_GRACE_MS = 120;
const RECONNECT_GRACE_MS = 12000;
const RESUME_COUNTDOWN_MS = 1500;
const rooms = new Map();
let quickWaiting = null;
let nextRaceId = 1;

function now(){ return Date.now(); }
function safeJson(ws, msg){
  if(ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
}
function cleanRoomId(value){
  return String(value || '').toUpperCase().replace(/[^A-Z0-9_-]/g,'').slice(0,24);
}
function makeRaceId(){ return `race_${now().toString(36)}_${nextRaceId++}`; }
function createRoom(id, kind='friend'){
  const room = { id, kind, players:new Map(), createdAt:now(), startedAt:0, resumeAt:0, paused:false, finishedAt:0, winnerId:null };
  rooms.set(id, room); return room;
}
function playerPublic(p){
  return { playerId:p.playerId, pufflingId:p.pufflingId || null, ready:!!p.ready, connected:!!p.connected, height:p.height||0, x:p.x||0, attacksUsed:p.attacksUsed||0 };
}
function broadcast(room, msg, exceptId=null){
  for(const p of room.players.values()) if(p.playerId !== exceptId && p.connected) safeJson(p.ws, msg);
}
function raceHasStarted(room, at=now()){
  return !!room.startedAt && at + START_GRACE_MS >= room.startedAt;
}
function raceAcceptingInput(room, at=now()){
  if(!raceHasStarted(room,at) || room.paused) return false;
  return !room.resumeAt || at + START_GRACE_MS >= room.resumeAt;
}
function rejectInactive(ws, room){
  if(room.paused) return safeJson(ws,{type:'race:paused',room:room.id,reason:'reconnect'});
  const gate=Math.max(room.startedAt||0,room.resumeAt||0);
  const remaining=Math.max(0,gate-now());
  safeJson(ws,{type:'race:notStarted',room:room.id,serverStartAt:gate,remaining});
}
function maybeStart(room){
  if(room.startedAt || room.players.size !== 2) return;
  if(![...room.players.values()].every(p=>p.ready && p.connected)) return;
  room.startedAt = now() + COUNTDOWN_MS;
  room.resumeAt = 0;
  room.paused = false;
  const players = [...room.players.values()].map(playerPublic);
  broadcast(room,{type:'race:start',room:room.id,serverStartAt:room.startedAt,countdownMs:COUNTDOWN_MS,goal:GOAL,players});
}
function bindPlayerSocket(ws, room, player){
  if(player.reconnectTimer){ clearTimeout(player.reconnectTimer); player.reconnectTimer=null; }
  player.ws=ws; player.connected=true; player.disconnectedAt=0; player.reconnectDeadline=0;
  ws.raceRoom=room.id; ws.racePlayerId=player.playerId;
}
function scheduleResume(room){
  if(room.winnerId || room.players.size !== 2) return;
  if(![...room.players.values()].every(p=>p.connected)) return;
  room.paused=false;
  room.resumeAt=now()+RESUME_COUNTDOWN_MS;
  broadcast(room,{type:'race:resume',room:room.id,serverResumeAt:room.resumeAt,countdownMs:RESUME_COUNTDOWN_MS,players:[...room.players.values()].map(playerPublic)});
}
function tryResume(ws, room, playerId){
  const existing=room.players.get(playerId);
  if(!existing || existing.connected) return null;
  if(!existing.reconnectDeadline || now()>existing.reconnectDeadline) return null;
  bindPlayerSocket(ws,room,existing);
  safeJson(ws,{type:'race:resumed',room:room.id,mode:room.kind,serverStartAt:room.startedAt,resumeAt:room.resumeAt,paused:room.paused,winnerId:room.winnerId,player:playerPublic(existing),players:[...room.players.values()].map(playerPublic)});
  broadcast(room,{type:'race:opponentReconnected',room:room.id,player:playerPublic(existing)},playerId);
  if(room.winnerId){
    safeJson(ws,{type:'race:result',room:room.id,winnerId:room.winnerId,finishedAt:room.finishedAt,goal:GOAL,reason:'finished'});
  }else if(room.startedAt){
    scheduleResume(room);
  }else{
    maybeStart(room);
  }
  return {room,p:existing,resumed:true};
}
function joinBoundRoom(ws, requestedRoom, playerId){
  let room;
  if(requestedRoom && requestedRoom.toLowerCase() !== 'quickmatch'){
    const id=cleanRoomId(requestedRoom);
    room=rooms.get(id);
    if(room){
      const resumed=tryResume(ws,room,playerId);
      if(resumed) return resumed;
    }
    room=room || createRoom(id,'friend');
    if(room.players.size >= 2) return {error:'room_full'};
  }else{
    if(quickWaiting && quickWaiting.players.size === 1 && !quickWaiting.startedAt){
      room = quickWaiting; quickWaiting = null;
    }else{
      room = createRoom(makeRaceId(),'quick'); quickWaiting = room;
    }
  }
  if(room.players.has(playerId)) return {error:'player_already_connected'};
  const p={ws,playerId,connected:true,ready:false,pufflingId:null,lastPositionAt:0,height:0,x:0,attacksUsed:0,lastAttackAt:0,finishedAt:0,disconnectedAt:0,reconnectDeadline:0,reconnectTimer:null};
  room.players.set(playerId,p); ws.raceRoom=room.id; ws.racePlayerId=playerId;
  safeJson(ws,{type:'race:matched',room:room.id,mode:room.kind,players:[...room.players.values()].map(playerPublic)});
  broadcast(room,{type:'race:opponentJoined',room:room.id,player:playerPublic(p)},playerId);
  return {room,p,resumed:false};
}
function getBound(ws){
  const room=rooms.get(ws.raceRoom); if(!room) return {};
  const player=room.players.get(ws.racePlayerId); return {room,player};
}
function finishAuthoritative(room, player, reason='finish'){
  if(room.winnerId || player.finishedAt) return;
  if(!raceAcceptingInput(room)) return;
  if(player.height < GOAL) return;
  player.finishedAt = now();
  room.winnerId=player.playerId; room.finishedAt=player.finishedAt; room.paused=false;
  broadcast(room,{type:'race:result',room:room.id,winnerId:room.winnerId,finishedAt:room.finishedAt,goal:GOAL,reason});
}
function expireReconnect(roomId, playerId){
  const room=rooms.get(roomId); if(!room) return;
  const player=room.players.get(playerId); if(!player || player.connected) return;
  room.players.delete(playerId);
  if(quickWaiting===room && room.players.size===0) quickWaiting=null;
  if(!room.winnerId && room.startedAt){
    const survivor=[...room.players.values()].find(p=>p.connected);
    if(survivor){
      room.winnerId=survivor.playerId; room.finishedAt=now(); room.paused=false;
      broadcast(room,{type:'race:result',room:room.id,winnerId:room.winnerId,finishedAt:room.finishedAt,goal:GOAL,reason:'opponent_disconnect'});
    }
  }else{
    broadcast(room,{type:'race:opponentLeft',room:room.id,playerId});
  }
  if(room.players.size===0) rooms.delete(room.id);
}
function markDisconnected(ws){
  const {room,player}=getBound(ws); if(!room || !player || player.ws!==ws || !player.connected) return;
  player.connected=false; player.ws=null; player.disconnectedAt=now(); player.reconnectDeadline=player.disconnectedAt+RECONNECT_GRACE_MS;
  if(room.winnerId){
    if(room.players.size===0) rooms.delete(room.id);
    return;
  }
  room.paused=!!room.startedAt;
  broadcast(room,{type:'race:opponentDisconnected',room:room.id,playerId:player.playerId,reconnectDeadline:player.reconnectDeadline,graceMs:RECONNECT_GRACE_MS});
  player.reconnectTimer=setTimeout(()=>expireReconnect(room.id,player.playerId),RECONNECT_GRACE_MS+50);
  if(player.reconnectTimer.unref) player.reconnectTimer.unref();
}

const server=http.createServer((req,res)=>{
  if(req.url==='/health'){
    res.writeHead(200,{'content-type':'application/json'});
    return res.end(JSON.stringify({ok:true,service:'sky-puff-race',rooms:rooms.size,time:now(),reconnectGraceMs:RECONNECT_GRACE_MS}));
  }
  res.writeHead(200,{'content-type':'text/plain'}); res.end('Sky Puff Race server');
});

const wss=new WebSocketServer({server,maxPayload:16*1024});
wss.on('connection', ws=>{
  ws.isAlive=true; ws.on('pong',()=>ws.isAlive=true);
  ws.on('message', raw=>{
    let m; try{m=JSON.parse(raw.toString())}catch{return;}
    if(!m || typeof m.type!=='string') return;

    if(m.type==='race:hello'){
      if(ws.raceRoom) return;
      const playerId=String(m.playerId||'').slice(0,40);
      if(!playerId) return safeJson(ws,{type:'race:error',code:'invalid_player'});
      const joined=joinBoundRoom(ws,m.room,playerId);
      if(joined.error) safeJson(ws,{type:'race:error',code:joined.error});
      return;
    }

    const {room,player}=getBound(ws); if(!room || !player || player.ws!==ws) return;

    if(m.type==='race:ready'){
      player.ready=true; player.pufflingId=String(m.pufflingId||'').slice(0,64)||null;
      broadcast(room,{type:'race:ready',room:room.id,playerId:player.playerId,pufflingId:player.pufflingId,ready:true},player.playerId);
      maybeStart(room); return;
    }

    if(m.type==='race:position'){
      if(!raceAcceptingInput(room)) return rejectInactive(ws,room);
      const t=now();
      if(t-player.lastPositionAt < (1000/MAX_POSITION_HZ)) return;
      player.lastPositionAt=t;
      const height=Math.max(0,Math.min(GOAL+100,Number(m.height)||0));
      const x=Math.max(-10000,Math.min(10000,Number(m.x)||0));
      if(height < player.height-120) player.height=height; else player.height=Math.max(player.height,height);
      player.x=x;
      broadcast(room,{type:'race:position',room:room.id,playerId:player.playerId,t,x:player.x,height:player.height,state:String(m.state||'jumping').slice(0,20),pufflingId:String(m.pufflingId||player.pufflingId||'').slice(0,64)||null},player.playerId);
      finishAuthoritative(room,player); return;
    }

    if(m.type==='race:attack'){
      const t=now();
      if(!raceAcceptingInput(room,t)) return rejectInactive(ws,room);
      if(room.winnerId) return;
      if(player.attacksUsed>=MAX_ATTACKS) return safeJson(ws,{type:'race:attackRejected',reason:'empty',remaining:0});
      if(t-player.lastAttackAt<ATTACK_COOLDOWN_MS) return safeJson(ws,{type:'race:attackRejected',reason:'cooldown',cooldownLeft:ATTACK_COOLDOWN_MS-(t-player.lastAttackAt),remaining:MAX_ATTACKS-player.attacksUsed});
      player.lastAttackAt=t; player.attacksUsed++;
      const ability=(m.ability&&typeof m.ability==='object')?m.ability:{};
      broadcast(room,{type:'race:attack',room:room.id,playerId:player.playerId,t,ability:{id:String(ability.id||m.abilityId||'').slice(0,40),type:String(ability.type||'').slice(0,24),duration:Math.max(200,Math.min(4000,Number(ability.duration)||1000)),strength:Math.max(0,Math.min(1,Number(ability.strength)||0.25))},remaining:MAX_ATTACKS-player.attacksUsed},player.playerId);
      return;
    }

    if(m.type==='race:finish'){
      if(!raceAcceptingInput(room)) return rejectInactive(ws,room);
      finishAuthoritative(room,player); return;
    }
  });
  ws.on('close',()=>markDisconnected(ws));
  ws.on('error',()=>markDisconnected(ws));
});

const heartbeat=setInterval(()=>{
  for(const ws of wss.clients){
    if(ws.isAlive===false){ ws.terminate(); continue; }
    ws.isAlive=false; try{ws.ping()}catch{}
  }
  const cutoff=now()-15*60*1000;
  for(const [id,room] of rooms) if(room.players.size===0 || (room.finishedAt&&room.finishedAt<cutoff)) rooms.delete(id);
},30000);
heartbeat.unref();

server.listen(PORT,'0.0.0.0',()=>console.log(`Sky Puff Race server listening on ${PORT}`));
