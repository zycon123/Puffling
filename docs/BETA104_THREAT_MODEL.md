# beta.104 threat model

Protected against in this phase:

- client-selected boss rewards
- unknown reward IDs through acquisition
- repeated Boss Session reward claims
- concurrent claims for the same source
- partial inventory/receipt/proof-consumption state
- alternate grant IDs targeting the same authoritative source

Not fully solved in this phase: a modified client can still originate boss hit reports. The server validates ownership, timing/rate and HP progression, but combat is not fully simulated server-side.