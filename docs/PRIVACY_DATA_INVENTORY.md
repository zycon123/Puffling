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

The leaderboard client can submit score/height, run signature and game version to the game API. Public display uses a deterministic Orbuff alias rather than the player's local free-text name.

Purpose: public/competitive leaderboard functionality and anti-cheat validation.

New submissions attach the signed guest account token when one is available. The server verifies that token and stores the authenticated guest account ID with the score row. Those account-linked rows are removed automatically when that guest account is deleted.

Older anonymous leaderboard rows created before account linkage may not contain an account ID. Leaderboard presentation uses a 180-day recent-results window and the backend periodically removes older score rows.

### 3. Pseudonymous guest account identity and recovery

The backend creates guest accounts using a randomly generated account ID and issues a signed bearer token. Authenticated multiplayer/trade/ranked systems use the account ID as the server identity.

Purpose: account/session authentication, multiplayer integrity, inventory ownership, trade protection, ranked progression and recovery after reinstall/device change.

A newly created account also receives a high-entropy recovery key. The recovery key is shown to the player so it can be backed up. The backend stores only a cryptographic hash of the key, not the plaintext recovery key. The player can rotate the recovery key; after rotation the old key is no longer accepted.

The recovery key is authentication data and must not be logged, committed to source control, included in analytics/crash telemetry or exposed to other players.

Orbuff exposes in-app account backup/recovery controls under System & Support in every selectable language, plus **Delete guest account**. Deletion requires the signed bearer token and explicit destructive confirmation.

On successful deletion the server removes account-linked rows from:

- ranked profile/results,
- authoritative Orbuff inventory and inventory migration state,
- trade records involving the account,
- acquisition/reward grants,
- boss combat sessions,
- leaderboard score rows that contain the authenticated guest account ID.

The server then writes a persistent deleted-account tombstone, removes/invalidates the account recovery credential and revokes the account identity. Deleted IDs are loaded into authentication revocation on server startup, and the just-deleted token is rejected immediately. The client removes stored account/recovery credentials and restarts after success.

Local gameplay progress on the device is intentionally not erased by deleting the server guest account; the deletion UI states this clearly.

### 4. Multiplayer, ranked and trade data

Server-authoritative Race/Trade systems can process identifiers and gameplay state required to match players, validate ownership, settle race results and protect trades. Ranked profiles include an account ID plus competitive rating/win/loss state.

Purpose: multiplayer gameplay, matchmaking/ranking, fraud/cheat prevention and inventory integrity.

Account-linked ranked, trade and inventory records are covered by the authenticated guest-account deletion route. Production retention periods for records that are not deleted by the user still need to be documented.

### 5. Authoritative inventory/progression

Production multiplayer protections can verify Orbuff ownership against server-authoritative inventory. Some progression/economy state therefore may be stored or synchronized server-side in addition to local save state.

Purpose: prevent inventory manipulation, protect trades and ensure multiplayer selections are valid.

Authoritative inventory rows and inventory-migration state are deleted with the guest account. Local save data remains local unless the user separately resets local data.

### 6. Diamond wallet and in-app purchases

The backend contains account-linked wallet and IAP endpoints. Paid-wallet records include a wallet ID, account link, balance and activation state. Purchase verification records may include transaction ID, wallet ID, platform, product ID, Diamond amount and provider verification/payment metadata needed for reconciliation and duplicate protection.

Purpose: process in-app purchases, grant paid currency, recover the same paid balance after account recovery, reconcile purchases and prevent fraud/double-crediting.

The native StoreKit/Google Play bridge and Apple/Google server verifier are implemented but real-money purchasing remains fail-closed until production credentials are configured and official sandbox/Internal testing passes.

The wallet is now mapped to the guest account. Recovering the same guest account reopens the same paid wallet and authoritative paid-Diamond balance. Real-money purchase UI requires the wallet to report that it is account-linked.

On guest-account deletion, the account-to-wallet relationship is removed/deactivated so deleted account credentials and previously issued wallet credentials cannot continue spending or receiving paid Diamonds. Transaction and ledger records are retained separately where needed for transaction reconciliation, duplicate prevention, fraud/security investigations, refund handling and applicable accounting/legal obligations. The exact production retention period and legal basis still need to be finalized and reflected in the public privacy policy/store disclosures before live IAP is enabled.

