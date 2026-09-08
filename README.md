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
- remaining `part*.js` files – gameplay/render/combat sections still being migrated

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
The loader now uses named feature modules for DOM references, leaderboard submission/UI, save/content/runtime state, Boss Rush/multiplayer, run/menu/shop/upgrades, and input/missions/boss spawning.

The old `part*.js` files are temporarily retained as rollback backups, but `part1.js`, `part3.js`, `part4.js`, `part5_1.js`, and `part5_2.js` are no longer part of the active loader path.

Next planned module splits:
1. finish localization + shared audio core migration from `part2.js`
2. split boss combat / endless progression from `part5_3.js`
3. split rendering / final bootstrap from `part5_4.js`
4. remove legacy backup modules after validation
5. connect the real leaderboard / multiplayer backend

## Online services
The leaderboard client currently uses a placeholder API base URL. The real Render backend URL can be configured when the score/multiplayer server is deployed.

The original v5.21 standalone HTML remains the development backup for the full pre-split build.
