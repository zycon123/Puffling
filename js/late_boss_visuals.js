/* Sky Puff — lightweight late boss visual identities v0.1 */
(function(){
 const late=new Set(['solar','void','thunder','crystal','inferno','cosmic']);
 const old=window.drawBoss;if(typeof old!=='function')return;
 window.drawBoss=function(){
  if(!boss||!late.has(boss.id))return old();
  const id=boss.id,n=performance.now(),pulse=.5+.5*Math.sin(n/220);
  const pal={solar:['#ffd85a','#ff8b38'],void:['#8e69c7','#26183f'],thunder:['#ffe45c','#536b9e'],crystal:['#bdf9ff','#668cff'],inferno:['#ff9a3d','#a72d2d'],cosmic:['#d2b5ff','#38256f']}[id];
  ctx.save();ctx.translate(boss.x,boss.y+Math.sin(n/300)*3);
  ctx.globalAlpha=.18+.08*pulse;ctx.strokeStyle=pal[0];ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,boss.r+9+3*pulse,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
  ctx.shadowColor=pal[0];ctx.shadowBlur=12;
  const g=ctx.createRadialGradient(-10,-12,4,0,0,boss.r);g.addColorStop(0,'#fff');g.addColorStop(.28,pal[0]);g.addColorStop(1,pal[1]);ctx.fillStyle=typeof bossFlash!=='undefined'&&bossFlash>0?'#fff':g;
  ctx.beginPath();
  if(id==='crystal'){for(let i=0;i<8;i++){const a=-Math.PI/2+i*Math.PI/4,r1=boss.r*.72,r2=boss.r;const x=Math.cos(a)*r2,y=Math.sin(a)*r2;const x1=Math.cos(a-.22)*r1,y1=Math.sin(a-.22)*r1;const x2=Math.cos(a+.22)*r1,y2=Math.sin(a+.22)*r1;ctx.moveTo(x1,y1);ctx.lineTo(x,y);ctx.lineTo(x2,y2);}ctx.fill();ctx.beginPath();ctx.arc(0,0,boss.r*.72,0,Math.PI*2);ctx.fill();}else{ctx.arc(0,0,boss.r*.82,0,Math.PI*2);ctx.fill();}
  ctx.shadowBlur=0;
  // Small identity ornaments only; avoids heavy textures/particles.
  ctx.fillStyle=pal[0];ctx.font='bold 22px system-ui';ctx.textAlign='center';const mark={solar:'☀',void:'◆',thunder:'ϟ',crystal:'✦',inferno:'♨',cosmic:'✧'}[id];ctx.fillText(mark,0,-boss.r*.93);
  ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-13,-5,6,5,0,0,Math.PI*2);ctx.ellipse(13,-5,6,5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#20223a';ctx.beginPath();ctx.arc(-13,-5,2.5,0,Math.PI*2);ctx.arc(13,-5,2.5,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#2b2340';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,10,13,.12*Math.PI,.88*Math.PI);ctx.stroke();
  ctx.font='800 10px system-ui';ctx.fillStyle='rgba(255,255,255,.92)';ctx.fillText(boss.name,0,boss.r+15);
  ctx.restore();
 };
})();
