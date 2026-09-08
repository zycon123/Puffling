(function(){
  const ua=navigator.userAgent||'';
  const platform={
    ios:/iPhone|iPad|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),
    android:/Android/i.test(ua),
    mobile:/Android|iPhone|iPad|iPod|Mobile/i.test(ua)||(navigator.maxTouchPoints||0)>1,
    touch:'ontouchstart' in window||(navigator.maxTouchPoints||0)>0
  };
  platform.desktop=!platform.mobile;

  let viewport=document.querySelector('meta[name="viewport"]');
  if(!viewport){viewport=document.createElement('meta');viewport.name='viewport';document.head.appendChild(viewport);}
  viewport.setAttribute('content','width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover');

  let theme=document.querySelector('meta[name="theme-color"]');
  if(!theme){theme=document.createElement('meta');theme.name='theme-color';document.head.appendChild(theme);}
  theme.setAttribute('content','#73c9f5');

  if(platform.ios){
    let capable=document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if(!capable){capable=document.createElement('meta');capable.name='apple-mobile-web-app-capable';document.head.appendChild(capable);}
    capable.content='yes';
    let status=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if(!status){status=document.createElement('meta');status.name='apple-mobile-web-app-status-bar-style';document.head.appendChild(status);}
    status.content='black-translucent';
  }

  const setViewportVars=()=>{
    const vv=window.visualViewport;
    const h=vv?vv.height:window.innerHeight;
    const w=vv?vv.width:window.innerWidth;
    document.documentElement.style.setProperty('--sky-vh',`${h}px`);
    document.documentElement.style.setProperty('--sky-vw',`${w}px`);
    document.documentElement.dataset.platform=platform.ios?'ios':platform.android?'android':'desktop';
  };
  setViewportVars();
  window.addEventListener('resize',setViewportVars,{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(setViewportVars,120),{passive:true});
  if(window.visualViewport){visualViewport.addEventListener('resize',setViewportVars,{passive:true});visualViewport.addEventListener('scroll',setViewportVars,{passive:true});}

  document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});
  document.addEventListener('gesturechange',e=>e.preventDefault(),{passive:false});
  document.addEventListener('gestureend',e=>e.preventDefault(),{passive:false});
  let lastTouchEnd=0;
  document.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTouchEnd<280&&e.target===document.body)e.preventDefault();lastTouchEnd=now;},{passive:false});

  window.skyPuffPlatform={...platform,userAgent:ua,viewport(){return{width:window.innerWidth,height:window.innerHeight,dpr:window.devicePixelRatio||1}}};
})();
