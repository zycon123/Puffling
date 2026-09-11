# beta.104 security notes

Threats addressed:
- Client-selected Puffling reward: rejected; reward is derived server-side.
- Unknown/arbitrary reward ID: rejected by canonical allowlist.
- Replay of identical grant: returns the existing receipt without incrementing inventory again.
- Reuse of grant ID with different account/source/session/reward: fails closed as `grant_conflict`.
- Partial settlement: atomic service performs inventory, receipt and Boss Session consumption inside one transaction.
- Concurrent claims: advisory lock plus row locks serialize settlement for a Boss Session.

The service is not production-active until bootstrap and HTTP are explicitly switched to it and CI verifies the wiring.
