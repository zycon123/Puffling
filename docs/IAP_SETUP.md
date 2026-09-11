# Puffling Diamond IAP setup

The browser beta must never grant paid Diamonds. Real-money purchases are enabled only when both a native billing bridge and a server-side verifier are present.

## Consumable product IDs and target EUR pricing

| Product ID | Diamonds | Target EUR price | Mystery Shop equivalent | Type |
| --- | ---: | ---: | --- | --- |
| `puffling.diamonds.25` | 25 | €1 | 1 Mystery Box | Consumable |
| `puffling.diamonds.75` | 75 | €3 | 3 Mystery Boxes | Consumable |
| `puffling.diamonds.250` | 250 | €9 | 10 Mystery Boxes | Consumable |
| `puffling.diamonds.600` | 600 | €16 | 24 Mystery Boxes | Consumable |

Use the same product IDs in App Store Connect and Google Play Console where possible. Configure the store price points as close as possible to the target EUR prices above. The game UI must still read the final localized `displayPrice` from App Store / Google Play metadata rather than assuming the user is billed in EUR.

The Diamond values intentionally line up with the existing Mystery Shop cost of 25 Diamonds per Mystery Box: 25/75/250 correspond exactly to 1/3/10 boxes. The 600-Diamond pack is the best-value larger pack and can fund 24 boxes if the player chooses to spend all Diamonds there.

## Native bridge contract

The iOS/Android wrapper injects `window.PufflingIAP` into the WebView:

```js
window.PufflingIAP = {
  platform: 'ios', // or 'android'
  isAvailable: true,
  async loadProducts(productIds) {
    // Return [{ productId, displayPrice, currencyCode, title }]
  },
  async purchase(productId) {
    // Return one of:
    // { status:'cancelled' }
    // { status:'pending' }
    // { status:'purchased', productId, transactionId, verificationData }
  },
  async finishTransaction(transactionId) {
    // Acknowledge/finish only after server verification succeeds.
  }
};
```

For Google Play, `verificationData` should contain the purchase token required for server verification. For Apple, it should contain the transaction/JWS data required by the verifier. Never place App Store or Google Play private credentials in browser JavaScript.

## Verification endpoint

Set `SKY_PUFF_IAP_VERIFY_URL` in `js/beta_config.js` only when the production verifier exists. The game sends:

```json
{
  "productId": "puffling.diamonds.75",
  "expectedDiamonds": 75,
  "platform": "ios|android",
  "transactionId": "...",
  "verificationData": "...",
  "appVersion": "...",
  "playerId": "..."
}
```

The verifier must:

1. Validate the transaction with Apple/Google.
2. Confirm the product ID matches the receipt/token.
3. Reject refunded, revoked, invalid or already-consumed transactions as appropriate.
4. Deduplicate transaction IDs server-side.
5. Grant the exact Diamond amount to the authenticated player account.
6. Return the authoritative Diamond balance.

Required success response:

```json
{
  "ok": true,
  "productId": "puffling.diamonds.75",
  "transactionId": "...",
  "diamonds": 75,
  "diamondBalance": 225
}
```

The client does not add paid Diamonds locally from the store result. It only applies the authoritative balance returned by the verifier.

## Before enabling production purchases

- Add account/authentication so paid currency belongs to a server-side player identity rather than only localStorage.
- Make the Diamond balance authoritative on the backend for purchases, Mystery Boxes and other spend paths.
- Create the four consumable products in App Store Connect and Google Play Console.
- Configure target EUR pricing: €1 / €3 / €9 / €16, then review each store's localized storefront prices.
- Implement StoreKit billing in the iOS wrapper and Google Play Billing in the Android wrapper.
- Deploy the receipt/purchase-token verifier and set `SKY_PUFF_IAP_VERIFY_URL`.
- Test successful, cancelled, pending, duplicate, refunded/revoked and interrupted transactions in sandbox/test tracks.
- Confirm Mystery Box odds remain visible before Diamonds are spent on randomized rewards.

Paid Diamonds do not expire.
