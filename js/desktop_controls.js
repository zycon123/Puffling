/* Orbuff — desktop keyboard/gamepad controls v2.0 */
(function(){
  const DEADZONE=.22;
  const DRIVE_DISTANCE=260;
  const NAV_REPEAT_MS=180;
  const STORAGE_KEY='orbuffPcControlsV1';
  const DEFAULTS={keys:{left:['KeyA','ArrowLeft'],right:['KeyD','ArrowRight'],boost:['Space'],attack:['KeyE'],pause:['KeyP']},buttons:{boost:0,pause:9}};
  const heldKeys=new Set();
  const allowedCode=code=>typeof code==='string'&&/^(Key[A-Z]|Digit[0-9]|Arrow(Left|Right|Up|Down)|Space|Shift(Left|Right)|Numpad[0-9]|Comma|Period|Slash|Semicolon|Quote|BracketLeft|BracketRight|Backslash|Minus|Equal)$/.test(code);
  function normalize(value){
    const result=JSON.parse(JSON.stringify(DEFAULTS));
    if(!value||value.version!==1)return result;
    const used=new Set();
    const candidate={};
    for(const action of Object.keys(DEFAULTS.keys)){
      const keys=value.keys?.[action];
      if(keys===undefined){
        // Saved config predates this action (e.g. Attack added later) — default
        // it in place instead of discarding the player's whole saved layout.
        const fallback=DEFAULTS.keys[action].filter(key=>!used.has(key));
        candidate[action]=fallback;fallback.forEach(key=>used.add(key));
        continue;
      }
      if(!Array.isArray(keys)||!keys.length||keys.length>2||keys.some(key=>!allowedCode(key)||used.has(key)))return result;
      if(new Set(keys).size!==keys.length)return result;
      candidate[action]=keys.slice();keys.forEach(key=>used.add(key));
    }
    result.keys=candidate;
    if([0,2,3,4,5,6,7].includes(value.buttons?.boost))result.buttons.boost=value.buttons.boost;
    if([8,9,10,11].includes(value.buttons?.pause))result.buttons.pause=value.buttons.pause;
    return result;
  }
  let config;
  try{config=normalize(JSON.parse(localStorage.getItem(STORAGE_KEY)))}catch(e){config=normalize(null)}
  let capture=null;
  let padIdentity='';
  function snapshot(){return JSON.parse(JSON.stringify(config))}
  function changed(){
    heldKeys.clear();
    let saved=true;
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,...config}))}catch(e){saved=false}
    ensureHint();
    window.dispatchEvent(new CustomEvent('orbuff:controls-changed',{detail:{saved}}));
    return {ok:true,saved};
  }
  function bindKey(action,slot,code){
    if(!Object.hasOwn(config.keys,action)||![0,1].includes(slot)||slot>config.keys[action].length||!allowedCode(code))return {ok:false,reason:'reserved'};
    if(Object.values(config.keys).some(keys=>keys.includes(code)))return {ok:false,reason:'conflict'};
    config.keys[action][slot]=code;
    return changed();
  }
  function bindButton(action,index){
    const allowed=action==='boost'?[0,2,3,4,5,6,7]:action==='pause'?[8,9,10,11]:[];
    if(!allowed.includes(index))return {ok:false,reason:'reserved'};
    config.buttons[action]=index;return changed();
  }
  function cancelCapture(){capture=null;window.dispatchEvent(new CustomEvent('orbuff:binding-cancelled'))}
  function beginCapture(action,slot){heldKeys.clear();capture={action,slot};}
  function keyLabel(code){return code.replace(/^Key|^Digit/,'').replace('ArrowLeft','←').replace('ArrowRight','→').replace('ArrowUp','↑').replace('ArrowDown','↓');}
  function bindingLabel(action){return config.keys[action].map(keyLabel).join(' / ')}
  function resetControls(){cancelCapture();config=normalize(null);return changed()}
  function settingsOpen(){return !!window.OrbuffPcSettings?.isOpen?.()}
  function getPad(){try{return [...(navigator.getGamepads?.()||[])].find(p=>p&&p.connected!==false)||null}catch(e){return null}}
  function buttonLabel(index){
    const ps=/playstation|dualsense|dualshock|054c/i.test(getPad()?.id||'');
    const names=ps?['✕','○','□','△','L1','R1','L2','R2','Create / Share','Options','L3','R3']:['A','B','X','Y','LB','RB','LT','RT','View','Menu','LS','RS'];
    return names[index]||`Button ${index}`;
  }
  const previousButtons=[];
  let driveWasActive=false;
  let lastNavAt=0;
  let lastAxisNav=0;

  const COPY={
    no:'PC: A/D eller ←/→ • Space: Rainbow Boost • E: Angrep • Esc/P: Pause',
    en:'PC: A/D or ←/→ • Space: Rainbow Boost • E: Attack • Esc/P: Pause',
    de:'PC: A/D oder ←/→ • Leertaste: Rainbow Boost • E: Angriff • Esc/P: Pause',
    es:'PC: A/D o ←/→ • Espacio: Rainbow Boost • E: Ataque • Esc/P: Pausa',
    fr:'PC : A/D ou ←/→ • Espace : Rainbow Boost • E : Attaque • Esc/P : Pause'
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
    try{return !!running&&!paused&&!settingsOpen()}catch(e){return false}
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
    if(active&&focusables().includes(active)&&typeof active.click==='function'&&!editableTarget(active)){active.click();return;}
    const items=focusables();
    if(items[0])items[0].focus({preventScroll:false});
  }
  function backAction(){
    heldKeys.clear();
    if(capture){cancelCapture();return;}
    if(settingsOpen()){window.OrbuffPcSettings.close();return;}
    const overlays=visibleOverlays().filter(el=>!['start','pauseMenu'].includes(el.id));
    overlays.sort((a,b)=>(parseInt(getComputedStyle(a).zIndex,10)||0)-(parseInt(getComputedStyle(b).zIndex,10)||0));
    const overlay=overlays.at(-1);
    if(overlay){
      if(overlay.id==='spMenuHub'){window.SkyPuffMenuCleanup?.closeHub?.();return;}
      if(overlay.id==='gameOver'){document.getElementById('menuBtn')?.click();return;}
      const back=[...overlay.querySelectorAll('button')].find(btn=>/^close/i.test(btn.id)||/back$/i.test(btn.id)||['tilbake','back','zurück','volver','retour'].includes((btn.textContent||'').trim().toLowerCase()));
      back?.click();return;
    }
    togglePause();
  }
  function togglePause(){
    heldKeys.clear();
    if(settingsOpen())return;
    if(isVisible(document.getElementById('resumeCountdown')))return;
    if(pausedGame()){try{resumeGame()}catch(e){};return;}
    if(gameplayActive()){try{pauseGame()}catch(e){}}
  }
  function boost(){
    if(!gameplayActive())return;
    try{doBoost()}catch(e){}
  }
  function attack(){
    if(!gameplayActive())return;
    try{window.SkyPuffRaceUI?.useAttack?.()}catch(e){}
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
    hint.textContent=(COPY[currentLanguage()]||COPY.en).replace(/A\/D (eller|or|oder|o|ou) ←\/→/,bindingLabel('left')+' · '+bindingLabel('right')).replace(/Space|Leertaste|Espacio|Espace/,bindingLabel('boost')).replace(/\bE\b/,bindingLabel('attack')).replace('Esc/P','Esc / '+bindingLabel('pause'));
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
    if(capture){
      event.preventDefault();event.stopImmediatePropagation();
      if(event.repeat)return;
      if(event.code==='Escape'){cancelCapture();return;}
      const result=event.ctrlKey||event.altKey||event.metaKey?{ok:false,reason:'reserved'}:bindKey(capture.action,capture.slot,event.code);
      if(result.ok)capture=null;
      window.dispatchEvent(new CustomEvent('orbuff:binding-result',{detail:result}));
      return;
    }
    if(event.defaultPrevented)return;
    if(event.code==='Tab'&&settingsOpen()){navigateFocus(event.shiftKey?-1:1);event.preventDefault();return;}
    if(editableTarget(event.target)){
      if(event.code==='Escape'){event.target.blur();event.preventDefault();backAction();}
      return;
    }
    if(event.altKey||event.ctrlKey||event.metaKey)return;
    if(event.code==='Escape'){if(!event.repeat)backAction();event.preventDefault();return;}
    if(gameplayActive()){
      const action=Object.keys(config.keys).find(name=>config.keys[name].includes(event.code));
      if(!action)return;
      event.preventDefault();heldKeys.add(event.code);
      if(!event.repeat&&action==='boost')boost();
      if(!event.repeat&&action==='attack')attack();
      if(!event.repeat&&action==='pause')togglePause();
      return;
    }
    // Menu controls stay available regardless of gameplay bindings.
    if(event.code==='Tab'&&visibleOverlays().length){navigateFocus(event.shiftKey?-1:1);event.preventDefault();return;}
    if(['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(event.code)){
      if(!event.repeat)navigateFocus(['ArrowLeft','ArrowUp'].includes(event.code)?-1:1);
      event.preventDefault();return;
    }
    if(['Enter','Space'].includes(event.code)){
      if(!event.repeat)activateFocused();event.preventDefault();event.stopImmediatePropagation();return;
    }
    if(config.keys.pause.includes(event.code)&&!event.repeat)togglePause();
  },true);
  addEventListener('keyup',event=>heldKeys.delete(event.code));
  function releaseInput(){heldKeys.clear();if(driveWasActive){try{pointerX=player.x}catch(e){}}driveWasActive=false;}
  addEventListener('blur',()=>{releaseInput();if(capture)cancelCapture();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseInput()});
  addEventListener('gamepadconnected',()=>{ensureHint();window.OrbuffPcSettings?.refresh?.()});
  addEventListener('gamepaddisconnected',()=>{releaseInput();previousButtons.length=0;ensureHint();window.OrbuffPcSettings?.refresh?.()});

  function pressedEdge(pad,index){
    const now=!!pad?.buttons?.[index]?.pressed;
    const prev=!!previousButtons[index];
    previousButtons[index]=now;
    return now&&!prev;
  }
  function pollGamepad(){
    const pad=getPad();
    const identity=pad?`${pad.index}:${pad.id}`:'';
    if(identity!==padIdentity){previousButtons.length=0;lastAxisNav=0;padIdentity=identity;}
    if(document.hidden){releaseInput();requestAnimationFrame(pollGamepad);return;}
    const inGame=gameplayActive();
    let padDir=0;

    if(pad&&pad.mapping==='standard'){
      const axis=Number(pad.axes?.[0]||0);
      if(Math.abs(axis)>=DEADZONE)padDir=axis;
      if(pad.buttons?.[14]?.pressed)padDir=-1;
      if(pad.buttons?.[15]?.pressed)padDir=1;

      const edges=Array.from(pad.buttons||[],(_,index)=>pressedEdge(pad,index));
      if(edges[1])backAction();
      else if(capture){/* Only Back may cancel keyboard capture. */}
      else if(inGame){
        if(edges[config.buttons.pause])togglePause();
        else if(edges[config.buttons.boost])boost();
      }else if(edges[0])activateFocused();
      else if(edges[config.buttons.pause])togglePause();

      const now=performance.now();
      if(!inGame&&!capture){
        let nav=0;
        if(pad.buttons?.[12]?.pressed||pad.buttons?.[14]?.pressed)nav=-1;
        if(pad.buttons?.[13]?.pressed||pad.buttons?.[15]?.pressed)nav=1;
        const yAxis=Number(pad.axes?.[1]||0);
        if(!nav&&Math.abs(yAxis)>=.65)nav=yAxis<0?-1:1;
        if(!nav&&Math.abs(axis)>=.65)nav=axis<0?-1:1;
        const focused=document.activeElement;
        let adjusted=false;
        if(nav&&editableTarget(focused)&&Math.abs(yAxis)<.65&&!pad.buttons?.[12]?.pressed&&!pad.buttons?.[13]?.pressed){
          if(nav!==lastAxisNav||now-lastNavAt>=NAV_REPEAT_MS){
            if(focused.type==='range'){focused.value=clamp(Number(focused.value)+nav*Number(focused.step||1),Number(focused.min||0),Number(focused.max||100));focused.dispatchEvent(new Event('input',{bubbles:true}));}
            else if(focused.tagName==='SELECT'){focused.selectedIndex=clamp(focused.selectedIndex+nav,0,focused.options.length-1);focused.dispatchEvent(new Event('change',{bubbles:true}));}
            lastNavAt=now;lastAxisNav=nav;
          }
          nav=0;adjusted=true;
        }
        if(nav&&(nav!==lastAxisNav||now-lastNavAt>=NAV_REPEAT_MS)){
          navigateFocus(nav);
          lastNavAt=now;
          lastAxisNav=nav;
        }
        if(!nav&&!adjusted)lastAxisNav=0;
      }
    }else{
      for(let i=0;i<previousButtons.length;i++)previousButtons[i]=false;
    }

    if(gameplayActive()){
      const keyboardDir=(config.keys.right.some(key=>heldKeys.has(key))?1:0)-(config.keys.left.some(key=>heldKeys.has(key))?1:0);
      const dir=keyboardDir||padDir;
      if(Math.abs(dir)>.05){
        try{pointerX=clamp(player.x+dir*DRIVE_DISTANCE,0,W);driveWasActive=true}catch(e){}
      }else if(driveWasActive){
        try{pointerX=player.x}catch(e){}
        driveWasActive=false;
      }
    }else{
      releaseInput();
    }
    requestAnimationFrame(pollGamepad);
  }

  ensureFocusStyle();
  ensureHint();
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(ensureHint,0));
  setTimeout(ensureHint,700);
  requestAnimationFrame(pollGamepad);

  window.OrbuffDesktopControls={
    snapshot,bindKey,bindButton,beginCapture,cancelCapture,resetControls,bindingLabel,buttonLabel,getPad,
    captureActive:()=>!!capture,
    navigateFocus,
    activateFocused,
    backAction,
    boost,
    attack,
    gamepadSupported:()=>typeof navigator.getGamepads==='function'
  };
})();
