import fs from 'node:fs';
import vm from 'node:vm';

const root=process.cwd();
const fail=message=>{throw new Error(message)};
const ok=message=>console.log(`✅ ${message}`);
const source=file=>fs.readFileSync(`${root}/${file}`,'utf8');

function storage(seed={}){
  const data=new Map(Object.entries(seed).map(([key,value])=>[key,String(value)]));
  return {getItem:key=>data.has(key)?data.get(key):null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)};
}

function element(tag,id='',nodes){
  const children=[];
  const node={tag,id,style:{},dataset:{},children,parentElement:null,textContent:'',className:'',type:'',onclick:null,
    appendChild(child){child.parentElement=this;children.push(child);if(child.id)nodes.set(child.id,child);return child;},
    setAttribute(name,value){this[name]=String(value);},addEventListener(name,fn,capture){this.listeners??={};this.listeners[name]={fn,capture};}
  };
  Object.defineProperty(node,'innerHTML',{get(){return this._html||''},set(value){this._html=String(value);children.length=0;if(this.id==='starterPufflingChoice')for(const childId of ['starterChoiceTitle','starterChoiceSub','starterChoiceGrid'])nodes.set(childId,element('div',childId,nodes));}});
  return node;
}

function context(seed={}){
  const nodes=new Map(),localStorage=storage(seed),start=element('div','start',nodes),play=element('button','playBtn',nodes),retry=element('button','retryBtn',nodes);
  start.inert=false;start.style.display='flex';nodes.set('start',start);nodes.set('playBtn',play);nodes.set('retryBtn',retry);
  const body=element('body','',nodes),head=element('head','',nodes);
  const document={readyState:'loading',body,head,getElementById:id=>nodes.get(id)||null,createElement:tag=>element(tag,'',nodes),addEventListener(){}};
  const ctx={console,localStorage,document,lang:'no',setTimeout:()=>0,CustomEvent:class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}},showToast(){},running:false};
  ctx.window=ctx;ctx.globalThis=ctx;ctx.addEventListener=()=>{};ctx.dispatchEvent=()=>true;vm.createContext(ctx);
  vm.runInContext(source('js/puff_fusion_core.js'),ctx,{filename:'js/puff_fusion_core.js'});
  vm.runInContext(source('js/puffling_starter_choice.js'),ctx,{filename:'js/puffling_starter_choice.js'});
  return {ctx,nodes,localStorage,play,retry};
}

{
  const {ctx,nodes,localStorage,play,retry}=context();
  const F=ctx.SkyPuffFusion,S=ctx.SkyPuffStarterChoice;
  if(!S.eligible()||Object.keys(F.load().owned).length!==0)fail('Fresh profile is not waiting for a starter with empty ownership');
  F.add('ember',1);
  if(!S.eligible())fail('An accidental or legacy non-starter incorrectly blocks starter choice');
  S.bindGuards();
  if(play.listeners?.click?.capture!==true||retry.listeners?.click?.capture!==true)fail('Play/retry starter guard is not installed in capture phase');
  let prevented=0,stopped=0;S.guardPlay({preventDefault:()=>prevented++,stopImmediatePropagation:()=>stopped++});
  if(prevented!==1||stopped!==1||nodes.get('starterPufflingChoice')?.style.display!=='flex')fail('Normal play was not blocked while starter choice was pending');
  const buttons=nodes.get('starterChoiceGrid')?.children||[];
  if(buttons.length!==3||buttons.some(button=>button.type!=='button'||!String(button.style.cssText).includes('touch-action:manipulation')))fail('Starter chooser does not render three touch-safe choices');
  buttons[1].onclick();
  const state=F.load(),starters=S.IDS.filter(id=>(state.owned[id]||0)>0);
  if(starters.length!==1||starters[0]!=='starterspark'||state.owned.starterspark!==1)fail('Starter selection did not grant exactly the chosen Puffling');
  if(localStorage.getItem('skyPuffStarterChoiceV1')!=='starterspark'||S.eligible())fail('Completed starter selection was not persisted');
  buttons[2].onclick();
  if((F.load().owned.starterdrop||0)!==0||S.IDS.filter(id=>(F.load().owned[id]||0)>0).length!==1)fail('A second starter could be claimed');
  ok('Fresh/legacy profile can choose exactly one touch-safe starter before normal play');
}

{
  const {ctx,localStorage}=context({skyPuffPufflings:JSON.stringify({owned:{starterdrop:1},discovered:['starterdrop'],vault:[],tradeReceipts:[]})});
  const S=ctx.SkyPuffStarterChoice;
  if(S.chosen()!=='starterdrop'||S.eligible()||localStorage.getItem('skyPuffStarterChoiceV1')!=='starterdrop')fail('Owned legacy starter was not repaired into completed onboarding');
  ok('Legacy starter ownership repairs missing onboarding marker');
}

{
  const {ctx,localStorage}=context({skyPuffStarterChoiceV1:'starterpuff'});
  if(!ctx.SkyPuffStarterChoice.eligible()||localStorage.getItem('skyPuffStarterChoiceV1')!==null)fail('Corrupt starter marker without ownership was not cleared');
  ok('Corrupt onboarding marker cannot skip starter choice');
}

const gameplay=source('js/puffling_gameplay.js');
if(/awardRunPuffling|skyPuffPufflingRunRewardV1|score\s*>=\s*600/.test(gameplay)||!gameplay.includes('runHeightReward:false'))fail('Pre-boss automatic Puffling grant is active');
ok('First run cannot award extra Pufflings before a verified boss reward');

const index=source('index.html'),diagnostics=source('js/diagnostics_support.js');
if(!index.includes('id="resetBetaDataBtn"')||!diagnostics.includes('clearPufflingStorage')||!diagnostics.includes("storage.getItem('skyPuffLang')")||!diagnostics.includes('/^(skyPuff|puffling)/i'))fail('Safe beta reset control is missing or can clear unrelated origin data');
ok('System & Support offers a scoped clean-profile reset while preserving language');
