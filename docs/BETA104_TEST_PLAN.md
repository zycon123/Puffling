# beta.104 test plan

Before PR readiness, CI must prove:
- Existing beta.102 and beta.103 regressions still pass.
- Canonical boss rewards accept only the intended server pool.
- Invalid acquisition source/reward fails closed.
- Reward selection is deterministic for the same Boss Session.
- Atomic settlement source contains transaction, advisory lock, row locks, commit and rollback boundaries.
- Production HTTP uses the settlement service instead of grant-then-consume sequencing.
- Client still submits only Boss Session proof and cannot select a Puffling reward.
- Race, Trade, leaderboard, save integrity and 100-Puffling launch simulation remain green.
