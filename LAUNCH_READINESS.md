# Orbuff launch readiness — 5.27 Beta 107

## Current validated state

The current web beta is deployed from `main` and its latest build validation and GitHub Pages deployment are green. The beta includes the Orbuff rebrand, multilingual menus/game guide, the 100-Orbuff collection runtime, progression/evolution, OrbVault, Mystery Boxes/Diamonds, Boss Rush, Quick/Friend Race, ranked foundations, authoritative Trade protections, leaderboard/backend integration and save-recovery checks.

The automated gameplay and backend suites cover the joined progression journey, Boss/Race systems, deterministic Race course generation, reconnect/resume, position integrity, attack limits/cooldowns, authoritative Race result settlement, inventory/trade protections, Diamond wallet/IAP fail-closed behavior and corrupted-save recovery.

Multiplayer hardening now requires signed account identity for Quick/Friend Race, prevents the same account from filling both Race slots, locks the selected Orbuff at ready time, can verify ownership against authoritative server inventory and canonicalizes Race attacks server-side.

## Mobile release foundation

A Capacitor-based native release foundation is being validated on `launch/mobile-release-foundation` with app ID `com.zyconstudios.orbuff`.

The mobile pipeline:

- Rebuilds a clean `www/` directory from the validated Orbuff browser build.
- Verifies Orbuff identity, safe-area support, localization and game-guide modules.
- Generates a native Android project in CI from a clean checkout.
- Builds an unsigned Android release AAB as a pre-signing launch check.
- Keeps real-money purchases fail-closed until native billing and provider verification are ready.

See `docs/MOBILE_RELEASE_SETUP.md` for native commands and release prerequisites.

## Public launch gates still open

These gates must be completed before claiming a fully production-ready App Store / Google Play launch:

1. **Native billing bridge:** Implement and test StoreKit / Google Play Billing integration that satisfies the existing `PufflingIAP` bridge contract.
2. **Apple/Google server verification:** Activate provider-side transaction verification so `/iap/status` reports `providerReady: true`; keep paid Diamonds blocked until then.
3. **Durable account/wallet recovery:** Ensure paid balance and account identity recover safely after reinstall and device changes.
4. **Signed store packages:** Configure the owner's Android upload key and Apple Developer signing/team, then produce signed release builds.
5. **Store assets and compliance:** Production icon/splash, screenshots, privacy policy/URL, App Store privacy details, Google Play Data safety, age/content ratings and store listing metadata.
6. **Physical-device E2E:** Test production networking on real iPhone and Android hardware, including startup, save recovery, Boss Rush, Quick/Friend Race, Trade, network interruption, purchases and restore/recovery paths.
7. **Pre-production distribution:** Complete TestFlight and Google Play Internal testing before production rollout.

The web beta can remain live while these native-only release gates are completed.
