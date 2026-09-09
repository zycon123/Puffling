# Sky Puff Beta Changelog

## 5.26-beta.80
- Fixed false AI Diagnostics repairs when newer overlay menus such as Puffdex, Nursery/Vault, Mystery Shop or Audio settings are open.
- Migrated away from the legacy repair log so old false `Main menu restored` counts are cleared automatically.
- Added an explicit Anti-Cheat baseline sync for the intentional score adjustment after boss victories.
- Deduplicated identical Anti-Cheat warnings and clear stale session flags when a new run starts.
- Added regression coverage for dynamic overlay detection, legacy diagnostic cleanup and boss-transition integrity checks.

## 5.26-beta.80
- Fixed incremental height XP so small score increases accumulate instead of rounding down to zero.
- Prevented Vault-protected Pufflings from being consumed by Fusion and improved the player-facing error message.
- Clear an active Puffling automatically when its final owned copy is removed.
- Connected every catalog ability type used by the 50 additional Pufflings to gameplay effects.
- Expanded the Mystery Shop's random Legendary reward to the complete Legendary catalog.
- Require confirmed boss victory before granting boss Puffling rewards, achievement wins or boss XP.
- Normalize malformed Puffling progress, egg inventory and diamond balance saves.
- Added runtime-model regression tests to CI for catalog count, Vault-safe Fusion, active selection, XP accumulation and egg saves.

## 5.26-beta.5
- Adopted `beta42.html` as the cache-safe stable beta entry and made it generate a unique asset nonce every launch.
- Updated `game.js` so the stable nonce propagates to every JavaScript module, preventing mixed old/new builds on mobile browsers.
- Removed obsolete Beta 39/polished-renderer experiments, superseded Boss Puff Creator v1 and unused legacy diagnostics/audio files.
- Cached Boss Rush unlock state instead of parsing localStorage during every player-render frame.
- Fixed startup guard so it no longer lowers the first jump; normal first-jump speed now matches regular platform jumps.
- Fixed main soundtrack saved-volume/slider synchronization.
- Made Premium Creator insertion reliable even when Creator is opened long after startup, without polling every 250 ms.
- Localized Boss Rush reward/status and multiplayer flow text across Norwegian, English, German, Spanish and French.
- Fixed System & Support Anti-Cheat reporting to read the real anti-cheat status/flags.
- Added rendering for all achievement headwear rewards that previously could be selected but appeared invisible.
- Strengthened CI validation to syntax-check the full JS directory, reject duplicate/missing active modules, protect the stable loader and prevent removed experiment files from returning.
- Preserved Boss Rush reward at 100 coins, current boss firing loop, post-boss countdown, Rainbow Puff burst/cooldown behavior and Boss Puff progression.

## 5.26-beta.4
- Expanded beta diagnostics, stability patches and mobile/browser compatibility work.
- Added/iterated Boss Rush, Boss Puff Creator, post-boss safety flow and Rainbow Puff tuning.

## 5.26-beta.3
- Added Zycon Studios startup/loading splash with game-ready signal and failsafe.
- Added official beta support: `zyconstudios@protonmail.com`.
- Added SYSTEM & SUPPORT diagnostics panel with live build, save, leaderboard, anti-cheat and auto-repair status.
- Added client-side anti-cheat plausibility checks and suspicious-score blocking for online leaderboard submission.
- Added local leaderboard fallback so beta works without a backend.
- Added runtime error capture and support-mail diagnostics payload.

## 5.26-beta.2
- Added support email to beta configuration and main menu.
- Added beta testing support instructions.

## 5.26-beta.1
- Entered beta-readiness mode.
- Added beta diagnostics, local score fallback and release testing checklist.
