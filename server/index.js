const http = require('http');
const crypto = require('crypto');
const { WebSocketServer, WebSocket } = require('ws');
const createTradeService = require('./trade');
const createAccountAuth = require('./account_auth');

const PORT = Number(process.env.PORT || 10000);
const GOAL = 1500;
const MAX_ATTACKS = 3;
const ATTACK_COOLDOWN_MS = 4000;
const MAX_POSITION_HZ = 25;
const COUNTDOWN_MS = 4000;
const START_GRACE_MS = 120;
const RECONNECT_GRACE_MS = 12000;
const RESUME_COUNTDOWN_MS = 1500;
const COURSE_VERSION = 1;
const INTEGRITY_VERSION = 1;
const HEIGHT_RATE_LIMIT = 520;
const HEIGHT_BURST_LIMIT = 220;
const HEIGHT_START_ALLOWANCE = 260;
const X_RATE_LIMIT = 2400;
const X_BURST_LIMIT = 360;
const MAX_POSITION_VIOLATIONS = 12;
const rooms = new Map();
let quickWaiting = null;
let nextRaceId = 1;
const accountAuth = global.PufflingAccountAuth || createAccountAuth();
const rankedStore = global.PufflingRankedStore || null;
const tradeInventoryStore = global.PufflingTradeInventoryStore || null;
const trade = createTradeService({accountAuth,inventoryStore:tradeInventoryStore});

function now(){ return Date.now(); }
function safeJson(ws,msg){ if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(msg)); }
function cleanRoomId(v){ return String(v||'').toUpperCase().replace(/[^A-Z0-9_-]/g,'').slice(0,24); }
function cleanText(v,max=64){ return String(v||'').slice(0,max)||null; }
function cleanEvolution(v){ return Math.max(0,Math.min(2,Math.floor(Number(v)||0))); }
