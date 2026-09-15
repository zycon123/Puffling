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

The leaderboard client can submit height/score, run signature and game version to the game API. New authenticated submissions attach the signed guest-account token. The server stores the authenticated guest account ID with the score row and exposes a deterministic public alias such as `Orbuff-XXXXXX` rather than the player's local free-text display name.

Purpose: public/competitive leaderboard functionality and anti-cheat validation.

Account-linked rows are removed automatically when that guest account is deleted. Older beta rows may not contain an account ID; the public deletion page retains a support route for matching/removing those legacy entries where possible. Leaderboard presentation uses a rolling recent-results window and the backend periodically removes older rows.

### 3. Pseudonymous guest account identity and recovery

The backend creates guest accounts using a randomly generated account ID and issues a signed bearer token. Authenticated multiplayer/trade/ranked systems use the account ID as the server identity.

Guest accounts also have an account-recovery credential. The plaintext recovery key is shown/stored on the player's device; the backend stores only a SHA-256 hash of that key. A valid Account ID + recovery key can issue a fresh signed token for the same guest identity after reinstall/device change. Recovery keys can be rotated. Deleted account IDs are blocked from recovery.

Purpose: account/session authentication, recovery after reinstall/device change, multiplayer integrity, inventory ownership, trade protection, ranked progression and wallet recovery.

Orbuff exposes backup/recovery controls plus an in-app **Delete guest account** control under System & Support in every selectable language. The deletion request requires the signed bearer token and explicit destructive confirmation.

On successful deletion the server removes account-linked rows from:

- ranked profile/results (results cascade with the profile),
- authoritative Orbuff inventory and inventory migration state,
- trade records involving the account,
- acquisition/reward grants,
- boss combat sessions,
- leaderboard score rows that contain the authenticated guest account ID,
- the account recovery credential record.

The server then writes a persistent deleted-account tombstone. Deleted IDs are loaded into authentication revocation on server startup, and the just-deleted token is rejected immediately. The client removes the stored account token/ID/recovery key and restarts after success.

Local gameplay progress on the device is intentionally not erased by deleting the server guest account; the deletion UI states this clearly. Starting an online feature later may create a new, unrelated guest account.

### 4. Multiplayer, ranked and trade data

Server-authoritative Race/Trade systems can process identifiers and gameplay state required to match players, validate ownership, settle race results and protect trades. Ranked profiles include an account ID plus competitive rating/win/loss state.

Purpose: multiplayer gameplay, matchmaking/ranking, fraud/cheat prevention and inventory integrity.

Account-linked ranked, trade and inventory records are covered by the authenticated guest-account deletion route. Production retention periods for records that are not deleted by the user still need to be documented.

### 5. Authoritative inventory/progression

Production multiplayer protections can verify Orbuff ownership against server-authoritative inventory. Some progression/economy state therefore may be stored or synchronized server-side in addition to local save state.

Purpose: prevent inventory manipulation, protect trades and ensure multiplayer selections are valid.

Authoritative inventory rows and inventory-migration state are deleted with the guest account. Local save data remains local unless the user separately resets local data.

### 6. Diamond wallet and in-app purchases

The backend contains wallet and IAP endpoints. Recoverable guest accounts are mapped to an authoritative Diamond wallet. The purchase verification flow uses the signed wallet token plus the native store purchase proof and records transaction information such as transaction ID, wallet ID, platform, product ID, Diamond amount and provider verification/payment metadata needed for reconciliation and duplicate protection.

Purpose: process in-app purchases, grant paid currency, recover the same paid balance after account restoration, reconcile store transactions and prevent fraud/double-crediting.

Current launch state: the native billing bridge and Apple/Google provider-verification framework are implemented, but real-money purchasing remains fail-closed until production store credentials/provider mode are configured and official Apple sandbox/TestFlight plus Google Play license/Internal testing passes.

Account/wallet deletion boundary:

- a recoverable guest account is linked to one authoritative wallet;
- restoring the guest account reconnects the same wallet and paid-Diamond balance;
- live IAP requires `accountLinked:true`;
- deleting the guest account removes the account-to-wallet link and disables the wallet so old wallet tokens can no longer spend or receive purchases;
- store transaction and wallet-ledger rows may be retained in pseudonymized form where needed for duplicate prevention, refunds, fraud prevention, accounting or legal obligations.

