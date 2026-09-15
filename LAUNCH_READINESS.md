# Orbuff launch readiness — 5.27 Beta 107

## Current validated state

The current web beta is deployed from `main` and its build validation and GitHub Pages deployment are green. The beta includes the Orbuff rebrand, multilingual menus/game guide, the 100-Orbuff collection runtime, progression/evolution, OrbVault, Mystery Boxes/Diamonds, Boss Rush, Quick/Friend Race, ranked foundations, authoritative Trade protections, leaderboard/backend integration and save-recovery checks.

The automated gameplay and backend suites cover the joined progression journey, Boss/Race systems, deterministic Race course generation, reconnect/resume, position integrity, attack limits/cooldowns, authoritative Race result settlement, inventory/trade protections, Diamond wallet/IAP fail-closed behavior and corrupted-save recovery.

Multiplayer hardening requires signed account identity for Quick/Friend Race, prevents the same account from filling both Race slots, locks the selected Orbuff at ready time, verifies ownership against authoritative server inventory where available and canonicalizes Race attacks server-side.

## Native mobile release state

The Capacitor 8 native release foundation is merged into `main` with app ID `com.zyconstudios.orbuff`.

Canonical native release metadata is:

- Version: `5.27.107`
- Build / Android versionCode: `107`

The native pipeline:

- Rebuilds a clean `www/` directory from the validated Orbuff browser build.
- Verifies Orbuff identity, safe-area support, localization, game-guide modules and release metadata.
- Generates clean Android and iOS projects in CI.
- Uses approved vector masters `assets/logo.svg` and `assets/logo-dark.svg` through pinned `@capacitor/assets` generation for native icons/splash resources.
- Builds an unsigned Android release AAB and an installable debug-signed Android device-test APK.
- Builds the iOS simulator target without signing.
- Enforces Android compile/target SDK API 36 for the current Google Play launch requirement.
- Has a fail-closed production Android signing path: all four upload-key GitHub secrets and approved Orbuff native masters must be present before CI can create and verify `orbuff-android-play-signed-aab`.
- Includes the Capacitor 8 StoreKit 2 / Google Play native purchase bridge. Android consumables are consumed only after Orbuff server credit; iOS StoreKit transactions are finished only after server credit. CI validates the bridge and the pinned StoreKit safety patch.
- Keeps real-money purchases fail-closed until provider credentials and production verification mode are configured and official sandbox/internal tests pass.

See `assets/README.md`, `docs/MOBILE_RELEASE_SETUP.md`, `docs/IAP_SETUP.md` and `docs/STORE_SIGNING_SETUP.md` for native commands, billing flow, credential handling and signing prerequisites.

## Store-account and privacy compliance state

Guest accounts have an authenticated in-app deletion flow under System & Support in every selectable language. Successful deletion removes account-linked ranked, authoritative inventory, trade, boss-session, acquisition/reward and authenticated leaderboard data; writes a persistent deleted-account tombstone; revokes the deleted identity immediately; and reloads deleted IDs into revocation after server restart.

Public leaderboard submissions no longer transmit the player's local free-text display name. The server exposes deterministic aliases such as `Orbuff-XXXXXX`, and legacy beta leaderboard names are anonymized during leaderboard-store initialization. Legacy anonymous score rows may remain non-account-linked until normal retention cleanup, but they no longer expose the old player-entered names publicly.

The public privacy resources are deployed from `main` through GitHub Pages:

- Privacy Policy: `https://zycon123.github.io/Puffling/privacy.html`
- Account deletion / privacy choices: `https://zycon123.github.io/Puffling/delete-account.html`
- In-app links to both resources under System & Support.
- A copyable guest Account ID to make support/deletion requests easier to match safely.
- A direct external deletion-request route that does not require reinstalling the app.

The repository contains a release-specific working sheet for Apple App Privacy and Google Play Data Safety at `docs/STORE_PRIVACY_FORM_ANSWERS.md`. It separates the current submitted build from future paid-IAP disclosures so disabled purchases are not accidentally declared as live functionality.

## IAP verification state

The paid-Diamond server uses a fail-closed provider gate. `server/iap_provider_verifier.js` verifies StoreKit 2 signed transactions with Apple's official App Store Server Library and Google Play one-time purchases with the Android Publisher API. Exact product/transaction identity is checked before credit; revoked/cancelled/consumed first-time proofs are rejected; transaction IDs remain globally idempotent in Postgres.

