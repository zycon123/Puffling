# Sky Puff

Sky Puff v5.23 modularization and smoke-check checkpoint.

## Project structure
- `index.html` – game UI and menus
- `style.css` – visual styling
- `audio_theme.js` – lightweight menu/game soundtrack engine
- `game.js` – ordered module loader
- `js/dom_refs.js` – cached DOM/UI references
- `js/localization_core.js` – Norwegian, English, German, Spanish and French text + translation helper
- `js/audio_core.js` – shared music settings, volume state and boss soundtrack definitions
- `js/endless_boss_core.js` – endless boss stage, health and reward scaling helpers
- `js/boss_multiplayer.js` – Boss Rush, multiplayer prototype and boss soundtrack control
- `js/music_bridge.js` – soundtrack bridge to game audio controls
- `js/leaderboard_submit.js` – online score submission
- `js/leaderboard_language_ui.js` – leaderboard rendering, language UI and canvas resize handling
- `js/state_content.js` – save data, cosmetics/content definitions and runtime state
- `js/world_helpers.js` – platform generation and mission setup helpers
- `js/run_menu_shop_upgrades.js` – run lifecycle, menus, daily reward, cosmetics shop and upgrades
- `js/input_missions_boss_spawn.js` – player input, missions, boss warnings and boss spawning
- `js/gameplay_update.js` – gameplay update loop, collisions, boss combat resolution and end-game handling
- `js/player_render_helpers.js` – cloud, trail, hat and face rendering helpers
- `js/renderer_runtime.js` – entity rendering, main draw function, runtime loop and final bootstrap
- `js/smoke_check.js` – post-bootstrap browser smoke check for required functions, state and DOM elements

## Current features
- Endless high-score climb
- Four main bosses with unique boss soundtracks
- Boss Rush for defeated bosses, 50 gold per win
- Skins, faces, hats and trails
- Upgrades and 250-gold daily reward
- Pause/audio settings and multilingual menu
- Global leaderboard integration hooks
- Multiplayer prototype with friend code UI and random-match UI; opponent networking is still simulated until the WebSocket backend is connected

## Validation status
- `audio_theme.js` loads before `game.js`
- `game.js` loads all feature modules sequentially
- No `part*.js` file remains in the active loader path
- `smoke_check.js` runs after final bootstrap and exposes `window.skyPuffSmokeCheck`
- Browser UI/version now reports v5.23

The original `part*.js` files are still retained only as rollback backups until the modular build has been exercised in a real browser session.

## Next planned steps
1. browser-run the modular build and inspect `window.skyPuffSmokeCheck`
2. test menu → gameplay → pause → game over → restart
3. test Boss Rush and each unlocked boss
4. test cosmetics/upgrades/daily reward persistence
5. then remove legacy rollback files and connect the real leaderboard / multiplayer backend

## Online services
The leaderboard client currently uses a placeholder API base URL. The real Render backend URL can be configured when the score/multiplayer server is deployed.

The original v5.21 standalone HTML remains the development backup for the full pre-split build.
