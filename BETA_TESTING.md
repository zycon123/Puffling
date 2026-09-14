# Orbuff Beta Testing

Build: `5.27-beta.107`

Stable test entry: `beta42.html`

Support: `zyconstudios@protonmail.com`

## Critical test flow
1. Open `beta42.html`. Confirm it opens the active Orbuff build, the Zycon Studios splash shows **ORBUFF**, and every visible main-menu button responds on its first tap.
2. On a fresh profile choose exactly one starter: Airbuff, Rainbuff or Sparkbuff. Confirm the chooser cannot grant a second free starter.
3. Open Orbdex. Confirm all 100 Orbuffs appear, starters remain base-only, and the other 97 show Evolved at level 10 / Ascended at level 20.
4. Open an owned Orbuff in Orbdex and confirm energy is visible. Base Orbuffs should have max 5 energy; Ascended should have max 6.
5. Exhaust an Orbuff through losses. Confirm it cannot be selected for normal play or Race until energy returns or it is revived. Test coin revival and a Revive Orb if available.
6. Open Nursery & OrbVault. Confirm egg tiers work and starter Orbuffs never hatch from eggs.
7. At OrbVault Level 1, confirm 3 slots. Upgrade through the levels and confirm the maximum reaches 8 slots.
8. Put Orbuffs into slots including slot 4–8. Confirm each one shows live rest status, gains passive XP/energy over time, cannot be selected for play/Race, and remains protected from Fusion and Trade.
9. Remove an Orbuff from OrbVault. Confirm it becomes usable again without losing its level/evolution.
10. Test Fusion. Both parents must be Level 20 + Ascended, protected OrbVault copies must not be consumed, and no Fusion Crystal should be required.
11. Start normal play. Check first jump, movement, platforms, coins, powerups, Rainbow Puff, pause/resume, retry and menu return.
12. On desktop (viewport >=900px with mouse/fine pointer), confirm the centered narrow playfield and corrected mouse mapping. On Android/iPhone/tablet, confirm full mobile viewport and touch controls.
13. Test bosses 1–10 and post-boss continuation. The run must resume from the boss height instead of automatically skipping to the next boss or dropping directly to Game Over.
14. Test Boss Rush. Only defeated bosses should be available. Confirm the first Boss Rush clear for each boss pays **250 coins** and replay clears pay **25 coins**.
15. Test Orbuff XP/progression/evolution, including small height increments and boss XP.
16. Test Mystery Shop, Orbuff Treasure, achievements, cosmetics, upgrades and Daily Reward. Refresh and verify persistence.
17. Open Race My Orbuff with a usable selected active Orbuff. Confirm Race uses that exact Orbuff, not simply the first owned creature.
18. Put the selected Orbuff in OrbVault or exhaust it. If another usable Orbuff exists, Race should switch to a usable one; if none are usable, Race must refuse to start with a clear message.
19. During Race, confirm YOU/RIVAL meters, ghost movement and progress update continuously. Goal is 1500m; each player has max 3 attacks with normal minimum cooldown of 4 seconds.
20. Test Quick Match and friend-room flow against the production connection. Verify shared countdown, deterministic course, attacks, authoritative finish result, reconnect within grace and disconnect-forfeit after grace.
21. Open System & Support and refresh diagnostics. There should be no hard smoke/save/runtime failures in a healthy build.
22. Confirm AI Diagnostics does not accumulate unexpected repairs and Anti-Cheat does not flag normal boss transitions or legitimate Race play.
23. Confirm bug reports include the current build, diagnostic codes, server mode and last runtime error.
24. Search player-visible UI for the old brand **Puffling** or **Sky Puff**. Legacy identifiers may remain internally, but menus, prompts, loading screens, share text and normal toasts should say Orbuff.
25. Refresh an existing beta profile created before the rename. Inventory, active Orbuff, OrbVault, eggs, currencies, starter choice, XP/evolution and other progress must survive unchanged.

## Startup behavior
The current loader is deliberately fail-open for a single missing optional module: it continues loading later modules rather than freezing the entire app. A failed module must be visible in developer/runtime diagnostics, while saved inventory and progression remain intact. Critical build validation prevents required modules from being omitted from the shipped loader.

## Persistence checks
- selected language
- bank coins, best/total height and daily streak
- upgrades and cosmetics
- achievements and boss unlocks
- Boss Rush progress
- Orbuff inventory and active Orbuff
- starter choice
- OrbVault level, 3→8 slots, resting Orbuffs and Revive Orbs
- egg inventory
- Orbuff energy, XP, levels and evolution
- Mystery Shop diamonds and treasure progress
- Race rank/identity data where applicable

## Performance check
Play at least 2 minutes plus one boss fight on a phone and desktop. Confirm no progressive slowdown, severe input lag, stuck Race/HUD loops or increasing AI auto-repair count.

For a longer automated stress baseline, CI simulates all 10 unique bosses and continued endless play through 300,000m.

## Compatibility / launch notes
Legacy `PFL-*`, `skyPuff*` and selected `Puffling*` internal identifiers remain intentionally during this beta so old saves and server/client contracts do not break. They are not intended as player-facing branding.

The production multiplayer/game endpoints are configured, but a public competitive launch still requires operational monitoring/scaling plus final real-device and store certification.

## Bug report information
Use **System & Support** and include the visible diagnostic code(s), build version, device/browser, what happened, approximate height/boss/mode, and a screenshot or recording when possible.

The latest captured runtime error is available through the legacy-compatible diagnostics API `window.skyPuffBetaDiagnostics.lastError`.
