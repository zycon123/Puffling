# beta.104 hard merge gate

Do not merge this branch until all conditions are true:

1. Production bootstrap initializes `boss_settlement` with the shared pool and acquisition store.
2. `/api/acquisition/boss` uses `settle(accountId, sessionId)` and no longer calls `store.grant()` followed by `bossSessions.consumeCompleted()`.
3. Server CI executes both acquisition allowlist and atomic settlement checks.
4. beta.104 validator rejects the old non-atomic HTTP sequence.
5. Validate Race Server and Validate Puffling Build are green on the final PR head.
6. Merge receives explicit approval.
