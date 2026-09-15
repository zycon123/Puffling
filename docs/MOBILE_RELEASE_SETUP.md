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

`release.config.json` is the canonical native release metadata. `package.json` must use the same version. The mobile validation fails if these drift apart.

## Local prerequisites

- Node.js 22+
- Android Studio / Android SDK for Android releases
- macOS + Xcode for iOS releases

## Validate the mobile bundle

```bash
npm install
npm run mobile:validate
```

The validation recreates `www/` from the current Orbuff web build and verifies the app name, safe-area viewport, localization runtime, game guide runtime, native package identity and release metadata.

## Create/open Android

```bash
npm run mobile:add:android
npm run mobile:open:android
```

The commands apply the version from `release.config.json` to the generated Android project. For a later manual sync/build, run:

```bash
npm run mobile:sync
npm run mobile:configure:android
npx cap open android
```

Repository CI generates a clean Android project and produces two artifacts:

- `orbuff-android-unsigned-aab`: release bundle used to prove the store build completes; it still requires the owner's Google Play upload signing before submission.
- `orbuff-android-device-test-apk`: debug-signed APK intended only for direct physical-device testing before the store release.

Never submit or market the debug APK as the production build.

## Create/open iOS

Run these commands on a Mac with Xcode installed:

```bash
npm run mobile:add:ios
npm run mobile:open:ios
```

For a later manual sync/build:

```bash
npm run mobile:sync
npm run mobile:configure:ios
npx cap open ios
```

The iOS CI verifies that a clean generated project accepts the same `5.27.107 (107)` release metadata and builds for the simulator without code signing. The final iOS archive must be signed with the owner's Apple Developer team/certificates and uploaded through Xcode/App Store Connect.

## Real-money purchases remain fail-closed

The client already refuses to grant paid Diamonds unless all of the following are true:

1. A native store bridge is available.
2. A signed Diamond wallet is available.
3. The verification endpoint is configured.
4. `/iap/status` reports the provider verifier as ready.
5. The platform is iOS or Android.

Do not enable real charging until the native StoreKit / Google Play Billing bridge and Apple/Google server-side purchase verification are implemented and tested in official sandbox/test environments.

Current product IDs are intentionally preserved for compatibility:

- `puffling.diamonds.25`
- `puffling.diamonds.75`
- `puffling.diamonds.250`
- `puffling.diamonds.600`

Do not register replacement IDs casually after store products have been created; product identifiers should be treated as persistent release identifiers.

## Remaining public-store gates

- Add the actual native billing bridge and Apple/Google provider verification.
- Add durable account/wallet recovery across reinstall/device changes.
- Add production app icon, splash assets and store screenshots.
- Configure Android upload signing and Apple signing/team settings.
- Complete privacy policy/store privacy declarations and age/content ratings.
- Run physical-device E2E on at least one supported iPhone and Android device, including startup, save recovery, Race, Friend Race, Boss Rush, purchases/restores and network interruption.
- Release through TestFlight and Google Play Internal testing before production rollout.

The web beta can remain live while these native-only gates are completed.
