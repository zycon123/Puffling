# beta.104 next step

Next implementation step: initialize `boss_settlement` from `bootstrap.js` with the existing shared PostgreSQL pool and acquisition store, then make `/api/acquisition/boss` call `settle(accountId, sessionId)` directly. Remove the old grant-then-consume sequence only after the new service is wired. Extend CI to reject any production HTTP path that performs those mutations separately.
