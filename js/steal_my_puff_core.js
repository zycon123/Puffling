/* Sky Puff — Steal My Puff multiplayer reward foundation v0.2
 * Server-authoritative hooks can replace local methods when backend is ready.
 */
(function(){
 const BOX=[
  {id:'coins100',label:'100 Coins',weight:43,type:'coins',amount:100},
  {id:'coins250',label:'250 Coins',weight:27,type:'coins',amount:250},
  {id:'fusionCrystal',label:'Fusion Crystal',weight:17,type:'item',amount:1},
  {id:'pufflingEgg',label:'Puffling Egg',weight:10,type:'egg',tier:'rare'},
  {id:'legendaryEgg',label:'Legendary Egg',weight:3,type:'egg',tier:'legendary'}
 ];
 function mysteryBox(rng=Math.random){const total=BOX.reduce((n,x)=>n+x.weight,0);let roll=rng()*total;for(const x of BOX){roll-=x.weight;if(roll<0)return {...x};}return {...BOX[0]};}
 function protectedCount(state,id){return (Array.isArray(state?.vault)?state.vault:[]).filter(x=>x===id).length;}
 function stealablePufflings(state){return Object.entries(state?.owned||{}).map(([id,n])=>({id,count:Math.max(0,(+n||0)-protectedCount(state,id))})).filter(x=>x.count>0);}
 function stealLocal(winnerState,loserState,id){const allowed=stealablePufflings(loserState).some(x=>x.id===id&&x.count>0);if(!allowed)return {ok:false,reason:'protected_or_missing'};loserState.owned[id]--;winnerState.owned[id]=(winnerState.owned[id]||0)+1;if(!Array.isArray(winnerState.discovered))winnerState.discovered=[];if(!winnerState.discovered.includes(id))winnerState.discovered.push(id);return {ok:true,id,winnerState,loserState};}
 function rewardChoices(loserState){return {mysteryBox:true,steal:stealablePufflings(loserState)};}
 window.SkyPuffSteal={BOX,mysteryBox,stealablePufflings,stealLocal,rewardChoices,protectedCount,requiresServerAuthority:true};
})();