# Orbuff

Orbuff `5.27-beta.107` – Zycon Studios browser beta.

**Stable beta entry:** `beta42.html`  
**Beta support:** `zyconstudios@protonmail.com`

## Current status
The browser build is in launch-hardening. GitHub Actions validates the modular build, runtime models, energy/revival, the full 3→8-slot OrbVault progression and protection model, Race HUD/desktop layout, active-Orbuff Race selection, all 100 Orbuffs and unique traits, 97 evolvable Orbuffs, boss/endurance flows and launch invariants.

`beta42.html` is the canonical test entry. It redirects directly to the current active `index.html` build, while the active page uses versioned asset URLs to prevent stale browser JavaScript/CSS from mixing with the current beta.

## Core features
- Endless vertical high-score gameplay with 10 unique bosses, Boss Rush, rewards and progression
- **100 Orbuffs**, including 3 deliberately weak starter Orbuffs: Airbuff, Rainbuff and Sparkbuff
- First-time player chooses exactly 1 starter Orbuff
- Normal play cannot start before that starter choice is complete
- No automatic Orbuff rewards are granted before the first verified boss reward
- 97 non-starter Orbuffs evolve at level 10 and ascend at level 20
- Base Orbuffs have 5 energy; Ascended Orbuffs have 6
- Orbdex with energy/revival and evolution details
- Nursery with Rare, Epic and Legendary eggs; starters are excluded from egg pools
- **OrbVault** starts with 3 slots and upgrades to 8; all unlocked slots protect from Fusion and Trade, recharge energy and grant passive XP
- OrbVault Level 5 can award Revive Orbs through its daily roll
- Fusion requires both parents to be Level 20 and Ascended
- Mystery Shop, Diamonds, cosmetics, upgrades, achievements, daily rewards and local persistence
- **Boss Rush:** first clear of each boss pays 250 coins; replay pays 25 coins
- **Race My Orbuff:** first to 1500m, live ghost, 3 attacks per player, 4-second attack cooldown, friend codes/Quick Match, reconnect flow and selected active-Orbuff validation
- System & Support diagnostics, runtime error capture and anti-cheat diagnostics
- Mobile/tablet support plus a centered narrower desktop playfield

## Compatibility note
The player-facing brand is **Orbuff**. Some internal filenames, JavaScript globals, event names, database fields and localStorage/API keys still contain legacy `Puffling`/`skyPuff` identifiers intentionally. They are retained so existing beta saves, inventories and server/client contracts survive the rebrand. New Orbuff aliases are added where safe.

## Validation
Every push to `main` validates, among other things:
- syntax and ordered loading for the active browser modules
- required DOM/UI state, stable entry and cache-busting
- save/runtime model normalization and persistence
- Orbuff energy, exhaustion and revival
- OrbVault rest/upgrades plus protection across **all 8 possible slots**
- Level-20 Ascended Fusion and protected-copy behavior
- starter onboarding and first-run reward guards
- a full launch gameplay journey
- all 10 bosses plus a 300,000m endurance simulation
- boss-session/reward authority
- deterministic Race course, HUD, ranking and selected usable Orbuff
- exactly 100 Orbuffs / 100 unique trait profiles
- exactly 97 evolvable Orbuffs + 3 non-evolving starters
- trading, Mystery Box, Diamond wallet/IAP scaffolding and launch-readiness invariants

Runtime checks expose legacy-compatible diagnostics APIs such as `window.skyPuffSmokeCheck`, `window.skyPuffBetaDiagnostics`, `window.skyPuffAIDiagnostics`, `window.skyPuffAntiCheat` and `window.skyPuffDiagnosticsSupport`.

## Race/backend status
The authoritative Node/WebSocket server is under `server/` and the Render blueprint is in `render.yaml`. The production client is configured for the shared Race/game API endpoints.

Race uses signed identity, deterministic server-provided course seeds, account-bound reconnect, movement validation, server-owned abilities and authoritative results. Boss completion/reward settlement, leaderboard, ranked identity and Diamond wallet also use server-side authority where implemented.

Large-scale public launch still needs operational monitoring/scaling and final production certification rather than only browser-beta validation.

## Release limitations
- Core browser progress is still primarily local; a complete cross-device cloud-save experience is not yet the release baseline.
- Real-money purchases require the native iOS/Android billing bridge and provider verification; browser beta stays fail-closed for real purchases.
- Store packaging/signing, privacy/legal metadata and final Android/iOS device certification are separate release steps.

## Ownership, licensing and IP
Original Puffling project code and original project-authored material are intended to remain proprietary. See:

- `LICENSE` — proprietary repository license
- `COPYRIGHT.md` — ownership scope and contributor/AI-assistance notes
- `THIRD_PARTY_NOTICES.md` — third-party runtime licenses
- `docs/IP_RIGHTS_AUDIT.md` — current pre-release IP audit and remaining legal/name-clearance gates
- `docs/ASSET_PROVENANCE.md` — provenance register for code, art, audio and future release assets

The repository license does **not** mean the word mark `Puffling` has been registered or cleared. Trademark/name clearance remains a release gate.

## Local Race server
```bash
cd server
npm install
npm run check
npm start
```

Then point a development client to it when using a local server override. Use `wss://` for production.

## Beta testing
Use `beta42.html` and follow `BETA_TESTING.md`. At minimum test one Android phone, one iPhone/iPad if available, and one desktop browser. Cover normal play, bosses, Boss Rush, Orbdex/OrbVault, energy/revival, Fusion, Nursery, Race, persistence and System & Support.
