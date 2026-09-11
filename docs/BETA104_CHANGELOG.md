# beta.104 changelog

- Started from green beta.103 main (`d65d9260`).
- Canonical boss acquisition reward allowlist remains enforced.
- Added database uniqueness for `(account_id, source, source_ref)` receipts.
- Added canonical source-receipt lookup during replay/concurrent settlement.
- Boss inventory mutation, acquisition receipt, and Boss Session consumption remain one PostgreSQL transaction.
- New settlement now verifies exactly one unconsumed Boss Session row was consumed before commit.
- Expanded beta.104 validator, test plan, review notes, and security-boundary documentation.
- No new paid infrastructure or dependency.

Status: development branch; CI is the next merge gate.