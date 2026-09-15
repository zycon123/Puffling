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

The wallet identity is still device-local. Do not market paid Diamonds as automatically portable across reinstall/device changes until durable account-to-wallet recovery is finished.

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
- native iOS/Android bridge is available

Bootstrap only injects the provider verifier when both Apple and Google configurations are complete. Therefore `/iap/status` cannot report `providerReady: true` just because one store is configured.

## Wallet / IAP endpoints

- `POST /wallet/session` — body `{ walletId, clientKey }`; returns signed `walletToken` + `paidDiamondBalance`.
- `GET /wallet/balance` — bearer token required.
- `POST /wallet/spend` — bearer token required; body `{ amount, reason }`.
- `GET /iap/status` — reports database/wallet/provider readiness without exposing secrets.
- `POST /iap/verify` — bearer token + native purchase proof; credits only after provider verification.

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
- Test successful, cancelled, pending, duplicate, interrupted/recovered, consumed, refunded/revoked and network-loss cases in Apple's sandbox/TestFlight and Google Play license/Internal testing.
- Confirm no client-only result can credit Diamonds when provider verification fails.
- Finish durable wallet recovery/deletion policy before marketing paid balance as cross-device/reinstall recoverable.
- Keep Mystery Box odds visible before Diamonds are spent.

No production real-money rollout should occur before these sandbox/internal-store tests pass. Paid Diamonds do not expire.
