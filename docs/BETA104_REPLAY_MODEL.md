# beta.104 replay model

A Boss Session is the authoritative source reference for a boss acquisition reward.

For a valid first settlement, the server locks the session, writes at most one inventory increment, writes one acquisition receipt, consumes the session, and commits atomically.

For a replay, the server locks the same source and resolves the existing canonical receipt. It does not increment inventory again. A mismatch between the canonical receipt and requested settlement is a conflict and fails closed.

Concurrent requests serialize through the transaction advisory lock and row lock.