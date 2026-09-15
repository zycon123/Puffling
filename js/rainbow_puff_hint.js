(function(){
 const hint=document.createElement('div');hint.id='rainbowPuffHint';
 const texts={no:'Dobbeltklikk for boost 🌈',en:'Double tap for boost 🌈',de:'Doppeltippen für Boost 🌈',es:'Doble toque para boost 🌈',fr:'Double-tapez pour le boost 🌈'};
 let runStartedAt=0,wasRunning=false;
 function updateHint(){const selected=(typeof lang!=='undefined'&&lang)||(typeof save!=='undefined'&&save.lang)||'en';const next=texts[selected]||texts.en;if(hint.textContent!==next)hint.textContent=next;const active=typeof running!=='undefined'&&running&&!(typeof paused!=='undefined'&&paused);if(active&&!wasRunning)runStartedAt=Date.now();if(!active)runStartedAt=0;wasRunning=active;const visible=active&&Date.now()-runStartedAt<7000;const d=visible?'block':'none';if(hint.style.display!==d)hint.style.display=d}
 Object.assign(hint.style,{position:'fixed',left:'50%',bottom:'calc(env(safe-area-inset-bottom, 0px) + 62px)',transform:'translateX(-50%)',zIndex:'7',pointerEvents:'none',fontSize:'12px',fontWeight:'900',letterSpacing:'.2px',color:'rgba(255,255,255,.92)',textShadow:'0 2px 6px rgba(0,0,0,.45)',background:'rgba(20,55,90,.35)',padding:'5px 10px',borderRadius:'999px',whiteSpace:'nowrap',opacity:'.9',display:'none'});
 document.body.appendChild(hint);updateHint();
 if(typeof languageSelectEl!=='undefined'&&languageSelectEl)languageSelectEl.addEventListener('change',updateHint);
 setInterval(updateHint,750);
})();
