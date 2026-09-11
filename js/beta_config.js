var SKY_PUFF_VERSION='5.27-beta.106';
var SKY_PUFF_BETA=true;
var SKY_PUFF_SUPPORT_EMAIL='zyconstudios@protonmail.com';
var SKY_PUFF_RACE_WS_URL='wss://puffling-race-server.onrender.com';
var SKY_PUFF_GAME_API_URL='https://puffling-race-server.onrender.com';
var SKY_PUFF_IAP_VERIFY_URL=SKY_PUFF_GAME_API_URL+'/iap/verify';
window.SKY_PUFF_RACE_WS_URL=SKY_PUFF_RACE_WS_URL;window.SKY_PUFF_GAME_API_URL=SKY_PUFF_GAME_API_URL;window.SKY_PUFF_IAP_VERIFY_URL=SKY_PUFF_IAP_VERIFY_URL;
var API_BASE=SKY_PUFF_GAME_API_URL;try{var storedApiBase=String(localStorage.getItem('skyPuffApiBase')||'').trim();if(storedApiBase)API_BASE=storedApiBase;}catch(e){}API_BASE=String(API_BASE||'').trim().replace(/\/$/,'');
window.skyPuffConfig={version:SKY_PUFF_VERSION,beta:SKY_PUFF_BETA,supportEmail:SKY_PUFF_SUPPORT_EMAIL,raceWsUrl:SKY_PUFF_RACE_WS_URL,gameApiUrl:SKY_PUFF_GAME_API_URL,iapVerifyUrl:SKY_PUFF_IAP_VERIFY_URL,get apiBase(){return API_BASE;},setApiBase(url){API_BASE=String(url||SKY_PUFF_GAME_API_URL||'').trim().replace(/\/$/,'');try{localStorage.setItem('skyPuffApiBase',API_BASE);}catch(e){}return API_BASE;}};
