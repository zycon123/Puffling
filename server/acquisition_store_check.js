const assert=require('assert');const mod=require('./acquisition_store');
for(const id of ['NONE','ember','volt','frost','wind','prism','nova','supernova','phoenix'])assert.equal(mod.validReward('boss',id),true,`expected boss reward ${id}`);
for(const id of ['starterpuff','admin','../../../x','phoenix2',''])assert.equal(mod.validReward('boss',id),false,`unexpected boss reward ${id}`);
assert.equal(mod.validReward('trade','ember'),false,'acquisition source must fail closed');
console.log('acquisition store allowlist checks passed');