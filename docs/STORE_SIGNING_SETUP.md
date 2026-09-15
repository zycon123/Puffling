# Orbuff production signing setup

Release identity:

- App: `Orbuff`
- Android application ID / Apple bundle ID: `com.zyconstudios.orbuff`
- Version: `5.27.107`
- Build / Android versionCode: `107`

Never commit a private key, keystore, certificate private key, provisioning profile containing private material, store password, key password, App Store Connect API private key, or plaintext secret to this repository.

Before any production-signed store build, also require the approved Orbuff native artwork under `assets/`. The repository intentionally allows unsigned/test builds without final artwork, but a production-signed Android AAB is blocked until the complete source set exists.

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

Choose unique strong passwords. Store the `.jks`, store password, key password, and alias in a password manager / encrypted backup. Losing the upload key is recoverable through Play's upload-key reset process, but losing credentials still creates avoidable release friction.

Do **not** add `orbuff-upload.jks` to Git.

## Production native artwork gate

Before signing, the repository must contain all five approved PNG sources:

- `assets/icon-only.png`
- `assets/icon-foreground.png`
- `assets/icon-background.png`
- `assets/splash.png`
- `assets/splash-dark.png`

Run the strict generator/check after creating the native project:

```bash
npm run mobile:add:android
npm run mobile:assets:android
```

The helper validates minimum dimensions and generates Android adaptive icons/splash resources with the pinned Capacitor asset generator. A partial asset set fails. GitHub production signing also fails if any of the five sources is missing.

## Local signing of the generated AAB

After the native project and production assets pass:

```bash
npm install
npm run mobile:add:android
npm run mobile:assets:android
npm run mobile:configure:android
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

The repository's Android release workflow is prepared to produce a signed AAB automatically **only when all four secrets are configured and the complete production asset set is present**:

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

Paste only the resulting base64 value into the GitHub Actions secret. Never paste it into source files, issues, pull requests, chat logs, or workflow YAML.

When the secrets are absent, CI continues to produce only the unsigned AAB and debug device-test APK. This is intentional fail-closed behavior. When all four secrets are present but production artwork is missing, signed AAB generation fails rather than shipping Capacitor/default branding.

## Google Play upload sequence

1. Create the app in Play Console using package `com.zyconstudios.orbuff`.
2. Enable Play App Signing.
3. Register/use the Orbuff upload key.
4. Confirm the production Orbuff icon/splash sources are committed and generated into the native project.
5. Complete App content, Data Safety, account deletion, target audience, content rating and store listing.
6. Upload the signed `.aab` to **Internal testing** first.
7. Install through Google Play Internal testing on a real Android device.
8. Run the physical-device release checklist before promoting to production.

---

# iOS / App Store

## Requirements

A production iOS upload needs:

- an active Apple Developer Program membership;
- App ID / bundle ID `com.zyconstudios.orbuff` registered to the correct Apple Developer Team;
- an App Store Connect app record;
- valid distribution signing managed by Xcode or equivalent CI credentials;
- a build using the currently accepted Apple SDK/Xcode requirement;
- version/build matching the App Store Connect record;
- the approved Orbuff icon/splash sources generated into the native iOS project.

The current repository CI only proves that the generated iOS project builds for the simulator with code signing disabled. It does **not** create a distributable `.ipa` yet.

## Recommended first signed archive path

Use a Mac with the Apple Developer account signed into Xcode:

```bash
npm install
npm run mobile:add:ios
npm run mobile:assets:ios
npm run mobile:configure:ios
npm run mobile:open:ios
```

`mobile:assets:ios` is strict: it must pass before creating the production archive. This prevents an App Store archive from accidentally retaining Capacitor/default icon or splash resources.

In Xcode:

1. Select the `App` target.
2. Confirm bundle identifier is `com.zyconstudios.orbuff`.
3. Under **Signing & Capabilities**, select the correct Zycon Studios Apple Developer Team.
4. Keep **Automatically manage signing** enabled for the first release unless there is a reason to manage profiles manually.
5. Confirm version `5.27.107` and build `107`.
6. Confirm the AppIcon/launch branding visibly matches the approved Orbuff source artwork.
7. Select **Any iOS Device (arm64)** / an appropriate generic device destination.
8. Choose **Product → Archive**.
9. In Organizer, choose **Distribute App → App Store Connect → Upload**.
10. After Apple finishes processing the build, add it to TestFlight before production review.

## Current Apple toolchain gate

Before archiving, install a current Xcode version accepted by App Store Connect. Do not rely on the simulator CI runner's version as proof that the production archive meets Apple's upload requirement.

## Future iOS CI automation

Do not add Apple private signing material to the repository. If automated signed iOS releases are added later, use GitHub Actions secrets for an App Store Connect API key/certificate/provisioning setup or a dedicated signing service, and keep the workflow fail-closed when credentials or production native artwork are absent.

Suggested future secret naming convention:

- `ORBUFF_APPLE_TEAM_ID`
- `ORBUFF_ASC_KEY_ID`
- `ORBUFF_ASC_ISSUER_ID`
- `ORBUFF_ASC_PRIVATE_KEY`

These are placeholders for future CI design; do not create or expose them until the Apple Developer/App Store Connect account is ready.

---

# Release security rules

- Never reuse the Android debug keystore as a Play upload key.
- Never commit the Android `.jks` or Apple private key.
- Never include plaintext passwords in workflow YAML.
- Never production-sign a native build that still uses Capacitor/default icon or splash artwork.
- Keep at least two encrypted backups of production signing credentials under the owner's control.
- Build production releases from a clean, reviewed `main` commit.
- Verify package/bundle ID, version and build before upload.
- Keep real-money Diamonds disabled until signed store builds, provider verification, restore/recovery, refund handling and privacy disclosures are all verified.
