var SKY_PUFF_VERSION='5.26-beta.1';
var SKY_PUFF_BETA=true;
var API_BASE=(localStorage.skyPuffApiBase||'').trim().replace(/\/$/,'');
window.skyPuffConfig={version:SKY_PUFF_VERSION,beta:SKY_PUFF_BETA,get apiBase(){return API_BASE;},setApiBase(url){API_BASE=String(url||'').trim().replace(/\/$/,'');localStorage.skyPuffApiBase=API_BASE;return API_BASE;}};
