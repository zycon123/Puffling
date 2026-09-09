/* Puffling — lightweight player-facing rebrand. Internal save/API keys intentionally remain unchanged. */
(function(){
 const BRAND='Puffling';
 const textRules=[
  [/SKY PUFF/g,'PUFFLING'],[/Sky Puff/g,'Puffling'],[/sky puff/g,'puffling'],
  [/Sky Cosmetics/g,'Puffling Cosmetics'],[/SKY COSMETICS/g,'PUFFLING COSMETICS'],
  [/Sky Treasure/g,'Puffling Treasure'],[/SKY TREASURE/g,'PUFFLING TREASURE'],
  [/Sky Legend/g,'Puffling Legend'],[/SKY LEGEND/g,'PUFFLING LEGEND'],
  [/Sky Immortal/g,'Puffling Immortal'],[/SKY IMMORTAL/g,'PUFFLING IMMORTAL'],
  [/Steal My Puff/g,'Steal My Puffling'],[/STEAL MY PUFF/g,'STEAL MY PUFFLING']
 ];
 function replaceText(s){let out=String(s??'');for(const [re,v] of textRules)out=out.replace(re,v);return out;}
 function cleanNode(root){
  if(!root)return;
  if(root.nodeType===3){const old=root.nodeValue,v=replaceText(old);if(v!==old)root.nodeValue=v;return;}
  if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const old=n.nodeValue,v=replaceText(old);if(v!==old)n.nodeValue=v;}
  if(root.querySelectorAll)root.querySelectorAll('[title],[aria-label],[placeholder],[alt]').forEach(el=>{for(const a of ['title','aria-label','placeholder','alt'])if(el.hasAttribute(a)){const old=el.getAttribute(a),v=replaceText(old);if(v!==old)el.setAttribute(a,v);}});
 }
 function apply(){document.title=BRAND;const splash=document.querySelector('.studioGame');if(splash)splash.textContent='PUFFLING';const main=document.querySelector('#start h1');if(main)main.textContent=BRAND;cleanNode(document.body);}
 let queued=false,pending=[];
 function flush(){queued=false;const nodes=pending;pending=[];for(const n of nodes)cleanNode(n);}
 // Only inspect newly inserted UI. Do not observe characterData: rewriting text while observing text mutations could create a feedback loop on some mobile browsers.
 const observer=new MutationObserver(list=>{for(const m of list)for(const n of m.addedNodes||[])pending.push(n);if(pending.length&&!queued){queued=true;requestAnimationFrame(flush);}});
 function start(){apply();observer.observe(document.body,{subtree:true,childList:true});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.PufflingBrand={name:BRAND,apply,replaceText};
})();