# Orbuff Steamworks foundation

This folder is intentionally safe before a real Steam App ID exists.

## Runtime

The packaged Electron build exposes a narrow preload/IPC bridge. Steam native code stays in the Electron main process.

Steam initialization is attempted only when:

1. a positive App ID is supplied through `ORBUFF_STEAM_APP_ID`, or a local `steam_appid.txt` exists; and
2. `steamworks.js` is installed in the build environment.

Without both conditions, Orbuff runs normally as a standalone Windows game.

Do not commit a development `steam_appid.txt` file.

## Steam achievements planned

- `ORB_SKY_LEGEND`
- `ORB_CLOUD_BREAKER`
- `ORB_SKY_IMMORTAL`
- `ORB_EVENT_MASTER`
- `ORB_BOSS_HUNTER`
- `ORB_BOSS_VETERAN`
- `ORB_TREASURE_HUNTER`

Create these exact API names in Steamworks before enabling production achievement sync.

## Steam stats planned

- `BEST_HEIGHT`
- `TOTAL_HEIGHT`
- `BOSS_WINS`
- `TREASURES`

All are written as non-negative 32-bit integer stats.

## Cloud save

The desktop runtime mirrors Orbuff localStorage data into:

`<Electron userData>/steam-cloud/orbuff-save.json`

Configure Steam Auto-Cloud for this file after the Steam App ID exists. The local mirror works even when Steam is unavailable, so the standalone Windows build remains testable.

Cloud restore is conflict-aware. Each real Orbuff persist records a local progress timestamp. A remote snapshot only replaces local data when it is demonstrably newer. Existing unversioned local progress is preserved rather than overwritten by an ambiguous cloud snapshot.

## Release gate

Run `npm run steam:readiness` at any time. It validates the Steam structure while allowing missing App/Depot IDs and missing native Steamworks binding.

Run `npm run steam:release:validate` only for a real Steam release. Strict mode requires the real App ID, Depot ID, generated SteamPipe config, Windows package, installed `steamworks.js`, and a packaging configuration that actually includes the native binding.

## SteamPipe templates

`app_build.vdf` and `depot_build_windows.vdf` contain placeholders:

- `ORBUFF_STEAM_APP_ID`
- `ORBUFF_STEAM_DEPOT_ID`

Replace them only in a local/release generation step. Never commit Steam credentials.

## Native integration step after App ID

Install the selected Steamworks Node binding in the Windows build environment. The current adapter targets the established `steamworks.js` API shape: `init`, `achievement.activate`, integer `stats`, `localplayer`, `overlay`, and callback pumping.

The renderer security posture must stay unchanged: context isolation on, Node integration off, sandbox on.
