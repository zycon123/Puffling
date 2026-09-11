# beta.104 — Multiplayer & payment readiness

This clean beta.104 branch is based directly on the green beta.103 `main` release and contains only reviewable implementation/test changes.

## Multiplayer hardened

- Signed account identity is required for Quick Race and Friend Race.
- Race protocol version 3 is enforced.
- Reconnect requires the same account identity.
- The same account cannot occupy both Race slots.
- Selected Puffling is locked at ready time and production Race can verify ownership against authoritative server inventory.
- Client performs authoritative inventory migration/sync before starting Race.
- Race attacks are canonicalized on the server from the selected Puffling; client-supplied strength/type/duration is ignored.
- Existing position integrity, server-authoritative finish/rank settlement, three-attack cap, cooldown, bot fallback and authoritative Trade remain protected by regression tests.

## Real-money payment preparation

- Web purchases remain disabled.
- Native purchase UI requires a complete billing bridge, signed wallet and `/iap/status` with `providerReady: true`.
- Server provider-verifier contract validates exact platform/product/transaction and rejects invalid, revoked or refunded outcomes.
- Purchase credit is idempotent by transaction ID and paid balance remains server-authoritative.
- Native transaction is finished/acknowledged only after Puffling server verification succeeds.
- Pending/unacknowledged transactions can be recovered and re-verified after interruption without double credit.

## Still intentionally not activated

The repo does not yet include the actual Apple/Google provider verifier or native StoreKit / Google Play Billing implementation. The existing wallet identity is also device-local and does not yet provide durable reinstall/device recovery. Therefore real charging remains fail-closed until those launch prerequisites are implemented and tested in official sandbox/test environments.

No new paid infrastructure or plan is introduced by beta.104.