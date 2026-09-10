/* Sky Puff — unique trait profiles for all Pufflings v1.1 */
(function(){
 const F=window.SkyPuffFusion;if(!F)return;
 const all=[...Object.values(F.BASE||{}),...Object.values(F.FUSIONS||{})];
 const rarityBase={common:0,rare:1,epic:2,legendary:3,mythic:4};
 function round(n,d=3){const p=10**d;return Math.round(n*p)/p;}
 function profileFor(p,index){
  const r=rarityBase[p.rarity]??0;
  const unique=index+1;
  if(p.starterOnly){
   const starterRank=Math.max(0,['starterpuff','starterspark','starterdrop'].indexOf(p.id));
   return {traitId:`starter-${p.id}`,traitName:`${p.name} Basics`,signatureIndex:unique,jumpScale:round(1+starterRank*.0004,4),boostRegen:round(starterRank*.0003,4),shotPower:round(.78+starterRank*.015,3),controlBonus:round(starterRank*.001,3),rescueChance:round(starterRank*.0005,4),raceStrength:round(.06+starterRank*.01,3),raceDuration:300+starterRank*25,raceCooldown:4400-starterRank*100};
  }
  return {
   traitId:`trait-${String(unique).padStart(3,'0')}-${p.id}`,
   traitName:`${p.name} Instinct`,
   signatureIndex:unique,
   jumpScale:round(1.002 + r*.004 + (unique%17)*.0007,4),
   boostRegen:round(.003 + r*.002 + (unique%13)*.0006,4),
   shotPower:round(1.01 + r*.025 + (unique%19)*.003,3),
   controlBonus:round(.005 + r*.006 + (unique%11)*.002,3),
   rescueChance:round(.002 + r*.004 + (unique%7)*.0015,4),
   raceStrength:round(.16 + r*.045 + (unique%23)*.006,3),
   raceDuration:520 + r*120 + unique*7,
   raceCooldown:Math.max(4000,5200-r*180-(unique%9)*70)
  };
 }
 all.forEach((p,index)=>{p.trait=profileFor(p,index);p.signatureTrait=p.trait.traitName;});
 function get(id){return all.find(p=>p.id===id)?.trait||null;}
 function allProfiles(){const out={};all.forEach(p=>{out[p.id]=p.trait;});return out;}
 window.SkyPuffUniqueTraits={get,allProfiles,count:all.length};
})();