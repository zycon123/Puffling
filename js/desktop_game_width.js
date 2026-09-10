/* Puffling — desktop playfield width v1.0 */
(function(){
  const MAX_DESKTOP_WIDTH=620;
  function isNarrowDesktop(){
    const fine=typeof matchMedia==='function'&&matchMedia('(pointer:fine)').matches;
    const desktop=window.skyPuffPlatform?.desktop||fine;
    return !!desktop&&window.innerWidth>=900;
  }
  function apply(){
    const vw=Math.max(320,Math.floor(window.innerWidth||320));
    const vh=Math.max(480,Math.floor(window.innerHeight||480));
    const narrow=isNarrowDesktop();
    W=narrow?Math.min(vw,MAX_DESKTOP_WIDTH):vw;
    H=vh;
    dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(W*dpr);
    canvas.height=Math.round(H*dpr);
    canvas.style.width=W+'px';
    canvas.style.height=H+'px';
    canvas.style.marginLeft='auto';
    canvas.style.marginRight='auto';
    canvas.style.maxWidth='100vw';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    document.documentElement.style.setProperty('--puffling-playfield-width',W+'px');
    document.documentElement.dataset.playfield=narrow?'desktop-narrow':'full';
    try{if(typeof pointerX==='number')pointerX=Math.max(0,Math.min(W,pointerX));}catch(e){}
  }
  function toGameX(clientX){
    const r=canvas.getBoundingClientRect();
    const raw=Number(clientX)-r.left;
    const x=Number.isFinite(raw)?raw:W/2;
    return Math.max(0,Math.min(W,x));
  }
  let scheduled=false;
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply();});}
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('orientationchange',schedule,{passive:true});
  if(window.visualViewport)window.visualViewport.addEventListener('resize',schedule,{passive:true});
  apply();
  window.PufflingDesktopViewport={MAX_DESKTOP_WIDTH,isNarrowDesktop,apply,toGameX,width:()=>W};
})();
