# Puffling

Puffling `5.26-beta.83` – Zycon Studios browser beta.

**Stable beta entry:** `beta42.html`  
**Beta support:** `zyconstudios@protonmail.com`

## Beta status
The current focus is stability, persistence, browser compatibility, boss flow, performance, diagnostics and tester feedback. `beta42.html` is the canonical test entry because it bypasses stale browser/GitHub Pages asset caches on every launch.

## Project structure
- `index.html` – game UI, startup splash and menus
- `beta42.html` – cache-safe stable beta loader
- `style.css` – visual styling
- `audio_theme.js` – menu/game soundtrack engine
- `game.js` – ordered module loader; propagates the current cache key to every game module
- `js/beta_config.js` – beta version, support contact and optional online API configuration
- `js/dom_refs.js` – cached DOM/UI references
- `js/localization_core.js` + `js/language_default.js` – Norwegian, English, German, Spanish and French UI with English default for new players and saved language persistence
- `js/audio_core.js` + `js/music_bridge.js` – music settings, soundtrack bridge and boss soundtrack definitions
- `js/endless_boss_core.js` – endless boss stage, health and reward scaling
- `js/boss_multiplayer.js` – Boss Rush, multiplayer prototype and boss soundtrack control
- `js/anti_cheat.js` – client-side beta integrity checks
- `js/leaderboard_submit.js` + `js/leaderboard_language_ui.js` – score submission, local fallback and leaderboard UI
- `js/state_content.js` – save data, cosmetics/content and runtime state
- `js/world_helpers.js` – platform generation
- `js/run_menu_shop_upgrades.js` – run lifecycle, menus, rewards, cosmetics and upgrades
- `js/input_missions_boss_spawn.js` – input, Rainbow Puff and boss spawning
- `js/gameplay_update.js` – gameplay, collisions, pickups, boss combat and end-game handling
- `js/boss_pattern_override.js` – current boss firing loop
- `js/boss_movement_fix.js` – boss arena boundary protection
- `js/boss_transition_fix.js` + `js/post_boss_guard.js` – safe post-boss landing, 3-second countdown and input lock
- `js/boss_boost_tuning.js` – faster Rainbow Puff recharge in boss fights
- `js/rainbow_puff_hint.js` – localized in-game boost hint
- `js/start_guard.js` – safe startup recovery without lowering normal first-jump height
- `js/achievements.js` + `js/achievements_menu.js` – persistent achievements
- `js/endless_events.js` – Coin Storm, Low Gravity and Rainbow Frenzy events
- `js/player_render_helpers.js` + `js/renderer_runtime.js` – player/entity rendering and main loop
- `js/boss_puff_creator_v2.js` – Boss Puff Creator
- `js/boss_puff_premium.js` – 100-item premium catalog prepared for later payment integration
- `js/boss_puff_main_unlock.js` – Boss Rush completion tracking and main-game Boss Puff unlock
- `js/boss_visual_override.js` – boss visual upgrade
- `js/ai_diagnostics.js` – safe diagnostics/self-repair without forced duplicate animation loops
- `js/beta_release_ui.js` + `js/diagnostics_support.js` – beta status, runtime errors and System & Support
- `js/smoke_check.js` – post-bootstrap smoke check
- `scripts/validate-build.mjs` – full static build validation

## Current beta features
- Endless high-score climb and persistent local progression
- Four main bosses plus endless boss tiers
- Boss attack loop: 3 normal attacks, alternate 3-projectile pattern, 2 normal attacks, alternate pattern, repeat
- Safe 3-second post-boss countdown before normal jumping resumes
- Boss Rush for defeated bosses, **100 coins per win**
- Boss Puff Creator; Boss Puff is Boss-Rush-only until all four Boss Rush bosses are defeated, then can be enabled in the main game
- Premium Creator catalog prepared with 100 additional accessories/styles; payments are not enabled in this beta
- Rainbow Puff: up to five rapid uses in normal play, escalating chain boost, then cooldown/reset
- Faster Rainbow Puff recharge in boss fights
- Extra-life pickups, milestone treasures, rare powerups and endless events
- Skins, faces, hats, trails, boss rewards and achievement cosmetics
- Seven persistent achievements
- Upgrades and 250-coin daily reward
- Pause/resume countdown and audio settings
- English default for new players; saved Norwegian/English/German/Spanish/French language preference
- Local leaderboard fallback, optional online leaderboard API
- Multiplayer beta prototype with simulated rival
- Diagnostics, anti-cheat and bug-report support

## Beta validation
GitHub Actions validates every push and deployment. Validation checks:
- every active module exists and has valid JavaScript syntax
- every JavaScript file under `js/` has valid syntax
- no duplicate active modules or legacy `part*.js` modules
- required DOM ids and bootstrap order
- cache-busting on critical assets
- the stable `beta42.html` loader uses `no-store` and a unique asset nonce
- obsolete experiment files do not reappear
- critical boss/boost/creator regression-fix modules remain active

Runtime checks expose `window.skyPuffSmokeCheck`, `window.skyPuffBetaDiagnostics`, `window.skyPuffAIDiagnostics`, `window.skyPuffAntiCheat` and `window.skyPuffDiagnosticsSupport`.

## Known beta limitations
- Multiplayer networking is simulated; a real WebSocket/backend service is not connected yet.
- Progress is local to the browser; there is no account/cloud save yet.
- Global leaderboard is optional and only activates when `API_BASE` is configured.
- Client-side anti-cheat is a beta protection layer; production leaderboard security should validate runs server-side too.
- Payments/IAP are not production-enabled for this browser beta.

## Beta testing
Use `beta42.html`, then follow `BETA_TESTING.md`. Important device coverage is at least one Android phone, one iPhone/iPad if available, and one desktop browser. Test a normal run, all four bosses, Boss Rush, Creator, pause/retry/menu transitions, language persistence, audio, save persistence and System & Support.

## Online API configuration
By default `API_BASE` is empty and Highscore uses browser-local scores. A hosted beta can configure a backend at runtime with:

```js
window.skyPuffConfig.setApiBase('https://your-api.example.com')
```

The URL is saved locally for subsequent sessions.
