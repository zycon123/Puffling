# beta.100 implementation status

Implemented on `beta100-server-ranked-foundation`:

- Postgres-backed `puffling_rank_profiles` canonical profile table.
- Postgres-backed `puffling_rank_results` idempotency/audit table keyed by `(race_id, account_id)`.
- Transactional `applyRace()` that locks both profiles and applies winner/loser MMR exactly once.
- Server-side MMR calculation with the existing beta.99 rating behavior (provisional K=40, normal K=28, delta clamped to 8..36).
- Persistent wins, losses, games, streak, best rating and last race ID.
- Ranked store initialized from `DATABASE_URL` by server bootstrap.
- Read-only `/api/ranked/status` and `/api/ranked/profile` diagnostics.
- Ranked calculation self-check added to `npm run check`.

Still intentionally disabled:

- Browser MMR is still the active beta.99 UI path.
- `rankServerAuthoritative` remains false.
- Race sockets are not yet authenticated account sessions.
- `race:result` is not yet wired to `rankedStore.applyRace()`.

Next gate:

Add authenticated account identity to the Race socket handshake. After that, bind Quick Race results to canonical account IDs and return server profiles/deltas to the client. Never trust client `rankRating` for competitive mutation.