Do not claim the app collects full payment-card details; Apple/Google store billing handles payment credentials rather than Orbuff.

## Public privacy/deletion resources

The release publishes:

- Privacy Policy: `https://zycon123.github.io/Puffling/privacy.html`
- Account deletion / privacy choices: `https://zycon123.github.io/Puffling/delete-account.html`

Both are linked from System & Support inside Orbuff. The app also exposes a copyable guest Account ID and account recovery controls.

## Data not found in the current repository audit

No dedicated analytics SDK or advertising SDK was identified by the 2026-09-15 repository search. No code was identified that intentionally collects precise location, contacts, photos, microphone data, health data or advertising identifiers.

This finding must be re-checked after adding native plugins, billing SDKs, crash reporting, analytics, ads, push notifications or any other third-party SDK. Hosting providers may also generate operational request/security logs independently of application-level fields, so production hosting/logging settings must be reviewed before the final public privacy policy is published.

## Security/authentication notes

- Account access uses signed bearer tokens rather than trusting a client-supplied account ID for protected systems.
- Recovery keys are high-entropy credentials; only their hashes are stored on the server.
- Deleted guest IDs are persistently tombstoned and loaded into token revocation at server startup.
- Race/Trade protections use authenticated account identity and server-authoritative inventory/results.
- Authenticated leaderboard submissions can be tied to the guest account for later deletion.
- Paid wallets are account-linked and disabled/unlinked when the account is deleted.
- Paid Diamonds remain blocked unless the server reports the Apple/Google provider verifier ready.
- Purchase verification validates platform, product and transaction identifiers and rejects invalid/revoked/refunded outcomes before granting currency.

## Store disclosure working map

The final Apple/Google answers should be based on the production build and backend configuration, but the current code indicates these categories need explicit review:

| Data/category | Current use | Collected off-device? | Launch review |
| --- | --- | --- | --- |
| Gameplay score/height | Leaderboard | Yes, when submitted | 180-day presentation window + leaderboard purpose |
| Pseudonymous guest account ID | Auth/multiplayer/linked leaderboard/wallet | Yes | In-app + external deletion routes implemented |
| Account recovery-key hash | Account recovery | Yes, hash only | Credential/security data; plaintext key remains player-controlled |
| Auth token | Session security | Sent to backend | Secure storage/expiry; revoked after deletion |
| Ranked results/profile | Competitive multiplayer | Yes | Deleted with guest account |
| Inventory/Orbuff ownership | Multiplayer/trade integrity | Yes where authoritative sync is enabled | Deleted with guest account |
| Trade records | Duplicate/integrity protection | Yes | Account-involving records deleted with guest account |
| Boss/reward grant records | Reward integrity | Yes | Deleted with guest account |
| Diamond wallet balance/account link | Virtual currency + recovery | Yes when wallet is used | Account-linked; wallet disabled/unlinked after deletion |
| Wallet transaction/ledger records | IAP reconciliation/security/accounting | Yes once IAP is enabled | Retention period/legal basis must be finalized before live IAP |
| Store transaction/product/platform data | IAP verification | Yes once IAP is enabled | Purchase-history/transaction disclosures and legal retention |
| Language/settings/local save | Device gameplay | Primarily local | Re-check native backup behavior |

## Must be decided before production submission

1. Minimum player age / target audience and whether children are in scope.
2. Retention periods for server records when the player does not request deletion.
3. Exact production retention period/legal basis for wallet transaction and purchase-verification records after account deletion.
4. Production hosting request/log retention.
5. Whether crash reporting, analytics, ads, notifications or other SDKs will be added.
6. Whether native OS/cloud backup can copy local save/recovery data off-device.
7. Final Apple App Privacy and Google Play Data safety answers after the signed production build is frozen.

## Release rule

Do not copy this file verbatim into the public privacy policy. Freeze the production SDK list, hosting/logging configuration, billing integration, retention periods and support/removal process before final store submission, then ensure the public policy and store disclosures match the production build.
