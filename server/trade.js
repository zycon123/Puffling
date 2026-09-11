const { WebSocket } = require('ws');

module.exports = function createTradeService(opts={}){
  const rooms=new Map();
  let nextTradeId=1;
  const accountAuth=opts.accountAuth||null,inventoryStore=opts.inventoryStore||null;
  const STARTERS=new Set(['starterpuff','starterspark','starterdrop']);
  const now=()=>Date.now();
  const cleanRoom=v=>String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  const cleanId=v=>String(v||'').replace(/[^a-zA-Z0-9_+.-]/g,'').slice(0,64);
  const cleanPlayer=v=>String(v||'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,40);
  function send(ws,msg){if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(msg));}
  function broadcast(room,msg,except=null){for(const p of room.players.values())if(p.playerId!==except&&p.connected)send(p.ws,msg);}
  function snapshot(room){return [...room.players.values()].map(p=>({playerId:p.playerId,offer:p.offer,accepted:!!p.accepted,connected:!!p.connected}));}
  function state(room){broadcast(room,{type:'trade:state',room:room.id,players:snapshot(room)});}
  function createRoom(id){const room={id,players:new Map(),createdAt:now(),updatedAt:now(),settling:false};rooms.set(id,room);return room;}
  function resetAccept(room){for(const p of room.players.values())p.accepted=false;room.updatedAt=now();}
  function verifyToken(token){if(!accountAuth?.verify)return null;try{return accountAuth.verify(String(token||''));}catch{return null;}}
  function hello(ws,m){
    const roomId=cleanRoom(m.room),playerId=cleanPlayer(m.playerId),claims=verifyToken(m.authToken);
    if(roomId.length!==6||!playerId)return send(ws,{type:'trade:error',code:'invalid_room'});
    if(!claims?.sub)return send(ws,{type:'trade:error',code:'trade_auth_required'});
    if(!inventoryStore?.status?.().ready)return send(ws,{type:'trade:error',code:'trade_inventory_unavailable'});
    let room=rooms.get(roomId)||createRoom(roomId);
    if([...room.players.values()].some(p=>p.accountId===claims.sub))return send(ws,{type:'trade:error',code:'same_account'});
    if(room.players.has(playerId))return send(ws,{type:'trade:error',code:'player_exists'});
    if(room.players.size>=2)return send(ws,{type:'trade:error',code:'room_full'});
    const p={playerId,accountId:claims.sub,ws,connected:true,offer:null,accepted:false};
    room.players.set(playerId,p);room.updatedAt=now();ws.tradeRoom=room.id;ws.tradePlayerId=playerId;
    send(ws,{type:'trade:matched',room:room.id,players:snapshot(room),serverAuthoritativeInventory:true});
    broadcast(room,{type:'trade:opponentJoined',room:room.id,player:{playerId}},playerId);state(room);
  }
  function bound(ws){const room=rooms.get(ws.tradeRoom);if(!room)return{};const player=room.players.get(ws.tradePlayerId);return{room,player};}
  async function settle(room){
    if(room.settling||room.players.size!==2)return;
    const players=[...room.players.values()];if(!players.every(p=>p.accepted&&p.offer))return;
    room.settling=true;const a=players[0],b=players[1],txId=`trade_${now().toString(36)}_${nextTradeId++}`;
    try{
      const result=await inventoryStore.exchange({tradeId:txId,accountA:a.accountId,accountB:b.accountId,pufflingA:a.offer.pufflingId,pufflingB:b.offer.pufflingId});
      broadcast(room,{type:'trade:commit',room:room.id,txId,transfers:result.transfers||[{from:a.playerId,to:b.playerId,pufflingId:a.offer.pufflingId},{from:b.playerId,to:a.playerId,pufflingId:b.offer.pufflingId}],committedAt:now(),serverAuthoritative:true});
      for(const p of players){p.offer=null;p.accepted=false;}
    }catch(e){const code=String(e?.message||'trade_failed');broadcast(room,{type:'trade:error',code:['inventory_missing','trade_inventory_unavailable','trade_result_conflict'].includes(code)?code:'trade_failed',room:room.id});resetAccept(room);}
    finally{room.settling=false;room.updatedAt=now();state(room);}
  }
  function handle(ws,m){
    if(!m||typeof m.type!=='string'||!m.type.startsWith('trade:'))return false;
    if(m.type==='trade:hello'){hello(ws,m);return true;}
    const {room,player}=bound(ws);if(!room||!player||player.ws!==ws)return true;room.updatedAt=now();
    if(m.type==='trade:offer'){
      const id=cleanId(m.pufflingId);if(!id)return send(ws,{type:'trade:error',code:'missing_puffling'}),true;
      if(STARTERS.has(id))return send(ws,{type:'trade:error',code:'starter_locked'}),true;
      player.offer={pufflingId:id};resetAccept(room);state(room);return true;
    }
    if(m.type==='trade:accept'){
      if(room.players.size!==2||![...room.players.values()].every(p=>p.offer))return send(ws,{type:'trade:error',code:'offers_required'}),true;
      player.accepted=true;state(room);settle(room);return true;
    }
    if(m.type==='trade:cancel'){
      if(room.settling)return send(ws,{type:'trade:error',code:'trade_settling'}),true;
      player.offer=null;resetAccept(room);broadcast(room,{type:'trade:canceled',room:room.id,playerId:player.playerId});state(room);return true;
    }
    if(m.type==='trade:prepared'||m.type==='trade:applyStatus')return true;
    return true;
  }
  function disconnect(ws){
    const {room,player}=bound(ws);if(!room||!player||player.ws!==ws)return;room.players.delete(player.playerId);room.updatedAt=now();resetAccept(room);
    broadcast(room,{type:'trade:opponentLeft',room:room.id,playerId:player.playerId});state(room);if(room.players.size===0)rooms.delete(room.id);
  }
  function cleanup(at=now()){const cutoff=at-30*60*1000;for(const [id,room] of rooms)if(room.players.size===0||room.updatedAt<cutoff)rooms.delete(id);}
  return {handle,disconnect,cleanup,stats:()=>({rooms:rooms.size,serverAuthoritativeInventory:!!inventoryStore?.status?.().ready})};
};
