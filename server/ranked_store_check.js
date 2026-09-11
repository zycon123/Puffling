const assert=require('assert');
const createRankedStore=require('./ranked_store');
const store=createRankedStore({databaseUrl:''});

const evenWin=store.deltaFor(1000,1000,true,0);
const evenLoss=store.deltaFor(1000,1000,false,0);
assert(evenWin>0,'winner delta must be positive');
assert(evenLoss<0,'loser delta must be negative');
assert(Math.abs(evenWin)>=8&&Math.abs(evenWin)<=36,'winner delta bounds');
assert(Math.abs(evenLoss)>=8&&Math.abs(evenLoss)<=36,'loser delta bounds');
assert(store.deltaFor(1600,1000,true,20)>0,'favorite win remains positive');
assert(store.deltaFor(1000,1600,false,20)<0,'underdog loss remains negative');
assert.strictEqual(store.cleanAccountId(''),'', 'empty account rejected');
assert.strictEqual(store.cleanAccountId('bad account!'),'', 'unsafe account rejected');
assert.strictEqual(store.cleanRaceId('race_123'),'RACE_123');
console.log('ranked_store_check: ok');
