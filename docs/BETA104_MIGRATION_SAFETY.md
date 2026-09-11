# beta.104 migration safety

The new unique index on `(account_id, source, source_ref)` is created during acquisition-store initialization.

Existing beta.103 boss grants derive one deterministic grant ID from account + Boss Session, so normal operation should already produce one receipt per source session. If production initialization encounters historical duplicate source receipts, deployment must fail closed; do not delete or rewrite historical grants automatically.

This migration adds no external service and no paid resource.