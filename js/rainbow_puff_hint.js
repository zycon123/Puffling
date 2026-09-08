(function(){
 const hint=document.createElement('div');
 hint.id='rainbowPuffHint';
 hint.textContent='Dobbeltklikk for Rainbow Puff 🌈';
 Object.assign(hint.style,{
  position:'fixed',left:'50%',bottom:'calc(env(safe-area-inset-bottom, 0px) + 8px)',transform:'translateX(-50%)',zIndex:'7',
  pointerEvents:'none',fontSize:'12px',fontWeight:'900',letterSpacing:'.2px',color:'rgba(255,255,255,.92)',
  textShadow:'0 2px 6px rgba(0,0,0,.45)',background:'rgba(20,55,90,.22)',backdropFilter:'blur(3px)',
  padding:'4px 9px',borderRadius:'999px',whiteSpace:'nowrap',opacity:'.82'
 });
 document.body.appendChild(hint);
})();