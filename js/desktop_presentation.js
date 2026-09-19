/* Orbuff — widescreen desktop presentation v1.0 */
(function(){
  const COPY={
    no:{pc:'PC BUILD',run:'RUN STATUS',height:'HØYDE',coins:'MYNTER',health:'LIV',mode:'MODUS',controls:'KONTROLLER',steer:'STYR',boost:'BOOST',pause:'PAUSE',fullscreen:'FULLSKJERM',endless:'ENDLESS',boss:'BOSS',race:'RACE',menu:'MENY',controller:'KONTROLLER TILKOBLET',keyboard:'TASTATUR'},
    en:{pc:'PC BUILD',run:'RUN STATUS',height:'HEIGHT',coins:'COINS',health:'HEALTH',mode:'MODE',controls:'CONTROLS',steer:'STEER',boost:'BOOST',pause:'PAUSE',fullscreen:'FULLSCREEN',endless:'ENDLESS',boss:'BOSS',race:'RACE',menu:'MENU',controller:'CONTROLLER CONNECTED',keyboard:'KEYBOARD'},
    de:{pc:'PC BUILD',run:'RUN-STATUS',height:'HÖHE',coins:'MÜNZEN',health:'LEBEN',mode:'MODUS',controls:'STEUERUNG',steer:'LENKEN',boost:'BOOST',pause:'PAUSE',fullscreen:'VOLLBILD',endless:'ENDLOS',boss:'BOSS',race:'RENNEN',menu:'MENÜ',controller:'CONTROLLER VERBUNDEN',keyboard:'TASTATUR'},
    es:{pc:'PC BUILD',run:'ESTADO',height:'ALTURA',coins:'MONEDAS',health:'VIDA',mode:'MODO',controls:'CONTROLES',steer:'MOVER',boost:'BOOST',pause:'PAUSA',fullscreen:'PANTALLA COMPLETA',endless:'ENDLESS',boss:'JEFE',race:'CARRERA',menu:'MENÚ',controller:'MANDO CONECTADO',keyboard:'TECLADO'},
    fr:{pc:'PC BUILD',run:'ÉTAT',height:'HAUTEUR',coins:'PIÈCES',health:'VIE',mode:'MODE',controls:'COMMANDES',steer:'DIRIGER',boost:'BOOST',pause:'PAUSE',fullscreen:'PLEIN ÉCRAN',endless:'ENDLESS',boss:'BOSS',race:'COURSE',menu:'MENU',controller:'MANETTE CONNECTÉE',keyboard:'CLAVIER'}
  };

  function language(){
    try{return typeof lang==='string'?lang:(localStorage.getItem('skyPuffLang')||'en')}catch(e){return 'en'}
  }
  function copy(){return COPY[language()]||COPY.en}
  function ensureStyle(){
    if(document.getElementById('orbuffDesktopPresentationCss'))return;
    const style=document.createElement('style');
    style.id='orbuffDesktopPresentationCss';
    style.textContent=`
      #orbuffDesktopFrame{display:none;position:fixed;inset:0;z-index:2;pointer-events:none;font-family:Arial,Helvetica,sans-serif}
      .orbuffDesktopRail{position:absolute;top:50%;transform:translateY(-50%);width:230px;box-sizing:border-box;padding:18px;border:1px solid rgba(255,255,255,.18);border-radius:24px;background:linear-gradient(180deg,rgba(20,37,72,.80),rgba(23,61,91,.68));box-shadow:0 20px 55px rgba(5,25,50,.24),inset 0 1px 0 rgba(255,255,255,.12);backdrop-filter:blur(14px);color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.22)}
      .orbuffDesktopRail.left{left:26px}.orbuffDesktopRail.right{right:26px}
      .orbuffDesktopBrand{font-size:30px;font-weight:1000;letter-spacing:-1px;background:linear-gradient(90deg,#fff,#9bdcff,#d3b9ff);-webkit-background-clip:text;background-clip:text;color:transparent}
      .orbuffDesktopBuild{font-size:10px;font-weight:900;letter-spacing:2px;opacity:.58;margin-top:2px}#orbuffDesktopSteamStatus{display:none;margin-top:8px;padding:7px 9px;border-radius:10px;background:rgba(87,170,255,.16);border:1px solid rgba(150,210,255,.18);font-size:9px;font-weight:1000;letter-spacing:.8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .orbuffDesktopSectionTitle{margin:20px 0 9px;font-size:10px;font-weight:1000;letter-spacing:1.8px;opacity:.58}
      .orbuffDesktopStat{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:7px 0;padding:10px 11px;border-radius:13px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08)}
      .orbuffDesktopStat span{font-size:10px;font-weight:900;letter-spacing:.8px;opacity:.65}.orbuffDesktopStat b{font-size:15px}
      .orbuffDesktopMode{margin-top:10px;padding:10px 12px;border-radius:14px;text-align:center;background:linear-gradient(135deg,rgba(255,94,172,.28),rgba(91,141,255,.30));font-size:12px;font-weight:1000;letter-spacing:1px}
      .orbuffDesktopKey{display:grid;grid-template-columns:72px 1fr;align-items:center;gap:10px;margin:8px 0;font-size:11px;font-weight:900}.orbuffDesktopKey kbd{display:inline-flex;justify-content:center;align-items:center;min-height:28px;padding:0 8px;border:1px solid rgba(255,255,255,.22);border-bottom-width:3px;border-radius:8px;background:rgba(255,255,255,.10);font:900 10px Arial;color:#fff;box-sizing:border-box}.orbuffDesktopKey span{opacity:.72}
      #orbuffDesktopInputStatus{margin-top:16px;padding-top:13px;border-top:1px solid rgba(255,255,255,.10);font-size:10px;font-weight:900;letter-spacing:.9px;opacity:.65}
      @media (min-width:1100px) and (pointer:fine){
        html[data-playfield="desktop-narrow"] body{background:radial-gradient(circle at 50% 38%,#8fe2ff 0,#65bfe9 40%,#253d70 100%)}
        html[data-playfield="desktop-narrow"] canvas{position:relative;z-index:1;box-shadow:0 0 0 1px rgba(255,255,255,.22),0 0 80px rgba(36,160,225,.38)}
        html[data-playfield="desktop-narrow"] #orbuffDesktopFrame{display:block}
      }
      @media (min-width:1500px){.orbuffDesktopRail{width:260px;padding:22px}.orbuffDesktopRail.left{left:48px}.orbuffDesktopRail.right{right:48px}}
    `;
    document.head.appendChild(style);
  }
  function ensureFrame(){
    let frame=document.getElementById('orbuffDesktopFrame');
    if(frame)return frame;
    frame=document.createElement('div');
    frame.id='orbuffDesktopFrame';
    frame.setAttribute('aria-hidden','true');
    frame.innerHTML=`
      <aside class="orbuffDesktopRail left">
        <div class="orbuffDesktopBrand">ORBUFF</div>
        <div id="orbuffDesktopBuild" class="orbuffDesktopBuild">PC BUILD</div>
        <div id="orbuffDesktopSteamStatus"></div>
        <div id="orbuffDesktopRunTitle" class="orbuffDesktopSectionTitle">RUN STATUS</div>
        <div class="orbuffDesktopStat"><span id="orbuffDesktopHeightLabel">HEIGHT</span><b><span id="orbuffDesktopHeight">0</span> m</b></div>
        <div class="orbuffDesktopStat"><span id="orbuffDesktopCoinsLabel">COINS</span><b>🪙 <span id="orbuffDesktopCoins">0</span></b></div>
        <div class="orbuffDesktopStat"><span id="orbuffDesktopHealthLabel">HEALTH</span><b>❤️ <span id="orbuffDesktopHealth">3</span></b></div>
        <div id="orbuffDesktopMode" class="orbuffDesktopMode">MENU</div>
      </aside>
      <aside class="orbuffDesktopRail right">
        <div id="orbuffDesktopControlsTitle" class="orbuffDesktopSectionTitle" style="margin-top:0">CONTROLS</div>
        <div class="orbuffDesktopKey"><kbd>A/D ←/→</kbd><span id="orbuffDesktopSteerLabel">STEER</span></div>
        <div class="orbuffDesktopKey"><kbd>SPACE</kbd><span id="orbuffDesktopBoostLabel">BOOST</span></div>
        <div class="orbuffDesktopKey"><kbd>ESC / P</kbd><span id="orbuffDesktopPauseLabel">PAUSE</span></div>
        <div class="orbuffDesktopKey"><kbd>F11</kbd><span id="orbuffDesktopFullscreenLabel">FULLSCREEN</span></div>
        <div class="orbuffDesktopKey"><kbd>🎮</kbd><span>A / ✕ · B / ○ · START</span></div>
        <div id="orbuffDesktopInputStatus">KEYBOARD</div>
      </aside>
    `;
    document.body.appendChild(frame);
    return frame;
  }
  let steamState={active:false};
  function setText(id,value){const el=document.getElementById(id);if(el)el.textContent=value}
  function updateSteamStatus(status){
    steamState=status&&typeof status==='object'?status:{active:false};
    const el=document.getElementById('orbuffDesktopSteamStatus');
    if(!el)return;
    if(!steamState.active){el.style.display='none';el.textContent='';return;}
    const prefix=steamState.steamDeck?'STEAM DECK':'STEAM';
    const user=String(steamState.user||'').trim();
    el.textContent=user?`${prefix} • ${user}`:prefix;
    el.style.display='block';
  }
  function applyCopy(){
    const t=copy();
    setText('orbuffDesktopBuild',t.pc);
    setText('orbuffDesktopRunTitle',t.run);
    setText('orbuffDesktopHeightLabel',t.height);
    setText('orbuffDesktopCoinsLabel',t.coins);
    setText('orbuffDesktopHealthLabel',t.health);
    setText('orbuffDesktopControlsTitle',t.controls);
    setText('orbuffDesktopSteerLabel',t.steer);
    setText('orbuffDesktopBoostLabel',t.boost);
    setText('orbuffDesktopPauseLabel',t.pause);
    setText('orbuffDesktopFullscreenLabel',t.fullscreen);
  }
  function currentMode(){
    const t=copy();
    try{
      if(typeof bossArena!=='undefined'&&bossArena)return t.boss;
      if(typeof multiplayerMode!=='undefined'&&multiplayerMode)return t.race;
      if(typeof running!=='undefined'&&running)return t.endless;
    }catch(e){}
    return t.menu;
  }
  function update(){
    const score=document.getElementById('score')?.textContent||'0';
    const coins=document.getElementById('coins')?.textContent||'0';
    const hp=document.getElementById('hp')?.textContent||'3';
    setText('orbuffDesktopHeight',score);
    setText('orbuffDesktopCoins',coins);
    setText('orbuffDesktopHealth',hp);
    setText('orbuffDesktopMode',currentMode());
    let controller=false;
    try{controller=[...navigator.getGamepads?.()||[]].some(Boolean)}catch(e){}
    const t=copy();
    setText('orbuffDesktopInputStatus',controller?t.controller:t.keyboard);
  }

  ensureStyle();
  ensureFrame();
  applyCopy();
  update();
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(()=>{applyCopy();update();},0));
  addEventListener('gamepadconnected',update);
  addEventListener('gamepaddisconnected',update);
  addEventListener('orbuff:steam-status',event=>updateSteamStatus(event?.detail));
  setTimeout(()=>updateSteamStatus(window.OrbuffSteamRuntime?.status?.()),350);
  setInterval(update,180);

  window.OrbuffDesktopPresentation={update,applyCopy,updateSteamStatus};
})();
