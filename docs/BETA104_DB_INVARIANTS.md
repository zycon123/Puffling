# beta.104 database invariants

- `grant_id` remains globally unique.
- `(account_id, source, source_ref)` is unique and represents one authoritative acquisition source.
- A Boss Session belongs to exactly one account.
- A new boss grant requires completed HP=0 proof that is unexpired and unconsumed.
- New settlement consumes exactly one proof row before commit.
- Replays resolve the existing receipt and never add inventory again.