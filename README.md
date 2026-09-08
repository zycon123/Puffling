# Sky Puff

Sky Puff v5.22 modularization checkpoint.

## Project structure
- `index.html` – game UI and menus
- `style.css` – visual styling
- `audio_theme.js` – lightweight menu/game soundtrack engine
- `game.js` – ordered module loader
- `js/` – gameplay, bosses, cosmetics, Boss Rush, score hooks and multiplayer prototype
- `js/leaderboard_submit.js` – online score submission module

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
The original v5.21 split files are being converted from generic `part*.js` names into clear feature modules. The loader now uses the named leaderboard submission module. Original `part*.js` files are temporarily kept as rollback backups while the migration continues.

Next planned module splits:
1. DOM/UI references
2. localization + shared audio settings
3. Boss Rush / multiplayer modes
4. gameplay state, economy and cosmetics
5. boss combat and endless progression

## Online services
The leaderboard client currently uses a placeholder API base URL. The real Render backend URL can be configured when the score/multiplayer server is deployed.

The original v5.21 standalone HTML remains the development backup for the full pre-split build.
