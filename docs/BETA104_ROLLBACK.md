# beta.104 rollback boundary

beta.104 is isolated on `beta104-acquisition-hardening`. `main` remains the green beta.103 release until beta.104 CI passes and merge is explicitly approved.

The production activation point is the future bootstrap/HTTP wiring commit. Before that commit, the new settlement service is inert. If wiring introduces a regression, revert that wiring on the beta.104 branch while retaining the allowlist/tests for diagnosis. No database-destructive migration is introduced by the current hardening work.
