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
- Keeps real-money purchases fail-closed until native billing and provider verification are ready.

See `docs/MOBILE_RELEASE_SETUP.md` for native commands and release prerequisites.

## Store-account compliance state

Guest accounts now have an authenticated in-app deletion flow under System & Support in every selectable language. Successful deletion removes account-linked ranked, authoritative inventory, trade, boss-session and acquisition/reward data; writes a persistent deleted-account tombstone; revokes the deleted identity immediately; and reloads deleted IDs into revocation after server restart.

Local gameplay progress remains on-device and is explicitly described as not being removed by guest-account deletion. Leaderboard display-name rows are not currently linked to guest account IDs and therefore still need a separate public removal/contact process.

## Public launch gates still open

These gates must be completed before claiming a fully production-ready App Store / Google Play launch:

1. **Native billing bridge:** Implement and test StoreKit / Google Play Billing integration that satisfies the existing `PufflingIAP` bridge contract.
2. **Apple/Google server verification:** Activate provider-side transaction verification so `/iap/status` reports `providerReady: true`; keep paid Diamonds blocked until then.
3. **Durable paid wallet recovery/deletion policy:** Ensure paid balance recovers safely after reinstall/device changes and finalize how the separate wallet/transaction records map to account deletion and legally required purchase retention before enabling real-money purchases.
4. **Signed store packages:** Configure the owner's Android upload key and Apple Developer signing/team, then produce signed release builds.
5. **Store assets:** Add a production app icon, splash assets and final phone/tablet screenshots.
6. **Privacy/compliance publication:** Publish the privacy-policy URL, finish App Store privacy details and Google Play Data safety, document retention periods and leaderboard-removal contact flow, and complete age/content/target-audience declarations.
7. **Physical-device E2E:** Test production networking on real iPhone and Android hardware, including startup, save recovery, Boss Rush, Quick/Friend Race, Trade, account deletion, network interruption and — once enabled — purchase/restore/recovery paths.
8. **Pre-production distribution:** Complete TestFlight and Google Play Internal testing before production rollout.

The web beta can remain live while these native-only/public-store gates are completed.
