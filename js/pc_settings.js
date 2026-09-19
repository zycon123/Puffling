/* Orbuff PC settings: shared audio/graphics preferences, device-local controls. */
(function(){
  const controls=window.OrbuffDesktopControls;
  const COPY={
    en:{title:'PC Settings',audio:'Audio & graphics',music:'Music',volume:'Music volume',graphics:'Graphics',keyboard:'Keyboard',left:'Move left',right:'Move right',boost:'Rainbow Boost',attack:'Attack',pause:'Pause',controller:'Controller',none:'No controller connected',unsupported:'Unmapped controller: use Steam Input to provide a standard layout.',map:'Left stick / D-pad: move · A / ✕: select · B / ○: back',nav:'Menus: arrows / Tab to move, Enter / Space to select, Esc to go back. Controller: up/down to move, left/right to adjust.',reserved:'That key is reserved. Use a letter, number, arrow or Space.',conflict:'That key is already assigned. Choose another.',capture:'Press a key. Esc cancels.',saved:'Controls saved.',unsaved:'Controls work this session, but could not be saved.',reset:'Reset controls to defaults',done:'Default controls restored.',back:'Back',add:'Add key',on:'On',off:'Off',auto:'Auto',high:'High',low:'Low',display:'Display',fullscreen:'Toggle fullscreen',cancel:'Cancel rebinding'},
    no:{title:'PC-innstillinger',audio:'Lyd og grafikk',music:'Musikk',volume:'Musikkvolum',graphics:'Grafikk',keyboard:'Tastatur',left:'Flytt venstre',right:'Flytt høyre',boost:'Regnbueboost',attack:'Angrep',pause:'Pause',controller:'Kontroller',none:'Ingen kontroller tilkoblet',unsupported:'Ukjent oppsett: bruk Steam Input med standardoppsett.',map:'Venstre spak / D-pad: flytt · A / ✕: velg · B / ○: tilbake',nav:'Menyer: piler / Tab for å flytte, Enter / Space for å velge, Esc tilbake. Kontroller: opp/ned for å flytte, venstre/høyre for å justere.',reserved:'Tasten er reservert. Bruk bokstav, tall, pil eller Space.',conflict:'Tasten er allerede i bruk. Velg en annen.',capture:'Trykk en tast. Esc avbryter.',saved:'Kontroller lagret.',unsaved:'Kontroller virker denne økten, men kunne ikke lagres.',reset:'Tilbakestill kontroller',done:'Standardkontroller gjenopprettet.',back:'Tilbake',add:'Legg til tast',on:'På',off:'Av',auto:'Auto',high:'Høy',low:'Lav',display:'Skjerm',fullscreen:'Bytt fullskjerm',cancel:'Avbryt tastvalg'},
    de:{title:'PC-Einstellungen',audio:'Audio und Grafik',music:'Musik',volume:'Musiklautstärke',graphics:'Grafik',keyboard:'Tastatur',left:'Nach links',right:'Nach rechts',boost:'Regenbogen-Boost',attack:'Angriff',pause:'Pause',controller:'Controller',none:'Kein Controller verbunden',unsupported:'Unbekannte Belegung: Standardlayout über Steam Input verwenden.',map:'Linker Stick / Steuerkreuz: bewegen · A / ✕: wählen · B / ○: zurück',nav:'Menüs: Pfeile / Tab bewegen, Enter / Leertaste wählen, Esc zurück. Controller: oben/unten bewegen, links/rechts anpassen.',reserved:'Taste reserviert. Buchstaben, Zahlen, Pfeile oder Leertaste verwenden.',conflict:'Taste bereits belegt. Andere Taste wählen.',capture:'Taste drücken. Esc bricht ab.',saved:'Steuerung gespeichert.',unsaved:'Steuerung gilt für diese Sitzung, konnte aber nicht gespeichert werden.',reset:'Standardsteuerung wiederherstellen',done:'Standardsteuerung wiederhergestellt.',back:'Zurück',add:'Taste hinzufügen',on:'An',off:'Aus',auto:'Auto',high:'Hoch',low:'Niedrig',display:'Anzeige',fullscreen:'Vollbild umschalten',cancel:'Belegung abbrechen'},
    es:{title:'Ajustes de PC',audio:'Audio y gráficos',music:'Música',volume:'Volumen',graphics:'Gráficos',keyboard:'Teclado',left:'Mover a la izquierda',right:'Mover a la derecha',boost:'Impulso arcoíris',attack:'Ataque',pause:'Pausa',controller:'Mando',none:'Ningún mando conectado',unsupported:'Mando sin asignación: usa un diseño estándar de Steam Input.',map:'Stick izquierdo / cruceta: mover · A / ✕: elegir · B / ○: volver',nav:'Menús: flechas / Tab para mover, Enter / Espacio para elegir, Esc para volver. Mando: arriba/abajo para mover, izquierda/derecha para ajustar.',reserved:'Tecla reservada. Usa una letra, número, flecha o Espacio.',conflict:'Tecla ya asignada. Elige otra.',capture:'Pulsa una tecla. Esc cancela.',saved:'Controles guardados.',unsaved:'Los controles funcionan esta sesión, pero no se pudieron guardar.',reset:'Restablecer controles',done:'Controles predeterminados restaurados.',back:'Volver',add:'Añadir tecla',on:'Sí',off:'No',auto:'Auto',high:'Alto',low:'Bajo',display:'Pantalla',fullscreen:'Alternar pantalla completa',cancel:'Cancelar asignación'},
    fr:{title:'Paramètres PC',audio:'Audio et graphismes',music:'Musique',volume:'Volume',graphics:'Graphismes',keyboard:'Clavier',left:'Aller à gauche',right:'Aller à droite',boost:'Boost arc-en-ciel',attack:'Attaque',pause:'Pause',controller:'Manette',none:'Aucune manette connectée',unsupported:'Manette non reconnue : utilisez une disposition standard via Steam Input.',map:'Stick gauche / croix : déplacer · A / ✕ : choisir · B / ○ : retour',nav:'Menus : flèches / Tab pour déplacer, Entrée / Espace pour choisir, Esc pour revenir. Manette : haut/bas pour déplacer, gauche/droite pour ajuster.',reserved:'Touche réservée. Utilisez une lettre, un chiffre, une flèche ou Espace.',conflict:'Touche déjà attribuée. Choisissez une autre.',capture:'Appuyez sur une touche. Esc annule.',saved:'Commandes enregistrées.',unsaved:'Commandes actives pour cette session, mais enregistrement impossible.',reset:'Rétablir les commandes',done:'Commandes par défaut rétablies.',back:'Retour',add:'Ajouter une touche',on:'Oui',off:'Non',auto:'Auto',high:'Élevé',low:'Faible',display:'Affichage',fullscreen:'Basculer en plein écran',cancel:'Annuler la saisie'}
  };
  let panel=null,opener=null;
  function copy(){try{return COPY[typeof lang==='string'?lang:'en']||COPY.en}catch(e){return COPY.en}}
  function available(){try{return !!window.skyPuffPlatform?.desktop||matchMedia('(pointer:fine)').matches||!!controls.getPad()}catch(e){return false}}
  function isOpen(){return panel?.style.display==='flex'}
  function message(text){document.getElementById('pcSettingsStatus').textContent=text}
  function refresh(){
    if(!panel)return;
    const t=copy(),config=controls.snapshot();
    panel.querySelectorAll('[data-pc-copy]').forEach(el=>el.textContent=t[el.dataset.pcCopy]);
    panel.querySelectorAll('[data-pc-key]').forEach(button=>{
      const action=button.dataset.pcKey,slot=Number(button.dataset.slot);
      button.textContent=config.keys[action][slot]?.replace(/^Key|^Digit/,'')||t.add;
      button.setAttribute('aria-label',`${t[action]}: ${button.textContent}`);
    });
    panel.querySelectorAll('[data-pc-button]').forEach(select=>{
      select.value=String(config.buttons[select.dataset.pcButton]);
      [...select.options].forEach(option=>option.textContent=controls.buttonLabel(Number(option.value)));
    });
    const pad=controls.getPad();
    document.getElementById('pcControllerStatus').textContent=pad?pad.id+(pad.mapping==='standard'?'':` — ${t.unsupported}`):t.none;
    document.getElementById('pcMusicToggle').textContent=typeof musicEnabled!=='undefined'&&musicEnabled?t.on:t.off;
    document.getElementById('pcVolume').value=String(Math.round((typeof musicVolume==='number'?musicVolume:.55)*100));
    document.getElementById('pcGraphics').value=window.SkyPuffPerformance?.mode?.()||'auto';
    document.querySelectorAll('[data-pc-settings-open]').forEach(button=>{button.textContent=t.title;button.style.display=available()?'':'none'});
  }
  function close(){
    if(!isOpen())return;
    controls.cancelCapture();panel.style.display='none';
    if(opener?.isConnected)opener.focus();
    // Closing settings leaves a running game paused until the player resumes.
  }
  function open(){
    if(!available())return;
    ensure();opener=document.activeElement;
    try{if(running&&!paused)pauseGame()}catch(e){}
    refresh();message('');panel.style.display='flex';
    panel.querySelector('button').focus();
  }
  function ensure(){
    if(panel)return;
    const style=document.createElement('style');
    style.textContent='#orbuffPcSettings{z-index:20000}#orbuffPcSettings .card{width:min(90vw,620px);max-width:620px;max-height:88vh;overflow:auto;text-align:left;padding:24px;box-sizing:border-box}#orbuffPcSettings h1{font-size:30px;margin:0 0 14px}#orbuffPcSettings h2{font-size:19px;margin:22px 0 10px}#orbuffPcSettings .pcRow{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:10px 0}#orbuffPcSettings .pcKeys{display:flex;gap:6px}#orbuffPcSettings button{font-size:14px;min-height:40px;padding:8px 12px;margin:2px}#orbuffPcSettings select{font:inherit;max-width:45%;padding:8px}#orbuffPcSettings input{width:48%}#pcSettingsStatus{min-height:36px;font-weight:bold;margin:12px 0}#pcControllerStatus{overflow-wrap:anywhere}.pcSettingsOpen{font-size:12px!important;padding:8px!important}';
    document.head.appendChild(style);
    panel=document.createElement('div');panel.id='orbuffPcSettings';panel.className='overlay';panel.style.display='none';
    panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','pcSettingsTitle');
    panel.innerHTML=`<div class="card">
      <h1 id="pcSettingsTitle" data-pc-copy="title"></h1>
      <p class="small" data-pc-copy="nav"></p>
      <h2 data-pc-copy="audio"></h2>
      <div class="pcRow"><span data-pc-copy="music"></span><button id="pcMusicToggle"></button></div>
      <label class="pcRow"><span data-pc-copy="volume"></span><input id="pcVolume" type="range" min="0" max="100" step="5"></label>
      <label class="pcRow"><span data-pc-copy="graphics"></span><select id="pcGraphics"><option value="auto" data-pc-copy="auto"></option><option value="high" data-pc-copy="high"></option><option value="low" data-pc-copy="low"></option></select></label>
      <div class="pcRow"><span data-pc-copy="display"></span><button id="pcFullscreen" data-pc-copy="fullscreen"></button></div>
      <h2 data-pc-copy="keyboard"></h2>
      ${Object.keys(controls.snapshot().keys).map(action=>`<div class="pcRow"><span data-pc-copy="${action}"></span><div class="pcKeys">${[0,1].map(slot=>`<button class="secondary" data-pc-key="${action}" data-slot="${slot}"></button>`).join('')}</div></div>`).join('')}
      <button id="pcCancelCapture" class="secondary" data-pc-copy="cancel" hidden></button>
      <h2 data-pc-copy="controller"></h2><p id="pcControllerStatus" class="small"></p><p class="small" data-pc-copy="map"></p>
      ${['boost','pause'].map(action=>`<label class="pcRow"><span data-pc-copy="${action}"></span><select data-pc-button="${action}">${(action==='boost'?[0,2,3,4,5,6,7]:[8,9,10,11]).map(index=>`<option value="${index}"></option>`).join('')}</select></label>`).join('')}
      <div id="pcSettingsStatus" role="status" aria-live="polite"></div>
      <button id="pcResetControls" class="secondary" data-pc-copy="reset"></button>
      <button id="pcSettingsBack" data-pc-copy="back"></button>
    </div>`;
    document.body.appendChild(panel);
    document.getElementById('pcSettingsBack').onclick=close;
    document.getElementById('pcMusicToggle').onclick=()=>{document.getElementById('musicToggle')?.click();refresh()};
    document.getElementById('pcVolume').oninput=event=>{const original=document.getElementById('musicVolume');original.value=event.target.value;original.dispatchEvent(new Event('input',{bubbles:true}))};
    document.getElementById('pcGraphics').onchange=event=>window.SkyPuffPerformance?.setMode?.(event.target.value);
    document.getElementById('pcFullscreen').onclick=async()=>{
      try{if(window.OrbuffDesktop?.toggleFullscreen)await window.OrbuffDesktop.toggleFullscreen();else if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(e){message('F11')}
    };
    document.getElementById('pcResetControls').onclick=()=>{const result=controls.resetControls();refresh();message(copy()[result.saved?'done':'unsaved'])};
    document.getElementById('pcCancelCapture').onclick=()=>controls.cancelCapture();
    panel.querySelectorAll('[data-pc-key]').forEach(button=>button.onclick=()=>{controls.beginCapture(button.dataset.pcKey,Number(button.dataset.slot));document.getElementById('pcCancelCapture').hidden=false;message(copy().capture)});
    panel.querySelectorAll('[data-pc-button]').forEach(select=>select.onchange=()=>{const result=controls.bindButton(select.dataset.pcButton,Number(select.value));refresh();message(copy()[result.saved?'saved':'unsaved'])});
  }
  function addEntries(){
    for(const id of ['start','pauseMenu']){
      const card=document.querySelector(`#${id} .card`);
      if(!card||card.querySelector('[data-pc-settings-open]'))continue;
      const button=document.createElement('button');button.className='secondary pcSettingsOpen';button.dataset.pcSettingsOpen='';button.onclick=open;card.appendChild(button);
    }
    refresh();
  }
  window.OrbuffPcSettings={open,close,isOpen,refresh,available};
  ensure();addEntries();
  addEventListener('orbuff:binding-result',event=>{refresh();document.getElementById('pcCancelCapture').hidden=!controls.captureActive();const result=event.detail;message(copy()[result.ok?(result.saved?'saved':'unsaved'):result.reason])});
  addEventListener('orbuff:binding-cancelled',()=>{document.getElementById('pcCancelCapture').hidden=true;message('')});
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(refresh,0));
  addEventListener('gamepadconnected',addEntries);addEventListener('gamepaddisconnected',refresh);
  setTimeout(addEntries,1200);
})();
