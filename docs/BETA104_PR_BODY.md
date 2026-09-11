## beta.104 — acquisition hardening

Hardens the beta.103 server-authoritative Boss reward path without adding paid infrastructure.

### Changes
- canonical server reward allowlist
- unique acquisition source receipts
- replay/concurrency-safe Boss Session settlement
- atomic inventory + receipt + proof consumption
- fail-closed proof consumption check
- expanded beta.104 validation and security documentation

### Known limitation
Boss hits are validated server-side but still originate from the client; combat is not fully server-simulated.

### Merge gate
Both Puffling Build and Race Server CI must be green on the final head, followed by explicit merge approval.