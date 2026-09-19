/* Orbuff — PC control rebinding UI v1.0 */
(function(){
  const API=()=>window.OrbuffDesktopControls;
  const COPY={
    no:{title:'PC-kontroller',sub:'Tilpass tastatur og gamepad. Piltaster og D-pad forblir alltid tilgjengelig i menyer.',left:'Venstre',right:'Høyre',boost:'Rainbow Boost',pause:'Pause',action:'Gamepad action',back:'Gamepad tilbake',padPause:'Gamepad pause',reset:'TILBAKESTILL STANDARD',close:'TILBAKE',press:'Trykk en tast…',padPress:'Trykk en knapp på gamepad…',none:'Ingen gamepad funnet',button:'Knapp'},
    en:{title:'PC Controls',sub:'Customize keyboard and gamepad. Arrow keys and D-pad always remain available for menu navigation.',left:'Left',right:'Right',boost:'Rainbow Boost',pause:'Pause',action:'Gamepad action',back:'Gamepad back',padPause:'Gamepad pause',reset:'RESET DEFAULTS',close:'BACK',press:'Press a key…',padPress:'Press a gamepad button…',none:'No gamepad detected',button:'Button'},
    de:{title:'PC-Steuerung',sub:'Tastatur und Gamepad anpassen. Pfeiltasten und D-Pad bleiben in Menüs immer verfügbar.',left:'Links',right:'Rechts',boost:'Rainbow Boost',pause:'Pause',action:'Gamepad Aktion',back:'Gamepad Zurück',padPause:'Gamepad Pause',reset:'STANDARD WIEDERHERSTELLEN',close:'ZURÜCK',press:'Taste drücken…',padPress:'Gamepad-Taste drücken…',none:'Kein Gamepad erkannt',button:'Taste'},
    es:{title:'Controles de PC',sub:'Personaliza teclado y mando. Flechas y D-pad siempre funcionan en los menús.',left:'Izquierda',right:'Derecha',boost:'Rainbow Boost',pause:'Pausa',action:'Acción del mando',back:'Atrás del mando',padPause:'Pausa del mando',reset:'RESTABLECER',close:'VOLVER',press:'Pulsa una tecla…',padPress:'Pulsa un botón del mando…',none:'No se detecta mando',button:'Botón'},
    fr:{title:'Commandes PC',sub:'Personnalisez clavier et manette. Les flèches et le D-pad restent disponibles dans les menus.',left:'Gauche',right:'Droite',boost:'Rainbow Boost',pause:'Pause',action:'Action manette',back:'Retour manette',padPause:'Pause manette',reset:'RÉINITIALISER',close:'RETOUR',press:'Appuyez sur une touche…',padPress:'Appuyez sur un bouton…',none:'Aucune manette détectée',button:'Bouton'}
  };
  let keyCapture='',padCapture='',padBaseline=[];
  function langCode(){try{return typeof lang==='string'?lang:(localStorage.getItem('skyPuffLang')||'en')}catch(e){return 'en'}}
  function copy(){return COPY[langCode()]||COPY.en}
  function isDesktop(){try{return !!window.skyPuffPlatform?.desktop||matchMedia('(pointer:fine)').matches||/Electron/i.test(navigator.userAgent||'')}catch(e){return false}}
  function ensureStyle(){
    if(document.getElementById('orbuffControlSettingsCss'))return;
    const s=document.createElement('style');s.id='orbuffControlSettingsCss';s.textContent=`
      .orbuffBindGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:14px 0;text-align:left}
      .orbuffBindRow{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:14px;background:#eef8ff}
      .orbuffBindRow span{font-size:12px;font-weight:900;color:#42617a}.orbuffBindRow button{min-width:88px;margin:0!important;padding:9px 10px!important;font-size:12px!important}
      .orbuffBindSection{margin:12px 0 6px;font-size:11px;font-weight:1000;letter-spacing:1px;color:#6a7d90;text-align:left}
      @media(max-width:430px){.orbuffBindGrid{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }
  function ensure(){
    if(!isDesktop())return;
    ensureStyle();
    if(!document.getElementById('pcControlsBtn')){
      const actions=document.querySelector('#start .menuActions');
      if(actions){const b=document.createElement('button');b.id='pcControlsBtn';b.className='secondary';b.textContent='PC CONTROLS 🎮';b.onclick=open;actions.appendChild(b);}
    }
    if(document.getElementById('pcControlsMenu'))return;
    const el=document.createElement('div');el.id='pcControlsMenu';el.className='overlay';el.style.display='none';
    el.innerHTML='<div class="card" style="max-width:560px"><h1 id="pcControlsTitle" style="font-size:34px"></h1><div id="pcControlsSub" class="small"></div><div id="pcControlsBody"></div><button id="pcControlsReset" class="gold"></button><button id="pcControlsClose" class="secondary"></button></div>';
    document.body.appendChild(el);
    document.getElementById('pcControlsReset').onclick=()=>{API()?.resetBindings?.();render();};
    document.getElementById('pcControlsClose').onclick=close;
  }
  function bindButton(label,action,type,value){
    const row=document.createElement('div');row.className='orbuffBindRow';
    const l=document.createElement('span');l.textContent=label;
    const b=document.createElement('button');b.className='secondary';b.textContent=value;
    b.onclick=()=>type==='key'?captureKey(action,b):capturePad(action,b);
    row.append(l,b);return row;
  }
  function captureKey(action,button){
    keyCapture=action;button.textContent=copy().press;
    const handler=e=>{
      if(!keyCapture)return;
      if(['Escape','Enter','Tab'].includes(e.code)){keyCapture='';removeEventListener('keydown',handler,true);render();return;}
      e.preventDefault();e.stopPropagation();
      API()?.setKeyboardBinding?.(action,e.code);keyCapture='';removeEventListener('keydown',handler,true);render();
    };
    addEventListener('keydown',handler,true);
    setTimeout(()=>{if(keyCapture===action){keyCapture='';removeEventListener('keydown',handler,true);render();}},8000);
  }
  function capturePad(action,button){
    const pad=[...navigator.getGamepads?.()||[]].find(Boolean);
    if(!pad){button.textContent=copy().none;setTimeout(render,1200);return;}
    padCapture=action;padBaseline=pad.buttons.map(x=>!!x.pressed);button.textContent=copy().padPress;
    const started=performance.now();
    function scan(){
      if(padCapture!==action)return;
      const current=[...navigator.getGamepads?.()||[]].find(Boolean);
      if(current){
        for(let i=0;i<current.buttons.length;i++){
          if(current.buttons[i]?.pressed&&!padBaseline[i]){
            API()?.setGamepadBinding?.(action,i);padCapture='';render();return;
          }
        }
        padBaseline=current.buttons.map(x=>!!x.pressed);
      }
      if(performance.now()-started>8000){padCapture='';render();return;}
      requestAnimationFrame(scan);
    }
    requestAnimationFrame(scan);
  }
  function render(){
    ensure();const api=API(),el=document.getElementById('pcControlsMenu');if(!api||!el)return;
    const t=copy(),b=api.getBindings();
    document.getElementById('pcControlsTitle').textContent=t.title;
    document.getElementById('pcControlsSub').textContent=t.sub;
    document.getElementById('pcControlsReset').textContent=t.reset;
    document.getElementById('pcControlsClose').textContent=t.close;
    const body=document.getElementById('pcControlsBody');body.innerHTML='';
    const ks=document.createElement('div');ks.className='orbuffBindSection';ks.textContent='KEYBOARD';body.appendChild(ks);
    const kg=document.createElement('div');kg.className='orbuffBindGrid';
    kg.append(bindButton(t.left,'left','key',api.keyLabel(b.keyboard.left)),bindButton(t.right,'right','key',api.keyLabel(b.keyboard.right)),bindButton(t.boost,'boost','key',api.keyLabel(b.keyboard.boost)),bindButton(t.pause,'pause','key',api.keyLabel(b.keyboard.pause)));body.appendChild(kg);
    const gs=document.createElement('div');gs.className='orbuffBindSection';gs.textContent='GAMEPAD';body.appendChild(gs);
    const gg=document.createElement('div');gg.className='orbuffBindGrid';
    gg.append(bindButton(t.action,'action','pad',t.button+' '+b.gamepad.action),bindButton(t.back,'back','pad',t.button+' '+b.gamepad.back),bindButton(t.padPause,'pause','pad',t.button+' '+b.gamepad.pause));body.appendChild(gg);
  }
  function open(){ensure();render();document.getElementById('spMenuHub')?.style.setProperty('display','none');document.getElementById('start')?.style.setProperty('display','none');const el=document.getElementById('pcControlsMenu');if(el)el.style.display='flex';}
  function close(){keyCapture='';padCapture='';const el=document.getElementById('pcControlsMenu');if(el)el.style.display='none';const start=document.getElementById('start');if(start)start.style.display='flex';}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,0));else setTimeout(ensure,0);
  [150,600,1300].forEach(ms=>setTimeout(ensure,ms));
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(render,0));
  window.OrbuffControlSettings={open,close,render};
})();
