/* Orbuff — privacy policy, deletion web resource, and account ID support links */
(function(){
  const PRIVACY_URL='https://zycon123.github.io/Puffling/privacy.html';
  const DELETE_URL='https://zycon123.github.io/Puffling/delete-account.html';
  const copy={
    no:{privacy:'PERSONVERN',deletion:'SLETTING & PERSONVERNVALG',account:'GJESTEKONTO-ID',copy:'KOPIER ID',copied:'Kopiert',none:'Ingen gjestekonto er opprettet ennå.'},
    en:{privacy:'PRIVACY POLICY',deletion:'DELETION & PRIVACY CHOICES',account:'GUEST ACCOUNT ID',copy:'COPY ID',copied:'Copied',none:'No guest account has been created yet.'},
    de:{privacy:'DATENSCHUTZ',deletion:'LÖSCHUNG & DATENSCHUTZOPTIONEN',account:'GASTKONTO-ID',copy:'ID KOPIEREN',copied:'Kopiert',none:'Es wurde noch kein Gastkonto erstellt.'},
    es:{privacy:'POLÍTICA DE PRIVACIDAD',deletion:'ELIMINACIÓN Y OPCIONES DE PRIVACIDAD',account:'ID DE CUENTA DE INVITADO',copy:'COPIAR ID',copied:'Copiado',none:'Aún no se ha creado una cuenta de invitado.'},
    fr:{privacy:'POLITIQUE DE CONFIDENTIALITÉ',deletion:'SUPPRESSION & CHOIX DE CONFIDENTIALITÉ',account:'ID DU COMPTE INVITÉ',copy:'COPIER ID',copied:'Copié',none:'Aucun compte invité n’a encore été créé.'}
  };
  function lang(){try{const v=String(localStorage.getItem('skyPuffLang')||'no');return copy[v]?v:'en';}catch{return'en';}}
  function text(){return copy[lang()]||copy.en;}
  function accountId(){try{return String(localStorage.getItem('pufflingAccountId')||'').trim();}catch{return'';}}
  function openExternal(url){try{window.open(url,'_blank','noopener,noreferrer');}catch{location.href=url;}}
  async function copyAccountId(){
    const id=accountId(),t=text();if(!id){alert(t.none);return false;}
    try{await navigator.clipboard.writeText(id);}catch{prompt(t.account,id);return true;}
    const button=document.getElementById('copyOrbuffAccountIdBtn');if(button){const old=button.textContent;button.textContent=`✓ ${t.copied}`;setTimeout(()=>{button.textContent=text().copy;},1300);}
    return true;
  }
  function sync(){
    const t=text(),id=accountId();
    const privacy=document.getElementById('orbuffPrivacyPolicyBtn');if(privacy)privacy.textContent=`🔒 ${t.privacy}`;
    const deletion=document.getElementById('orbuffDeletionWebBtn');if(deletion)deletion.textContent=`🧾 ${t.deletion}`;
    const label=document.getElementById('orbuffAccountIdLabel');if(label)label.textContent=t.account;
    const value=document.getElementById('orbuffAccountIdValue');if(value)value.textContent=id||'—';
    const copyBtn=document.getElementById('copyOrbuffAccountIdBtn');if(copyBtn){copyBtn.textContent=t.copy;copyBtn.disabled=!id;}
  }
  function mount(){
    const menu=document.querySelector('#diagnosticsMenu .card');if(!menu||document.getElementById('orbuffPrivacyLinks'))return;
    const wrap=document.createElement('div');wrap.id='orbuffPrivacyLinks';wrap.style.cssText='display:grid;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid rgba(70,115,150,.2)';
    const privacy=document.createElement('button');privacy.id='orbuffPrivacyPolicyBtn';privacy.type='button';privacy.className='secondary';privacy.addEventListener('click',()=>openExternal(PRIVACY_URL));
    const deletion=document.createElement('button');deletion.id='orbuffDeletionWebBtn';deletion.type='button';deletion.className='secondary';deletion.addEventListener('click',()=>openExternal(DELETE_URL));
    const account=document.createElement('div');account.style.cssText='background:rgba(235,247,255,.72);border-radius:14px;padding:10px 12px;text-align:left;color:#35516b';account.innerHTML='<div id="orbuffAccountIdLabel" style="font-size:11px;font-weight:900;opacity:.7"></div><div id="orbuffAccountIdValue" style="font:700 12px ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere;margin:4px 0 7px">—</div>';
    const copyBtn=document.createElement('button');copyBtn.id='copyOrbuffAccountIdBtn';copyBtn.type='button';copyBtn.className='secondary';copyBtn.style.cssText='margin:0;padding:7px 10px;font-size:11px;min-height:0';copyBtn.addEventListener('click',copyAccountId);account.appendChild(copyBtn);
    wrap.append(privacy,deletion,account);
    const deleteButton=document.getElementById('deleteGuestAccountBtn');menu.insertBefore(wrap,deleteButton||document.getElementById('closeDiagnostics')||null);
    sync();
  }
  window.addEventListener('storage',e=>{if(['skyPuffLang','pufflingAccountId'].includes(e.key))sync();});
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(sync,0));
  window.addEventListener('sky-puff-ready',()=>{mount();sync();},{once:true});
  mount();
  window.OrbuffPrivacyLinks={privacyUrl:PRIVACY_URL,deletionUrl:DELETE_URL,mount,sync,copyAccountId};
})();
