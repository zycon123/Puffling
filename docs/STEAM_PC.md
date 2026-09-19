# Orbuff PC / Steam foundation

This branch introduces the first native desktop packaging layer for the existing Orbuff browser game without changing the mobile release path.

## What is included

- Secure Electron desktop shell loading the local Orbuff game files.
- Windows-friendly 1280×900 default window with 900×700 minimum size.
- F11 fullscreen toggle and Escape to leave fullscreen.
- External web links open in the operating-system browser instead of replacing the game.
- Node integration is disabled, context isolation and sandboxing are enabled.
- Windows NSIS installer and portable EXE targets through electron-builder.
- GitHub Actions workflow that validates and builds the Windows packages.
- A deterministic desktop validation script that checks the release wrapper, packaging invariants and PC input layer.
- Native keyboard gameplay: A/D or Left/Right to steer, Space for Rainbow Boost, Esc/P for pause/back.
- Gamepad API support: left stick/D-pad steering, A/Cross action, B/Circle back and Start pause.
- Keyboard/controller focus navigation for player-facing menus without requiring a mouse.

## Local commands

Run the desktop build:

```bash
npm run desktop:start
```

Validate the desktop wrapper:

```bash
npm run desktop:validate
```

Create unpacked desktop output:

```bash
npm run desktop:pack
```

Create Windows installer + portable build:

```bash
npm run desktop:dist:win
```

The commands pin Electron 44.4.2 and electron-builder 26.15.3 through npx, so the current mobile package lock does not need to be rewritten just to introduce the PC shell.

## Still required before Steam release

1. Add final Windows icon assets and Steam capsule/library artwork.
2. Add user-configurable keyboard/gamepad rebinding and complete packaged-hardware QA across Xbox, PlayStation and generic XInput-compatible controllers.
3. Decide whether Steam achievements, cloud saves, leaderboards and overlay support are required for v1.
4. Integrate Steamworks only after the standalone PC build is stable.
5. Replace or adapt mobile-only real-money/IAP surfaces for the Steam SKU.
6. Run a real packaged Windows smoke test on multiple resolutions, DPI scales and fresh user profiles.
7. Create Steam depot/build scripts after a Steam App ID exists.
8. Perform final legal, privacy, crash-handling and save-migration checks for the PC SKU.

## Release strategy

Keep browser/mobile and Steam as one gameplay codebase, with thin platform adapters. The desktop shell should remain small. Steam-specific APIs should be isolated behind a platform bridge so the browser and mobile builds continue to work without Steam.
