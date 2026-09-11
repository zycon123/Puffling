# beta.104 checkpoint

The branch has real implementation commits. Acquisition rejects unknown boss rewards, source receipts are unique per account/source/source-ref, duplicate or concurrent settlements resolve against the canonical receipt, and inventory + receipt + Boss Session consumption are one transaction.

The production acquisition HTTP path delegates to `settleBossSession`. The next gate is CI and migration-safety review. `main` remains unchanged and no merge is authorized by this checkpoint.