# Puffling Diamond IAP setup

The browser beta never grants paid Diamonds from a web payment. Native purchases require App Store / Google Play billing, a signed Puffling wallet session and server-side receipt verification.

## Consumable products

| Product ID | Diamonds | Target EUR price | Mystery Shop equivalent |
| --- | ---: | ---: | --- |
| `puffling.diamonds.25` | 25 | €1 | 1 Mystery Box |
| `puffling.diamonds.75` | 75 | €3 | 3 Mystery Boxes |
| `puffling.diamonds.250` | 250 | €9 | 10 Mystery Boxes |
| `puffling.diamonds.600` | 600 | €16 | 24 Mystery Boxes |

The final user-facing price is always read from the App Store / Google Play `displayPrice`; EUR values are target price points only.

## Paid wallet architecture

Earned Diamonds and paid Diamonds are intentionally separated:

- gameplay rewards remain in the existing earned-Diamond save for now;
- paid Diamonds are stored in Postgres in `puffling_wallets.paid_diamonds`;
- Mystery Shop spends earned Diamonds first, then calls `/wallet/spend` for any remaining amount;
- paid spends are atomic and recorded in `puffling_wallet_ledger`;
- verified purchases are deduplicated by transaction ID in `puffling_iap_transactions`;
- a purchase can never overwrite an existing earned-Diamond balance.

The browser creates a random `walletId` plus a random `clientKey`. The server stores only a SHA-256 hash of the client key and issues a server-signed wallet token. Paid balance and spend endpoints require that bearer token.

### Wallet endpoints

- `POST /wallet/session` — body `{ walletId, clientKey }`; returns signed `walletToken` + `paidDiamondBalance`.
- `GET /wallet/balance` — bearer token required.
- `POST /wallet/spend` — bearer token required; body `{ amount, reason }`.
- `GET /iap/status` — reports database/provider readiness without secrets.
- `POST /iap/verify` — bearer token + store purchase payload; grants only after provider verification succeeds.

## Native billing bridge

The iOS/Android wrapper injects:

```js
window.PufflingIAP = {
  platform: 'ios', // or 'android'
  isAvailable: true,
  async loadProducts(productIds) {
    // [{ productId, displayPrice, currencyCode, title }]
  },
  async purchase(productId) {
    // { status:'cancelled' }
    // { status:'pending' }
    // { status:'purchased', productId, transactionId, verificationData }
  },
  async finishTransaction(transactionId) {
    // Finish/acknowledge only after server verification succeeds.
  }
};
```

Never embed Apple or Google private credentials in browser/WebView JavaScript.

## Verification request

`SKY_PUFF_IAP_VERIFY_URL` points to `https://puffling-race-server.onrender.com/iap/verify`.
The client sends the signed wallet token as `Authorization: Bearer ...` and this JSON body:

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

Required successful response:

```json
{
  "ok": true,
  "productId": "puffling.diamonds.75",
  "transactionId": "...",
  "diamonds": 75,
  "paidDiamondBalance": 225
}
```

The server must validate the transaction with Apple/Google, verify the exact product, reject invalid/refunded/revoked purchases, deduplicate transaction IDs and update the wallet in one database transaction.

## Render configuration

The multiplayer/game API uses:

- `DATABASE_URL` — connection string for the Puffling Postgres database;
- `PUFFLING_WALLET_SECRET` — long random HMAC secret used to sign wallet tokens;
- `PUFFLING_IAP_PROVIDER_MODE=disabled` until direct Apple/Google verification is ready.

`provider_not_configured` is an intentional fail-closed result. Do not switch provider mode to production until the Apple/Google verifier implementation and store credentials are complete.

## Before enabling real purchases

- Link the Render Postgres database to the `puffling-race-server` as `DATABASE_URL`.
- Create all four consumables in App Store Connect and Google Play Console.
- Configure target price points €1 / €3 / €9 / €16 and review localized prices.
- Implement StoreKit in the iOS wrapper and Google Play Billing in the Android wrapper.
- Implement direct Apple/Google server verification and only then enable the provider mode.
- Test successful, cancelled, pending, duplicate, interrupted, refunded and revoked transactions in sandbox/test tracks.
- Keep Mystery Box odds visible before Diamonds are spent.
- Move more gameplay-earned currency/inventory server-side before a competitive public launch if stronger anti-tamper protection is required.

Paid Diamonds do not expire.
