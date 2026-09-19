/* Orbuff — desktop keyboard/gamepad controls v1.0 */
(function(){
  const DEADZONE=.22;
  const DRIVE_DISTANCE=260;
  const NAV_REPEAT_MS=180;
  const keyState={left:false,right:false};
  const previousButtons=[];
  let driveWasActive=false;
  let lastNavAt=0;
  let lastAxisNav=0;

  const COPY={
    no:'PC: A/D eller ←/→ • Space: Rainbow Boost • Esc/P: Pause',
    en:'PC: A/D or ←/→ • Space: Rainbow Boost • Esc/P: Pause',
    de:'PC: A/D oder ←/→ • Leertaste: Rainbow Boost • Esc/P: Pause',
    es:'PC: A/D o ←/→ • Espacio: Rainbow Boost • Esc/P: Pausa',
    fr:'PC : A/D ou ←/→ • Espace : Rainbow Boost • Esc/P : Pause'
  };

  function currentLanguage(){
    try{return typeof lang==='string'?lang:(localStorage.getItem('skyPuffLang')||'en')}catch(e){return 'en'}
  }
  function editableTarget(target){
    if(!target)return false;
    const tag=(target.tagName||'').toLowerCase();
    return tag==='input'||tag==='textarea'||tag==='select'||target.isContentEditable;
  }
  function isVisible(el){
    if(!el||el.disabled)return false;
    const s=getComputedStyle(el);
    if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false;
    const r=el.getBoundingClientRect();
    return r.width>0&&r.height>0;
  }
  function gameplayActive(){
    try{return !!running&&!paused}catch(e){return false}
  }
  function pausedGame(){
    try{return !!running&&!!paused}catch(e){return false}
  }
  function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
  function visibleOverlays(){
    return [...document.querySelectorAll('.overlay')].filter(isVisible);
  }
  function focusables(){
    const overlays=visibleOverlays();
    let root=document;
    if(overlays.length){
      const all=[...document.querySelectorAll('.overlay')];
      overlays.sort((a,b)=>{
        const za=parseInt(getComputedStyle(a).zIndex,10)||0;
        const zb=parseInt(getComputedStyle(b).zIndex,10)||0;
        if(za!==zb)return za-zb;
        return all.indexOf(a)-all.indexOf(b);
      });
      root=overlays[overlays.length-1];
    }
    return [...root.querySelectorAll('button,input,select,[tabindex]:not([tabindex="-1"])')].filter(isVisible);
  }
  function navigateFocus(delta){
    const items=focusables();
    if(!items.length)return;
    const active=document.activeElement;
    let index=items.indexOf(active);
    if(index<0)index=delta>0?-1:0;
    index=(index+delta+items.length)%items.length;
    items[index].focus({preventScroll:false});
  }
  function activateFocused(){
    const active=document.activeElement;
    if(active&&isVisible(active)&&typeof active.click==='function'&&!editableTarget(active)){active.click();return;}
    const items=focusables();
    if(items[0])items[0].focus({preventScroll:false});
  }
  function backAction(){
    if(pausedGame()){
      try{resumeGame();return}catch(e){}
    }
    if(gameplayActive()){
      try{pauseGame();return}catch(e){}
    }
    const hub=document.getElementById('spMenuHub');
    if(isVisible(hub)&&window.SkyPuffMenuCleanup?.closeHub){window.SkyPuffMenuCleanup.closeHub();return;}
    const overlays=visibleOverlays().filter(el=>el.id!=='start');
    if(!overlays.length)return;
    const overlay=overlays[overlays.length-1];
    if(overlay.id==='gameOver'){
      document.getElementById('menuBtn')?.click();
      return;
    }
    const back=[...overlay.querySelectorAll('button')].find(btn=>{
      const id=btn.id||'';
      const text=(btn.textContent||'').trim().toLowerCase();
      return /^close/i.test(id)||/back$/i.test(id)||id==='spHubBack'||['tilbake','back','zurück','volver','retour'].includes(text);
    });
    if(back)back.click();
  }
  function togglePause(){
    if(pausedGame()){try{resumeGame()}catch(e){};return;}
    if(gameplayActive()){try{pauseGame()}catch(e){}}
  }
  function boost(){
    if(!gameplayActive())return;
    try{doBoost()}catch(e){}
  }
  function shouldUseDesktopHint(){
    try{return !!window.skyPuffPlatform?.desktop||matchMedia('(pointer:fine)').matches||[...navigator.getGamepads?.()||[]].some(Boolean)}catch(e){return false}
  }
  function ensureHint(){
    let hint=document.getElementById('orbuffPcControlHint');
    if(!hint){
      const card=document.querySelector('#start .card');
      if(!card)return;
      hint=document.createElement('div');
      hint.id='orbuffPcControlHint';
      hint.className='small';
      hint.style.cssText='margin-top:8px;font-size:10px;line-height:1.35;opacity:.72';
      card.appendChild(hint);
    }
    hint.textContent=COPY[currentLanguage()]||COPY.en;
    hint.style.display=shouldUseDesktopHint()?'block':'none';
  }
  function ensureFocusStyle(){
    if(document.getElementById('orbuffPcFocusCss'))return;
    const style=document.createElement('style');
    style.id='orbuffPcFocusCss';
    style.textContent='button:focus-visible,input:focus-visible,select:focus-visible,[tabindex]:focus-visible{outline:3px solid #fff!important;outline-offset:3px!important;box-shadow:0 0 0 6px rgba(71,137,255,.45)!important}';
    document.head.appendChild(style);
  }

  addEventListener('keydown',event=>{
    if(editableTarget(event.target)){
      if(event.key==='Escape'){event.target.blur();event.preventDefault();}
      return;
    }
    switch(event.code){
      case 'KeyA':
      case 'ArrowLeft':
        if(gameplayActive()){keyState.left=true;event.preventDefault();}
        else if(!event.repeat){navigateFocus(-1);event.preventDefault();}
        break;
      case 'KeyD':
      case 'ArrowRight':
        if(gameplayActive()){keyState.right=true;event.preventDefault();}
        else if(!event.repeat){navigateFocus(1);event.preventDefault();}
        break;
      case 'ArrowUp':
        if(!gameplayActive()&&!event.repeat){navigateFocus(-1);event.preventDefault();}
        break;
      case 'ArrowDown':
        if(!gameplayActive()&&!event.repeat){navigateFocus(1);event.preventDefault();}
        break;
      case 'Space':
        if(gameplayActive()&&!event.repeat){boost();event.preventDefault();}
        else if(!event.repeat){activateFocused();event.preventDefault();}
        break;
      case 'Escape':
        if(!event.repeat){backAction();event.preventDefault();}
        break;
      case 'KeyP':
        if(!event.repeat){togglePause();event.preventDefault();}
        break;
    }
  });
  addEventListener('keyup',event=>{
    if(event.code==='KeyA'||event.code==='ArrowLeft')keyState.left=false;
    if(event.code==='KeyD'||event.code==='ArrowRight')keyState.right=false;
  });
  addEventListener('blur',()=>{keyState.left=false;keyState.right=false;driveWasActive=false;});
  addEventListener('gamepadconnected',()=>{ensureHint();try{showToast('Controller connected 🎮')}catch(e){}});
  addEventListener('gamepaddisconnected',ensureHint);

  function pressedEdge(pad,index){
    const now=!!pad?.buttons?.[index]?.pressed;
    const prev=!!previousButtons[index];
    previousButtons[index]=now;
    return now&&!prev;
  }
  function pollGamepad(){
    const pads=navigator.getGamepads?.()||[];
    const pad=[...pads].find(Boolean);
    const inGame=gameplayActive();
    let padDir=0;

    if(pad){
      const axis=Number(pad.axes?.[0]||0);
      if(Math.abs(axis)>=DEADZONE)padDir=axis;
      if(pad.buttons?.[14]?.pressed)padDir=-1;
      if(pad.buttons?.[15]?.pressed)padDir=1;

      if(pressedEdge(pad,0)){inGame?boost():activateFocused();}
      if(pressedEdge(pad,1))backAction();
      if(pressedEdge(pad,9))togglePause();

      const now=performance.now();
      if(!inGame){
        let nav=0;
        if(pad.buttons?.[12]?.pressed||pad.buttons?.[14]?.pressed)nav=-1;
        if(pad.buttons?.[13]?.pressed||pad.buttons?.[15]?.pressed)nav=1;
        if(!nav&&Math.abs(axis)>=.65)nav=axis<0?-1:1;
        if(nav&&(nav!==lastAxisNav||now-lastNavAt>=NAV_REPEAT_MS)){
          navigateFocus(nav);
          lastNavAt=now;
          lastAxisNav=nav;
        }
        if(!nav)lastAxisNav=0;
      }
    }else{
      for(let i=0;i<previousButtons.length;i++)previousButtons[i]=false;
    }

    if(inGame){
      const keyboardDir=(keyState.right?1:0)-(keyState.left?1:0);
      const dir=keyboardDir||padDir;
      if(Math.abs(dir)>.05){
        try{pointerX=clamp(player.x+dir*DRIVE_DISTANCE,0,W);driveWasActive=true}catch(e){}
      }else if(driveWasActive){
        try{pointerX=player.x}catch(e){}
        driveWasActive=false;
      }
    }else{
      driveWasActive=false;
    }
    requestAnimationFrame(pollGamepad);
  }

  ensureFocusStyle();
  ensureHint();
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(ensureHint,0));
  setTimeout(ensureHint,700);
  requestAnimationFrame(pollGamepad);

  window.OrbuffDesktopControls={
    navigateFocus,
    activateFocused,
    backAction,
    boost,
    gamepadSupported:()=>typeof navigator.getGamepads==='function'
  };
})();
