# Puffling beta.100 — server-ranked foundation

## Goal
Move Quick Race MMR/W/L away from browser-local authority and make the server the only component allowed to mutate competitive rank.

## Current beta.99 gap
`js/race_ranked.js` stores the ranked profile in `localStorage`. The Race server validates movement and decides the winner, but the browser still calculates and writes MMR after receiving the result. A player can therefore modify local rank data.

## beta.100 contract

### Identity
Every ranked request must eventually carry an authenticated account ID. Do not treat the current client-generated `playerId` as account identity. Until authentication is configured, ranked persistence must remain disabled/fail closed rather than pretending to be secure.

### Server profile
Canonical profile fields:
- accountId
- rating (default 1000, minimum 600)
- wins
- losses
- games
- streak
- bestRating
- lastRaceId
- updatedAt

### Authoritative result flow
1. Two authenticated accounts join Quick Race.
2. Server loads both canonical ratings.
3. Race server validates positions and chooses the winner as it already does.
4. Server applies the MMR transaction exactly once using `raceId` as the idempotency key.
5. Server returns each player's canonical before/after profile and delta in `race:result`.
6. Browser renders the server profile. It never calculates or writes competitive MMR.

### Persistence
Use the existing server-side database connection pattern (Neon/Postgres where configured). Ranked mutation must be transactional and idempotent. A repeated result for the same account/race must return the existing result without applying a second delta.

### Migration
Existing local beta MMR is display-only legacy data and must not automatically become trusted production rank. New authenticated accounts should start at 1000 unless an explicit one-time migration policy is introduced later.

## Required tests before enabling `rankServerAuthoritative`
- unauthenticated Quick Race cannot mutate rank
- spoofed client `rankRating` cannot overwrite canonical rating
- server winner receives positive delta and loser negative delta
- duplicate `raceId` does not apply twice
- reconnect does not create a second ranked result
- friend races never mutate rank
- invalid/locked race never mutates rank
- concurrent result submission remains atomic
- database restart preserves profile
- client renders server-returned canonical profile

## Release gate
Only set `window.PufflingAccountProfile.rankServerAuthoritative = true` after authenticated identity, persistent profile storage, server-only result mutation and the tests above are all active in the production backend.
