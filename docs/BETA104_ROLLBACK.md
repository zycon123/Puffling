# beta.104 rollback boundary

beta.104 is isolated on `beta104-acquisition-hardening`. `main` remains the green beta.103 release until beta.104 CI passes and merge is explicitly approved.

The production HTTP path delegates boss reward settlement to the acquisition store. Inventory mutation, receipt insertion, and Boss Session consumption are kept in one PostgreSQL transaction; any failure rolls all of them back.

If the new source uniqueness index cannot be created because unexpected historical duplicate receipts exist, initialization must fail closed rather than automatically deleting or rewriting historical rewards. No destructive migration is performed.