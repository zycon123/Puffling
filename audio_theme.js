(() => {
  let ctx=null, timer=null, step=0, gain=null;
  const melody=[0,4,7,12,7,4,2,7,9,7,4,0,2,4,7,11];
  const bass=[0,0,5,5,7,7,4,4];
  const root=261.63, bpm=116;
  const freq=n=>root*Math.pow(2,n/12);

  function tone(f,t,d,type='triangle',v=.035){
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(Math.max(.0002,v),t+.015);
    g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g);g.connect(gain);o.start(t);o.stop(t+d+.03);
  }
  function tick(){
    if(!ctx||!gain)return;
    const beat=60/bpm,now=ctx.currentTime+.03,i=step++;
    tone(freq(melody[i%melody.length]),now,beat*.72,'triangle',.035);
    if(i%2===0)tone(freq(-12+bass[(i/2|0)%bass.length]),now,beat*.9,'sine',.024);
    if(i%4===0)tone(freq(12+melody[(i+4)%melody.length]),now,beat*1.6,'sine',.012);
  }
  window.startSkyTheme=()=>{
    try{
      ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
      if(ctx.state==='suspended')ctx.resume();
      if(timer)return;
      gain=ctx.createGain();gain.gain.value=.22;gain.connect(ctx.destination);
      step=0;tick();timer=setInterval(tick,(60/bpm)*1000);
    }catch(_){}
  };
  window.stopSkyTheme=()=>{
    if(timer){clearInterval(timer);timer=null}
    if(gain&&ctx){
      try{const t=ctx.currentTime;gain.gain.cancelScheduledValues(t);gain.gain.setValueAtTime(Math.max(.0001,gain.gain.value),t);gain.gain.exponentialRampToValueAtTime(.0001,t+.18)}catch(_){}
    }
    gain=null;
  };
  window.setSkyThemeVolume=v=>{if(gain)gain.gain.value=Math.max(.01,Math.min(1,v))*.4};
})();
