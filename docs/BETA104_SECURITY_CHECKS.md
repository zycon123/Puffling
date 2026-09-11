# beta.104 security checks

Static validation must reject a regression where the public acquisition endpoint accepts a client-selected Puffling ID. It must also require the reward allowlist, source-level unique receipt, transaction/locking boundaries, exact proof-consumption check, and existing beta.102/beta.103 regressions.

Runtime/database integration remains gated by the existing Race Server CI and production deployment checks.