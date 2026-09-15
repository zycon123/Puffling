# Orbuff production signing setup

Release identity:

- App: `Orbuff`
- Android application ID / Apple bundle ID: `com.zyconstudios.orbuff`
- Version: `5.27.107`
- Build / Android versionCode: `107`

Never commit a private key, keystore, certificate private key, provisioning profile containing private material, store password, key password, App Store Connect API private key, or plaintext secret to this repository.

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

## Local signing of the generated AAB

The existing CI builds an unsigned release bundle. Locally, after creating/syncing the Android project and building the release bundle:

```bash
npm install
npm run mobile:prepare
npx cap add android
npx cap sync android
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

The repository's Android release workflow is prepared to produce a signed AAB automatically **only when all four secrets are configured**:

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

When the secrets are absent, CI continues to produce only the unsigned AAB and debug device-test APK. This is intentional fail-closed behavior.

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

## Requirements

A production iOS upload needs:

- an active Apple Developer Program membership;
- App ID / bundle ID `com.zyconstudios.orbuff` registered to the correct Apple Developer Team;
- an App Store Connect app record;
- valid distribution signing managed by Xcode or equivalent CI credentials;
- a build using the currently accepted Apple SDK/Xcode requirement;
- version/build matching the App Store Connect record.

The current repository CI only proves that the generated iOS project builds for the simulator with code signing disabled. It does **not** create a distributable `.ipa` yet.

## Recommended first signed archive path

Use a Mac with the Apple Developer account signed into Xcode:

```bash
npm install
npm run mobile:add:ios
npm run mobile:sync
npm run mobile:configure:ios
npm run mobile:open:ios
```

In Xcode:

1. Select the `App` target.
2. Confirm bundle identifier is `com.zyconstudios.orbuff`.
3. Under **Signing & Capabilities**, select the correct Zycon Studios Apple Developer Team.
4. Keep **Automatically manage signing** enabled for the first release unless there is a reason to manage profiles manually.
5. Confirm version `5.27.107` and build `107`.
6. Select **Any iOS Device (arm64)** / an appropriate generic device destination.
7. Choose **Product → Archive**.
8. In Organizer, choose **Distribute App → App Store Connect → Upload**.
9. After Apple finishes processing the build, add it to TestFlight before production review.

## Current Apple toolchain gate

Before archiving, install a current Xcode version accepted by App Store Connect. Do not rely on the simulator CI runner's version as proof that the production archive meets Apple's upload requirement.

## Future iOS CI automation

Do not add Apple private signing material to the repository. If automated signed iOS releases are added later, use GitHub Actions secrets for an App Store Connect API key/certificate/provisioning setup or a dedicated signing service, and keep the workflow fail-closed when credentials are absent.

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
- Keep at least two encrypted backups of production signing credentials under the owner's control.
- Build production releases from a clean, reviewed `main` commit.
- Verify package/bundle ID, version and build before upload.
- Keep real-money Diamonds disabled until signed store builds, provider verification, restore/recovery, refund handling and privacy disclosures are all verified.
