/* Orbuff — player-facing rebrand with legacy Puffling/Sky Puff compatibility.
 * Internal save/API keys intentionally remain unchanged so existing beta progress survives the rename.
 */
(function(){
 const BRAND='Orbuff';
 const textRules=[
  [/PUFFLINGS/g,'ORBUFFS'],[/Pufflings/g,'Orbuffs'],[/pufflings/g,'orbuffs'],
  [/PUFFLING/g,'ORBUFF'],[/Puffling/g,'Orbuff'],[/puffling/g,'orbuff'],
  [/SKY PUFF/g,'ORBUFF'],[/Sky Puff/g,'Orbuff'],[/sky puff/g,'orbuff'],
  [/Sky Cosmetics/g,'Orbuff Cosmetics'],[/SKY COSMETICS/g,'ORBUFF COSMETICS'],
  [/Sky Treasure/g,'Orbuff Treasure'],[/SKY TREASURE/g,'ORBUFF TREASURE'],
  [/Sky Legend/g,'Orbuff Legend'],[/SKY LEGEND/g,'ORBUFF LEGEND'],
  [/Sky Immortal/g,'Orbuff Immortal'],[/SKY IMMORTAL/g,'ORBUFF IMMORTAL'],
  [/Steal My Puff(?!ling)/g,'Race My Orbuff'],[/STEAL MY PUFF(?!LING)/g,'RACE MY ORBUFF'],
  [/Puff down!/g,'Orbuff down!'],[/PUFF DOWN!/g,'ORBUFF DOWN!']
 ];
 function replaceText(s){let out=String(s??'');for(const [re,v] of textRules)out=out.replace(re,v);return out;}
 function cleanNode(root){
  if(!root)return;
  if(root.nodeType===3){const old=root.nodeValue,v=replaceText(old);if(v!==old)root.nodeValue=v;return;}
  if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const old=n.nodeValue,v=replaceText(old);if(v!==old)n.nodeValue=v;}
  if(root.querySelectorAll)root.querySelectorAll('[title],[aria-label],[placeholder],[alt]').forEach(el=>{for(const a of ['title','aria-label','placeholder','alt'])if(el.hasAttribute(a)){const old=el.getAttribute(a),v=replaceText(old);if(v!==old)el.setAttribute(a,v);}});
 }
 function apply(){
  document.title=BRAND;
  const splash=document.querySelector('.studioGame');if(splash)splash.textContent='ORBUFF';
  const main=document.querySelector('#start h1');if(main)main.textContent=BRAND;
  cleanNode(document.body);
 }
 let queued=false,pending=[];
 function flush(){queued=false;const nodes=pending;pending=[];for(const n of nodes)cleanNode(n);}
 // Only inspect newly inserted UI. Do not observe characterData: rewriting text while observing text mutations could create a feedback loop on some mobile browsers.
 const observer=new MutationObserver(list=>{for(const m of list)for(const n of m.addedNodes||[])pending.push(n);if(pending.length&&!queued){queued=true;requestAnimationFrame(flush);}});
 function start(){apply();observer.observe(document.body,{subtree:true,childList:true});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 const api={name:BRAND,legacyName:'Puffling',apply,replaceText};
 window.OrbuffBrand=api;
 // Backward-compatible alias for existing modules/tests that still reference PufflingBrand.
 window.PufflingBrand=api;
})();
