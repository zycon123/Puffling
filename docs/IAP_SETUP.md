# Orbuff Diamond IAP setup

The browser beta never grants paid Diamonds from a web payment. Native purchases require App Store / Google Play billing, a signed Diamond wallet session and server-side provider verification.

## Consumable products

| Product ID | Diamonds | Target EUR price | Mystery Shop equivalent |
| --- | ---: | ---: | --- |
| `puffling.diamonds.25` | 25 | €1 | 1 Mystery Box |
| `puffling.diamonds.75` | 75 | €3 | 3 Mystery Boxes |
| `puffling.diamonds.250` | 250 | €9 | 10 Mystery Boxes |
| `puffling.diamonds.600` | 600 | €16 | 24 Mystery Boxes |

The product IDs are intentionally preserved for store compatibility even though the game is branded Orbuff. The final user-facing price is always read from App Store / Google Play metadata; EUR values are target price points only.

## Current release architecture

The native Capacitor 8 bridge is implemented with `@capgo/native-purchases` and exposes the existing `window.PufflingIAP` contract. The bridge deliberately leaves purchases unfinished until the Orbuff server verifies and credits them:

1. Native store returns an Apple signed StoreKit transaction or Google Play purchase token.
2. Client posts the proof to `/iap/verify` with its signed wallet token.
3. Server verifies the exact platform, product and transaction with Apple/Google.
4. Server records the transaction and credits paid Diamonds atomically.
5. Only after a successful server response does the native bridge finish the StoreKit transaction or consume the Google Play purchase.
6. Interrupted purchases are retried; transaction IDs are idempotent and already-recorded transactions return their existing balance without requiring the store proof to remain unconsumed.

Earned Diamonds and paid Diamonds remain separated. Paid balance is stored in `puffling_wallets.paid_diamonds`; verified purchases are recorded in `puffling_iap_transactions`; paid changes are recorded in `puffling_wallet_ledger`.

## Recoverable account-linked wallets

Guest accounts now have a recovery key. The plaintext recovery key is shown/stored on the player's device; the server stores only a SHA-256 hash. A valid Account ID + recovery key can restore the same guest identity after reinstall/device change and issue a fresh signed account token. Recovery keys can be rotated, and deleted accounts cannot be recovered.

The paid-Diamond wallet uses that recoverable guest identity:

- `POST /wallet/account-session` requires the signed guest-account token.
- The server returns the same authoritative wallet for the same guest account, including the same paid-Diamond balance.
- The native Diamond Store requires `accountLinked:true` before real-money purchase buttons can become active.
- Legacy device-only wallets can still be read for compatibility but cannot enable live paid IAP.
- Deleting a guest account removes its wallet link and disables the linked wallet. Previously issued wallet bearer tokens then fail with `wallet_disabled`.
- Store transaction and ledger rows can remain pseudonymized when retention is needed for duplicate prevention, refunds, fraud prevention, accounting or legal obligations.

Players should be encouraged to keep the recovery key in a safe place. The recovery key is an account-recovery credential and must never be logged, emailed automatically, sent to analytics, or committed to source control.

## Provider verification

`server/iap_provider_verifier.js` contains the production verifier framework.

### Apple

Apple StoreKit 2 provides a signed JWS transaction. Orbuff verifies it with Apple's official `@apple/app-store-server-library`, Apple root CA certificates, the Orbuff bundle ID and the App Store Apple ID. The decoded product ID, transaction ID, bundle ID and environment must match. Revoked transactions are rejected.

Required server configuration:

- `ORBUFF_APPLE_APP_ID` — numeric Apple ID from App Store Connect.
- `ORBUFF_APPLE_ROOT_CERTIFICATES_BASE64` — Apple root CA DER certificate(s), base64 encoded. Use either a JSON array of base64 strings or a comma/semicolon-separated list.
- `ORBUFF_APPLE_BUNDLE_ID` — optional; defaults to `com.zyconstudios.orbuff`.
- `ORBUFF_APPLE_ONLINE_CHECKS` — optional; defaults to `true` for certificate revocation/validity checks.

