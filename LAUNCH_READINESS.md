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
- Builds an unsigned Android release AAB and an installable debug-signed Android device-test APK.
- Builds the iOS simulator target without signing.
- Enforces Android compile/target SDK API 36 for the current Google Play launch requirement.
- Has a fail-closed production Android signing path: all four upload-key GitHub secrets must be present before CI can create and verify `orbuff-android-play-signed-aab`.
- Keeps real-money purchases fail-closed until native billing and provider verification are ready.

See `docs/MOBILE_RELEASE_SETUP.md` and `docs/STORE_SIGNING_SETUP.md` for native commands, credential handling and signing prerequisites.

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

## Content rating and store-asset preparation

The launch branch now contains:

- `docs/CONTENT_RATING_AUDIT.md` — production-content mapping for Apple age rating and Google Play/IARC questionnaire answers.
- `docs/STORE_ASSET_SPEC.md` — required/recommended App Store and Google Play icon, feature-graphic and screenshot dimensions plus the exact Orbuff capture plan.
- `docs/PHYSICAL_DEVICE_RELEASE_CHECKLIST.md` — real Android/iPhone/iPad launch QA covering install, localization, Boss 10, endless mode, Boss Rush, Race, Trade, leaderboard privacy, deletion and network interruption.

The content audit records fantasy/cartoon combat, competitive contests and the Mystery Box randomized-reward mechanic; it does not misclassify the game as casino gambling. Target audience remains a publisher decision because selecting child age groups in Google Play can trigger additional Families Policy obligations.

The Mystery Shop audit also removed the final stale Fusion Crystal reward. Its 26% reward slot is now `1000 Coins`, preserving the remaining rarity odds rather than silently increasing rare/epic/legendary rewards.

## Public launch gates still open

These gates must be completed before claiming a fully production-ready App Store / Google Play launch:

1. **Native billing bridge:** Implement and test StoreKit / Google Play Billing integration that satisfies the existing `PufflingIAP` bridge contract.
2. **Apple/Google server verification:** Activate provider-side transaction verification so `/iap/status` reports `providerReady: true`; keep paid Diamonds blocked until then.
3. **Durable paid wallet recovery/deletion policy:** Ensure paid balance recovers safely after reinstall/device changes and finalize how the separate wallet/transaction records map to account deletion and legally required purchase retention before enabling real-money purchases.
4. **Production signing credentials:** Create and securely store the owner's Android upload key, add all four Android GitHub signing secrets, and configure the correct Apple Developer Team/App Store Connect signing. CI support is prepared, but no private production key is committed or assumed.
5. **Signed store packages:** Produce and verify the first signed Android Play AAB and signed iOS archive from reviewed `main`.
6. **Store assets:** Produce the production icon, feature graphic and final phone/tablet screenshots using `docs/STORE_ASSET_SPEC.md`.
7. **Store-form completion:** Enter the published privacy/deletion URLs and reviewed answers from `docs/STORE_PRIVACY_FORM_ANSWERS.md`, then complete the age/content questionnaire from `docs/CONTENT_RATING_AUDIT.md`. Target audience remains an explicit publisher decision.
8. **Physical-device E2E:** Run `docs/PHYSICAL_DEVICE_RELEASE_CHECKLIST.md` on real Android and iPhone hardware and on iPad if iPad remains enabled. Repeat critical tests in Google Play Internal and TestFlight builds.
9. **Pre-production distribution:** Complete TestFlight and Google Play Internal testing before production rollout.

See `docs/STORE_SUBMISSION_METADATA.md`, `docs/STORE_LISTING_COPY.md`, `docs/STORE_PRIVACY_FORM_ANSWERS.md`, `docs/CONTENT_RATING_AUDIT.md`, `docs/STORE_ASSET_SPEC.md`, `docs/PHYSICAL_DEVICE_RELEASE_CHECKLIST.md` and `docs/STORE_SIGNING_SETUP.md` for the ready-to-use launch material.

The web beta can remain live while these native-only/public-store gates are completed.
