# Orbuff production signing setup

Release identity:

- App: `Orbuff`
- Android application ID / Apple bundle ID: `com.zyconstudios.orbuff`
- Version: `5.27.107`
- Build / Android versionCode: `107`

Never commit a private key, keystore, certificate private key, provisioning profile, store password, certificate password, App Store Connect API private key, or plaintext secret to this repository.

The canonical native artwork is `assets/logo.svg` plus `assets/logo-dark.svg`. Production-signed Android and iOS builds are blocked unless both approved Orbuff vector masters are present.

---

# Android / Google Play

## Signing model

For Google Play App Signing, use two concepts:

1. **App signing key** — normally held and protected by Google Play once Play App Signing is enabled. Google uses it to sign APKs delivered to users.
2. **Upload key** — held by Zycon Studios. Orbuff's `.aab` is signed with this key before it is uploaded to Play Console.

The upload key is the secret we need for GitHub/local release signing. Do not use a debug key for production submission.

## Create the Orbuff upload keystore

Run locally on a trusted machine with a current JDK:

```bash
keytool -genkeypair \
  -v \
  -keystore orbuff-upload.jks \
  -alias orbuff-upload \
  -keyalg RSA \
  -keysize 4096 \
  -validity 10000
```

Choose unique strong passwords. Store the `.jks`, store password, key password, and alias in a password manager / encrypted backup. Do **not** add `orbuff-upload.jks` to Git.

## Production native artwork gate

Before signing, the repository must contain:

- `assets/logo.svg`
- `assets/logo-dark.svg`

Both masters use the canonical Orbuff visual direction. The native asset helper generates Android adaptive icons/splash resources from them after Capacitor creates the native project.

For local Android generation:

```bash
npm install
npm run mobile:add:android
npm run mobile:assets:android
npm run mobile:configure:android
```

## Local signing of the generated AAB

```bash
cd android
./gradlew bundleRelease
```

Then sign a copy with the upload key:

```bash
cp app/build/outputs/bundle/release/app-release.aab orbuff-5.27.107-107.aab
jarsigner \
  -verbose \
  -sigalg SHA256withRSA \
  -digestalg SHA-256 \
  -keystore /secure/path/orbuff-upload.jks \
  orbuff-5.27.107-107.aab \
  orbuff-upload
jarsigner -verify -verbose -certs orbuff-5.27.107-107.aab
```

The final upload bundle must verify successfully before Play Console upload.

## GitHub Actions secret names

The Android release workflow produces a signed Play upload AAB only when all four secrets are configured and the approved Orbuff SVG masters are present:

- `ORBUFF_ANDROID_KEYSTORE_BASE64`
- `ORBUFF_ANDROID_KEY_ALIAS`
- `ORBUFF_ANDROID_STORE_PASSWORD`
- `ORBUFF_ANDROID_KEY_PASSWORD`

Prepare the base64 secret locally.

macOS/Linux:

```bash
base64 < orbuff-upload.jks | tr -d '\n'
```

PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("orbuff-upload.jks"))
```

When the secrets are absent, CI produces only the unsigned AAB and debug device-test APK. A partial secret set fails the workflow. This is intentional fail-closed behavior.

## Google Play upload sequence

1. Create the app in Play Console using package `com.zyconstudios.orbuff`.
2. Enable Play App Signing.
3. Register/use the Orbuff upload key.
4. Complete App content, Data Safety, account deletion, target audience, content rating and store listing.
5. Upload the signed `.aab` to **Internal testing** first.
6. Install through Google Play Internal testing on a real Android device.
7. Run the physical-device release checklist before promoting to production.

---

# iOS / App Store

## Current Apple build requirement

Orbuff App Store/TestFlight packages must be built with **Xcode 26 or later and the iOS 26 SDK or later**. The iOS workflow checks the active Xcode and iPhoneOS SDK before building. A newer supported Xcode/SDK is acceptable.

The App Store bundle ID is `com.zyconstudios.orbuff`.

## Apple Developer material required for a signed IPA

Create these in the owner's Apple Developer account:

1. An explicit App ID for `com.zyconstudios.orbuff`.
2. An **Apple Distribution** certificate whose private key is under the owner's control.
3. An **App Store Connect distribution provisioning profile** for `com.zyconstudios.orbuff` using that certificate.
4. An App Store Connect app record for Orbuff.

Export the distribution certificate together with its private key from Keychain Access as a password-protected `.p12`. Download the App Store Connect provisioning profile (`.mobileprovision`). Keep both outside Git.

## GitHub Actions secret names for signed iOS builds

The iOS workflow produces a signed `.xcarchive` and exported App Store `.ipa` only when all four values are configured:

- `ORBUFF_IOS_DISTRIBUTION_CERT_BASE64`
- `ORBUFF_IOS_CERT_PASSWORD`
- `ORBUFF_IOS_PROVISIONING_PROFILE_BASE64`
- `ORBUFF_APPLE_TEAM_ID`

`ORBUFF_APPLE_TEAM_ID` is the 10-character Apple Developer Team ID. Although a Team ID is not equivalent to a private key, the workflow keeps the whole signing configuration together in Actions secrets.

Prepare certificate/profile base64 locally.

macOS:

```bash
base64 < OrbuffDistribution.p12 | tr -d '\n'
base64 < Orbuff_AppStore.mobileprovision | tr -d '\n'
```

PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("OrbuffDistribution.p12"))
[Convert]::ToBase64String([IO.File]::ReadAllBytes("Orbuff_AppStore.mobileprovision"))
```

