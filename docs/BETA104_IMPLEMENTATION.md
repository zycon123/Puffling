# beta.104 implementation

`server/acquisition_store.js` now treats the Boss Session as the canonical acquisition source. The store validates rewards against the server allowlist, serializes settlement, checks an existing source receipt, validates the locked Boss Session proof, updates inventory, inserts the receipt, consumes exactly one proof row, and commits.

The public HTTP route continues to choose rewards server-side and calls this settlement method. The client cannot submit a desired reward.