/* Orbuff — in-app guest account privacy controls */
(function(){
  const copy={
    no:{button:'SLETT GJESTEKONTO',title:'Slette gjestekonto?',body:'Dette sletter kontoknyttede data på Orbuff-serveren, inkludert rangering, serverlagrede Orbuffs, byttehistorikk, bossøkter og belønningshistorikk. Lokal spillprogresjon på denne enheten slettes ikke.',confirm:'Skriv SLETT for å bekrefte permanent sletting.',word:'SLETT',cancel:'Sletting avbrutt.',working:'Sletter konto …',success:'Gjestekontoen og serverdataene er slettet. Orbuff starter på nytt.',none:'Ingen gjestekonto er lagret på denne enheten.',fail:'Kunne ikke slette kontoen. Prøv igjen når du er tilkoblet.'},
    en:{button:'DELETE GUEST ACCOUNT',title:'Delete guest account?',body:'This permanently deletes account-linked data from the Orbuff server, including rank, server-stored Orbuffs, trade history, boss sessions, and reward history. Local game progress on this device is not deleted.',confirm:'Type DELETE to confirm permanent deletion.',word:'DELETE',cancel:'Deletion cancelled.',working:'Deleting account …',success:'The guest account and server data were deleted. Orbuff will restart.',none:'No guest account is stored on this device.',fail:'Could not delete the account. Try again while online.'},
    de:{button:'GASTKONTO LÖSCHEN',title:'Gastkonto löschen?',body:'Dadurch werden kontobezogene Daten dauerhaft vom Orbuff-Server gelöscht, einschließlich Rang, servergespeicherter Orbuffs, Tauschverlauf, Boss-Sitzungen und Belohnungsverlauf. Lokaler Spielfortschritt auf diesem Gerät wird nicht gelöscht.',confirm:'Gib LÖSCHEN ein, um die dauerhafte Löschung zu bestätigen.',word:'LÖSCHEN',cancel:'Löschung abgebrochen.',working:'Konto wird gelöscht …',success:'Gastkonto und Serverdaten wurden gelöscht. Orbuff wird neu gestartet.',none:'Auf diesem Gerät ist kein Gastkonto gespeichert.',fail:'Konto konnte nicht gelöscht werden. Versuche es online erneut.'},
    es:{button:'ELIMINAR CUENTA DE INVITADO',title:'¿Eliminar cuenta de invitado?',body:'Esto elimina permanentemente del servidor de Orbuff los datos vinculados a la cuenta, incluidos rango, Orbuffs guardados en el servidor, historial de intercambios, sesiones de jefes e historial de recompensas. El progreso local de este dispositivo no se elimina.',confirm:'Escribe ELIMINAR para confirmar la eliminación permanente.',word:'ELIMINAR',cancel:'Eliminación cancelada.',working:'Eliminando cuenta …',success:'La cuenta de invitado y los datos del servidor se eliminaron. Orbuff se reiniciará.',none:'No hay ninguna cuenta de invitado guardada en este dispositivo.',fail:'No se pudo eliminar la cuenta. Inténtalo de nuevo con conexión.'},
    fr:{button:'SUPPRIMER LE COMPTE INVITÉ',title:'Supprimer le compte invité ?',body:'Cette action supprime définitivement du serveur Orbuff les données liées au compte, notamment le classement, les Orbuffs stockés sur le serveur, l’historique des échanges, les sessions de boss et l’historique des récompenses. La progression locale sur cet appareil n’est pas supprimée.',confirm:'Saisissez SUPPRIMER pour confirmer la suppression définitive.',word:'SUPPRIMER',cancel:'Suppression annulée.',working:'Suppression du compte …',success:'Le compte invité et les données serveur ont été supprimés. Orbuff va redémarrer.',none:'Aucun compte invité n’est enregistré sur cet appareil.',fail:'Impossible de supprimer le compte. Réessayez lorsque vous êtes en ligne.'}
  };
  function lang(){try{const v=String(localStorage.getItem('skyPuffLang')||'no');return copy[v]?v:'en';}catch{return'en';}}
  function text(){return copy[lang()]||copy.en;}
  function identity(){try{return{token:String(localStorage.getItem('pufflingAccountAuthToken')||''),accountId:String(localStorage.getItem('pufflingAccountId')||'')}}catch{return{token:'',accountId:''}}}
  function apiBase(){const configured=String(window.skyPuffConfig?.apiBase||window.SKY_PUFF_GAME_API_URL||'').trim();if(configured)return configured.replace(/\/$/,'');try{const raw=String(window.SKY_PUFF_RACE_WS_URL||'');if(!raw)return'';const u=new URL(raw);u.protocol=u.protocol==='wss:'?'https:':'http:';u.pathname='';u.search='';u.hash='';return u.origin;}catch{return'';}}
  function clearIdentity(){try{localStorage.removeItem('pufflingAccountAuthToken');localStorage.removeItem('pufflingAccountId');localStorage.removeItem('skyPuffRaceReconnect');}catch{}try{window.SkyPuffRaceTransport?.disconnect?.();window.SkyPuffRaceTransport?.setAuthToken?.('',{persist:false});}catch{}}
  async function deleteGuestAccount(){
    const t=text(),id=identity();
    if(!id.token){alert(t.none);return{ok:true,alreadyDeleted:true};}
    const base=apiBase();if(!base){alert(t.fail);return{ok:false,error:'account_endpoint_missing'};}
    const typed=prompt(`${t.title}\n\n${t.body}\n\n${t.confirm}`,'');
    if(String(typed||'').trim().toUpperCase()!==t.word.toUpperCase()){if(typed!==null)alert(t.cancel);return{ok:false,cancelled:true};}
    const button=document.getElementById('deleteGuestAccountBtn');if(button){button.disabled=true;button.textContent=t.working;}
    try{
      const response=await fetch(base+'/api/account/me',{method:'DELETE',headers:{accept:'application/json','content-type':'application/json',authorization:`Bearer ${id.token}`},body:JSON.stringify({confirm:'DELETE'})});
      let body={};try{body=await response.json();}catch{}
      if(!response.ok||body?.deleted!==true)throw new Error(body?.error||`http_${response.status}`);
      clearIdentity();alert(t.success);setTimeout(()=>location.reload(),50);return{ok:true,deleted:true};
    }catch(e){console.error('[OrbuffAccountPrivacy]',e);alert(t.fail);if(button){button.disabled=false;button.textContent=t.button;}return{ok:false,error:String(e?.message||e)};}
  }
  function syncLabel(){const button=document.getElementById('deleteGuestAccountBtn');if(button)button.textContent=text().button;}
  function mount(){
    const menu=document.querySelector('#diagnosticsMenu .card');if(!menu||document.getElementById('deleteGuestAccountBtn'))return;
    const button=document.createElement('button');button.id='deleteGuestAccountBtn';button.type='button';button.className='secondary';button.style.cssText='border:2px solid rgba(205,65,65,.6);color:#a52e2e;margin-top:8px';button.textContent=text().button;button.addEventListener('click',deleteGuestAccount);
    const close=document.getElementById('closeDiagnostics');menu.insertBefore(button,close||null);
  }
  window.addEventListener('storage',e=>{if(e.key==='skyPuffLang')syncLabel();});
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(syncLabel,0));
  mount();
  window.OrbuffAccountPrivacy={deleteGuestAccount,clearIdentity,identity,apiBase,mount,syncLabel};
})();
