# Sky Puff

Sky Puff `5.26-beta.2` – Zycon Studios browser beta release candidate.

**Beta support:** `zyconstudios@protonmail.com`

## Beta status
The game is now in beta-readiness mode: feature work is frozen unless it fixes a beta issue. Current focus is stability, persistence, browser compatibility, boss flow and test feedback.

## Project structure
- `index.html` – game UI, Zycon Studios startup splash and menus
- `style.css` – visual styling
- `audio_theme.js` – menu/game soundtrack engine
- `game.js` – ordered module loader
- `js/beta_config.js` – beta version, support contact and optional online API configuration
- `js/dom_refs.js` – cached DOM/UI references
- `js/localization_core.js` – Norwegian, English, German, Spanish and French text + translation helper
- `js/audio_core.js` – music settings and boss soundtrack definitions
- `js/endless_boss_core.js` – endless boss stage, health and reward scaling
- `js/boss_multiplayer.js` – Boss Rush, multiplayer prototype and boss soundtrack control
- `js/music_bridge.js` – soundtrack bridge
- `js/leaderboard_submit.js` – score submission + local fallback storage
- `js/leaderboard_language_ui.js` – leaderboard rendering, language UI and canvas resize
- `js/state_content.js` – save data, cosmetics/content and runtime state
- `js/world_helpers.js` – platform generation and mission setup
- `js/run_menu_shop_upgrades.js` – run lifecycle, menus, rewards, cosmetics and upgrades
- `js/input_missions_boss_spawn.js` – input, missions, boss warnings and spawning
- `js/gameplay_update.js` – gameplay, collisions, pickups, boss combat and end-game handling
- `js/achievements.js` – persistent achievement progression
- `js/achievements_menu.js` – achievements UI
- `js/endless_events.js` – Coin Storm, Low Gravity and Rainbow Frenzy events
- `js/player_render_helpers.js` – player/cloud/trail/hat/face rendering
- `js/renderer_runtime.js` – entity renderer, draw loop and bootstrap
- `js/beta_release_ui.js` – beta label, support link, version display and runtime error capture
- `js/smoke_check.js` – post-bootstrap beta smoke check
- `BETA_TESTING.md` – beta tester checklist, support instructions and known limitations

## Current beta features
- Zycon Studios startup/loading screen
- Endless high-score climb
- Extra-life pickup every 500 m
- Sky Treasure milestone rewards every 2500 m
- Rare Coin Rush, Super Shield and Rainbow Overcharge powerups
- Endless Coin Storm, Low Gravity and Rainbow Frenzy events
- Four main bosses with unique patterns and soundtracks
- Endless boss tiers and scaling
- Boss Rush for defeated bosses, 50 gold per win
- Rainbow Blast fired straight upward from Sky Puff during boss fights
- Skins, faces, hats, trails and achievement cosmetics
- Seven persistent achievements
- Upgrades and 250-gold daily reward
- Pause/resume countdown and audio settings
- Norwegian, English, German, Spanish and French UI core
- Local leaderboard fallback when no online API is configured
- Optional global leaderboard backend integration
- Multiplayer beta prototype with friend-code/random-match UI
- In-game beta support contact for Zycon Studios

## Beta validation
- All active JavaScript is split into named feature modules
- No legacy `part*.js` files remain
- GitHub Actions validates every push/PR
- Validation checks module existence, JavaScript syntax, bootstrap order and required DOM ids
- Browser smoke check exposes `window.skyPuffSmokeCheck`
- Runtime beta diagnostics expose `window.skyPuffBetaDiagnostics`
- Leaderboard no longer requires a backend to function
- Critical transitions clean up boss warnings, projectiles, boss music, overlays and multiplayer timers
- Achievement/event/boss/treasure progression is persisted in localStorage
- Startup splash has a game-ready signal plus failsafe so it cannot permanently block the menu

## Before wider public beta
1. Run the complete checklist in `BETA_TESTING.md` on at least one Android phone, one iPhone/iPad if available, and one desktop browser.
2. Confirm `window.skyPuffSmokeCheck.ok === true` on the hosted build.
3. Test all four main bosses plus at least one endless Tier 2+ boss.
4. Test pause/resume/menu/retry repeatedly for state leaks.
5. Verify local save persistence after refresh/browser restart.
6. Verify the Zycon Studios support mail link opens correctly on test devices.
7. Decide whether to connect a real leaderboard API before beta or keep local leaderboard mode.
8. Keep multiplayer clearly labeled beta/simulated until real networking is connected.

## Known beta limitations
- Multiplayer networking is simulated; a real WebSocket/backend service is not connected yet.
- Progress is local to the browser; there is no account/cloud save yet.
- Global leaderboard is optional and only activates when `API_BASE` is configured.
- Payments/IAP are not production-enabled for this browser beta.

## Beta support
Players and testers can report bugs to `zyconstudios@protonmail.com`. The address is also shown as a tappable support link in the Sky Puff main menu.

Useful bug reports should include the build version, device, operating system/browser, what happened, approximate height/boss/mode, and a screenshot or screen recording when possible.

## Online API configuration
By default `API_BASE` is empty and the highscore system uses browser-local scores. A hosted beta can configure the backend at runtime with:

```js
window.skyPuffConfig.setApiBase('https://your-api.example.com')
```

The URL is saved locally for subsequent sessions.

## Beta build
Current release candidate: `5.26-beta.2`.
