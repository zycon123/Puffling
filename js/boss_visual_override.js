// Visual-only boss upgrade. Gameplay sizes/hitboxes remain unchanged.
(function(){
  if(typeof drawBoss!=='function') return;

  function eye(x,y,iris,angry){
    ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(x,y,6,5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=iris;ctx.beginPath();ctx.arc(x,y,2.6,0,Math.PI*2);ctx.fill();
    if(angry){ctx.strokeStyle='rgba(20,20,35,.75)';ctx.lineWidth=2.3;ctx.beginPath();ctx.moveTo(x-7,y-8);ctx.lineTo(x+2,y-5);ctx.stroke();}
  }

  function aura(col,pulse){
    ctx.save();ctx.globalAlpha=.24+.09*pulse;ctx.strokeStyle=col;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,2,54+4*pulse,45+3*pulse,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  }

  drawBoss=function(){
    if(!boss)return;
    ctx.save();ctx.translate(boss.x,boss.y);
    const now=performance.now(),hover=Math.sin(now/260)*4,pulse=.5+.5*Math.sin(now/180);
    ctx.translate(0,hover);

    let main='#566273',dark='#26313d',light='#a7b6c8',glow='#ffe66d';
    if(boss.id==='candy'){main='#d75ba6';dark='#7b2d68';light='#ffb5e5';glow='#ff8ad8';}
    if(boss.id==='ice'){main='#72cde9';dark='#2e7694';light='#d9f8ff';glow='#9ff1ff';}
    if(boss.id==='galaxy'){main='#6853a8';dark='#281d5d';light='#c6b7ff';glow='#bb94ff';}

    aura(glow,pulse);
    ctx.shadowColor=glow;ctx.shadowBlur=20+8*pulse;

    if(boss.id==='storm'){
      // Armored thunder cloud with horn-like lightning fins.
      ctx.fillStyle='#ffd43b';
      for(const sx of [-1,1]){ctx.save();ctx.scale(sx,1);ctx.beginPath();ctx.moveTo(28,-28);ctx.lineTo(48,-39);ctx.lineTo(38,-18);ctx.lineTo(53,-15);ctx.lineTo(31,3);ctx.closePath();ctx.fill();ctx.restore();}
      const g=ctx.createLinearGradient(0,-42,0,38);g.addColorStop(0,light);g.addColorStop(.52,main);g.addColorStop(1,dark);ctx.fillStyle=bossFlash>0?'#fff':g;
      ctx.beginPath();ctx.arc(-27,2,27,0,Math.PI*2);ctx.arc(0,-16,35,0,Math.PI*2);ctx.arc(29,2,29,0,Math.PI*2);ctx.arc(0,15,37,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;ctx.strokeStyle='#dfe7ef';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-21,-27);ctx.lineTo(-10,-14);ctx.lineTo(-17,-2);ctx.moveTo(19,-27);ctx.lineTo(9,-13);ctx.lineTo(16,-1);ctx.stroke();
      eye(-13,-3,'#ffd43b',true);eye(13,-3,'#ffd43b',true);
      ctx.strokeStyle='#19232e';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,12,13,.15*Math.PI,.85*Math.PI);ctx.stroke();
    }else if(boss.id==='candy'){
      // Candy dragon: horns, cheek scales, fangs and glossy candy body.
      ctx.fillStyle='#fff1a8';for(const sx of [-1,1]){ctx.save();ctx.scale(sx,1);ctx.beginPath();ctx.moveTo(18,-32);ctx.quadraticCurveTo(32,-53,38,-31);ctx.lineTo(28,-18);ctx.closePath();ctx.fill();ctx.restore();}
      const g=ctx.createRadialGradient(-10,-20,5,0,0,52);g.addColorStop(0,'#ffd7f0');g.addColorStop(.45,main);g.addColorStop(1,dark);ctx.fillStyle=bossFlash>0?'#fff':g;ctx.beginPath();ctx.ellipse(0,0,43,38,0,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;ctx.fillStyle='#ff8fcf';ctx.beginPath();ctx.arc(-28,9,8,0,Math.PI*2);ctx.arc(28,9,8,0,Math.PI*2);ctx.fill();
      eye(-14,-5,'#7b2d68',true);eye(14,-5,'#7b2d68',true);
      ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-10,13);ctx.lineTo(-4,24);ctx.lineTo(1,13);ctx.moveTo(10,13);ctx.lineTo(4,24);ctx.lineTo(-1,13);ctx.fill();
      ctx.strokeStyle='#8d2f72';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,10,16,.1*Math.PI,.9*Math.PI);ctx.stroke();
      ctx.globalAlpha=.5;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-12,-22,13,6,-.2,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    }else if(boss.id==='ice'){
      // Ice titan: crystal crown, angular jaw and frosty core.
      ctx.fillStyle='#dffaff';for(let i=-2;i<=2;i++){const x=i*15,h=24-Math.abs(i)*5;ctx.beginPath();ctx.moveTo(x-7,-28);ctx.lineTo(x,-28-h);ctx.lineTo(x+7,-28);ctx.closePath();ctx.fill();}
      const g=ctx.createLinearGradient(0,-45,0,40);g.addColorStop(0,'#e9fdff');g.addColorStop(.42,main);g.addColorStop(1,dark);ctx.fillStyle=bossFlash>0?'#fff':g;ctx.beginPath();ctx.moveTo(-40,-20);ctx.lineTo(-31,25);ctx.lineTo(-12,40);ctx.lineTo(12,40);ctx.lineTo(31,25);ctx.lineTo(40,-20);ctx.lineTo(20,-36);ctx.lineTo(-20,-36);ctx.closePath();ctx.fill();
      ctx.shadowBlur=0;ctx.strokeStyle='#b9f6ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-27,-20);ctx.lineTo(-15,2);ctx.lineTo(-26,24);ctx.moveTo(27,-20);ctx.lineTo(15,2);ctx.lineTo(26,24);ctx.stroke();
      eye(-13,-6,'#2e7694',true);eye(13,-6,'#2e7694',true);
      ctx.fillStyle='#d9fbff';ctx.beginPath();ctx.moveTo(-10,12);ctx.lineTo(0,22);ctx.lineTo(10,12);ctx.lineTo(0,30);ctx.closePath();ctx.fill();
      ctx.globalAlpha=.55+.25*pulse;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,6,6+2*pulse,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    }else{
      // Galaxy King: crown, orbiting stars and royal cosmic face.
      ctx.strokeStyle='#bfa8ff';ctx.lineWidth=2;ctx.globalAlpha=.7;ctx.beginPath();ctx.ellipse(0,0,51,24,now/1100,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
      for(let i=0;i<4;i++){const a=now/700+i*Math.PI/2;ctx.fillStyle=i%2?'#ffe66d':'#d6c4ff';ctx.beginPath();ctx.arc(Math.cos(a)*49,Math.sin(a)*24,3.2,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#f7d76b';ctx.beginPath();ctx.moveTo(-27,-29);ctx.lineTo(-20,-48);ctx.lineTo(-8,-35);ctx.lineTo(0,-53);ctx.lineTo(9,-35);ctx.lineTo(22,-48);ctx.lineTo(29,-28);ctx.closePath();ctx.fill();
      const g=ctx.createRadialGradient(-12,-20,5,0,0,50);g.addColorStop(0,light);g.addColorStop(.48,main);g.addColorStop(1,dark);ctx.fillStyle=bossFlash>0?'#fff':g;ctx.beginPath();ctx.arc(0,2,40,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;eye(-14,-5,'#ffe66d',true);eye(14,-5,'#ffe66d',true);
      ctx.fillStyle='#fff';ctx.globalAlpha=.45;ctx.beginPath();ctx.arc(-23,16,2,0,Math.PI*2);ctx.arc(24,-17,2.5,0,Math.PI*2);ctx.arc(5,-24,1.8,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
      ctx.strokeStyle='#2b1d58';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,13,15,.12*Math.PI,.88*Math.PI);ctx.stroke();
    }

    ctx.shadowBlur=0;
    if((boss.tier||1)>1){ctx.font='bold 11px Arial';ctx.textAlign='center';ctx.fillStyle='rgba(255,255,255,.9)';ctx.fillText('TIER '+boss.tier,0,54);}
    ctx.restore();
  };
})();