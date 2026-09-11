# beta.104 settlement atomicity

The boss settlement transaction owns all state transitions for a reward:

1. Lock the Boss Session source.
2. Resolve an existing canonical acquisition receipt if this is a replay.
3. Validate completion, expiry, consumption state, HP, account, and reward allowlist.
4. Increment inventory only for a non-`NONE` reward.
5. Insert the acquisition receipt.
6. Consume exactly one previously unconsumed Boss Session row.
7. Commit.

Any error rolls the transaction back, including the inventory mutation and receipt insert.