Do not claim the app collects full payment-card details; Apple/Google store billing should handle payment credentials rather than Orbuff.

## Public privacy/deletion resources

The release publishes:

- Privacy Policy: `https://zycon123.github.io/Puffling/privacy.html`
- Account deletion / privacy choices: `https://zycon123.github.io/Puffling/delete-account.html`

Both are linked from System & Support inside Orbuff. The app exposes a copyable guest Account ID plus account backup/recovery controls so players can retain access to their pseudonymous account after reinstall/device change.

## Data not found in the current repository audit

No dedicated analytics SDK or advertising SDK was identified by the 2026-09-15 repository search. No code was identified that intentionally collects precise location, contacts, photos, microphone data, health data or advertising identifiers.

This finding must be re-checked after adding native plugins, crash reporting, analytics, ads, push notifications or any other third-party SDK. Hosting providers may also generate operational request/security logs independently of application-level fields, so production hosting/logging settings must be reviewed before the final public privacy policy is frozen.

## Security/authentication notes

- Account access uses signed bearer tokens rather than trusting a client-supplied account ID for protected systems.
- Recovery keys are high-entropy secrets; the server stores only SHA-256 hashes and supports rotation.
- Deleted guest IDs are persistently tombstoned and loaded into token revocation at server startup.
- Race/Trade protections use authenticated account identity and server-authoritative inventory/results.
- Authenticated leaderboard submissions can be tied to the guest account for later deletion.
- Paid-Diamond wallets are account-linked and disabled/unlinked on account deletion.
- Paid Diamonds remain blocked unless the server reports the provider verifier ready and the wallet reports `accountLinked:true`.
- Purchase verification validates platform, product and transaction identifiers and rejects invalid/revoked/refunded outcomes before granting currency.

## Store disclosure working map

The final Apple/Google answers should be based on the production build and backend configuration, but the current code indicates these categories need explicit review:

| Data/category | Current use | Collected off-device? | Launch review |
| --- | --- | --- | --- |
| Gameplay score/height | Leaderboard | Yes, when submitted | Recent-results window + leaderboard purpose |
| Pseudonymous guest account ID | Auth/multiplayer/linked leaderboard/wallet | Yes | In-app + external deletion routes implemented |
| Recovery-key hash | Account recovery | Yes, hash only | Treat as account/security credential; never log plaintext key |
| Auth token | Session security | Sent to backend | Secure storage/expiry; revoked after deletion |
| Ranked results/profile | Competitive multiplayer | Yes | Deleted with guest account |
| Inventory/Orbuff ownership | Multiplayer/trade integrity | Yes where authoritative sync is enabled | Deleted with guest account |
| Trade records | Duplicate/integrity protection | Yes | Account-involving records deleted with guest account |
| Boss/reward grant records | Reward integrity | Yes | Deleted with guest account |
| Diamond wallet balance | Virtual currency | Yes when wallet is used | Restored through guest account; wallet disabled/unlinked on account deletion |
| Wallet ledger/store transaction records | IAP integrity/accounting | Yes once IAP is enabled | May require pseudonymized retention after deletion |
| Store product/platform verification data | IAP verification | Yes once IAP is enabled | Purchase-history/transaction disclosures and legal retention |
| Language/settings/local save | Device gameplay | Primarily local | Re-check native backup behavior |

## Must be decided before production submission

1. Minimum player age / target audience and whether children are in scope.
2. Retention periods for server records when the player does not request deletion.
3. Exact production retention duration/legal basis for pseudonymized wallet ledger and store transaction records after account deletion.
4. Production hosting request/log retention.
5. Whether crash reporting, analytics, ads, notifications or other SDKs will be added.
6. Whether native OS/cloud backup can copy local save or recovery-key data off-device.
7. Final Apple App Privacy and Google Play Data safety answers after the signed production build is frozen and paid-IAP activation state is known.

## Release rule

Do not copy this file verbatim into the public privacy policy. Freeze the production SDK list, hosting/logging configuration, billing activation state, retention periods and support/removal process before final store submission, then ensure the public policy and store disclosures match the production build.
