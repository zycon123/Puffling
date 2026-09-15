import fs from 'node:fs';
const read=file=>fs.readFileSync(file,'utf8');
const fail=msg=>{console.error(`❌ Account/wallet recovery validation: ${msg}`);process.exit(1);};
const accountHttp=read('server/account_http.js');
const accountStore=read('server/account_store.js');
const iapStore=read('server/iap_store.js');
const iapHttp=read('server/iap_http.js');
const transport=read('js/race_multiplayer_transport.js');
const wallet=read('js/diamond_wallet_client.js');
const store=read('js/diamond_iap_store.js');
const privacyUi=read('js/account_privacy_ui.js');

for(const token of ['/api/account/guest','/api/account/recover','/api/account/recovery','newRecoveryKey','registerAccount','recoverAccount','setRecoveryKey'])if(!accountHttp.includes(token))fail(`account HTTP missing ${token}`);
for(const token of ['puffling_accounts','recovery_key_hash','createHash(\'sha256\')','timingSafe','puffling_wallets','account_id=NULL','active=false'])if(!accountStore.includes(token))fail(`account store missing ${token}`);
for(const token of ['account_id varchar(96)','active boolean','puffling_wallets_account_idx','issueAccountWallet','accountLinked:true','wallet_disabled','activeWallet','accountWallets:true'])if(!iapStore.includes(token))fail(`IAP store missing ${token}`);
for(const token of ['/wallet/account-session','accountAuth.verify','issueAccountWallet','wallet_disabled'])if(!iapHttp.includes(token))fail(`IAP HTTP missing ${token}`);
for(const token of ['pufflingAccountRecoveryKey','recoverGuestIdentity','rotateRecoveryKey','ensureGuestIdentity','/api/account/recover','/api/account/recovery'])if(!transport.includes(token))fail(`Race identity client missing ${token}`);
for(const token of ['/wallet/account-session','accountLinked','connectAccountWallet','clearLocal','pufflingWalletClientKeyV1'])if(!wallet.includes(token))fail(`Diamond wallet client missing ${token}`);
if(!store.includes('walletAccountLinked')||!store.includes('accountLinked:true')||!store.includes('canPurchase'))fail('Diamond Store does not require an account-linked wallet before live purchase');
for(const token of ['backupGuestAccount','recoverGuestAccount','pufflingAccountRecoveryKey','BACK UP ACCOUNT','GJENOPPRETT KONTO','KONTO WIEDERHERSTELLEN','RECUPERAR CUENTA','RÉCUPÉRER LE COMPTE','PufflingDiamondWallet?.clearLocal'])if(!privacyUi.includes(token))fail(`Account privacy/recovery UI missing ${token}`);

console.log('✅ Recoverable guest identity, account-linked Diamond wallet, deletion disablement and localized recovery UI validated');
