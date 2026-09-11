# Puffling Beta Testing

Build: `5.27-beta.106`

Stable test entry: `beta42.html`

Support: `zyconstudios@protonmail.com`

## Critical test flow
1. Open `beta42.html` and confirm the Zycon Studios splash stays visible until startup is complete, then every visible main-menu button responds on its first tap without a warm-up tap.
2. On a fresh profile choose exactly one of the 3 starter Pufflings. Confirm Race My Puffling unlocks after selection and the chooser cannot grant a second free starter.
3. Open Puffdex. Confirm all 100 Pufflings are visible in the catalog, starters are identifiable, and the other 97 show evolution progression. Check a level-10 and level-20 Puffling for Evolved/Ascended presentation.
4. Confirm English is the default on a fresh profile; change language, refresh/reopen and verify persistence.
5. Hard-refresh/reopen and confirm the compact main menu appears immediately without a legacy button grid flashing first.
6. Start a normal run. Confirm first jump height, movement, platforms, coins, powerups and Rainbow Puff all behave normally.
7. On desktop (viewport >=900px with mouse/fine pointer), confirm the gameplay canvas is centered and capped near 620px wide, platforms are not spread across the full monitor, mouse steering maps correctly, and the Puffling follower stays aligned with the player.
8. On Android/iPhone/tablet, confirm gameplay still uses the full mobile viewport and touch steering/boost works.
9. Pause/resume, retry after Game Over, and return to the main menu. Confirm no stuck overlays.
10. Verify bosses at 1200 / 2000 / 3000 / 4500m plus endless tiers. Bosses must remain inside the arena and the post-boss return must resume safely.
11. Test Boss Rush and confirm the intended reward and return flow.
12. Open Nursery & Vault. Confirm all three egg tiers work, three fixed Vault slots are usable, and Vaulted Pufflings are protected from Fusion.
13. Confirm **Starter Puff / Starter Spark / Starter Drop never hatch from Rare, Epic or Legendary eggs** and are not granted by boss rewards.
14. Test Fusion, Mystery Shop, Puffling Treasure, achievements, cosmetics, upgrades and Daily Reward. Refresh and verify persistence.
15. Test Puffling XP/evolution accumulation during a run, including small height increments.
16. Open Race My Puffling. Confirm the old multiplayer HUD is not visible behind the Race HUD.
17. During Race, confirm YOU/GHOST meters and both progress bars update continuously rather than freezing.
18. Confirm the Race goal is 1500m, each Puffling has max 3 attacks, and the normal minimum attack cooldown is 4 seconds.
19. Test Quick Match/local fallback without a configured WebSocket endpoint. It may use a test ghost, but it must enter/exit without freezing.
20. After the production Race server is configured, test two real clients: same countdown, opponent ghost movement, attacks, finish result, reconnect within grace, and disconnect-forfeit after grace.
21. Open System & Support and refresh diagnostics. A healthy local beta should have no hard `PFL-SMOKE-*`, `PFL-SAVE-*` or `PFL-RUNTIME-*` errors. `PFL-LAUNCH-101` and `PFL-LAUNCH-102` are expected until Race server/global leaderboard are configured.
22. Confirm AI Diagnostics does not accumulate unexpected repairs in normal play and Anti-Cheat does not flag a normal boss transition/run.
23. Confirm the bug-report button opens a report containing build, diagnostic codes, smoke status, Race server mode and last runtime error.

## Startup recovery
- Interrupt one module request during startup. The same module should retry before later modules execute.
- Keep the request blocked. After three attempts a clear retry screen must appear.
- Restore the connection and retry. Saved inventory, Vault, eggs, currencies and progression must remain intact.

## Persistence checks
- selected language
- bank coins, best/total height and daily streak
- upgrades and cosmetics
- achievements and boss unlocks
- Boss Rush progress
- Puffling inventory and active Puffling
- starter choice
- Vault slots and egg inventory
- Puffling XP/levels/evolution
- Mystery Shop diamonds and treasure progress

## Performance check
Play at least 2 minutes plus one boss fight on a phone and desktop. Confirm no progressive slowdown, severe input lag, stuck Race/HUD loops or increasing AI auto-repair count.

## Launch blockers / expected launch codes
- `PFL-LAUNCH-101`: Race WebSocket endpoint is not configured. Deploy `puffling-race-server` and set a production `wss://` URL before public online multiplayer launch.
- `PFL-LAUNCH-102`: Global leaderboard backend is not configured. Local scores remain usable, but production global ranking needs a backend.

Additional multiplayer hardening still required before a competitive public launch: deterministic shared course seed, secure reconnect/resume token, stronger movement validation/rate limits, and production monitoring/scaling.

## Bug report information
Use **System & Support** and include the visible `PFL-*` code(s), build version, device/browser, what happened, approximate height/boss/mode, and a screenshot or recording when possible.

The latest captured runtime error is available via `window.skyPuffBetaDiagnostics.lastError`.
