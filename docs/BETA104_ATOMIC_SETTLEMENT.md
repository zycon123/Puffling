# beta.104 atomic boss settlement invariant

A completed Boss Session must never be consumed unless its acquisition receipt and inventory mutation commit successfully in the same database transaction.

Required behavior:
1. Lock the Boss Session row and grant ID inside one transaction.
2. Verify account ownership, completion, expiry, HP=0 and unconsumed state.
3. Derive the reward on the server and validate it against the canonical boss reward allowlist.
4. If the grant receipt already exists with identical account/source/session/reward, return the existing result without another inventory increment.
5. If the receipt conflicts, abort.
6. Insert/increment inventory and acquisition receipt.
7. Mark the Boss Session consumed.
8. Commit once. Any error rolls back all three mutations.

This is the beta.104 merge gate. No paid infrastructure is required because the existing shared PostgreSQL pool is used.
