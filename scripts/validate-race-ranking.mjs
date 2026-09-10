import fs from 'node:fs';
import vm from 'node:vm';

const root=process.cwd();
const fail=m=>{throw new Error(m)};
const data=new Map();
const localStorage={getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
const listeners=new Map();
let lastConnectOpts=null;
const transport={
  connect:opts=>{lastConnectOpts=opts;return Promise.resolve({mode:'online'});},
  on:(type,fn)=>{listeners.set(type,fn);return()=>listeners.delete(type);},
  snapshot:()=>({playerId:'rank_test_me'})
};
const context={window:{},localStorage,console,setTimeout:fn=>{fn();return 1;},clearTimeout:()=>{},Date,Math};
context.window=context;context.SkyPuffRaceTransport=transport;context.globalThis=context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(`${root}/js/race_ranked.js`,'utf8'),context,{filename:'js/race_ranked.js'});

const R=context.SkyPuffQuickRank;
if(!R)fail('SkyPuffQuickRank API missing');
let p=R.profile();
if(p.rating!==1000||p.rank.name!=='Silver'||p.rank.division!=='III')fail(`Unexpected starting rank: ${p.rating} ${p.rank.label}`);
if(R.rankFor(1200).name!=='Gold'||R.rankFor(1600).name!=='Diamond'||R.rankFor(2000).name!=='Champion')fail('Rank thresholds are incorrect');

await transport.connect({room:'quickmatch'});
if(lastConnectOpts?.rankRating!==1000)fail('Race transport did not receive current MMR');

let r=R.recordResult({mode:'friend',authoritative:true,raceId:'friend_1',won:true,opponentRating:1000});
if(r.applied||R.profile().rating!==1000)fail('Friend race changed ranked MMR');
r=R.recordResult({mode:'quick',authoritative:false,raceId:'local_1',won:true,opponentRating:1000});
if(r.applied||R.profile().rating!==1000)fail('Local/test race changed ranked MMR');

r=R.recordResult({mode:'quick',authoritative:true,raceId:'quick_1',won:true,opponentRating:1000});
if(!r.applied||r.delta!==20||r.after.rating!==1020||r.after.wins!==1||r.after.streak!==1)fail('Equal-rating Quick Race win did not apply expected provisional MMR');
const duplicate=R.recordResult({mode:'quick',authoritative:true,raceId:'quick_1',won:true,opponentRating:1000});
if(duplicate.applied||R.profile().games!==1)fail('Duplicate authoritative Race result was counted twice');

r=R.recordResult({mode:'quick',authoritative:true,raceId:'quick_2',won:false,opponentRating:1200});
p=R.profile();
if(!r.applied||r.delta>=0||p.games!==2||p.wins!==1||p.losses!==1||p.streak!==0)fail('Ranked loss/stat tracking failed');
if(p.bestRating<1020)fail('Best MMR was not retained');

console.log('✅ Ranked Quick Race starts at 1000 MMR / Silver III');
console.log('✅ Friend/local races cannot change MMR');
console.log('✅ Authoritative wins/losses, duplicate protection and transport rating passed');
