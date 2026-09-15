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

The current leaderboard schema does not store the guest account ID, so leaderboard rows cannot currently be identified by guest account ID during account deletion. Before production submission, document public visibility, the 180-day score retention behavior and a separate removal/contact route for display-name leaderboard entries.

### 3. Pseudonymous guest account identity

The backend creates guest accounts using a randomly generated account ID and issues a signed bearer token. Authenticated multiplayer/trade/ranked systems use the account ID as the server identity.

Purpose: account/session authentication, multiplayer integrity, inventory ownership, trade protection and ranked progression.

Orbuff now exposes an in-app **Delete guest account** control under System & Support in every selectable language. The request requires the signed bearer token and explicit destructive confirmation.

On successful deletion the server removes account-linked rows from:

- ranked profile/results (results cascade with the profile),
- authoritative Orbuff inventory and inventory migration state,
- trade records involving the account,
- acquisition/reward grants,
- boss combat sessions.

The server then writes a persistent deleted-account tombstone. Deleted IDs are loaded into authentication revocation on server startup, and the just-deleted token is rejected immediately. The client removes the stored account token/ID and restarts after success.

Local gameplay progress on the device is intentionally not erased by deleting the server guest account; the deletion UI states this clearly. Starting an online feature later may create a new, unrelated guest account.

### 4. Multiplayer, ranked and trade data

Server-authoritative Race/Trade systems can process identifiers and gameplay state required to match players, validate ownership, settle race results and protect trades. Ranked profiles include an account ID plus competitive rating/win/loss state.

Purpose: multiplayer gameplay, matchmaking/ranking, fraud/cheat prevention and inventory integrity.

Account-linked ranked, trade and inventory records are now covered by the authenticated guest-account deletion route. Production retention periods for records that are not deleted by the user still need to be documented.

### 5. Authoritative inventory/progression

Production multiplayer protections can verify Orbuff ownership against server-authoritative inventory. Some progression/economy state therefore may be stored or synchronized server-side in addition to local save state.

Purpose: prevent inventory manipulation, protect trades and ensure multiplayer selections are valid.

Authoritative inventory rows and inventory-migration state are deleted with the guest account. Local save data remains local unless the user separately resets local data.

### 6. Diamond wallet and in-app purchases

The backend contains wallet and IAP endpoints. The purchase verification design uses a separate authenticated wallet plus store purchase payload and records transaction information such as transaction ID, wallet ID, platform, product ID, Diamond amount and provider verification/payment data needed for reconciliation and duplicate protection.

Purpose: process in-app purchases, grant paid currency, restore/reconcile entitlements and prevent fraud/double-crediting.

Current launch state: real-money purchasing remains fail-closed until the native billing bridge and Apple/Google provider verification are implemented and tested.

Important deletion boundary: the current Diamond wallet ID is not reliably mapped to the guest account ID. Therefore the guest-account deletion route does **not** claim to delete a separate Diamond wallet or store transaction ledger. This is acceptable only while real-money purchasing remains disabled. Before paid IAP is enabled, durable wallet/account recovery plus a compliant wallet/purchase deletion-retention policy must be finalized and reflected in the public privacy policy and store disclosures.

Do not claim the app collects full payment-card details; Apple/Google store billing should handle payment credentials rather than Orbuff.

## Data not found in the current repository audit

No dedicated analytics SDK or advertising SDK was identified by the 2026-09-15 repository search. No code was identified that intentionally collects precise location, contacts, photos, microphone data, health data or advertising identifiers.

This finding must be re-checked after adding native plugins, billing SDKs, crash reporting, analytics, ads, push notifications or any other third-party SDK. Hosting providers may also generate operational request/security logs independently of application-level fields, so production hosting/logging settings must be reviewed before the final public privacy policy is published.

## Security/authentication notes

- Account access uses signed bearer tokens rather than trusting a client-supplied account ID for protected systems.
- Deleted guest IDs are persistently tombstoned and loaded into token revocation at server startup.
- Race/Trade protections use authenticated account identity and server-authoritative inventory/results.
- Paid Diamonds remain blocked unless the server reports the provider verifier ready.
- Purchase verification must validate platform, product and transaction identifiers and reject invalid/revoked/refunded outcomes before granting currency.

## Store disclosure working map

The final Apple/Google answers should be based on the production build and backend configuration, but the current code indicates these categories need explicit review:

| Data/category | Current use | Collected off-device? | Launch review |
| --- | --- | --- | --- |
| Player display name | Leaderboard | Yes, when submitted | Public visibility + separate removal route |
| Gameplay score/height | Leaderboard | Yes, when submitted | 180-day behavior + leaderboard purpose |
| Pseudonymous guest account ID | Auth/multiplayer | Yes | In-app deletion implemented |
| Auth token | Session security | Sent to backend | Secure storage/expiry; revoked after deletion |
| Ranked results/profile | Competitive multiplayer | Yes | Deleted with guest account |
| Inventory/Orbuff ownership | Multiplayer/trade integrity | Yes where authoritative sync is enabled | Deleted with guest account |
| Trade records | Duplicate/integrity protection | Yes | Account-involving records deleted with guest account |
| Boss/reward grant records | Reward integrity | Yes | Deleted with guest account |
| Diamond wallet balance/ledger | Virtual currency | Yes when wallet is used | Separate wallet; IAP must remain disabled until recovery/deletion policy is finalized |
| Store transaction/product/platform data | IAP verification | Yes once IAP is enabled | Purchase-history/transaction disclosures and legal retention |
| Language/settings/local save | Device gameplay | Primarily local | Re-check native backup behavior |

## Must be decided before production submission

1. Public privacy-policy URL and publisher/contact identity.
2. Minimum player age / target audience and whether children are in scope.
3. Retention periods for server records when the player does not request deletion.
4. Separate leaderboard display-name removal/contact process.
5. Exact production retention and deletion/legal-retention policy for wallet/IAP records before real-money purchases are enabled.
6. Production hosting request/log retention.
7. Whether crash reporting, analytics, ads, notifications or other SDKs will be added.
8. Whether native OS/cloud backup can copy local save data off-device.
9. Final Apple App Privacy and Google Play Data safety answers after the signed production build is frozen.

## Release rule

Do not copy this file verbatim into the public privacy policy. First freeze the production SDK list, hosting/logging configuration, billing integration, retention periods and support/removal process; then generate the public policy and store disclosures from that verified state.
