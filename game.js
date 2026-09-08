(function(){
const parts=['js/dom_refs.js','js/part2.js','js/boss_multiplayer.js','js/music_bridge.js','js/leaderboard_submit.js','js/part5_1.js','js/part5_helpers.js','js/part5_2.js','js/part5_3.js','js/part5_4.js'];
let i=0;
function next(){
 if(i>=parts.length)return;
 const s=document.createElement('script');
 s.src=parts[i++];
 s.onload=next;
 s.onerror=()=>console.error('Kunne ikke laste',s.src);
 document.body.appendChild(s);
}
next();
})();
