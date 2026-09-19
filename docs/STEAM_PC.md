# Orbuff PC / Steam foundation

This branch introduces the first native desktop packaging layer for the existing Orbuff browser game without changing the mobile release path.

## What is included

- Secure Electron desktop shell loading the local Orbuff game files.
- Windows-friendly 1280×900 default window with 900×700 minimum size.
- F11 fullscreen toggle and Escape for pause/back, including in fullscreen.
- External web links open in the operating-system browser instead of replacing the game.
- Node integration is disabled, context isolation and sandboxing are enabled.
- Windows NSIS installer and portable EXE targets through electron-builder.
- GitHub Actions workflow that validates and builds the Windows packages.
- A deterministic desktop validation script that checks the release wrapper, packaging invariants and PC input layer.
- Native keyboard gameplay: A/D or Left/Right to steer, Space for Rainbow Boost, Esc/P for pause/back.
- Gamepad API support: left stick/D-pad steering, A/Cross action, B/Circle back and Start pause.
- Keyboard/controller focus navigation for player-facing menus without requiring a mouse.
- Widescreen PC presentation keeps the validated 620px gameplay field intact while using side space for live height, coins, health, mode and control reference on large desktop displays.

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
2. Complete packaged-hardware QA of the implemented keyboard/gamepad rebinding across Xbox, PlayStation and generic XInput-compatible controllers.
3. Finish Steam achievements/Cloud/overlay validation against the real App ID; the runtime hooks, conflict-safe Cloud restore and mappings are implemented.
4. Install and pin the selected Steamworks native Node binding and update electron-builder to package it. `npm run steam:release:validate` now blocks release until both conditions are true.
5. Integrate a future Steamworks purchase bridge only if paid Diamonds are desired on Steam; the packaged PC SKU now explicitly hides and blocks the current Apple/Google mobile IAP surface.
6. Run a real packaged Windows smoke test on multiple resolutions, DPI scales and fresh user profiles.
7. Replace SteamPipe App/Depot placeholders using `npm run steam:prepare` after the real IDs exist; templates and generator are already implemented.
8. Perform final legal, privacy, crash-handling and save-migration checks for the PC SKU.

## PC store policy

The packaged Electron PC build does not expose Apple App Store / Google Play Diamond purchases. The existing Diamond balance, earned Diamonds and Mystery Shop spending remain available. This prevents accidental mobile billing UX on Steam while leaving a clean adapter point for a future Steamworks commerce implementation.

## Steamworks foundation

The desktop build now contains an isolated Steam bridge, local Cloud Save mirror, achievement/stat synchronization hooks, and SteamPipe VDF templates. Steam activation remains optional until a real App ID and native Steamworks binding are supplied. See `steam/README.md`.

The bridge intentionally keeps Steam native code in Electron's main process. Renderer security remains context-isolated, sandboxed, and without Node integration.

## Release strategy

Keep browser/mobile and Steam as one gameplay codebase, with thin platform adapters. The desktop shell should remain small. Steam-specific APIs should be isolated behind a platform bridge so the browser and mobile builds continue to work without Steam.

## PC Settings and controls

Open **PC Settings** from the main or pause menu. Music, volume and graphics use the existing shared game preferences. Fullscreen works from the settings button or F11 in the Windows app; Escape remains available for menu navigation.

Keyboard actions support two saved bindings per action. Select a binding, then press a key; Escape cancels capture. Duplicate and reserved keys are rejected. Reset restores A/Left, D/Right, Space and P. Escape, Tab, Enter and fullscreen shortcuts are reserved so menus remain reachable.

Standard-mapped controllers use the left stick / D-pad to steer, A/Cross to select and B/Circle to go back. Boost and pause can be mapped in Settings; connection status and Xbox/PlayStation button names are displayed. Unmapped devices need Steam Input's standard controller layout. Menu up/down changes focus, left/right adjusts sliders and selects. Keyboard arrows, Tab/Shift+Tab, Enter/Space and Escape work without a mouse.

Closing Settings leaves an active run paused. Movement input clears on blur/disconnect. Touch and pointer handlers and the 620px PC playfield are unchanged. Saved controls validate on load; corrupt data restores defaults and unavailable storage is reported in the settings status.

Regression: `node scripts/validate-pc-controls.mjs`. CI additionally runs `scripts/validate-pc-settings-browser.mjs` with isolated Playwright tooling and builds both Windows packages. Physical controller and packaged Windows hardware QA remain required before shipping.
