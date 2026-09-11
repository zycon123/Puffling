# beta.104 status

Implemented on `beta104-acquisition-hardening`:

- canonical boss reward allowlist
- source-level unique acquisition receipts
- replay/concurrency guard keyed by Boss Session
- atomic inventory + receipt + Boss Session consumption
- fail-closed consumption row-count check
- beta.104 static security validator
- explicit documentation of the remaining client-hit trust boundary

Next gate: GitHub Actions must pass before the pull request can be marked ready for review.