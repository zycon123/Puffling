/* Sky Puff — Puffling Performance Mode v0.1 */
(function(){
 const KEY='skyPuffPerformanceMode';
 function autoLow(){try{return (navigator.deviceMemory&&navigator.deviceMemory<=4)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)||innerWidth<430}catch(e){return false}}
 function mode(){try{return localStorage.getItem(KEY)||'auto'}catch(e){return 'auto'}}
 function low(){const m=mode();return m==='low'||(m==='auto'&&autoLow())}
 function apply(){document.documentElement.classList.toggle('spLowFx',low());}
 function setMode(v){if(!['auto','high','low'].includes(v))return false;localStorage.setItem(KEY,v);apply();return true}
 const s=document.createElement('style');s.textContent=`.spLowFx .spPuffArt{animation-duration:2.5s!important;box-shadow:0 3px 7px #0002!important;filter:none!important}.spLowFx .spPuffArt:after,.spLowFx .spPuffArt:before{display:none!important}.spLowFx .spPuffArt.s1,.spLowFx .spPuffArt.s2{box-shadow:0 4px 9px #0003!important}.spLowFx #pufflingFollower{filter:none!important}`;document.head.appendChild(s);apply();
 window.SkyPuffPerformance={mode,low,setMode,apply};
})();
