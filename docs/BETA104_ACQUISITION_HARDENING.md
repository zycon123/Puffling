# beta.104 — Acquisition hardening

Goal: make server-issued boss rewards replay-safe and catalog-constrained without adding paid infrastructure.

## Security boundary

- The client submits only a signed account token and a completed Boss Session ID.
- Reward selection remains server-side and deterministic for a session.
- Only the canonical boss reward allowlist may enter inventory through acquisition grants.
- `(account_id, source, source_ref)` is unique, so one authoritative source cannot mint multiple grants under different grant IDs.
- Boss proof row, acquisition receipt, inventory mutation, and proof consumption are settled inside one PostgreSQL transaction.
- A concurrent/replayed settlement returns the canonical receipt or fails closed on conflict.
- `consumed_at` is updated with `RETURNING`; a new grant cannot commit unless exactly one unconsumed proof is consumed.

## Cost

Uses the existing Puffling PostgreSQL connection and GitHub CI only. No new service or paid resource is introduced.

## Remaining trust limitation

Boss hit events are server-validated for session ownership, timing, rate, and HP, but originate from the game client. This is stronger than client-only rewards but is not equivalent to fully server-simulated combat.