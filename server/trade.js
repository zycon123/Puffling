const { WebSocket } = require('ws');

module.exports = function createTradeService(){
  const rooms=new Map();
  let nextTradeId=1;
  const STARTERS=new Set(['starterpuff','starterspark','starterdrop']);
  const now=()=>Date.now();
  const cleanRoom=v=>String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  const cleanId=v=>String(v||'').replace(/[^a-zA-Z0-9_+.-]/g,'').slice(0,64);
  const cleanPlayer=v=>String(v||'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,40);
  function send(ws,msg){if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(msg));}
  function broadcast(room,msg,except=null){for(const p of room.players.values())if(p.playerId!==except&&p.connected)send(p.ws,msg);}
  function snapshot(room){return [...room.players.values()].map(p=>({playerId:p.playerId,offer:p.offer,accepted:!!p.accepted,connected:!!p.connected}));}
  function state(room){broadcast(room,{type:'trade:state',room:room.id,players:snapshot(room)});}
  function createRoom(id){const room={id,players:new Map(),createdAt:now(),updatedAt:now(),pending:null};rooms.set(id,room);return room;}
  function resetAccept(room){room.pending=null;for(const p of room.players.values()){p.accepted=false;p.prepared=false;}room.updatedAt=now();}
  function hello(ws,m){
    const roomId=cleanRoom(m.room),playerId=cleanPlayer(m.playerId);
    if(roomId.length!==6||!playerId)return send(ws,{type:'trade:error',code:'invalid_room'});
    let room=rooms.get(roomId)||createRoom(roomId);
    if(room.players.has(playerId))return send(ws,{type:'trade:error',code:'player_exists'});
    if(room.players.size>=2)return send(ws,{type:'trade:error',code:'room_full'});
    const p={playerId,ws,connected:true,offer:null,accepted:false,prepared:false};
    room.players.set(playerId,p);room.updatedAt=now();ws.tradeRoom=room.id;ws.tradePlayerId=playerId;
    send(ws,{type:'trade:matched',room:room.id,players:snapshot(room)});
    broadcast(room,{type:'trade:opponentJoined',room:room.id,player:{playerId}},playerId);
    state(room);
  }
  function bound(ws){const room=rooms.get(ws.tradeRoom);if(!room)return{};const player=room.players.get(ws.tradePlayerId);return{room,player};}
  function startPrepare(room){
    if(room.pending||room.players.size!==2)return;
    const players=[...room.players.values()];if(!players.every(p=>p.accepted&&p.offer))return;
    const txId=`trade_${now().toString(36)}_${nextTradeId++}`;
    const transfers=players.map(p=>({from:p.playerId,to:players.find(x=>x.playerId!==p.playerId).playerId,pufflingId:p.offer.pufflingId}));
    room.pending={txId,prepared:new Set(),transfers,createdAt:now()};room.updatedAt=now();
    broadcast(room,{type:'trade:prepare',room:room.id,txId,transfers});
  }
  function abort(room,code){resetAccept(room);broadcast(room,{type:'trade:error',code,room:room.id});state(room);}
  function handle(ws,m){
    if(!m||typeof m.type!=='string'||!m.type.startsWith('trade:'))return false;
    if(m.type==='trade:hello'){hello(ws,m);return true;}
    const {room,player}=bound(ws);if(!room||!player||player.ws!==ws)return true;
    room.updatedAt=now();
    if(m.type==='trade:offer'){
      const id=cleanId(m.pufflingId),count=Math.max(0,Math.floor(Number(m.availableCount)||0));
      if(!id||count<1)return send(ws,{type:'trade:error',code:'missing_puffling'}),true;
      if(STARTERS.has(id))return send(ws,{type:'trade:error',code:'starter_locked'}),true;
      player.offer={pufflingId:id,availableCount:Math.min(9999,count)};resetAccept(room);state(room);return true;
    }
    if(m.type==='trade:accept'){
      if(room.players.size!==2||![...room.players.values()].every(p=>p.offer))return send(ws,{type:'trade:error',code:'offers_required'}),true;
      player.accepted=true;state(room);startPrepare(room);return true;
    }
    if(m.type==='trade:prepared'){
      const pending=room.pending;if(!pending||String(m.txId||'')!==pending.txId)return true;
      if(!m.ok)return abort(room,'inventory_changed'),true;
      pending.prepared.add(player.playerId);player.prepared=true;
      if(pending.prepared.size===2){
        const payload={type:'trade:commit',room:room.id,txId:pending.txId,transfers:pending.transfers,committedAt:now()};
        broadcast(room,payload);for(const p of room.players.values()){p.offer=null;p.accepted=false;p.prepared=false;}room.pending=null;room.updatedAt=now();state(room);
      }
      return true;
    }
    if(m.type==='trade:cancel'){
      player.offer=null;resetAccept(room);broadcast(room,{type:'trade:canceled',room:room.id,playerId:player.playerId});state(room);return true;
    }
    if(m.type==='trade:applyStatus'){
      if(m.ok===false)broadcast(room,{type:'trade:error',code:'client_apply_failed',playerId:player.playerId},player.playerId);
      return true;
    }
    return true;
  }
  function disconnect(ws){
    const {room,player}=bound(ws);if(!room||!player||player.ws!==ws)return;
    room.players.delete(player.playerId);room.pending=null;room.updatedAt=now();
    for(const p of room.players.values()){p.accepted=false;p.prepared=false;}
    broadcast(room,{type:'trade:opponentLeft',room:room.id,playerId:player.playerId});state(room);
    if(room.players.size===0)rooms.delete(room.id);
  }
  function cleanup(at=now()){
    const cutoff=at-30*60*1000;for(const [id,room] of rooms)if(room.players.size===0||room.updatedAt<cutoff)rooms.delete(id);
  }
  return {handle,disconnect,cleanup,stats:()=>({rooms:rooms.size})};
};
