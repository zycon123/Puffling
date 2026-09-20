import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// The widescreen desktop side rail (js/desktop_presentation.js) lists PC
// controls next to the gameplay canvas. Attack is only meaningful during
// Race My Orbuff, so its row must stay hidden outside a race and appear (with
// the player's real rebound key) once multiplayerMode goes true.
const src=fs.readFileSync('js/desktop_presentation.js','utf8');

function harness(){
  const elements=new Map();
  function element(id){
    if(elements.has(id))return elements.get(id);
    const el={id,style:{},textContent:'',getAttribute(){return null},setAttribute(){},addEventListener(){}};
    elements.set(id,el);
    return el;
  }
  const context={
    console,Math,Date,JSON,Object,String,Number,Array,
    document:{
      getElementById:id=>elements.has(id)?elements.get(id):null,
      createElement:()=>element('__new'+Math.random()),
      head:{appendChild(){}},
      body:{appendChild(el){}},
      addEventListener(){},
    },
    navigator:{getGamepads:()=>[]},
    localStorage:{getItem:()=>null},
    lang:'en',
    multiplayerMode:false,running:false,bossArena:false,
    setInterval(){},setTimeout(fn,ms){if(!ms)fn();return 0;},
    addEventListener(){},
    OrbuffDesktopControls:{bindingLabel:action=>({left:'A',right:'D',boost:'Space',attack:'E',pause:'P'})[action]||'?'},
  };
  context.window=context;
  // Pre-register the DOM ids the source creates/queries so getElementById
  // resolves them consistently across the whole test (ensureFrame's real
  // innerHTML assignment is skipped since createElement/appendChild are
  // stubbed -- the ids below stand in for what that markup would produce).
  for(const id of ['orbuffDesktopFrame','orbuffDesktopBuild','orbuffDesktopSteamStatus','orbuffDesktopRunTitle',
    'orbuffDesktopHeightLabel','orbuffDesktopHeight','orbuffDesktopCoinsLabel','orbuffDesktopCoins',
    'orbuffDesktopHealthLabel','orbuffDesktopHealth','orbuffDesktopMode','orbuffDesktopControlsTitle',
    'orbuffDesktopSteerKeys','orbuffDesktopSteerLabel','orbuffDesktopBoostKeys','orbuffDesktopBoostLabel',
    'orbuffDesktopAttackRow','orbuffDesktopAttackKeys','orbuffDesktopAttackLabel',
    'orbuffDesktopPauseKeys','orbuffDesktopPauseLabel','orbuffDesktopInputStatus',
    'score','coins','hp','languageSelect'])element(id);
  vm.createContext(context);
  vm.runInContext(src,context,{filename:'js/desktop_presentation.js'});
  return {context,elements};
}

{
  const {context,elements}=harness();
  context.OrbuffDesktopPresentation.update();
  assert.equal(elements.get('orbuffDesktopAttackRow').style.display,'none',
    'attack row must stay hidden outside a race');

  context.multiplayerMode=true;
  context.OrbuffDesktopPresentation.update();
  assert.equal(elements.get('orbuffDesktopAttackRow').style.display,'grid',
    'attack row must appear once a Race My Orbuff match is active');
  assert.equal(elements.get('orbuffDesktopAttackKeys').textContent,'E',
    'attack row must show the player\'s real rebound Attack key');

  context.multiplayerMode=false;
  context.OrbuffDesktopPresentation.update();
  assert.equal(elements.get('orbuffDesktopAttackRow').style.display,'none',
    'attack row must hide again once the race ends');
}

console.log('✅ Desktop side rail shows the Attack key only during Race My Orbuff');