Bootstrap injects the live provider verifier only when both Apple and Google configurations are complete. `PUFFLING_IAP_PROVIDER_MODE` must also be explicitly set to `apple_google`; otherwise `/iap/status` remains `providerReady:false` and the app will not start a real-money purchase.

No Apple root certificates, Google service-account credentials, store signing secrets or private keys are committed to the repository.

## Content rating and store-asset preparation

The repository contains:

- `docs/CONTENT_RATING_AUDIT.md` — production-content mapping for Apple age rating and Google Play/IARC questionnaire answers.
- `docs/STORE_ASSET_SPEC.md` — required/recommended App Store and Google Play icon, feature-graphic and screenshot dimensions plus the exact Orbuff capture plan.
- `docs/PHYSICAL_DEVICE_RELEASE_CHECKLIST.md` — real Android/iPhone/iPad launch QA covering install, localization, Boss 10, endless mode, Boss Rush, Race, Trade, leaderboard privacy, deletion and network interruption.
- `assets/README.md` + `scripts/apply-native-assets.mjs` — the canonical two-SVG native icon/splash source contract and generated-resource pipeline.

The content audit records fantasy/cartoon combat, competitive contests and the Mystery Box randomized-reward mechanic; it does not misclassify the game as casino gambling. Target audience remains a publisher decision because selecting child age groups in Google Play can trigger additional Families Policy obligations.

The Mystery Shop audit also removed the final stale Fusion Crystal reward. Its 26% reward slot is now `1000 Coins`, preserving the remaining rarity odds rather than silently increasing rare/epic/legendary rewards.

## Public launch gates still open

These gates must be completed before claiming a fully production-ready App Store / Google Play launch:

1. **Production IAP configuration and store testing:** Configure Apple App ID/root certificates, Google Play service-account credentials and `PUFFLING_IAP_PROVIDER_MODE=apple_google` on the production backend. Confirm `/iap/status` only becomes `providerReady:true` after both providers are ready, then pass Apple sandbox/TestFlight and Google Play license/Internal tests for success, cancel, pending, retry, duplicate, network loss and revoked/refunded cases.
2. **Durable paid wallet recovery/deletion policy:** Ensure paid balance recovers safely after reinstall/device changes and finalize how the separate wallet/transaction records map to account deletion and legally required purchase retention before enabling real-money purchases.
3. **Production signing credentials:** Create and securely store the owner's Android upload key, add all four Android GitHub signing secrets, and configure the correct Apple Developer Team/App Store Connect signing. CI support is prepared, but no private production key is committed or assumed.
4. **Signed store packages:** Produce and verify the first signed Android Play AAB and signed iOS archive from reviewed `main` using the approved Orbuff native artwork.
5. **Store listing assets:** Produce the Google Play feature graphic and final phone/tablet screenshots using `docs/STORE_ASSET_SPEC.md`.
6. **Store-form completion:** Enter the published privacy/deletion URLs and reviewed answers from `docs/STORE_PRIVACY_FORM_ANSWERS.md`, then complete the age/content questionnaire from `docs/CONTENT_RATING_AUDIT.md`. Target audience remains an explicit publisher decision.
7. **Physical-device E2E:** Run `docs/PHYSICAL_DEVICE_RELEASE_CHECKLIST.md` on real Android and iPhone hardware and on iPad if iPad remains enabled. Repeat critical tests in Google Play Internal and TestFlight builds.
8. **Pre-production distribution:** Complete TestFlight and Google Play Internal testing before production rollout.

See `docs/IAP_SETUP.md`, `docs/STORE_SUBMISSION_METADATA.md`, `docs/STORE_LISTING_COPY.md`, `docs/STORE_PRIVACY_FORM_ANSWERS.md`, `docs/CONTENT_RATING_AUDIT.md`, `docs/STORE_ASSET_SPEC.md`, `docs/PHYSICAL_DEVICE_RELEASE_CHECKLIST.md` and `docs/STORE_SIGNING_SETUP.md` for the ready-to-use launch material.

The web beta can remain live while these native-only/public-store gates are completed.
