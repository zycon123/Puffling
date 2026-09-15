# Orbuff mobile release setup

This document tracks the native iOS/Android release path for Orbuff 5.27 Beta 107.

## Native identity and version

- App name: `Orbuff`
- App ID / package ID: `com.zyconstudios.orbuff`
- Native version: `5.27.107`
- Native build number / Android versionCode: `107`
- Web source: the same validated browser build used by the current beta
- Native wrapper: Capacitor 8
- Generated web directory: `www/` (not committed)

`release.config.json` is the canonical native release metadata. `package.json` must use the same version. Mobile validation fails if these drift apart.

## Local prerequisites

- Node.js 22+
- Android Studio / Android SDK for Android releases
- macOS + Xcode 26+ with iOS 26 SDK or later for App Store/TestFlight builds

## Validate the mobile bundle

```bash
npm install
npm run mobile:validate
```

The validation recreates `www/` from the current Orbuff web build and verifies app identity, safe-area support, localization, game-guide runtime, native package identity and release metadata.

## Native Orbuff icon and splash pipeline

The Android/iOS projects are generated from scratch. Canonical production branding therefore lives in:

```text
assets/
  logo.svg
  logo-dark.svg
```

Both SVG masters use `viewBox="0 0 1024 1024"`. `scripts/apply-native-assets.mjs` runs pinned `@capacitor/assets` generation after the native project exists.

Strict production generation:

```bash
npm run mobile:assets:android
npm run mobile:assets:ios
```

Unsigned/test builds can use the optional asset command, but production signing is blocked unless both approved SVG masters exist.

See `assets/README.md` and `docs/STORE_ASSET_SPEC.md` for the source/capture contract.

## Android

Create/open locally:

```bash
npm run mobile:add:android
npm run mobile:open:android
```

Production local build:

```bash
npm install
npm run mobile:add:android
npm run mobile:assets:android
npm run mobile:configure:android
cd android
./gradlew bundleRelease
```

Repository CI always produces:

- `orbuff-android-unsigned-aab`
- `orbuff-android-device-test-apk`

When all four Android signing secrets are configured, CI also creates and verifies:

- `orbuff-android-play-signed-aab`

The signed path fails closed on partial signing configuration or missing approved SVG masters.

## iOS

Create/open locally on a Mac:

```bash
npm run mobile:add:ios
npm run mobile:open:ios
```

Production local preparation:

```bash
npm install
npm run mobile:add:ios
npm run mobile:assets:ios
npm run mobile:configure:ios
npm run mobile:open:ios
```

The iOS workflow always validates Xcode/iOS SDK requirements and builds a simulator target without signing.

When all four iOS signing secrets are configured, CI additionally:

1. imports the Apple Distribution `.p12` into a temporary keychain;
2. decodes and validates the App Store provisioning profile;
3. checks Apple Team ID and `com.zyconstudios.orbuff` entitlement;
4. creates a Release `.xcarchive` for a generic iOS device;
5. exports an App Store Connect `.ipa`;
6. validates bundle ID, version `5.27.107`, build `107`, and code signature;
7. uploads `orbuff-ios-app-store-ipa` and `orbuff-ios-app-store-xcarchive` artifacts;
8. removes temporary signing material/keychain.

Required iOS GitHub Actions secrets:

- `ORBUFF_IOS_DISTRIBUTION_CERT_BASE64`
- `ORBUFF_IOS_CERT_PASSWORD`
- `ORBUFF_IOS_PROVISIONING_PROFILE_BASE64`
- `ORBUFF_APPLE_TEAM_ID`

The workflow intentionally does **not** upload to TestFlight automatically merely because signing secrets exist. TestFlight upload remains an explicit later/manual release action.

See `docs/STORE_SIGNING_SETUP.md` for exact certificate/profile preparation and security rules.

## Real-money purchases remain fail-closed

Native StoreKit 2 / Google Play Billing bridging, Apple/Google server verification, recoverable guest accounts and account-linked paid-Diamond wallets are implemented.

Real charging still requires all production provider credentials/configuration plus official Apple sandbox/TestFlight and Google Play Internal/license testing. The client does not open live purchase flow unless the native bridge, recoverable account-linked wallet, verification endpoint and provider readiness checks all pass.

Current product IDs remain intentionally stable:

- `puffling.diamonds.25`
- `puffling.diamonds.75`
- `puffling.diamonds.250`
- `puffling.diamonds.600`

## Remaining public-store gates

- Configure Android upload signing secrets and Apple Distribution/profile secrets owned by the publisher.
- Produce the first signed Play AAB and App Store IPA from reviewed `main`.
- Configure production Apple/Google IAP verification credentials and pass sandbox/Internal purchase tests.
- Finalize purchase-record retention/legal basis and synchronize public privacy/store disclosures.
- Produce final store screenshots and Google Play feature graphic.
- Complete App Store Connect / Play Console privacy, content-rating and target-audience forms.
- Run physical-device E2E and then TestFlight/Google Play Internal testing before production rollout.

The web beta can remain live while these native/store-account gates are completed.
