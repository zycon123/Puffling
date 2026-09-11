# beta.104 review notes

Review priority:

- Confirm the existing production PostgreSQL schema can create the source-level unique index without duplicate historical `(account_id, source, source_ref)` rows.
- Confirm replay behavior returns the original grant receipt and never increments inventory twice.
- Confirm all boss reward IDs are valid catalog IDs.
- Confirm no public HTTP route accepts a client-selected reward ID.
- Confirm beta.104 introduces no new infrastructure or paid dependency.

Do not merge until both Puffling Build and Race Server workflows are green.