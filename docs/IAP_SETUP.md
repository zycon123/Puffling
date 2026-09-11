# Puffling Diamond IAP setup

The browser beta never grants paid Diamonds from a web payment. Native purchases require App Store / Google Play billing, a signed Puffling wallet session and server-side provider verification.

## Consumable products

| Product ID | Diamonds | Target EUR price | Mystery Shop equivalent |
| --- | ---: | ---: | --- |
| `puffling.diamonds.25` | 25 | €1 | 1 Mystery Box |
| `puffling.diamonds.75` | 75 | €3 | 3 Mystery Boxes |
| `puffling.diamonds.250` | 250 | €9 | 10 Mystery Boxes |
| `puffling.diamonds.600` | 600 | €16 | 24 Mystery Boxes |

The final user-facing price is always read from the App Store / Google Play `displayPrice`; EUR values are target price points only.

## Paid wallet architecture

Earned Diamonds and paid Diamonds are intentionally separated. Gameplay rewards remain in the existing earned-Diamond save for now. Paid Diamonds are stored in Postgres in `puffling_wallets.paid_diamonds`. Mystery Shop spends earned Diamonds first, then calls `/wallet/spend` for any remaining amount. Paid spends are atomic and recorded in `puffling_wallet_ledger`. Verified purchases are deduplicated by transaction ID in `puffling_iap_transactions`, and a purchase can never overwrite an existing earned-Diamond balance.

The client creates a random `walletId` plus a random `clientKey`. The server stores only a SHA-256 hash of the client key and issues a server-signed wallet token. Paid balance and spend endpoints require that bearer token.

Important launch limitation: this wallet identity is currently device-local. A reinstall or device move does not yet provide a full user-account recovery flow. Do not describe paid purchases as account-portable until durable account recovery is implemented.

### Wallet / IAP endpoints

- `POST /wallet/session` — body `{ walletId, clientKey }`; returns signed `walletToken` + `paidDiamondBalance`.
- `GET /wallet/balance` — bearer token required.
- `POST /wallet/spend` — bearer token required; body `{ amount, reason }`.
- `GET /iap/status` — reports database, wallet and provider-verifier readiness without secrets.
- `POST /iap/verify` — bearer token + store purchase payload; grants only after provider verification succeeds.

The native purchase UI stays disabled unless `/iap/status` reports `providerReady: true`. This prevents the app from opening a real-money store flow when the server cannot safely verify and credit the purchase.

## Native billing bridge contract

The iOS/Android wrapper must inject all of these methods before real-money purchase buttons can become active:

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
    // { status:'purchased', productId, transactionId, verificationData, purchaseToken? }
  },
  async getPendingPurchases() {
    // Return unfinished/unacknowledged purchases so the web layer can re-verify them.
    // [{ status:'purchased', productId, transactionId, verificationData, purchaseToken? }]
  },
  async finishTransaction(payload) {
    // payload: { productId, platform, transactionId, purchaseToken, verificationData }
    // Finish/acknowledge only after Puffling server verification succeeds.
  }
};
```

Never embed Apple or Google private credentials in browser/WebView JavaScript.

## Purchase lifecycle

1. App checks native bridge, signed wallet and `/iap/status`.
2. Real purchase button is enabled only when the server reports `providerReady: true`.
3. Native store returns a transaction / purchase token.
4. Client sends the store proof to Puffling `/iap/verify`.
5. Puffling server verifies the exact store transaction and product with the provider verifier.
6. Server records the transaction and credits paid Diamonds atomically.
7. Client receives the authoritative paid-Diamond balance.
8. Only then does the native bridge finish / acknowledge the store transaction.
9. On a later startup, `getPendingPurchases()` retries unfinished transactions. Server transaction-ID idempotency prevents double credit.

This order is intended to protect against the dangerous case where the store charge succeeds but the app crashes or loses connection before the transaction is credited/finished.

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

The server verifier contract now rejects invalid proofs, product/platform/transaction mismatches and revoked/refunded outcomes. Transaction IDs remain idempotent and wallet credit + ledger entry remain one database transaction.

## Server provider state

The IAP store supports an injected trusted `providerVerifier`. Production readiness requires BOTH:

- `PUFFLING_IAP_PROVIDER_MODE=apple_google`
- a real Apple/Google verifier implementation injected on the server

Without both, `/iap/status` reports `providerReady: false` and the client does not initiate a real-money purchase. This is intentional fail-closed behavior.

The current Puffling repository does not yet contain the real Apple/Google verifier implementation or native StoreKit / Google Play Billing wrapper. Therefore real charging must remain disabled for now.

## Before enabling real purchases

- Keep the existing Puffling database and wallet secret configured; do not add a paid service just for IAP.
- Create the four consumables in the platform stores only when the required developer/store accounts are approved.
- Implement the native iOS StoreKit bridge and Android Google Play Billing bridge, including `getPendingPurchases()` and finish/acknowledge behavior.
- Implement the real server provider verifier using store credentials kept only on the server.
- Enable provider mode only after `/iap/status` can truthfully return `providerReady: true`.
- Test successful, cancelled, pending, duplicate, interrupted/recovered, refunded and revoked transactions in official sandbox/test environments.
- Test app reinstall/device-change behavior before marketing paid Diamonds as recoverable across devices.
- Keep Mystery Box odds visible before Diamonds are spent.

No real-money purchase should be reachable until the native bridge and server provider verifier are both ready. Paid Diamonds do not expire.
