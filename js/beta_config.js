var SKY_PUFF_VERSION='5.26-beta.94';
var SKY_PUFF_BETA=true;
var SKY_PUFF_SUPPORT_EMAIL='zyconstudios@protonmail.com';
var SKY_PUFF_RACE_WS_URL='wss://puffling-race-server.onrender.com';
window.SKY_PUFF_RACE_WS_URL=SKY_PUFF_RACE_WS_URL;
var API_BASE=(localStorage.skyPuffApiBase||'').trim().replace(/\/$/,'');
window.skyPuffConfig={version:SKY_PUFF_VERSION,beta:SKY_PUFF_BETA,supportEmail:SKY_PUFF_SUPPORT_EMAIL,raceWsUrl:SKY_PUFF_RACE_WS_URL,get apiBase(){return API_BASE;},setApiBase(url){API_BASE=String(url||'').trim().replace(/\/$/,'');localStorage.skyPuffApiBase=API_BASE;return API_BASE;}};