Paste only the resulting base64 strings into GitHub Actions secrets.

## Fail-closed iOS CI behavior

`.github/workflows/build-ios-release.yml` always performs the unsigned iOS simulator build. Before any signed archive it additionally verifies:

- all four signing values are present, or none are present;
- Xcode major version is at least 26;
- the iPhoneOS SDK major version is at least 26;
- `assets/logo.svg` and `assets/logo-dark.svg` are present;
- **Provisioning profile Team ID** equals `ORBUFF_APPLE_TEAM_ID`;
- the profile entitlement is exactly `${ORBUFF_APPLE_TEAM_ID}.com.zyconstudios.orbuff`;
- the exported app has bundle ID `com.zyconstudios.orbuff`;
- app version is `5.27.107` and build is `107`;
- the archived app passes `codesign --verify --deep --strict`.

The certificate is imported only into a temporary GitHub Actions keychain. The provisioning profile is installed only for the job. Signing files/keychain are removed in the cleanup step.

If successful, CI uploads two artifacts:

- `orbuff-ios-app-store-ipa`
- `orbuff-ios-app-store-xcarchive`

A partial Apple signing configuration fails instead of silently falling back to an unsigned production archive.

## Local signed archive path

On a trusted Mac with the correct Apple Developer account/certificate/profile installed:

```bash
npm install
npm run mobile:add:ios
npm run mobile:assets:ios
npm run mobile:configure:ios
npm run mobile:open:ios
```

In Xcode:

1. Select the `App` target.
2. Confirm bundle identifier `com.zyconstudios.orbuff`.
3. Select the correct Apple Developer Team under Signing & Capabilities.
4. Confirm version `5.27.107` and build `107`.
5. Confirm the generated AppIcon/launch branding uses the approved Orbuff assets.
6. Select a generic/Any iOS Device destination.
7. Choose **Product → Archive**.
8. In Organizer choose **Distribute App → App Store Connect → Upload**.
9. Add the processed build to **TestFlight** first.

Apple can automatically manage the distribution provisioning profile in Xcode, but the repository CI deliberately uses an explicit App Store provisioning profile so the automated archive is deterministic and fail-closed.

## Explicit TestFlight upload workflow

`.github/workflows/upload-ios-testflight.yml` is **workflow_dispatch only**. Normal pushes and pull requests cannot upload a build to Apple.

The upload workflow requires these additional GitHub Actions secrets:

- `ORBUFF_ASC_APPLE_ID` — Apple Account used by `altool` with the App Store Connect API key.
- `ORBUFF_ASC_KEY_ID` — App Store Connect API key ID.
- `ORBUFF_ASC_ISSUER_ID` — App Store Connect API issuer ID.
- `ORBUFF_ASC_PRIVATE_KEY` — complete `.p8` App Store Connect API private key, stored as a multiline GitHub secret.

Apple documents App Store Connect API keys/JWTs for automated uploads, and `altool` can authenticate using the API key ID and issuer while locating the matching `AuthKey_<KEY_ID>.p8` file in its private-key search path.

The workflow deliberately separates **signing** from **uploading**:

1. From reviewed current `main`, manually run **Validate Orbuff iOS Build** after all four iOS signing secrets are configured.
2. Confirm that run succeeds and contains artifact `orbuff-ios-app-store-ipa`.
3. Copy that GitHub Actions run ID.
4. Manually run **Upload Orbuff iOS to TestFlight**.
5. Enter the signed-build run ID as `source_run_id`.
6. Type exactly `UPLOAD TESTFLIGHT` in the confirmation input.
7. The workflow rejects a source run unless it came from `.github/workflows/build-ios-release.yml`, succeeded on `main`, and its commit is still the current `main` commit.
8. It downloads only `orbuff-ios-app-store-ipa`, unpacks it and re-checks bundle ID `com.zyconstudios.orbuff`, version `5.27.107`, build `107`, and code signature.
9. It writes the `.p8` key only to the runner's temporary App Store Connect key path, validates the IPA with Apple, then uploads it with `xcrun altool`.
10. The private key and temporary IPA extraction are removed in an `always()` cleanup step.

A successful upload means Apple accepted the binary transfer. App Store Connect processing still occurs afterward before the build becomes visible/usable in TestFlight.

The App Store Connect API key should have only the role/permissions needed for Orbuff build upload/TestFlight operations. Revoke and replace the key immediately if the private key is ever exposed.

---

# Release security rules

- Never reuse the Android debug keystore as a Play upload key.
- Never commit the Android `.jks`, Apple `.p12`, provisioning profile, certificate private key, or App Store Connect private key.
- Never include plaintext passwords in workflow YAML.
- Never production-sign a native build that still uses Capacitor/default artwork.
- Never make normal push/PR workflows upload builds to App Store Connect.
- Keep encrypted backups of production signing credentials under the owner's control.
- Build production releases from a clean, reviewed `main` commit.
- Verify package/bundle ID, version and build before upload.
- Keep real-money Diamonds disabled until signed store builds, Apple/Google provider verification, sandbox/Internal testing, recovery/refund handling, and store privacy disclosures are all verified.