Do not store Apple certificates/private credentials in source files. The root CA certificates are public trust anchors but are still configured outside the repo so certificate rotation does not require application code changes.

### Google Play

Orbuff authenticates to the Google Play Android Publisher API with a service account and checks the one-time product purchase using the package name, product ID and purchase token. A purchase must be in the purchased state and still unconsumed when first credited. The client consumes it only after server credit succeeds.

Required server configuration:

- `ORBUFF_GOOGLE_SERVICE_ACCOUNT_JSON` — complete service-account JSON stored as a server secret.
- `ORBUFF_GOOGLE_PACKAGE_NAME` — optional; defaults to `com.zyconstudios.orbuff`.

The service account must have the minimum Google Play Console/API access required to read purchase state for Orbuff. Never embed this JSON in the app or repository.

### Global activation gate

Live purchase UI remains fail-closed unless all of these are true:

- `PUFFLING_IAP_PROVIDER_MODE=apple_google`
- `PUFFLING_WALLET_SECRET` is configured
- Apple configuration above is complete
- Google configuration above is complete
- database/wallet initialization succeeds
- a recoverable guest identity is available and the wallet reports `accountLinked:true`
- native iOS/Android bridge is available

Bootstrap only injects the provider verifier when both Apple and Google configurations are complete. Therefore `/iap/status` cannot report `providerReady: true` just because one store is configured.

## Wallet / account / IAP endpoints

- `POST /api/account/guest` — creates a guest account and recovery key.
- `POST /api/account/recover` — body `{ accountId, recoveryKey }`; issues a fresh signed account token for the same guest account.
- `POST /api/account/recovery-key` — authenticated recovery-key rotation.
- `POST /wallet/account-session` — guest-account bearer token required; returns the account-linked wallet token and authoritative paid balance.
- `POST /wallet/session` — legacy body `{ walletId, clientKey }`; retained for compatibility but does not make a wallet eligible for live paid IAP.
- `GET /wallet/balance` — wallet bearer token required.
- `POST /wallet/spend` — wallet bearer token required; body `{ amount, reason }`.
- `GET /iap/status` — reports database/wallet/provider readiness without exposing secrets.
- `POST /iap/verify` — wallet bearer token + native purchase proof; credits only after provider verification.

## Verification request

`SKY_PUFF_IAP_VERIFY_URL` points to `https://puffling-race-server.onrender.com/iap/verify`.

```json
{
  "productId": "puffling.diamonds.75",
  "expectedDiamonds": 75,
  "platform": "ios|android",
  "transactionId": "...",
  "verificationData": "...",
  "appVersion": "..."
}
```

A successful response includes the authoritative paid balance:

```json
{
  "ok": true,
  "productId": "puffling.diamonds.75",
  "transactionId": "...",
  "diamonds": 75,
  "paidDiamondBalance": 225
}
```

## Before enabling real purchases

- Register the four consumables in App Store Connect and Google Play Console using the existing product IDs.
- Configure the Apple root CA/App ID and Google service-account secrets only in the production server environment.
- Set `PUFFLING_IAP_PROVIDER_MODE=apple_google` only after the credentials are confirmed.
- Verify `/iap/status` remains `providerReady:false` before configuration and becomes true only after both stores are ready.
- Verify a new account, recovery-key backup, reinstall simulation, account recovery and wallet-balance restoration before any paid rollout.
- Verify account deletion disables the wallet and invalidates the old wallet token while retained store transaction/ledger records no longer contain an active account link.
- Test successful, cancelled, pending, duplicate, interrupted/recovered, consumed, refunded/revoked and network-loss cases in Apple's sandbox/TestFlight and Google Play license/Internal testing.
- Confirm no client-only result can credit Diamonds when provider verification fails.
- Keep Mystery Box odds visible before Diamonds are spent.

No production real-money rollout should occur before these sandbox/internal-store tests pass. Paid Diamonds do not expire.
