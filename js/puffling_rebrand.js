/* Puffling — player-facing rebrand layer. Internal save/API keys intentionally remain unchanged. */
(function(){
 const BRAND='Puffling';
 const textRules=[
  [/SKY PUFF/g,'PUFFLING'],[/Sky Puff/g,'Puffling'],[/sky puff/g,'puffling'],
  [/Sky Cosmetics/g,'Puffling Cosmetics'],[/SKY COSMETICS/g,'PUFFLING COSMETICS'],
  [/Sky Treasure/g,'Puffling Treasure'],[/SKY TREASURE/g,'PUFFLING TREASURE']
 ];
 function replaceText(s){let out=String(s??'');for(const [re,v] of textRules)out=out.replace(re,v);return out;}
 function cleanNode(root){
  if(!root)return;
  if(root.nodeType===3){const v=replaceText(root.nodeValue);if(v!==root.nodeValue)root.nodeValue=v;return;}
  if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
  if(root.nodeType===1){for(const a of ['title','aria-label','placeholder','alt']){if(root.hasAttribute?.(a)){const old=root.getAttribute(a),v=replaceText(old);if(v!==old)root.setAttribute(a,v);}}}
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const v=replaceText(n.nodeValue);if(v!==n.nodeValue)n.nodeValue=v;}
  if(root.querySelectorAll)root.querySelectorAll('[title],[aria-label],[placeholder],[alt]').forEach(el=>{for(const a of ['title','aria-label','placeholder','alt'])if(el.hasAttribute(a)){const old=el.getAttribute(a),v=replaceText(old);if(v!==old)el.setAttribute(a,v);}});
 }
 function apply(){document.title=BRAND;cleanNode(document.documentElement);const splash=document.querySelector('.studioGame');if(splash)splash.textContent='PUFFLING';const main=document.querySelector('#start h1');if(main)main.textContent=BRAND;const ver=document.querySelector('.menuVersion');if(ver)ver.innerHTML=replaceText(ver.innerHTML);}
 const observer=new MutationObserver(list=>{for(const m of list){if(m.type==='characterData')cleanNode(m.target);for(const n of m.addedNodes||[])cleanNode(n);}});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{apply();observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});});else{apply();observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});}
 setTimeout(apply,250);setTimeout(apply,1000);
 window.PufflingBrand={name:BRAND,apply,replaceText};
})();