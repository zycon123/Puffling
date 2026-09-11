# Puffling beta.104 — Acquisition hardening

Goal: harden authoritative acquisition without adding paid infrastructure.

## Implemented
- Canonical server-side boss reward allowlist.
- Boss acquisition fails closed for unknown Puffling IDs.
- Duplicate grant replay is idempotent only when account, source, source reference and reward match.
- Conflicting reuse of a grant ID fails with `grant_conflict`.
- Dedicated beta.104 CI validator.

## Next security gate
Boss session consumption and inventory grant should become one atomic settlement boundary. Until that transaction is implemented and validated, beta.104 remains a development branch and must not be merged to `main`.
