/* Sky Puff — Puffdex + Fusion Lab UI v0.3 */
(function(){
  function allPuffs(){
    const F=window.SkyPuffFusion;if(!F)return [];
    const fused=Object.values(F.FUSIONS||{});return [...Object.values(F.BASE||{}),...fused];
  }
  function rarityLabel(r){return ({common:'Common',rare:'Rare',epic:'Epic',legendary:'Legendary',mythic:'Mythic'})[r]||r;}
  function ensureUI(){
    if(document.getElementById('puffdexMenu'))return;
    const wrap=document.createElement('div');wrap.id='puffdexMenu';wrap.className='overlay';wrap.style.display='none';
    wrap.innerHTML='<div class="card" style="max-width:760px"><h1 style="font-size:36px">Puffdex ☁️</h1><div id="puffdexSummary" class="small" style="margin-bottom:12px"></div><div id="puffdexGrid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;text-align:left"></div><button id="openFusionLabBtn" class="gold" style="margin-top:14px">FUSION LAB 🧬</button><button id="closePuffdex" class="secondary">TILBAKE</button></div>';
    document.body.appendChild(wrap);
    const lab=document.createElement('div');lab.id='fusionLabMenu';lab.className='overlay';lab.style.display='none';
    lab.innerHTML='<div class="card" style="max-width:620px"><h1 style="font-size:36px">Fusion Lab 🧬</h1><div class="small" style="margin-bottom:12px">Velg to Pufflings du eier. Gyldige kombinasjoner viser hva du kan lage.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><select id="fusionA" style="padding:12px;border:0;border-radius:12px"></select><select id="fusionB" style="padding:12px;border:0;border-radius:12px"></select></div><div id="fusionPreview" style="margin:14px 0;padding:14px;border-radius:16px;background:rgba(255,255,255,.72);font-weight:900"></div><button id="doFusionBtn" class="gold">FUSIONER</button><button id="closeFusionLab" class="secondary">TILBAKE</button></div>';
    document.body.appendChild(lab);
    const startActions=document.querySelector('#start .menuActions');if(startActions&&!document.getElementById('puffdexBtn')){const b=document.createElement('button');b.id='puffdexBtn';b.className='gold';b.textContent='PUFFDEX ☁️';startActions.appendChild(b);}
    document.getElementById('puffdexBtn')?.addEventListener('click',()=>openDex());
    document.getElementById('closePuffdex')?.addEventListener('click',()=>{wrap.style.display='none';document.getElementById('start').style.display='flex';});
    document.getElementById('openFusionLabBtn')?.addEventListener('click',()=>{wrap.style.display='none';openLab();});
    document.getElementById('closeFusionLab')?.addEventListener('click',()=>{lab.style.display='none';openDex();});
    document.getElementById('fusionA')?.addEventListener('change',renderPreview);document.getElementById('fusionB')?.addEventListener('change',renderPreview);document.getElementById('doFusionBtn')?.addEventListener('click',doFusion);
  }
  function openDex(){ensureUI();document.getElementById('start').style.display='none';document.getElementById('puffdexMenu').style.display='flex';renderDex();}
  function renderDex(){
    const F=window.SkyPuffFusion;if(!F)return;const s=F.load(),grid=document.getElementById('puffdexGrid');grid.innerHTML='';const list=allPuffs(),activeId=window.SkyPuffPufflingGameplay?.active?.()||'';
    document.getElementById('puffdexSummary').textContent=`Oppdaget ${s.discovered.length} / ${list.length} Pufflings`;
    list.forEach(p=>{
      const owned=s.owned[p.id]||0,found=s.discovered.includes(p.id),isActive=activeId===p.id,prog=window.SkyPuffPufflingProgress?.get?.(p.id)||{level:1,xp:0,next:0};
      const pct=prog.next?Math.min(100,Math.round(prog.xp/prog.next*100)):100;
      const d=document.createElement('div');d.style.cssText=`padding:12px;border-radius:16px;background:${isActive?'rgba(215,248,255,.95)':'rgba(255,255,255,.78)'};min-height:154px;border:${isActive?'2px solid #55c8ff':'2px solid transparent'}`;
      if(found){d.innerHTML=`<div style="font-size:30px">${p.icon||'☁️'}</div><b>${p.name}</b><div class="small">${rarityLabel(p.rarity)} • x${owned}</div><div class="small">Level ${prog.level}${prog.next?` • ${prog.xp}/${prog.next} XP`:' • MAX'}</div><div style="height:6px;background:rgba(0,0,0,.1);border-radius:99px;overflow:hidden;margin:5px 0 7px"><div style="height:100%;width:${pct}%;background:#62c6ff"></div></div><div class="small">${p.ability||''}</div>${owned>0?`<button data-equip="${p.id}" class="${isActive?'gold':'secondary'}" style="margin-top:8px;padding:8px 10px;font-size:12px">${isActive?'AKTIV ✓':'EQUIP'}</button>`:''}`;}else d.innerHTML='<div style="font-size:30px">❔</div><b>???</b><div class="small">Ikke oppdaget</div>';
      grid.appendChild(d);
    });
    grid.querySelectorAll('[data-equip]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.getAttribute('data-equip');if(window.SkyPuffPufflingGameplay?.setActive?.(id)){const p=allPuffs().find(x=>x.id===id);if(typeof showToast==='function')showToast(`${p?.icon||'☁️'} ${p?.name||id} er nå aktiv!`);renderDex();}}));
  }
  function openLab(){ensureUI();document.getElementById('fusionLabMenu').style.display='flex';populateSelectors();renderPreview();}
  function populateSelectors(){const F=window.SkyPuffFusion,s=F.load(),ids=Object.keys(s.owned).filter(id=>s.owned[id]>0);const opts=ids.map(id=>{const p=[...Object.values(F.BASE),...Object.values(F.FUSIONS)].find(x=>x.id===id);return p?`<option value="${id}">${p.icon||'☁️'} ${p.name} (x${s.owned[id]})</option>`:''}).join('');['fusionA','fusionB'].forEach(id=>document.getElementById(id).innerHTML=opts||'<option value="">Ingen Pufflings eid</option>');}
  function renderPreview(){const F=window.SkyPuffFusion,a=document.getElementById('fusionA')?.value,b=document.getElementById('fusionB')?.value,box=document.getElementById('fusionPreview');if(!box||!F)return;const recipe=F.FUSIONS[F.key(a,b)];box.textContent=recipe?`${recipe.icon||'✨'} ${recipe.name} — ${rarityLabel(recipe.rarity)}`:'Ingen kjent fusion for denne kombinasjonen.';}
  function doFusion(){const F=window.SkyPuffFusion,a=document.getElementById('fusionA').value,b=document.getElementById('fusionB').value,res=F.fuse(a,b);if(!res.ok){alert('Fusion kunne ikke gjennomføres.');return;}alert(`✨ Ny Puffling: ${res.puffling.name}!`);populateSelectors();renderPreview();renderDex();}
  window.SkyPuffFusionUI={openDex,openLab,renderDex};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureUI);else ensureUI();
})();