# Orbuff mobile release setup

This document tracks the native iOS/Android release path for Orbuff 5.27 Beta 107.

## Native identity

- App name: `Orbuff`
- App ID / package ID: `com.zyconstudios.orbuff`
- Web source: the same validated browser build used by the current beta
- Native wrapper: Capacitor 8
- Generated web directory: `www/` (not committed)

## Local prerequisites

- Node.js 22+
- Android Studio / Android SDK for Android releases
- macOS + Xcode for iOS releases

## Validate the mobile bundle

```bash
npm install
npm run mobile:validate
```

The validation recreates `www/` from the current Orbuff web build and verifies the app name, safe-area viewport, localization runtime, game guide runtime and native package configuration.

## Create/open Android

```bash
npm run mobile:add:android
npm run mobile:open:android
```

For later updates after the Android project exists:

```bash
npm run mobile:sync
npx cap open android
```

The repository CI also generates a clean Android project and builds an unsigned release AAB. Signing must be added with the owner's Google Play upload key before store submission.

## Create/open iOS

Run these commands on a Mac with Xcode installed:

```bash
npm run mobile:add:ios
npm run mobile:open:ios
```

For later updates:

```bash
npm run mobile:sync
npx cap open ios
```

The final iOS archive must be signed with the owner's Apple Developer team/certificates and uploaded through Xcode/App Store Connect.

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
