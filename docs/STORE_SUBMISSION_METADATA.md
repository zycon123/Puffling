# Orbuff store submission metadata — working release sheet

Release candidate: Orbuff 5.27 Beta 107

## Identity

- App name: `Orbuff`
- Developer / publisher name used in-app: `Zycon Studios`
- Bundle ID / Android application ID: `com.zyconstudios.orbuff`
- Version: `5.27.107`
- Build number / Android versionCode: `107`
- Support email: `zyconstudios@protonmail.com`

## Public URLs

Use these after the privacy release has been merged and GitHub Pages deployment is green:

- Privacy Policy URL: `https://zycon123.github.io/Puffling/privacy.html`
- Account deletion / privacy choices URL: `https://zycon123.github.io/Puffling/delete-account.html`
- Web beta / support site: `https://zycon123.github.io/Puffling/`

The privacy and account-deletion URLs are also linked from Orbuff under **System & Support**.

## Google Play readiness fields

- Package name: `com.zyconstudios.orbuff`
- Target SDK gate: API 36 enforced by CI
- Privacy Policy: public URL above
- Account deletion web resource: public deletion URL above
- In-app account deletion: implemented under System & Support
- Data safety form: still requires final manual answers based on the signed production build and production backend/SDK configuration
- Target audience / content rating: still requires owner decision and Play Console questionnaire
- App access: guest accounts are created automatically for online features; document any reviewer instructions if production features require special access

## Apple App Store Connect readiness fields

- Bundle ID: `com.zyconstudios.orbuff`
- Version: `5.27.107`
- Build: `107`
- Privacy Policy URL: public URL above
- User Privacy Choices URL: account deletion URL above
- App Privacy questionnaire: still requires final manual answers based on the signed production build and production backend/SDK configuration
- Age rating: still requires App Store Connect questionnaire
- App Review notes: explain automatic guest account creation, in-app account deletion under System & Support, and that paid Diamonds remain disabled until store billing/provider verification are production-ready

## Store assets still required

- Production 1024×1024 app icon source
- Android adaptive icon foreground/background
- Native splash assets
- iPhone screenshots for required device sizes
- iPad screenshots if iPad distribution is enabled
- Google Play phone screenshots
- Google Play feature graphic
- Final short description, full description, subtitle/promotional text and keywords where applicable

## Payment release rule

Do not enable real-money Diamond purchases until all of these are true:

1. Native StoreKit / Google Play Billing bridge is implemented.
2. Apple/Google server-side transaction verification is active.
3. `/iap/status` reports provider verification ready.
4. Paid wallet recovery across reinstall/device changes is implemented.
5. Purchase/wallet retention and deletion behavior is reflected in the privacy policy and store disclosures.
6. Sandbox/test purchases and restore/refund behavior pass on physical iOS and Android devices.

## Final pre-submit checks

- Signed Android AAB from the owner's upload key.
- Signed iOS archive from the owner's Apple Developer team.
- Physical device smoke and full E2E.
- TestFlight and Play Internal testing.
- Public privacy/deletion URLs return HTTP 200 without login.
- Production backend uses HTTPS/WSS and account deletion succeeds against production data stores.
- No placeholder Puffling/Sky-Puff player-facing branding remains in store assets or metadata.
