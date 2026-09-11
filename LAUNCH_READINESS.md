# Puffling launch readiness — 5.26-beta.99

## Automated audit status

The beta.99 launch audit validates the complete modular browser build, runtime models, a joined gameplay journey, deterministic Race course generation, Race HUD/desktop behavior, ranked result handling, Mystery Box/Vault behavior, Diamond wallet/IAP scaffolding, duplicate ownership/Trade, the 100-Puffling catalog, all 97 evolvable non-starters, static launch invariants, and the Node multiplayer/backend integration suite.

The joined gameplay simulation covers catalog/traits → starter and duplicate ownership → Vault protection → Trade idempotency → XP/evolution → Nursery eggs → Mystery Boxes/diamond spending → Race abilities/finish → web IAP fail-closed behavior → corrupted-save recovery.

The multiplayer integration simulation covers Quick Race matchmaking, shared course seed, reconnect/resume, synchronized countdown, rejection of a direct 1500 m teleport, valid position relay, attack cooldown, a plausible 1500 m finish, authoritative result metadata/MMR relay, starter Trade lock, and two-party prepare/commit.

## Launch hardening added in beta.99

- Server-side Race height/x progression validation and integrity lockout.
- Reconnect-safe Quick Race room IDs.
- Persistent Neon-backed global leaderboard with validation and rate limiting.
- Core save repair for malformed numbers, cosmetics and player names.
- Explicit verified TLS for Neon database connections.
- Production API enabled by default for the leaderboard.
- Early first-paint Puffling branding and correct 1500 m Race copy.
- Expanded System & Support launch codes.

## Intentional launch gates still open

These are not hidden by diagnostics and must be completed before claiming a fully secure public mobile/competitive launch:

1. **Native purchases:** StoreKit 2 / Google Play Billing plus direct Apple/Google server receipt/token verification. The current purchase backend intentionally fails closed and cannot grant paid Diamonds without verification.
2. **Account-backed ranked profile:** MMR/W/L is still a local beta profile. Public ranked play needs authenticated identity and server-only rank mutation.
3. **Server-authoritative Trade inventory:** Puffling ownership is still client-local. Public trading needs authenticated canonical inventory/ownership on the server.
4. **Physical-device E2E:** Race/Trade have automated two-client integration coverage, but still require real iPhone/Android/desktop two-device testing on production networking.
5. **Native store release work:** signed Android/iOS packages, privacy/store metadata, billing products, restore-purchase behavior and store review checks.

The web beta can be tested with the hardened systems above while these public/mobile release gates are completed.
