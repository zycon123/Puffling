/* Orbuff — packaged PC store policy v1.0
 * Mobile App Store / Google Play IAP must never be offered from the Electron PC SKU.
 * Earned/existing Diamonds and Mystery Shop spending remain available.
 */
(function(){
  const COPY={
    no:'Kjøp av diamanter med ekte penger er deaktivert i PC-builden. Opptjente diamanter og eksisterende saldo kan fortsatt brukes.',
    en:'Real-money Diamond purchases are disabled in the PC build. Earned Diamonds and your existing balance can still be used.',
    de:'Diamantkäufe mit Echtgeld sind im PC-Build deaktiviert. Verdiente Diamanten und dein vorhandenes Guthaben können weiterhin verwendet werden.',
    es:'Las compras de Diamantes con dinero real están desactivadas en la versión de PC. Los Diamantes obtenidos y tu saldo existente siguen disponibles.',
    fr:'Les achats de Diamants en argent réel sont désactivés dans la version PC. Les Diamants gagnés et votre solde existant restent utilisables.'
  };

  function isPackagedDesktop(){
    try{return location.protocol==='file:'&&/Electron/i.test(navigator.userAgent||'')}catch(e){return false}
  }
  function language(){
    try{return typeof lang==='string'?lang:(localStorage.getItem('skyPuffLang')||'en')}catch(e){return 'en'}
  }
  function message(){return COPY[language()]||COPY.en}
  function hideMobilePurchaseUi(){
    if(!isPackagedDesktop())return;
    document.documentElement.dataset.orbuffStore='pc';
    const entry=document.getElementById('openDiamondStore');
    if(entry){entry.hidden=true;entry.style.display='none';entry.disabled=true;entry.setAttribute('aria-hidden','true');}
    const menu=document.getElementById('diamondStoreMenu');
    if(menu){menu.style.display='none';menu.setAttribute('aria-hidden','true');}
    const mystery=document.getElementById('mysteryShopMenu');
    if(mystery){
      let notice=document.getElementById('orbuffPcStoreNotice');
      if(!notice){
        notice=document.createElement('div');
        notice.id='orbuffPcStoreNotice';
        notice.className='small';
        notice.style.cssText='margin:9px 0 12px;padding:10px 12px;border-radius:13px;background:rgba(80,130,190,.10);border:1px solid rgba(80,130,190,.16);line-height:1.45';
        const bundles=mystery.querySelector('#mysteryBoxBundles');
        if(bundles)bundles.insertAdjacentElement('beforebegin',notice);
        else mystery.querySelector('.card')?.appendChild(notice);
      }
      notice.textContent=message();
    }
  }
  function blockStoreApi(){
    if(!isPackagedDesktop())return;
    const store=window.PufflingDiamondStore;
    if(!store||store.__orbuffPcBlocked)return;
    store.__orbuffPcBlocked=true;
    store.mobilePurchaseDisabled=true;
    store.canPurchase=()=>false;
    store.purchase=async()=>({ok:false,reason:'pc_mobile_iap_disabled'});
    store.open=()=>{
      hideMobilePurchaseUi();
      try{if(typeof showToast==='function')showToast(message())}catch(e){}
      return false;
    };
  }
  function apply(){
    if(!isPackagedDesktop())return;
    hideMobilePurchaseUi();
    blockStoreApi();
  }

  if(!isPackagedDesktop()){
    window.OrbuffDesktopStorePolicy={isPackagedDesktop,active:false};
    return;
  }

  const observer=new MutationObserver(()=>apply());
  if(document.documentElement)observer.observe(document.documentElement,{childList:true,subtree:true});
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(apply,0));
  window.addEventListener('sky-puff-ready',apply);
  [0,50,150,500,1200].forEach(ms=>setTimeout(apply,ms));

  window.OrbuffDesktopStorePolicy={
    isPackagedDesktop,
    active:true,
    apply,
    mobileIapAllowed:false
  };
})();
