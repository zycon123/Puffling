# Sky Puff

Sky Puff v5.21 development checkpoint.

## Project structure
- `index.html` – game UI and menus
- `style.css` – visual styling
- `audio_theme.js` – lightweight menu/game soundtrack engine
- `game.js` – ordered module loader
- `js/` – gameplay, bosses, cosmetics, Boss Rush, score hooks and multiplayer prototype

## Current features
- Endless high-score climb
- Four main bosses with unique boss soundtracks
- Boss Rush for defeated bosses, 50 gold per win
- Skins, faces, hats and trails
- Upgrades and 250-gold daily reward
- Pause/audio settings and multilingual menu
- Global leaderboard integration hooks
- Multiplayer prototype with friend code UI and random-match UI; opponent networking is still simulated until the WebSocket backend is connected

## Online services
The leaderboard client currently uses a placeholder API base URL. The real Render backend URL can be configured when the score/multiplayer server is deployed.

The original v5.21 standalone HTML remains the development backup for the full pre-split build.
