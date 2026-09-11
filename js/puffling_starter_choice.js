/* Puffling — first Puffling starter choice v1.1 */
(function(){
 const KEY='skyPuffStarterChoiceV1';
 const IDS=['starterpuff','starterspark','starterdrop'];
 const COPY={
  no:{title:'Velg din første Puffling',sub:'Velg én starter-Puffling. Alle tre er enkle og klart svakere enn Pufflings du kan finne senere.',choose:'VELG',common:'COMMON • STARTER',weak:'Lav styrke',picked:'Din første Puffling er klar!'},
  en:{title:'Choose your first Puffling',sub:'Choose one starter Puffling. All three are simple and clearly weaker than Pufflings you can find later.',choose:'CHOOSE',common:'COMMON • STARTER',weak:'Low power',picked:'Your first Puffling is ready!'},
  de:{title:'Wähle deinen ersten Puffling',sub:'Wähle einen Starter-Puffling. Alle drei sind einfach und deutlich schwächer als spätere Pufflings.',choose:'WÄHLEN',common:'COMMON • STARTER',weak:'Geringe Stärke',picked:'Dein erster Puffling ist bereit!'},
  es:{title:'Elige tu primer Puffling',sub:'Elige un Puffling inicial. Los tres son simples y claramente más débiles que los Pufflings que encontrarás después.',choose:'ELEGIR',common:'COMMON • STARTER',weak:'Poca fuerza',picked:'¡Tu primer Puffling está listo!'},
  fr:{title:'Choisissez votre premier Puffling',sub:'Choisissez un Puffling de départ. Tous les trois sont simples et nettement plus faibles que les Pufflings trouvés plus tard.',choose:'CHOISIR',common:'COMMON • STARTER',weak:'Faible puissance',picked:'Votre premier Puffling est prêt !'}
 };
 function tr(){try{return COPY[typeof lang==='string'?lang:'no']||COPY.en}catch(e){return COPY.en}}
 function F(){return window.SkyPuffFusion}
 function state(){return F()?.load?.()||{owned:{}}}
 function ownsAny(){return Object.values(state().owned||{}).some(n=>Number(n)>0)}
 function ownedStarter(){const owned=state().owned||{};return IDS.find(id=>Number(owned[id])>0)||''}
 function storedChoice(){try{const id=localStorage.getItem(KEY)||'';return IDS.includes(id)?id:''}catch(e){return ''}}
 function chosen(){
  const owned=ownedStarter(),stored=storedChoice();
  if(stored&&stored===owned)return stored;
  if(owned){try{localStorage.setItem(KEY,owned)}catch(e){}return owned;}
  if(stored){try{localStorage.removeItem(KEY)}catch(e){}}
  return '';
 }
 function puff(id){return F()?.BASE?.[id]||null}
 function eligible(){return !chosen()}
 function ensure(){
  let root=document.getElementById('starterPufflingChoice');if(root)return root;
  root=document.createElement('div');root.id='starterPufflingChoice';root.className='overlay';root.style.cssText='display:none;z-index:120;align-items:flex-start;overflow:auto;padding:max(12px,env(safe-area-inset-top)) 10px max(12px,env(safe-area-inset-bottom))';
  root.innerHTML='<div class="card" style="width:min(94vw,560px);margin:auto;padding:20px 16px"><div style="font-size:48px">☁️✨💧</div><h1 id="starterChoiceTitle" style="font-size:clamp(28px,8vw,38px);margin:4px 0"></h1><div id="starterChoiceSub" class="small" style="max-width:470px;margin:0 auto 15px;line-height:1.45"></div><div id="starterChoiceGrid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px"></div></div>';
  document.body.appendChild(root);
  if(!document.getElementById('starterPufflingChoiceCss')){const s=document.createElement('style');s.id='starterPufflingChoiceCss';s.textContent='@media(max-width:500px){#starterChoiceGrid{grid-template-columns:1fr!important}#starterChoiceGrid button{min-height:112px!important}}';document.head.appendChild(s);}
  return root;
 }
 function render(){
  const t=tr(),root=ensure(),grid=document.getElementById('starterChoiceGrid');
  document.getElementById('starterChoiceTitle').textContent=t.title;document.getElementById('starterChoiceSub').textContent=t.sub;grid.innerHTML='';
  IDS.forEach(id=>{const p=puff(id);if(!p)return;const b=document.createElement('button');b.type='button';b.className='secondary';b.dataset.starterPuffling=id;b.setAttribute('aria-label',`${t.choose}: ${p.name}`);b.style.cssText='min-width:0;margin:0;padding:14px 8px;min-height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:2px solid rgba(80,160,210,.22);pointer-events:auto;touch-action:manipulation';b.innerHTML=`<span style="font-size:38px">${p.icon||'☁️'}</span><b style="font-size:15px">${p.name}</b><small style="font-weight:1000;opacity:.7">${t.common}</small><small style="opacity:.68">${t.weak}</small><span style="margin-top:5px;font-weight:1000">${t.choose}</span>`;b.onclick=()=>select(id);grid.appendChild(b);});
  root.style.display='flex';
 }
 function select(id){
  if(!IDS.includes(id)||!eligible())return false;const f=F(),p=puff(id);if(!f||!p)return false;
  f.add(id,1);const after=f.load();if(!(after.owned?.[id]>0))return false;
  try{localStorage.setItem(KEY,id)}catch(e){}
  window.SkyPuffPufflingGameplay?.setActive?.(id);window.SkyPuffFusionUI?.renderDex?.();window.SkyPuffRaceEligibility?.refresh?.();
  const root=ensure();root.style.display='none';
  if(typeof showToast==='function')showToast(`${tr().picked} ${p.icon||'☁️'} ${p.name}`);
  window.dispatchEvent(new CustomEvent('puffling:starterChosen',{detail:{id,puffling:p}}));return true;
 }
 function open(){if(eligible())render();return eligible()}
 function maybeShow(){if(!eligible())return;const start=document.getElementById('start');if(start?.inert){setTimeout(maybeShow,80);return;}render();}
 function guardPlay(event){
  if(!eligible())return;
  event?.preventDefault?.();event?.stopImmediatePropagation?.();
  try{if(typeof running!=='undefined')running=false;}catch(e){}
  const start=document.getElementById('start');if(start)start.style.display='flex';
  render();return false;
 }
 function bindGuards(){
  for(const id of ['playBtn','retryBtn']){const button=document.getElementById(id);if(button&&!button.dataset.starterGuard){button.dataset.starterGuard='1';button.addEventListener('click',guardPlay,true);}}
 }
 // The bundle is loaded after the menu markup, so create the modal and bind the
 // play guards immediately. This avoids a short first-load window where a fast
 // tap could start a run before the starter prompt's delayed reveal.
 ensure();bindGuards();
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{bindGuards();setTimeout(maybeShow,120)});else setTimeout(maybeShow,120);
 document.getElementById('languageSelect')?.addEventListener('change',()=>{if(ensure().style.display!=='none')render()});
 window.SkyPuffStarterChoice={IDS,ownsAny,ownedStarter,chosen,eligible,open,select,render,guardPlay,bindGuards};
})();
