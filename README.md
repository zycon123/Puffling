# Sky Puff

Sky Puff v5.22 modularization checkpoint.

## Project structure
- `index.html` – game UI and menus
- `style.css` – visual styling
- `audio_theme.js` – lightweight menu/game soundtrack engine
- `game.js` – ordered module loader
- `js/dom_refs.js` – cached DOM/UI references
- `js/leaderboard_submit.js` – online score submission
- `js/leaderboard_language_ui.js` – leaderboard rendering, language UI and canvas resize handling
- `js/state_content.js` – save data, cosmetics/content definitions and runtime state
- `js/boss_multiplayer.js` – Boss Rush, multiplayer prototype and boss soundtrack control
- `js/run_menu_shop_upgrades.js` – run lifecycle, menus, daily reward, cosmetics shop and upgrades
- `js/input_missions_boss_spawn.js` – player input, missions, boss warnings and boss spawning
- `js/gameplay_update.js` – gameplay update loop, collisions, boss combat resolution and end-game handling
- `js/player_render_helpers.js` – cloud, trail, hat and face rendering helpers
- `js/renderer_runtime.js` – entity rendering, main draw function, runtime loop and final bootstrap
- remaining `part*.js` files – legacy rollback backups plus `part2.js`/helpers still awaiting final migration

## Current features
- Endless high-score climb
- Four main bosses with unique boss soundtracks
- Boss Rush for defeated bosses, 50 gold per win
- Skins, faces, hats and trails
- Upgrades and 250-gold daily reward
- Pause/audio settings and multilingual menu
- Global leaderboard integration hooks
- Multiplayer prototype with friend code UI and random-match UI; opponent networking is still simulated until the WebSocket backend is connected

## Modularization progress
The active loader now uses named feature modules for DOM references, leaderboard submission/UI, save/content/runtime state, Boss Rush/multiplayer, run/menu/shop/upgrades, input/missions/boss spawning, gameplay update/combat, player rendering helpers and the renderer/runtime loop.

The old `part*.js` files are temporarily retained as rollback backups. `part1.js`, `part3.js`, `part4.js`, `part5_1.js`, `part5_2.js`, `part5_3.js` and `part5_4.js` are no longer part of the active loader path.

Next planned module splits:
1. finish localization + shared audio/endless boss helper migration from `part2.js`
2. review and migrate `part5_helpers.js`
3. remove legacy backup modules after validation
4. connect the real leaderboard / multiplayer backend
5. add automated smoke checks for the browser build

## Online services
The leaderboard client currently uses a placeholder API base URL. The real Render backend URL can be configured when the score/multiplayer server is deployed.

The original v5.21 standalone HTML remains the development backup for the full pre-split build.
