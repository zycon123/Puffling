# beta.104 CI gate

The branch must not merge until both repository workflows are green on the final head:

- Validate Puffling Build
- Validate Race Server

The Race Server check includes beta.102, beta.103, and beta.104 regression validators through `server/package.json`. The build check must continue to pass the full launch simulation and launch-readiness audit.