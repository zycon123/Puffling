# Sky Puff Beta Testing

Build: `5.26-beta.2`

Support: `zyconstudios@protonmail.com`

## Critical test flow
1. Open the game and confirm the Zycon Studios splash/loading screen appears and then reaches the main menu.
2. Confirm menu music starts.
3. Start a run and confirm movement, jumping, coins, powerups and extra-life pickup at 500 m.
4. Pause, resume with countdown, return to menu, then start a new run.
5. Reach Game Over, retry, then return to menu.
6. Verify bosses at 1200 / 2000 / 3000 / 4500 m and endless bosses after 4500 m.
7. Verify Rainbow Blast fires straight upward during boss fights.
8. Test Boss Rush with unlocked bosses and confirm 50-gold reward.
9. Test Sky Treasure milestones, rare powerups and endless events.
10. Open Achievements and verify progress persists after refreshing the page.
11. Open Highscore. Without an API backend it must show local beta scores instead of failing.
12. Tap the support email in the main menu and confirm the device opens an email composer addressed to `zyconstudios@protonmail.com`.

## Persistence checks
- bank coins
- best height and total height
- upgrades
- daily reward timestamp/streak
- selected cosmetics
- defeated boss unlocks
- achievement flags
- events cleared
- boss wins
- Sky Treasures collected

## Known beta limitations
- Multiplayer rival networking is still simulated until a real backend/WebSocket service is connected.
- Global leaderboard is optional. If no `API_BASE` is configured, the game uses a local leaderboard stored in the browser.
- Progress is browser-local and is not yet synced to an account/cloud save.
- Payments/IAP are not production-enabled in this browser beta.

## Bug report information
Send beta bug reports to `zyconstudios@protonmail.com` and include:
- Sky Puff build/version shown in the menu
- phone/computer model
- operating system
- browser + version
- what you were doing when the bug happened
- approximate height / boss / mode
- whether refreshing fixed it
- screenshot or screen recording when possible

The latest captured runtime error is available in the browser console via `window.skyPuffBetaDiagnostics.lastError`.
