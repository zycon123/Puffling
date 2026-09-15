# Orbuff store assets

This folder contains store-facing production graphics generated from the approved Orbuff vector master.

Generate and validate the deterministic assets with:

```bash
npm run store:generate
npm run store:validate
```

`scripts/store-capture-bootstrap.js` is a development-only capture helper for reproducible gameplay, Boss, Race and Orbdex scenes. It is never referenced by `index.html`, copied into the Capacitor `www/` bundle or loaded by the published game.

Phone screenshots must be opaque `1080×1920` PNG files named `phone-01-…-1080x1920.png`, `phone-02-…-1080x1920.png`, and so on. They must be reviewed against `docs/STORE_ASSET_SPEC.md` before upload.

Desktop beta captures can be framed without cropping game UI using:

```bash
node scripts/frame-store-phone-screenshot.mjs input.jpg store-assets/google-play/phone-01-gameplay-1080x1920.png x,y,width,height
```

The full game viewport stays visible in the center while a blurred extension fills the required portrait canvas. Boss and Race screenshots should still be recaptured from the signed Internal/TestFlight build before store submission.
