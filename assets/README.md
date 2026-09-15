# Orbuff native production assets

The native Android/iOS projects are generated from scratch in CI. Production branding must therefore live here as source assets and be applied after `npx cap add` / `npx cap sync`.

Do not place temporary Capacitor/default art in this folder. When the final Orbuff artwork is approved, add **all five** PNG files together:

```text
assets/
  icon-only.png
  icon-foreground.png
  icon-background.png
  splash.png
  splash-dark.png
```

Requirements enforced by `scripts/apply-native-assets.mjs`:

- `icon-only.png`: at least 1024×1024 — primary iOS/icon source.
- `icon-foreground.png`: at least 1024×1024 — Android adaptive foreground. Keep important character/logo detail well inside the safe center area.
- `icon-background.png`: at least 1024×1024 — Android adaptive background layer.
- `splash.png`: at least 2732×2732 — light-mode splash source.
- `splash-dark.png`: at least 2732×2732 — dark-mode splash source.
- Files must be valid PNG images.

Generation is pinned to `@capacitor/assets` 3.0.5 in the helper script.

## CI behavior

Normal unsigned/test CI remains buildable while the production artwork is not yet present: the asset helper logs a clear skip when **none** of the five files exists.

A **partial** asset set fails CI because mixing Orbuff and Capacitor/default assets is not acceptable.

Android production signing is additionally gated so a signed Play AAB cannot be created while the five production assets are missing.

For iOS, the simulator validation can still run without production art; before a signed App Store/TestFlight archive, run:

```bash
npm run mobile:add:ios
npm run mobile:assets:ios
```

For Android production:

```bash
npm run mobile:add:android
npm run mobile:assets:android
```

The source art should match the store-asset direction in `docs/STORE_ASSET_SPEC.md` and must not advertise paid Diamonds while real-money IAP remains disabled.
