# Orbuff privacy & data inventory — launch audit

Last reviewed: 2026-09-15
Build reviewed: Orbuff 5.27 Beta 107

This is an internal launch document for preparing App Store privacy disclosures, Google Play Data safety answers and the public privacy policy. It is not legal advice and is not itself the public privacy policy.

## Current data flows found in the codebase

### 1. Local gameplay data

The game stores gameplay state locally on the device/browser using localStorage. This includes language/settings and game state such as owned/discovered Orbuffs, progression, OrbVault/rest state, rewards, scores and related recovery/error state.

Purpose: provide save/progression, settings and offline/local game functionality.

Store disclosure note: data that remains only on-device is generally different from data collected by the developer. Verify the final native build does not add cloud backup or SDK behavior that changes this assumption.

### 2. Leaderboard submissions

The leaderboard client can submit a cleaned player display name, height/score, run signature and game version to the game API.

Purpose: public/competitive leaderboard functionality and anti-cheat validation.

Launch action: document whether the display name is visible publicly, how long leaderboard entries are retained and how a player can request removal.

### 3. Pseudonymous account identity

The backend can create guest accounts using a randomly generated account ID and issue a signed bearer token. Authenticated multiplayer/trade/ranked systems use the account ID as the server identity.

Purpose: account/session authentication, multiplayer integrity, inventory ownership, trade protection and ranked progression.

Launch action: treat the account ID as a persistent/pseudonymous identifier for store privacy review. Define retention/deletion behavior before public release.

### 4. Multiplayer, ranked and trade data

Server-authoritative Race/Trade systems can process identifiers and gameplay state required to match players, validate ownership, settle race results and protect trades. Ranked profiles include an account ID plus competitive rating/win/loss state.

Purpose: multiplayer gameplay, matchmaking/ranking, fraud/cheat prevention and inventory integrity.

Launch action: document retention for race/trade/ranked records and whether any player-facing names are attached to them.

### 5. Authoritative inventory/progression

Production multiplayer protections can verify Orbuff ownership against server-authoritative inventory. Some progression/economy state therefore may be stored or synchronized server-side in addition to local save state.

Purpose: prevent inventory manipulation, protect trades and ensure multiplayer selections are valid.

Launch action: enumerate the final production database tables/fields and define account deletion behavior across inventory, ranked, trade and wallet stores.

### 6. Diamond wallet and in-app purchases

The backend contains wallet and IAP endpoints. The purchase verification design uses an authenticated wallet plus store purchase payload and records transaction information such as transaction ID, wallet/account linkage, platform, product ID, Diamond amount and provider verification/payment data needed for reconciliation and duplicate protection.

Purpose: process in-app purchases, grant paid currency, restore/reconcile entitlements and prevent fraud/double-crediting.

Current launch state: real-money purchasing remains fail-closed until the native billing bridge and Apple/Google provider verification are implemented and tested.

Launch action: when billing is enabled, disclose purchase history/transaction identifiers as required by the applicable store forms. Do not claim the app collects full payment-card details; Apple/Google store billing should handle payment credentials rather than Orbuff.

## Data not found in the current repository audit

No dedicated analytics SDK or advertising SDK was identified by the 2026-09-15 repository search. No code was identified that intentionally collects precise location, contacts, photos, microphone data, health data or advertising identifiers.

This finding must be re-checked after adding native plugins, billing SDKs, crash reporting, analytics, ads, push notifications or any other third-party SDK. Hosting providers may also generate operational request/security logs independently of application-level fields, so production hosting/logging settings must be reviewed before the final public privacy policy is published.

## Security/authentication notes

- Account access uses signed bearer tokens rather than trusting a client-supplied account ID for protected systems.
- Race/Trade protections are designed to use authenticated account identity and server-authoritative inventory/results.
- Paid Diamonds are designed to remain blocked unless the server reports the provider verifier ready.
- Purchase verification must validate platform, product and transaction identifiers and reject invalid/revoked/refunded outcomes before granting currency.

## Store disclosure working map

The final Apple/Google answers should be based on the production build and backend configuration, but the current code indicates these likely categories need explicit review:

| Data/category | Current use | Collected off-device? | Launch review |
| --- | --- | --- | --- |
| Player display name | Leaderboard | Yes, when submitted | Public visibility + retention/removal |
| Gameplay score/height | Leaderboard | Yes, when submitted | Retention + leaderboard purpose |
| Pseudonymous account ID | Auth/multiplayer | Yes | Account identifier + deletion |
| Auth token | Session security | Sent to backend | Secure storage/expiry; never log intentionally |
| Ranked results/profile | Competitive multiplayer | Yes | Gameplay/activity data + retention |
| Inventory/Orbuff ownership | Multiplayer/trade integrity | Yes where authoritative sync is enabled | Retention + deletion |
| Trade records/receipts | Duplicate/integrity protection | Yes | Retention + deletion |
| Diamond wallet balance/ledger | Virtual currency | Yes | Account/purchase functionality |
| Store transaction/product/platform data | IAP verification | Yes once IAP is enabled | Purchase history/transaction disclosures |
| Language/settings/local save | Device gameplay | Primarily local | Re-check native backup behavior |

## Must be decided before production submission

1. Public privacy-policy URL and publisher/contact identity.
2. Minimum player age / target audience and whether children are in scope.
3. Account/data deletion route and retention periods.
4. Whether leaderboard names are public and how users remove them.
5. Exact production database retention for account, ranked, inventory, trade and wallet/IAP records.
6. Production hosting request/log retention.
7. Whether crash reporting, analytics, ads, notifications or other SDKs will be added.
8. Whether native OS/cloud backup can copy local save data off-device.
9. Final Apple App Privacy and Google Play Data safety answers after the signed production build is frozen.

## Release rule

Do not copy this file verbatim into the public privacy policy. First freeze the production SDK list, hosting/logging configuration, billing integration and account deletion/retention behavior; then generate the public policy and store disclosures from that verified state.
