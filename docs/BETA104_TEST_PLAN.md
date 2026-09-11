# beta.104 acquisition test plan

Required before merge:

1. Normal completed Boss Session creates exactly one acquisition receipt and at most one inventory increment.
2. Repeating the same request returns the same canonical grant without a second inventory increment.
3. Concurrent settlement attempts for the same Boss Session cannot both mint inventory.
4. A grant ID/source conflict fails closed.
5. Unknown Puffling IDs cannot be inserted through the acquisition path.
6. `NONE` is a valid no-drop receipt but never increments inventory.
7. Expired, incomplete, wrong-account, positive-HP, or already-consumed Boss Sessions cannot create a new grant.
8. Vault/trade inventory behavior remains unchanged.
9. beta.102 and beta.103 regression validators remain green.
10. Full Puffling build and Race Server CI must pass on the final PR head.

The client must continue to submit only Boss Session proof; it must never select the reward Puffling.