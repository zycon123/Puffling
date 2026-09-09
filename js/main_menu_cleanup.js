/* Sky Puff — cleaner grouped main menu v0.1 */
(function(){
 function ensure(){
  const actions=document.querySelector('#start .menuActions');if(!actions||document.getElementById('menuPrimaryGroup'))return;
  const play=document.getElementById('playBtn');
  const primary=document.createElement('div');primary.id='menuPrimaryGroup';primary.className='spMenuGroup';
  const collection=document.createElement('div');collection.id='menuCollectionGroup';collection.className='spMenuGroup spMenuGrid';
  const more=document.createElement('details');more.id='menuMoreGroup';more.className='spMenuMore';more.innerHTML='<summary>MER ☰</summary><div class="spMenuGroup spMenuGrid" id="menuMoreGrid"></div>';
  actions.parentNode.insertBefore(primary,actions);actions.parentNode.insertBefore(collection,actions);actions.parentNode.insertBefore(more,actions);actions.style.display='none';
  if(play)primary.appendChild(play);
  const move=(id,parent)=>{const e=document.getElementById(id);if(e)parent.appendChild(e)};
  // Keep only the most-used options visible.
  ['multiplayerBtn','bossRushBtn','puffdexBtn','dailyBtn'].forEach(id=>move(id,collection));
  const mg=document.getElementById('menuMoreGrid');
  ['shopBtn','upgradeBtn','leaderboardBtn','achievementsBtn','diagnosticsBtn'].forEach(id=>move(id,mg));
  const style=document.createElement('style');style.id='spMenuCleanupCss';style.textContent=`
  #start .card{max-width:430px!important;padding:18px 16px!important}
  #start h1{margin:4px 0 2px!important}.menuStats{margin:9px 0!important}
  .spMenuGroup{display:grid;gap:8px;margin-top:9px}.spMenuGrid{grid-template-columns:1fr 1fr}
  .spMenuGroup button{margin:0!important;min-height:44px;padding:10px 8px!important;font-size:13px!important}
  #menuPrimaryGroup button{font-size:17px!important;min-height:50px!important}
  .spMenuMore{margin-top:8px;border-radius:14px;background:rgba(255,255,255,.34);overflow:hidden}
  .spMenuMore summary{cursor:pointer;list-style:none;padding:10px 12px;font-weight:900;color:#35516b;user-select:none}.spMenuMore summary::-webkit-details-marker{display:none}
  .spMenuMore[open] summary{border-bottom:1px solid rgba(60,100,140,.12)}.spMenuMore .spMenuGroup{padding:9px;margin:0}
  #start .small#menuHint{font-size:11px!important;line-height:1.3;margin-top:9px!important;opacity:.8}
  #start .menuVersion{font-size:10px!important;margin-top:7px!important;opacity:.65}
  @media(max-width:390px){.spMenuGrid{grid-template-columns:1fr 1fr}.spMenuGroup button{font-size:12px!important;padding:9px 5px!important}.menuStats{grid-template-columns:repeat(2,1fr)!important}}
  `;document.head.appendChild(style);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,0));else setTimeout(ensure,0);
 window.SkyPuffMenuCleanup={ensure};
})();
