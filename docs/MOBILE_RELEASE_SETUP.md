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

## Native Orbuff icon and splash pipeline

The Android/iOS projects are generated from scratch, so native branding must be regenerated after the platform project exists. Orbuff uses `scripts/apply-native-assets.mjs`, pinned to `@capacitor/assets` 3.0.5.

The final production source set belongs under `assets/`:

```text
assets/
  icon-only.png
  icon-foreground.png
  icon-background.png
  splash.png
  splash-dark.png
```

Minimum source sizes:

- each icon source: 1024×1024 PNG or larger;
- each splash source: 2732×2732 PNG or larger.

Until the approved production artwork is committed, unsigned/test CI is allowed to skip generation so development builds remain usable. A partial asset set fails validation. Android production signing is additionally blocked until all five production source images are present.

Strict production checks/generation:

```bash
npm run mobile:assets:android
npm run mobile:assets:ios
```

See `assets/README.md` and `docs/STORE_ASSET_SPEC.md` for the complete source/capture contract.

## Create/open Android

```bash
npm run mobile:add:android
npm run mobile:open:android
```

The commands prepare the web bundle, generate/sync Android, apply Orbuff native assets when the full source set exists, and apply the version from `release.config.json`.

For a production local build, require the branded assets explicitly before building/signing:

```bash
npm run mobile:add:android
npm run mobile:assets:android
npm run mobile:configure:android
cd android
./gradlew bundleRelease
```

Repository CI generates a clean Android project and produces two artifacts while signing secrets are absent:

- `orbuff-android-unsigned-aab`: release bundle used to prove the store build completes; it still requires the owner's Google Play upload signing before submission.
- `orbuff-android-device-test-apk`: debug-signed APK intended only for direct physical-device testing before the store release.

When all Android signing secrets are later configured, CI refuses to create the signed Play AAB unless all five production Orbuff asset sources are also present and valid.

Never submit or market the debug APK as the production build.

## Create/open iOS

Run these commands on a Mac with Xcode installed:

```bash
npm run mobile:add:ios
npm run mobile:open:ios
```

For a production signed archive, require branded assets before opening/archiving:

```bash
npm run mobile:add:ios
npm run mobile:assets:ios
npm run mobile:configure:ios
npm run mobile:open:ios
```

The iOS CI verifies that a clean generated project accepts the same `5.27.107 (107)` release metadata and builds for the simulator without code signing. The simulator path can remain usable before final artwork is committed. The final iOS archive must use the approved Orbuff asset set, be signed with the owner's Apple Developer team/certificates and be uploaded through Xcode/App Store Connect.

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
- Produce/approve the five production native icon/splash source images and the final store screenshots. The generation/validation pipeline is already prepared.
- Configure Android upload signing and Apple signing/team settings.
- Complete the reviewed privacy/content forms in App Store Connect and Play Console.
- Run physical-device E2E on at least one supported iPhone and Android device, including startup, save recovery, Race, Friend Race, Boss Rush, purchases/restores and network interruption.
- Release through TestFlight and Google Play Internal testing before production rollout.

The web beta can remain live while these native-only gates are completed.
