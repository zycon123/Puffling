# Puffling Race Server

WebSocket backend for **Race My Puffling**.

## What it does

- Quick Match pairing
- Friend room codes
- Maximum 2 players per race
- Relays live position packets
- Relays validated attack packets
- Enforces 3 attacks per player
- Enforces 4 second attack cooldown
- Server validates first player to reach 1500m
- Sends authoritative `race:result`
- Requires signed guest-account identity for Quick/Friend Race
- Uses authoritative inventory, ranking, account recovery and deletion stores
- Health endpoint at `/health`

## Local run

```bash
cd server
npm install
npm start
```

Default port is `10000`. Override with `PORT`.

Then point the game client to the server in the browser console:

```js
localStorage.setItem('skyPuffRaceWsUrl', 'ws://localhost:10000');
location.reload();
```

For production use a secure WebSocket URL (`wss://...`).

## Protocol

Client -> server:

- `race:hello`
- `race:ready`
- `race:position`
- `race:attack`
- `race:finish`

Server -> client:

- `race:matched`
- `race:opponentJoined`
- `race:start`
- `race:ready`
- `race:position`
- `race:attack`
- `race:attackRejected`
- `race:result`
- `race:opponentLeft`
- `race:error`

## Production configuration

`PUFFLING_AUTH_SECRET`, `PUFFLING_WALLET_SECRET` and `DATABASE_URL` are required production secrets and must be configured outside Git. The Render Blueprint declares them with `sync: false`. `/health` must report `raceAuth:true`, `rankAuth:true`, `raceInventory:true` and `rankStore:true` before release testing.

Real-money IAP remains disabled until the Apple/Google provider configuration and official store tests are complete. Keep `PUFFLING_IAP_PROVIDER_MODE=disabled` until that gate is deliberately opened.

Before scaling public concurrency, add production rate limiting/metrics and validate horizontal room coordination. The current service already provides authoritative finish settlement, movement integrity checks, reconnect/resume, signed account identity and server-backed inventory/ranking.
