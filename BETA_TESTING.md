# Sky Puff Beta Testing

Build: `5.26-beta.79`

Stable test entry: `beta42.html`

Support: `zyconstudios@protonmail.com`

## Critical test flow
1. Open `beta42.html` and confirm the Zycon Studios splash reaches the main menu without visible lag.
2. Confirm English is the default for a fresh browser profile; change language, refresh/reopen and confirm the selected language is remembered.
3. Confirm menu music starts and Audio settings can mute/unmute and change volume.
4. Start a run and confirm the **first jump has normal height** and reaches the next platform without needing boost.
5. Confirm movement, coins, powerups and Rainbow Puff work. In normal play, use up to five rapid boosts, then confirm cooldown and reset to five new uses.
6. Pause, resume with countdown, return to menu, then start a new run. Confirm the boost hint is visible only while actively playing.
7. Reach Game Over, retry, then return to menu.
8. Verify bosses at 1200 / 2000 / 3000 / 4500 m and endless bosses after 4500 m. Bosses must stay inside the arena.
9. Verify boss attack loop: 3 normal attacks → alternate 3-projectile pattern → 2 normal attacks → alternate pattern → repeat.
10. Defeat a boss and confirm Sky Puff lands safely, stays still for a 3-second countdown, then resumes normal jumping without skipping directly to the next boss.
11. Verify Rainbow Puff recharge is faster in boss fights and Rainbow Blast fires straight upward.
12. Test Boss Rush with unlocked bosses and confirm **100-coin reward**.
13. Open Boss Puff Creator and verify its text explains that Boss Puff is Boss-Rush-only until all four Boss Rush bosses are defeated. Confirm Premium Creator appears even if Creator is first opened several minutes after game launch.
14. Defeat all four bosses in Boss Rush and confirm Boss Puff can then be enabled/disabled for the main game.
15. Test achievement cosmetics and confirm selected unlocked headwear is actually visible on Sky Puff.
16. Test Puffling Treasure milestones, rare powerups and endless events. Each collected treasure must give its coin reward, exactly 1 Mystery Shop diamond and exactly 1 Treasure Hunter progress.
17. Open Achievements and verify progress persists after refresh.
18. Open Highscore. Without an API backend it must show local beta scores instead of failing.
19. Test Cosmetics, Upgrades and Daily Reward, then refresh and verify purchases/progress remain.
20. Open Multiplayer and verify the beta/simulated-rival flow can be entered and exited without freezing.
21. Open System & Support and verify smoke check, save status and Anti-Cheat details appear. Confirm the bug-report button can open an email composer.

## Persistence checks
- selected language
- bank coins
- best height and total height
- upgrades
- daily reward timestamp/streak
- selected cosmetics
- defeated boss unlocks
- Boss Rush victories and main-game Boss Puff unlock
- Boss Puff Creator configuration
- achievement flags
- events cleared
- boss wins
- Puffling Treasures collected and Mystery Shop diamond balance
- Puffling inventory, active Puffling, Vault slots, eggs and Puffling XP/levels

## Performance check
Play a normal run for at least 2 minutes and one complete boss fight on mobile. Confirm that height continuously awards Puffling XP, including when height increases in small steps. There should be no progressive slowdown or severe input lag. Use `beta42.html`; other old beta test URLs should not be used for performance comparisons.

## Known beta limitations
- Multiplayer rival networking is still simulated until a real backend/WebSocket service is connected.
- Global leaderboard is optional. If no `API_BASE` is configured, the game uses a local leaderboard stored in the browser.
- Progress is browser-local and is not yet synced to an account/cloud save.
- Premium Creator payment/IAP is prepared but not production-enabled in this browser beta.

## Bug report information
Send beta bug reports to `zyconstudios@protonmail.com` or use **System & Support**. Include build version, device, operating system/browser, what happened, approximate height/boss/mode, whether refreshing fixed it, and a screenshot or screen recording when possible.

The latest captured runtime error is available via `window.skyPuffBetaDiagnostics.lastError`.
