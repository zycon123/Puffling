# beta.104 boss acquisition API contract

Client request remains `POST /api/acquisition/boss` with authenticated Bearer token and `{sessionId}` only.

Successful response remains server authoritative and may contain: `ok`, `serverAuthoritative`, `noDrop`, `pufflingId`, `grantId`, `bossRef`, `duplicate`.

The client must never send a requested Puffling ID, rarity, reward tier or inventory delta. Atomic settlement is an internal server implementation detail and should not require a client migration.
