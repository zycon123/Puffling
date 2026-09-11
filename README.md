# Puffling

Puffling `5.27-beta.106` – Zycon Studios browser beta.

**Stable beta entry:** `beta42.html`  
**Beta support:** `zyconstudios@protonmail.com`

## Current status
The browser build is in launch-hardening. GitHub Actions validates the modular build, runtime models, Race HUD/desktop layout, all 100 Pufflings and unique traits, 97 evolvable Pufflings, launch invariants, and the Race server.

`beta42.html` remains the canonical test entry because it reloads the current assets with `no-store` and a unique nonce.

## Core features
- Endless vertical high-score gameplay with bosses, Boss Rush, rewards and progression
- **100 Pufflings**, including 3 deliberately weak starter Pufflings
- First-time player chooses exactly 1 starter Puffling
- Normal play cannot start before that starter choice is complete
- No automatic Puffling rewards are granted before the first boss
- 97 non-starter Pufflings can evolve at level 10 and ascend at level 20
- 100 distinct gameplay trait profiles
- Puffdex, Nursery, fixed 3-slot Vault, Fusion and Mystery Shop
- Starter Pufflings are excluded from egg and boss reward pools
- Cosmetics, upgrades, achievements, daily rewards and local persistence
- Mobile/tablet support plus a centered narrower desktop playfield
- **Race My Puffling**: first to 1500m, live ghost, 3 attacks per player, 4-second attack cooldown, friend codes/Quick Match transport and reconnect flow
- System & Support diagnostics, runtime error capture and anti-cheat diagnostics

## Validation
Every pull request and push to `main` validates:
- syntax for every JavaScript file under `js/` and all active entry files
- ordered module loading and bounded startup retries
- required DOM/UI and cache-safe stable loader
- runtime model normalization, persistence and Vault/Fusion behavior
- exactly 100 Pufflings and 100 unique trait profiles
- exactly 97 evolvable Pufflings + 3 non-evolving starters
- live Race HUD sync and desktop playfield behavior
- launch-readiness invariants and current diagnostic codes
- Race server syntax plus a two-client WebSocket integration flow

Runtime checks expose `window.skyPuffSmokeCheck`, `window.skyPuffBetaDiagnostics`, `window.skyPuffAIDiagnostics`, `window.skyPuffAntiCheat` and `window.skyPuffDiagnosticsSupport`.

## Diagnostics codes
System & Support separates actual failures from launch configuration warnings. Current code families include:
- `PFL-SMOKE-*` – missing/failed runtime smoke checks
- `PFL-SAVE-*` – local save/storage problems
- `PFL-RUNTIME-*` – captured JavaScript/runtime errors
- `PFL-AC-*` – anti-cheat flags or blocked submissions
- `PFL-AI-*` – AI diagnostics/watchdog issues
- `PFL-LAUNCH-101` – Race WebSocket server is not configured
- `PFL-LAUNCH-102` – global leaderboard backend is not configured

## Race backend
The authoritative Node/WebSocket server is under `server/` and a Render blueprint is provided in `render.yaml`.

It currently supports Quick Match, friend rooms, shared countdown, position relay, validated attack limits/cooldown, reconnect grace and authoritative 1500m results. CI starts the server and verifies a real two-client race flow.

### Remaining production hardening
The Race server and production `wss://` endpoint are configured. Race now uses signed identities, server-generated deterministic course seeds, account-bound reconnect, movement validation, server-owned abilities and authoritative 1500m results. Rate limiting, metrics and a scaling strategy are still required before a large public launch.

## Other launch limitations
- Progress is currently browser-local; there is no account/cloud save yet.
- Global leaderboard falls back to local scores until `API_BASE` is configured.
- Payment/IAP hooks are not production-enabled in this browser beta.
- Store packaging/signing, privacy/legal metadata and final Android/iOS device certification are separate release steps.

## Local Race server
```bash
cd server
npm install
npm run check
npm start
```

Then point the client to it:
```js
localStorage.setItem('skyPuffRaceWsUrl', 'ws://localhost:10000');
location.reload();
```

Use `wss://` in production.

## Beta testing
Use `beta42.html` and follow `BETA_TESTING.md`. At minimum test one Android phone, one iPhone/iPad if available, and one desktop browser, including normal play, bosses, Boss Rush, Puffling collection/progression, starter onboarding, Race, save persistence and System & Support.
