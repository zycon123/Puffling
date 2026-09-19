/* Orbuff — desktop keyboard/gamepad controls v2.0 */
(function(){
  const DEADZONE=.22;
  const DRIVE_DISTANCE=260;
  const NAV_REPEAT_MS=180;
  const BINDINGS_KEY='orbuffPcBindingsV1';
  const DEFAULT_BINDINGS=Object.freeze({
    keyboard:{left:'KeyA',right:'KeyD',boost:'Space',pause:'KeyP'},
    gamepad:{action:0,back:1,pause:9}
  });
  const keyState={left:false,right:false};
  const previousButtons=[];
  let driveWasActive=false;
  let lastNavAt=0;
  let lastAxisNav=0;

  function cloneDefaults(){return JSON.parse(JSON.stringify(DEFAULT_BINDINGS));}
  function sanitizeBindings(raw){
    const out=cloneDefaults();
    if(raw&&typeof raw==='object'){
      for(const key of ['left','right','boost','pause']){
        const value=String(raw.keyboard?.[key]||'').trim();
        if(/^[A-Za-z0-9]+$/.test(value))out.keyboard[key]=value;
      }
      for(const key of ['action','back','pause']){
        const value=Number(raw.gamepad?.[key]);
        if(Number.isInteger(value)&&value>=0&&value<=31)out.gamepad[key]=value;
      }
    }
    return out;
  }
  function loadBindings(){
    try{return sanitizeBindings(JSON.parse(localStorage.getItem(BINDINGS_KEY)||'null'));}catch(e){return cloneDefaults();}
  }
  let bindings=loadBindings();
  function persistBindings(){
    try{localStorage.setItem(BINDINGS_KEY,JSON.stringify(bindings));}catch(e){}
    window.dispatchEvent(new CustomEvent('orbuff:controls-changed',{detail:getBindings()}));
    ensureHint();
  }
  function getBindings(){return JSON.parse(JSON.stringify(bindings));}
  function setKeyboardBinding(action,code){
    if(!['left','right','boost','pause'].includes(action))return false;
    const value=String(code||'').trim();
    if(!/^[A-Za-z0-9]+$/.test(value))return false;
    bindings.keyboard[action]=value;
    keyState.left=false;keyState.right=false;
    persistBindings();
    return true;
  }
  function setGamepadBinding(action,index){
    if(!['action','back','pause'].includes(action))return false;
    const value=Number(index);
    if(!Number.isInteger(value)||value<0||value>31)return false;
    bindings.gamepad[action]=value;
    persistBindings();
    return true;
  }
  function resetBindings(){bindings=cloneDefaults();keyState.left=false;keyState.right=false;persistBindings();return getBindings();}

  const COPY={
    no:'PC: {left}/{right} • {boost}: Rainbow Boost • Esc/{pause}: Pause',
    en:'PC: {left}/{right} • {boost}: Rainbow Boost • Esc/{pause}: Pause',
    de:'PC: {left}/{right} • {boost}: Rainbow Boost • Esc/{pause}: Pause',
    es:'PC: {left}/{right} • {boost}: Rainbow Boost • Esc/{pause}: Pausa',
    fr:'PC : {left}/{right} • {boost} : Rainbow Boost • Esc/{pause} : Pause'
  };
  const KEY_LABELS={Space:'Space',ArrowLeft:'←',ArrowRight:'→',ArrowUp:'↑',ArrowDown:'↓',Escape:'Esc'};
  function keyLabel(code){return KEY_LABELS[code]||String(code||'').replace(/^Key/,'').replace(/^Digit/,'');}
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
  function gameplayActive(){try{return !!running&&!paused}catch(e){return false}}
  function pausedGame(){try{return !!running&&!!paused}catch(e){return false}}
  function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
  function visibleOverlays(){return [...document.querySelectorAll('.overlay')].filter(isVisible)}
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
    const items=focusables();if(!items.length)return;
    const active=document.activeElement;let index=items.indexOf(active);
    if(index<0)index=delta>0?-1:0;
    index=(index+delta+items.length)%items.length;
    items[index].focus({preventScroll:false});
  }
  function activateFocused(){
    const active=document.activeElement;
    if(active&&isVisible(active)&&typeof active.click==='function'&&!editableTarget(active)){active.click();return;}
    const items=focusables();if(items[0])items[0].focus({preventScroll:false});
  }
  function backAction(){
    if(pausedGame()){try{resumeGame();return}catch(e){}}
    if(gameplayActive()){try{pauseGame();return}catch(e){}}
    const hub=document.getElementById('spMenuHub');
    if(isVisible(hub)&&window.SkyPuffMenuCleanup?.closeHub){window.SkyPuffMenuCleanup.closeHub();return;}
    const overlays=visibleOverlays().filter(el=>el.id!=='start');
    if(!overlays.length)return;
    const overlay=overlays[overlays.length-1];
    if(overlay.id==='gameOver'){document.getElementById('menuBtn')?.click();return;}
    const back=[...overlay.querySelectorAll('button')].find(btn=>{
      const id=btn.id||'',text=(btn.textContent||'').trim().toLowerCase();
      return /^close/i.test(id)||/back$/i.test(id)||id==='spHubBack'||['tilbake','back','zurück','volver','retour'].includes(text);
    });
    if(back)back.click();
  }
  function togglePause(){
    if(pausedGame()){try{resumeGame()}catch(e){};return;}
    if(gameplayActive()){try{pauseGame()}catch(e){}}
  }
  function boost(){if(gameplayActive())try{doBoost()}catch(e){}}
  function shouldUseDesktopHint(){
    try{return !!window.skyPuffPlatform?.desktop||matchMedia('(pointer:fine)').matches||[...navigator.getGamepads?.()||[]].some(Boolean)}catch(e){return false}
  }
  function ensureHint(){
    let hint=document.getElementById('orbuffPcControlHint');
    if(!hint){
      const card=document.querySelector('#start .card');if(!card)return;
      hint=document.createElement('div');hint.id='orbuffPcControlHint';hint.className='small';
      hint.style.cssText='margin-top:8px;font-size:10px;line-height:1.35;opacity:.72';card.appendChild(hint);
    }
    const t=COPY[currentLanguage()]||COPY.en;
    hint.textContent=t.replace('{left}',keyLabel(bindings.keyboard.left)).replace('{right}',keyLabel(bindings.keyboard.right)).replace('{boost}',keyLabel(bindings.keyboard.boost)).replace('{pause}',keyLabel(bindings.keyboard.pause));
    hint.style.display=shouldUseDesktopHint()?'block':'none';
  }
  function ensureFocusStyle(){
    if(document.getElementById('orbuffPcFocusCss'))return;
    const style=document.createElement('style');style.id='orbuffPcFocusCss';
    style.textContent='button:focus-visible,input:focus-visible,select:focus-visible,[tabindex]:focus-visible{outline:3px solid #fff!important;outline-offset:3px!important;box-shadow:0 0 0 6px rgba(71,137,255,.45)!important}';
    document.head.appendChild(style);
  }
  function keyboardAction(code){
    if(code==='ArrowLeft'||code===bindings.keyboard.left)return 'left';
    if(code==='ArrowRight'||code===bindings.keyboard.right)return 'right';
    if(code===bindings.keyboard.boost)return 'boost';
    if(code===bindings.keyboard.pause)return 'pause';
    return '';
  }

  addEventListener('keydown',event=>{
    if(editableTarget(event.target)){
      if(event.key==='Escape'){event.target.blur();event.preventDefault();}
      return;
    }
    const action=keyboardAction(event.code);
    if(gameplayActive()){
      if(action==='left'){keyState.left=true;event.preventDefault();return;}
      if(action==='right'){keyState.right=true;event.preventDefault();return;}
      if(action==='boost'&&!event.repeat){boost();event.preventDefault();return;}
      if(action==='pause'&&!event.repeat){togglePause();event.preventDefault();return;}
    }
    if(event.code==='Escape'&&!event.repeat){backAction();event.preventDefault();return;}
    if(!gameplayActive()&&!event.repeat){
      if(event.code==='ArrowLeft'||event.code==='ArrowUp'){navigateFocus(-1);event.preventDefault();return;}
      if(event.code==='ArrowRight'||event.code==='ArrowDown'){navigateFocus(1);event.preventDefault();return;}
      if(event.code==='Space'||event.code==='Enter'){activateFocused();event.preventDefault();}
    }
  });
  addEventListener('keyup',event=>{
    if(event.code==='ArrowLeft'||event.code===bindings.keyboard.left)keyState.left=false;
    if(event.code==='ArrowRight'||event.code===bindings.keyboard.right)keyState.right=false;
  });
  addEventListener('blur',()=>{keyState.left=false;keyState.right=false;driveWasActive=false;});
  addEventListener('gamepadconnected',()=>{ensureHint();try{showToast('Controller connected 🎮')}catch(e){}});
  addEventListener('gamepaddisconnected',ensureHint);

  function pressedEdge(pad,index){
    const now=!!pad?.buttons?.[index]?.pressed,prev=!!previousButtons[index];
    previousButtons[index]=now;return now&&!prev;
  }
  function pollGamepad(){
    const pads=navigator.getGamepads?.()||[],pad=[...pads].find(Boolean);
    const inGame=gameplayActive();let padDir=0;
    if(pad){
      const axis=Number(pad.axes?.[0]||0);
      if(Math.abs(axis)>=DEADZONE)padDir=axis;
      if(pad.buttons?.[14]?.pressed)padDir=-1;
      if(pad.buttons?.[15]?.pressed)padDir=1;

      if(pressedEdge(pad,bindings.gamepad.action)){inGame?boost():activateFocused();}
      if(pressedEdge(pad,bindings.gamepad.back))backAction();
      if(pressedEdge(pad,bindings.gamepad.pause))togglePause();

      const now=performance.now();
      if(!inGame){
        let nav=0;
        if(pad.buttons?.[12]?.pressed||pad.buttons?.[14]?.pressed)nav=-1;
        if(pad.buttons?.[13]?.pressed||pad.buttons?.[15]?.pressed)nav=1;
        if(!nav&&Math.abs(axis)>=.65)nav=axis<0?-1:1;
        if(nav&&(nav!==lastAxisNav||now-lastNavAt>=NAV_REPEAT_MS)){navigateFocus(nav);lastNavAt=now;lastAxisNav=nav;}
        if(!nav)lastAxisNav=0;
      }
    }else for(let i=0;i<previousButtons.length;i++)previousButtons[i]=false;

    if(inGame){
      const keyboardDir=(keyState.right?1:0)-(keyState.left?1:0),dir=keyboardDir||padDir;
      if(Math.abs(dir)>.05){try{pointerX=clamp(player.x+dir*DRIVE_DISTANCE,0,W);driveWasActive=true}catch(e){}}
      else if(driveWasActive){try{pointerX=player.x}catch(e){}driveWasActive=false;}
    }else driveWasActive=false;
    requestAnimationFrame(pollGamepad);
  }

  ensureFocusStyle();ensureHint();
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(ensureHint,0));
  setTimeout(ensureHint,700);requestAnimationFrame(pollGamepad);

  window.OrbuffDesktopControls={
    navigateFocus,activateFocused,backAction,boost,
    gamepadSupported:()=>typeof navigator.getGamepads==='function',
    getBindings,setKeyboardBinding,setGamepadBinding,resetBindings,
    defaults:cloneDefaults,keyLabel
  };
})();
