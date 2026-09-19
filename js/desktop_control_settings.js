/* Orbuff — desktop control settings + rebinding v1.0 */
(function(){
  const STORAGE_KEY='orbuffPcBindingsV1';
  const DEFAULTS=Object.freeze({
    keyboard:{left:'KeyA',right:'KeyD',boost:'Space',pause:'KeyP'},
    gamepad:{boost:0,back:1,pause:9}
  });
  const KEY_ACTIONS=['left','right','boost','pause'];
  const PAD_ACTIONS=['boost','back','pause'];
  const RESERVED_KEYS=new Set(['Escape','F11','Tab','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown']);
  const KEY_LABELS={
    Space:'SPACE',KeyA:'A',KeyB:'B',KeyC:'C',KeyD:'D',KeyE:'E',KeyF:'F',KeyG:'G',KeyH:'H',KeyI:'I',KeyJ:'J',KeyK:'K',KeyL:'L',KeyM:'M',
    KeyN:'N',KeyO:'O',KeyP:'P',KeyQ:'Q',KeyR:'R',KeyS:'S',KeyT:'T',KeyU:'U',KeyV:'V',KeyW:'W',KeyX:'X',KeyY:'Y',KeyZ:'Z',
    Digit0:'0',Digit1:'1',Digit2:'2',Digit3:'3',Digit4:'4',Digit5:'5',Digit6:'6',Digit7:'7',Digit8:'8',Digit9:'9',
    ShiftLeft:'L SHIFT',ShiftRight:'R SHIFT',ControlLeft:'L CTRL',ControlRight:'R CTRL',AltLeft:'L ALT',AltRight:'R ALT',
    Backquote:'~',Minus:'-',Equal:'=',BracketLeft:'[',BracketRight:']',Backslash:'\\',Semicolon:';',Quote:"'",Comma:',',Period:'.',Slash:'/'
  };
  const PAD_LABELS={0:'A / ✕',1:'B / ○',2:'X / □',3:'Y / △',4:'LB / L1',5:'RB / R1',6:'LT / L2',7:'RT / R2',8:'VIEW',9:'MENU / OPTIONS',10:'L3',11:'R3',12:'D-PAD ↑',13:'D-PAD ↓',14:'D-PAD ←',15:'D-PAD →'};
  const COPY={
    no:{menu:'KONTROLLER',title:'PC-kontroller',sub:'Endre tastatur og gamepad-knapper. Piltaster og Escape er alltid tilgjengelige som sikker fallback.',keyboard:'TASTATUR',gamepad:'GAMEPAD',left:'Venstre',right:'Høyre',boost:'Rainbow Boost',pause:'Pause',back:'Tilbake',reset:'TILBAKESTILL STANDARD',close:'TILBAKE',pressKey:'Trykk en tast…',pressButton:'Trykk en gamepad-knapp…',reserved:'Denne tasten er reservert.',noPad:'Koble til en gamepad først.',saved:'Kontroller lagret.'},
    en:{menu:'CONTROLS',title:'PC Controls',sub:'Rebind keyboard and gamepad actions. Arrow keys and Escape always remain available as safe fallbacks.',keyboard:'KEYBOARD',gamepad:'GAMEPAD',left:'Left',right:'Right',boost:'Rainbow Boost',pause:'Pause',back:'Back',reset:'RESET DEFAULTS',close:'BACK',pressKey:'Press a key…',pressButton:'Press a gamepad button…',reserved:'That key is reserved.',noPad:'Connect a gamepad first.',saved:'Controls saved.'},
    de:{menu:'STEUERUNG',title:'PC-Steuerung',sub:'Tastatur- und Gamepad-Aktionen neu belegen. Pfeiltasten und Escape bleiben immer als sichere Alternative verfügbar.',keyboard:'TASTATUR',gamepad:'GAMEPAD',left:'Links',right:'Rechts',boost:'Rainbow Boost',pause:'Pause',back:'Zurück',reset:'STANDARD WIEDERHERSTELLEN',close:'ZURÜCK',pressKey:'Taste drücken…',pressButton:'Gamepad-Taste drücken…',reserved:'Diese Taste ist reserviert.',noPad:'Verbinde zuerst ein Gamepad.',saved:'Steuerung gespeichert.'},
    es:{menu:'CONTROLES',title:'Controles de PC',sub:'Cambia las acciones de teclado y mando. Las flechas y Escape siempre quedan como alternativas seguras.',keyboard:'TECLADO',gamepad:'MANDO',left:'Izquierda',right:'Derecha',boost:'Rainbow Boost',pause:'Pausa',back:'Volver',reset:'RESTABLECER',close:'VOLVER',pressKey:'Pulsa una tecla…',pressButton:'Pulsa un botón del mando…',reserved:'Esa tecla está reservada.',noPad:'Conecta primero un mando.',saved:'Controles guardados.'},
    fr:{menu:'COMMANDES',title:'Commandes PC',sub:'Réassignez les actions clavier et manette. Les flèches et Échap restent toujours disponibles comme solution de secours.',keyboard:'CLAVIER',gamepad:'MANETTE',left:'Gauche',right:'Droite',boost:'Rainbow Boost',pause:'Pause',back:'Retour',reset:'RÉINITIALISER',close:'RETOUR',pressKey:'Appuyez sur une touche…',pressButton:'Appuyez sur un bouton…',reserved:'Cette touche est réservée.',noPad:"Connectez d’abord une manette.",saved:'Commandes enregistrées.'}
  };

  let bindings=load();
  let keyCapture='';
  let padCapture='';
  let padCaptureAt=0;
  let padBaseline=new Set();

  function language(){try{return typeof lang==='string'?lang:(localStorage.getItem('skyPuffLang')||'en')}catch(e){return 'en'}}
  function copy(){return COPY[language()]||COPY.en}
  function cloneDefaults(){return {keyboard:{...DEFAULTS.keyboard},gamepad:{...DEFAULTS.gamepad}}}
  function isDesktopCapable(){
    try{return !!window.skyPuffPlatform?.desktop||(typeof matchMedia==='function'&&matchMedia('(pointer:fine)').matches&&innerWidth>=700)}catch(e){return false}
  }
  function sanitize(candidate){
    const out=cloneDefaults();
    const usedKeys=new Set();
    for(const action of KEY_ACTIONS){
      const code=String(candidate?.keyboard?.[action]||DEFAULTS.keyboard[action]);
      if(code&&!RESERVED_KEYS.has(code)&&!usedKeys.has(code)){out.keyboard[action]=code;usedKeys.add(code);}
      else if(!usedKeys.has(DEFAULTS.keyboard[action]))usedKeys.add(DEFAULTS.keyboard[action]);
    }
    const usedButtons=new Set();
    for(const action of PAD_ACTIONS){
      const n=Number(candidate?.gamepad?.[action]);
      if(Number.isInteger(n)&&n>=0&&n<=31&&!usedButtons.has(n)){out.gamepad[action]=n;usedButtons.add(n);}
      else usedButtons.add(DEFAULTS.gamepad[action]);
    }
    return out;
  }
  function load(){try{return sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'));}catch(e){return cloneDefaults()}}
  function emit(){
    try{window.dispatchEvent(new CustomEvent('orbuff:control-bindings',{detail:getBindings()}));}catch(e){}
  }
  function save(showFeedback=true){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(bindings));}catch(e){}
    emit();
    render();
    if(showFeedback)try{showToast(copy().saved)}catch(e){}
  }
  function getBindings(){return {keyboard:{...bindings.keyboard},gamepad:{...bindings.gamepad}}}
  function key(action){return String(bindings.keyboard[action]||DEFAULTS.keyboard[action]||'')}
  function keyMatches(action,code){return key(action)===String(code||'')}
  function gamepad(action){const n=Number(bindings.gamepad[action]);return Number.isInteger(n)?n:DEFAULTS.gamepad[action]}
  function keyLabelFromCode(code){
    const c=String(code||'');
    if(KEY_LABELS[c])return KEY_LABELS[c];
    if(/^Numpad\d$/.test(c))return 'NUM '+c.slice(-1);
    if(/^F\d{1,2}$/.test(c))return c;
    return c.replace(/^Key/,'').replace(/^Digit/,'').replace(/([a-z])([A-Z])/g,'$1 $2').toUpperCase()||'?';
  }
  function keyLabel(action){return keyLabelFromCode(key(action))}
  function buttonLabel(index){const n=Number(index);return PAD_LABELS[n]||('BUTTON '+n)}
  function gamepadLabel(action){return buttonLabel(gamepad(action))}
  function swapKeyboard(action,code){
    if(!KEY_ACTIONS.includes(action)||!code||RESERVED_KEYS.has(code))return false;
    const old=key(action);
    const other=KEY_ACTIONS.find(a=>a!==action&&key(a)===code);
    bindings.keyboard[action]=code;
    if(other)bindings.keyboard[other]=old;
    save();
    return true;
  }
  function swapGamepad(action,index){
    const n=Number(index);
    if(!PAD_ACTIONS.includes(action)||!Number.isInteger(n)||n<0||n>31)return false;
    const old=gamepad(action);
    const other=PAD_ACTIONS.find(a=>a!==action&&gamepad(a)===n);
    bindings.gamepad[action]=n;
    if(other)bindings.gamepad[other]=old;
    save();
    return true;
  }
  function reset(){
    bindings=cloneDefaults();
    keyCapture='';padCapture='';
    save();
  }
  function setStatus(text,type=''){
    const el=document.getElementById('orbuffControlsStatus');
    if(!el)return;
    el.textContent=text||'';
    el.dataset.type=type;
  }
  function cancelCapture(){
    keyCapture='';padCapture='';padBaseline.clear();
    render();
  }
  function startKeyCapture(action){
    keyCapture=action;padCapture='';
    setStatus(copy().pressKey,'capture');
    render();
  }
  function startPadCapture(action){
    const pad=[...(navigator.getGamepads?.()||[])].find(Boolean);
    if(!pad){setStatus(copy().noPad,'warn');return;}
    padCapture=action;keyCapture='';
    padCaptureAt=performance.now();
    padBaseline=new Set();
    pad.buttons?.forEach((b,i)=>{if(b?.pressed)padBaseline.add(i);});
    setStatus(copy().pressButton,'capture');
    render();
  }

  function ensureStyle(){
    if(document.getElementById('orbuffControlSettingsCss'))return;
    const style=document.createElement('style');
    style.id='orbuffControlSettingsCss';
    style.textContent=`
      #orbuffControlsMenu .card{max-width:560px}
      .orbuffControlSection{margin:15px 0;padding:13px;border-radius:17px;background:rgba(230,244,255,.74);text-align:left}
      .orbuffControlSectionTitle{font-size:11px;font-weight:1000;letter-spacing:1.4px;opacity:.6;margin-bottom:8px}
      .orbuffControlRow{display:grid;grid-template-columns:1fr minmax(130px,190px);align-items:center;gap:10px;margin:7px 0}
      .orbuffControlRow span{font-size:13px;font-weight:900}
      .orbuffControlRow button{margin:0!important;min-height:40px!important;padding:8px 10px!important;font-size:12px!important}
      #orbuffControlsStatus{min-height:18px;margin:8px 0;font-size:12px;font-weight:800}
      #orbuffControlsStatus[data-type="warn"]{color:#9b5a00}
      #orbuffControlsStatus[data-type="capture"]{color:#4d56b9}
      @media(max-width:430px){.orbuffControlRow{grid-template-columns:1fr 1fr;gap:7px}}
    `;
    document.head.appendChild(style);
  }
  function ensure(){
    if(!isDesktopCapable())return;
    ensureStyle();
    let trigger=document.getElementById('pcControlsBtn');
    if(!trigger){
      trigger=document.createElement('button');
      trigger.id='pcControlsBtn';
      trigger.className='secondary';
      trigger.onclick=open;
      document.querySelector('#start .menuActions')?.appendChild(trigger);
    }
    trigger.textContent=copy().menu;

    let menu=document.getElementById('orbuffControlsMenu');
    if(!menu){
      menu=document.createElement('div');
      menu.id='orbuffControlsMenu';
      menu.className='overlay';
      menu.style.display='none';
      document.body.appendChild(menu);
    }
    render();
  }
  function render(){
    const menu=document.getElementById('orbuffControlsMenu');
    const trigger=document.getElementById('pcControlsBtn');
    if(trigger)trigger.textContent=copy().menu;
    if(!menu)return;
    const t=copy();
    menu.innerHTML=`
      <div class="card">
        <h1 style="font-size:34px">${t.title} 🎮</h1>
        <div class="small">${t.sub}</div>
        <div class="orbuffControlSection">
          <div class="orbuffControlSectionTitle">${t.keyboard}</div>
          ${KEY_ACTIONS.map(action=>`<div class="orbuffControlRow"><span>${t[action]}</span><button class="secondary" data-key-action="${action}">${keyCapture===action?t.pressKey:keyLabel(action)}</button></div>`).join('')}
        </div>
        <div class="orbuffControlSection">
          <div class="orbuffControlSectionTitle">${t.gamepad}</div>
          ${PAD_ACTIONS.map(action=>`<div class="orbuffControlRow"><span>${t[action]}</span><button class="secondary" data-pad-action="${action}">${padCapture===action?t.pressButton:gamepadLabel(action)}</button></div>`).join('')}
          <div class="small">Left stick / D-pad = ${t.left} / ${t.right}</div>
        </div>
        <div id="orbuffControlsStatus"></div>
        <button id="orbuffControlsReset" class="gold">${t.reset}</button>
        <button id="orbuffControlsClose" class="secondary">${t.close}</button>
      </div>
    `;
    menu.querySelectorAll('[data-key-action]').forEach(btn=>btn.onclick=()=>startKeyCapture(btn.dataset.keyAction));
    menu.querySelectorAll('[data-pad-action]').forEach(btn=>btn.onclick=()=>startPadCapture(btn.dataset.padAction));
    document.getElementById('orbuffControlsReset').onclick=reset;
    document.getElementById('orbuffControlsClose').onclick=close;
  }
  function open(){
    ensure();
    const menu=document.getElementById('orbuffControlsMenu');
    if(!menu)return;
    document.getElementById('spMenuHub')?.style&&(document.getElementById('spMenuHub').style.display='none');
    const start=document.getElementById('start');if(start)start.style.display='none';
    menu.style.display='flex';
    render();
  }
  function close(){
    cancelCapture();
    const menu=document.getElementById('orbuffControlsMenu');if(menu)menu.style.display='none';
    const start=document.getElementById('start');if(start)start.style.display='flex';
  }

  addEventListener('keydown',event=>{
    if(!keyCapture)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if(event.code==='Escape'){cancelCapture();return;}
    if(RESERVED_KEYS.has(event.code)){setStatus(copy().reserved,'warn');return;}
    swapKeyboard(keyCapture,event.code);
    keyCapture='';
    render();
  },true);

  function pollPadCapture(){
    if(padCapture){
      const pad=[...(navigator.getGamepads?.()||[])].find(Boolean);
      if(!pad){padCapture='';padBaseline.clear();setStatus(copy().noPad,'warn');render();}
      else{
        pad.buttons?.forEach((button,index)=>{if(!button?.pressed)padBaseline.delete(index);});
        if(performance.now()-padCaptureAt>250){
          const index=pad.buttons?.findIndex((button,i)=>button?.pressed&&!padBaseline.has(i))??-1;
          if(index>=0){
            const action=padCapture;
            padCapture='';padBaseline.clear();
            swapGamepad(action,index);
          }
        }
      }
    }
    requestAnimationFrame(pollPadCapture);
  }

  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(()=>{ensure();render();},0));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,20));else setTimeout(ensure,20);
  [250,800].forEach(ms=>setTimeout(ensure,ms));
  requestAnimationFrame(pollPadCapture);

  window.OrbuffControlSettings={
    getBindings,key,keyMatches,gamepad,keyLabel,keyLabelFromCode,gamepadLabel,buttonLabel,reset,open,close,isDesktopCapable,
    defaults:cloneDefaults()
  };
})();
