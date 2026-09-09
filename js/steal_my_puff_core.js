/* Sky Puff — Steal My Puff multiplayer reward foundation v0.1
 * Server-authoritative hooks can replace local methods when backend is ready.
 */
(function(){
 const BOX=[
  {id:'coins100',label:'100 Coins',weight:40,type:'coins',amount:100},
  {id:'coins250',label:'250 Coins',weight:25,type:'coins',amount:250},
  {id:'fusionCrystal',label:'Fusion Crystal',weight:16,type:'item',amount:1},
  {id:'pufflingEgg',label:'Puffling Egg',weight:10,type:'egg',tier:'rare'},
  {id:'vaultShield',label:'Vault Shield',weight:6,type:'item',amount:1},
  {id:'legendaryEgg',label:'Legendary Egg',weight:3,type:'egg',tier:'legendary'}
 ];
 function mysteryBox(rng=Math.random){const total=BOX.reduce((n,x)=>n+x.weight,0);let roll=rng()*total;for(const x of BOX){roll-=x.weight;if(roll<0)return {...x};}return {...BOX[0]};}
 function stealablePufflings(state){const vault=new Set(state.vault||[]);return Object.entries(state.owned||{}).filter(([id,n])=>n>0&&!vault.has(id)).map(([id,n])=>({id,count:n}));}
 function stealLocal(winnerState,loserState,id){const allowed=stealablePufflings(loserState).some(x=>x.id===id);if(!allowed)return {ok:false,reason:'protected_or_missing'};loserState.owned[id]--;winnerState.owned[id]=(winnerState.owned[id]||0)+1;if(!winnerState.discovered.includes(id))winnerState.discovered.push(id);return {ok:true,id,winnerState,loserState};}
 function rewardChoices(loserState){return {mysteryBox:true,steal:stealablePufflings(loserState)};}
 window.SkyPuffSteal={BOX,mysteryBox,stealablePufflings,stealLocal,rewardChoices,requiresServerAuthority:true};
})();
