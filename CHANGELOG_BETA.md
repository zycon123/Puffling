# Sky Puff Beta Changelog

## 5.26-beta.3
- Added Zycon Studios startup/loading splash with game-ready signal and failsafe.
- Added official beta support: `zyconstudios@protonmail.com`.
- Added SYSTEM & SUPPORT diagnostics panel with live build, save, leaderboard, anti-cheat and auto-repair status.
- Added automatic diagnostics/self-repair for invalid player state, broken boss state, missing platforms, stuck overlays and stopped animation loop.
- Added client-side anti-cheat plausibility checks and suspicious-score blocking for online leaderboard submission.
- Added local leaderboard fallback so beta works without a backend.
- Added runtime error capture and support-mail diagnostics payload.
- Expanded smoke checks and CI validation for diagnostics/support/anti-cheat.
- Restored missing `js/ai_diagnostics.js` after CI detected the loader mismatch.

## 5.26-beta.2
- Added support email to beta configuration and main menu.
- Added beta testing support instructions.

## 5.26-beta.1
- Entered beta-readiness mode.
- Added beta diagnostics, local score fallback and release testing checklist.
