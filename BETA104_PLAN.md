# beta.104 — Acquisition hardening

Goal: harden server-authoritative Puffling acquisition without adding paid infrastructure.

- Atomically settle Boss Session proof, inventory grant, grant receipt, and proof consumption in the existing PostgreSQL transaction.
- Restrict boss rewards to the canonical server allowlist.
- Keep reward selection deterministic and server-owned.
- Make duplicate/replay requests idempotent and reject conflicting grant identities.
- Keep client-selected Puffling IDs outside the boss acquisition trust boundary.
- Preserve existing zero-cost deployment architecture and fail closed when persistence is unavailable.

Next validation work: wire beta.104 static validation into CI, add concurrent settlement regression coverage, and verify replay/no-drop behavior before marking the PR ready.