# Sky Puff Beta Testing

Build: `5.26-beta.4`

Support: `zyconstudios@protonmail.com`

## Welcome, beta tester
Thanks for testing Sky Puff. Please play normally first, then try the checklist below. If something freezes, looks wrong, feels unfair, or is confusing, report it through **System & Support** in the main menu.

## Critical test flow
1. Open the game and confirm the Zycon Studios splash/loading screen reaches the main menu.
2. Confirm menu music starts and Audio settings can mute/unmute and change volume.
3. Start a run and confirm movement, jumping, coins, powerups and extra-life pickup at 500 m.
4. Pause, resume with countdown, return to menu, then start a new run.
5. Reach Game Over, retry, then return to menu.
6. Verify bosses at 1200 / 2000 / 3000 / 4500 m and endless bosses after 4500 m.
7. Verify Rainbow Blast fires straight upward during boss fights.
8. Test Boss Rush with unlocked bosses and confirm 50-gold reward.
9. Test Sky Treasure milestones, rare powerups and endless events.
10. Open Achievements and verify progress persists after refreshing the page.
11. Open Highscore. Without an API backend it must show local beta scores instead of failing.
12. Test Cosmetics, Upgrades and Daily Reward, then refresh and verify purchases/progress remain.
13. Change language and check that the main menus remain readable and usable.
14. Open Multiplayer and verify the beta/simulated-rival flow can be entered and exited without freezing.
15. Tap the support email or use System & Support and confirm an email composer can be opened.

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

## What feedback is most useful?
- Was the game immediately understandable?
- Did movement feel responsive?
- Did any jump, respawn, boss or menu feel broken?
- Was progression too slow or too fast?
- Which cosmetic/reward made you want to keep playing?
- Where did you stop playing, and why?
- Would you play another round or recommend it to someone?

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
