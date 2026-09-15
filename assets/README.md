# Orbuff native production assets

The native Android/iOS projects are generated from scratch in CI. Production branding therefore lives here as source art and is applied after `npx cap add` / `npx cap sync`.

The approved Orbuff native direction uses Capacitor Assets **Easy Mode** with two vector masters:

```text
assets/
  logo.svg
  logo-dark.svg
```

Both SVGs must use `viewBox="0 0 1024 1024"` and keep the important mascot/orbit detail comfortably inside the safe center area. The current approved direction is the blue cosmic Orbuff mascot with warm gold/orange orbital accents.

`scripts/apply-native-assets.mjs` runs pinned `@capacitor/assets` 3.0.5 and generates all required Android/iOS icon and splash resources from these masters. It applies the canonical brand backgrounds:

- icon light: `#081B3F`
- icon dark: `#030A18`
- splash light: `#59BFFF`
- splash dark: `#030A18`

The helper still understands the older full-control five-PNG source layout for compatibility, but the SVG path is canonical for the launch build.

## CI behavior

The Android and iOS workflows regenerate native projects, then apply these approved masters before compiling. Android production signing is fail-closed: when upload-key secrets are configured, `assets/logo.svg` and `assets/logo-dark.svg` must both be present.

For local Android generation:

```bash
npm run mobile:add:android
npm run mobile:assets:android
```

For local iOS generation:

```bash
npm run mobile:add:ios
npm run mobile:assets:ios
```

Do not replace these masters with temporary Capacitor/default artwork. Store screenshots and Google Play feature graphics remain separate deliverables under `docs/STORE_ASSET_SPEC.md`.
