/* Puffling — one-time legacy collection -> authoritative Trade inventory */
(function(){
 const MIGRATION_KEY='pufflingTradeInventoryMigrationV1';
 function endpoint(){try{return localStorage.getItem('skyPuffRaceWsUrl')||window.SKY_PUFF_RACE_WS_URL||'';}catch(e){return window.SKY_PUFF_RACE_WS_URL||'';}}
 function apiBase(){try{const u=new URL(endpoint());u.protocol=u.protocol==='wss:'?'https:':'http:';u.pathname='';u.search='';u.hash='';return u.origin;}catch(e){return '';}}
 function token(){try{return String(localStorage.getItem('pufflingAccountAuthToken')||'');}catch(e){return '';}}
 function localSnapshot(){const f=window.SkyPuffFusion,s=f?.load?.();if(!s)return{owned:{},vault:[]};const allowed=new Set([...Object.keys(f.BASE||{}),...Object.values(f.FUSIONS||{}).map(x=>x.id)]);const owned={};for(const [id,n] of Object.entries(s.owned||{})){const q=Math.max(0,Math.floor(Number(n)||0));if(allowed.has(id)&&q>0)owned[id]=q;}const vault=[...new Set((s.vault||[]).filter(id=>allowed.has(id)&&(owned[id]||0)>0))].slice(0,3);return{owned,vault};}
 async function request(path,options={}){const base=apiBase(),auth=token();if(!base||!auth)throw new Error('trade_inventory_auth_missing');const r=await fetch(base+path,{...options,headers:{accept:'application/json',authorization:`Bearer ${auth}`,'content-type':'application/json',...(options.headers||{})}});let b={};try{b=await r.json();}catch(e){}if(!r.ok){const err=new Error(b?.error||`http_${r.status}`);err.status=r.status;throw err;}return b;}
 async function ensure(){if(!window.PufflingTrade?.ensureIdentity)throw new Error('trade_identity_unavailable');await window.PufflingTrade.ensureIdentity();let migrated=false;try{migrated=localStorage.getItem(MIGRATION_KEY)==='1';}catch(e){}if(!migrated){try{await request('/api/trade/inventory/migrate',{method:'POST',body:JSON.stringify(localSnapshot())});}catch(e){if(e.status!==409)throw e;}try{localStorage.setItem(MIGRATION_KEY,'1');}catch(e){}}
 return request('/api/trade/inventory',{method:'GET'});}
 function fail(){const e=document.getElementById('tradeStatus');if(e){e.textContent='Kunne ikke synkronisere Puffling-samlingen med serveren. Trade er stoppet for å beskytte inventory.';e.style.color='#a73535';}}
 function install(){const t=window.PufflingTrade;if(!t||t.__inventorySyncInstalled)return false;const original=t.connect.bind(t);t.connect=async function(code){const e=document.getElementById('tradeStatus');if(e)e.textContent='Synkroniserer sikker Puffling-samling…';try{await ensure();return original(code);}catch(err){fail();return false;}};t.ensureServerInventory=ensure;t.__inventorySyncInstalled=true;
  const create=document.getElementById('tradeCreateBtn'),join=document.getElementById('tradeJoinBtn'),input=document.getElementById('tradeJoinInput');
  if(create)create.onclick=()=>t.connect((()=>{const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let out='';for(let i=0;i<6;i++)out+=chars[Math.floor(Math.random()*chars.length)];return out;})());
  if(join)join.onclick=()=>{const code=String(input?.value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);if(code.length!==6){const e=document.getElementById('tradeStatus');if(e)e.textContent='Skriv inn en gyldig 6-tegns trade-kode.';return;}t.connect(code);};
  return true;}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,120));else setTimeout(install,120);
 window.PufflingTradeInventorySync={ensure,localSnapshot,install};
})();
