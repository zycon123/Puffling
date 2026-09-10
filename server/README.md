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

## Remaining production hardening

This is an initial authoritative race server. Before public launch, add persistent accounts/authentication, stronger movement anti-cheat validation, reconnect tokens, rate limiting per IP/account, metrics/logging, and horizontal room scaling if concurrency grows.
