import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('js/desktop_controls.js','utf8');
function harness(saved=null,{storageFails=false}={}){
  const events=new Map(),elements=new Map(),frames=[];
  let pads=[],now=0,settings=false;
  const storage=new Map(saved?[['orbuffPcControlsV1',saved]]:[]);
  function element(id,tag='BUTTON'){
    const el={id,tagName:tag,style:{},disabled:false,textContent:'',type:'',value:'',dataset:{},
      getBoundingClientRect(){return {width:this.hidden||this.style.display==='none'?0:100,height:40}},
      focus(){ctx.document.activeElement=this},blur(){ctx.document.activeElement=null},click(){this.clicks=(this.clicks||0)+1},
      querySelectorAll(){return this.children||[]},appendChild(child){elements.set(child.id,child)},
      dispatchEvent(e){this.lastEvent=e.type}
    };elements.set(id,el);return el;
  }
  const ctx={console,Set,Map,Date,Math,JSON,Object,Array,Number,String,
    running:false,paused:false,player:{x:310},pointerX:310,W:620,
    performance:{now:()=>now},navigator:{getGamepads:()=>pads},
    localStorage:{getItem:key=>storage.get(key)||null,setItem(key,value){if(storageFails)throw Error('denied');storage.set(key,value)}},
    matchMedia:()=>({matches:true}),getComputedStyle:el=>({display:el.style.display||'block',visibility:'visible',opacity:'1',zIndex:el.style.zIndex||'0'}),
    CustomEvent:class{constructor(type,args){this.type=type;this.detail=args?.detail}},Event:class{constructor(type){this.type=type}},
    setTimeout(){},requestAnimationFrame:fn=>frames.push(fn),
    addEventListener(type,fn){if(!events.has(type))events.set(type,[]);events.get(type).push(fn)},
    dispatchEvent(e){for(const fn of events.get(e.type)||[])fn(e)},
    doBoost(){ctx.boosts=(ctx.boosts||0)+1},pauseGame(){ctx.paused=true},resumeGame(){ctx.paused=false},
    OrbuffPcSettings:{isOpen:()=>settings,close:()=>{settings=false},refresh(){}},
  };
  ctx.window=ctx;
  ctx.document={hidden:false,activeElement:null,head:{appendChild(el){elements.set(el.id,el)}},
    createElement:()=>element('new','DIV'),getElementById:id=>elements.get(id)||null,
    querySelector:()=>null,querySelectorAll:selector=>selector==='.overlay'?[...elements.values()].filter(e=>e.overlay):[...elements.values()].filter(e=>e.tagName==='BUTTON'),
    addEventListener:ctx.addEventListener,
  };
  vm.createContext(ctx);vm.runInContext(source,ctx);
  function key(type,code,extra={}){const event={type,code,target:ctx.document.activeElement,preventDefault(){this.prevented=true},stopImmediatePropagation(){},...extra};ctx.dispatchEvent(event);return event}
  return {ctx,controls:ctx.OrbuffDesktopControls,storage,element,key,
    frame(ms=200){now+=ms;frames.shift()()},setPad(pad){pads=pad?[pad]:[]},settings(value){settings=value},isOpen:()=>settings};
}
const h=harness(),{controls:c,ctx}=h;
assert.equal(c.bindingLabel('left'),'A / ←');
assert.equal(c.bindKey('left',0,'KeyJ').ok,true);
assert.equal(c.bindKey('right',0,'KeyJ').reason,'conflict');
assert.equal(c.bindKey('left',0,'Escape').reason,'reserved');
assert.equal(c.bindKey('left',0,'Tab').ok,false);
assert.equal(c.bindKey('left',0,'F11').ok,false);
assert.equal(c.bindKey('boost',1,'KeyK').ok,true);
ctx.running=true;
h.key('keydown','KeyJ');h.frame();assert.ok(ctx.pointerX<ctx.player.x,'rebound move works');
h.key('keyup','KeyJ');h.frame();assert.equal(ctx.pointerX,ctx.player.x,'release stops movement');
h.key('keydown','KeyA');h.frame();assert.equal(ctx.pointerX,ctx.player.x,'old binding no longer moves');
h.key('keydown','KeyK');h.key('keydown','KeyK',{repeat:true});assert.equal(ctx.boosts,1,'held boost fires once');
h.key('keydown','KeyP');assert.equal(ctx.paused,true);
h.settings(true);h.key('keydown','Escape');assert.equal(h.isOpen(),false);assert.equal(ctx.paused,true,'close settings never resumes game');
c.beginCapture('right',0);h.key('keydown','Space');assert.equal(c.captureActive(),true,'conflict keeps capture open');
h.key('keydown','KeyL');assert.equal(c.captureActive(),false);assert.equal(c.snapshot().keys.right[0],'KeyL');
c.beginCapture('boost',0);h.key('keydown','Escape');assert.equal(c.captureActive(),false);assert.equal(ctx.paused,true,'cancel never resumes');
const restored=harness(h.storage.get('orbuffPcControlsV1'));assert.equal(restored.controls.bindingLabel('right'),'L / →');
for(const saved of ['{','null',JSON.stringify({version:2}),JSON.stringify({version:1,keys:{left:['KeyA'],right:['KeyA'],boost:['Space'],pause:['KeyP']}})])assert.equal(harness(saved).controls.bindingLabel('left'),'A / ←','invalid storage falls back safely');
assert.equal(harness(null,{storageFails:true}).controls.bindKey('left',0,'KeyJ').saved,false,'storage failure is surfaced');
c.resetControls();assert.equal(c.bindingLabel('left'),'A / ←');
const pad={id:'Xbox',index:0,mapping:'standard',connected:true,axes:[0,0],buttons:Array.from({length:16},()=>({pressed:false}))};
ctx.paused=false;h.setPad(pad);pad.axes[0]=.8;h.frame();assert.ok(ctx.pointerX>ctx.player.x);pad.axes[0]=.1;h.frame();assert.equal(ctx.pointerX,ctx.player.x,'deadzone stops movement');
c.bindButton('boost',2);pad.buttons[0].pressed=true;h.frame();assert.equal(ctx.boosts,1,'old controller boost removed');pad.buttons[2].pressed=true;h.frame();h.frame();assert.equal(ctx.boosts,2,'mapped controller action is edge-triggered');
assert.equal(c.bindButton('boost',1).ok,false,'Back is reserved');assert.equal(c.bindButton('pause',2).ok,false,'pause cannot collide with boost');
h.setPad(null);h.frame();assert.equal(ctx.pointerX,ctx.player.x);
h.key('keydown','KeyA');h.frame();ctx.dispatchEvent({type:'blur'});h.frame();assert.equal(ctx.pointerX,ctx.player.x,'blur clears held input');
ctx.running=false;
const modal=h.element('modal','DIV');modal.overlay=true;modal.style.zIndex='100';const one=h.element('one'),two=h.element('two');modal.children=[one,two];
one.focus();h.key('keydown','ArrowDown');assert.equal(ctx.document.activeElement,two);h.key('keydown','Enter');assert.equal(two.clicks,1);
const outside=h.element('outside');outside.focus();c.activateFocused();assert.equal(outside.clicks,undefined,'controller cannot activate background UI');assert.equal(ctx.document.activeElement,one);
h.settings(true);const input=h.element('slider','INPUT');input.type='range';input.value='50';input.min='0';input.max='100';input.step='5';modal.children.push(input);input.focus();h.key('keydown','Tab');assert.equal(ctx.document.activeElement,one,'Tab stays inside settings from editable input');
input.focus();pad.buttons.forEach(b=>b.pressed=false);pad.axes=[1,0];h.setPad(pad);h.frame();assert.equal(Number(input.value),55);h.frame(16);assert.equal(Number(input.value),55,'controller slider respects repeat delay');pad.axes=[0,1];h.frame();assert.equal(ctx.document.activeElement,one,'vertical stick exits slider');
console.log('PASS PC controls: persistence, validation, keyboard capture, movement, pause, focus trap, controller mapping, deadzone, edges, disconnect, sliders and repeat.');
