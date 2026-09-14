# Orbuff Beta Changelog

## 5.27-beta.107
- Promote the active Orbuff build to `index.html` and point the stable `beta42.html` entry directly to it.
- Add cache-busted Beta 107 assets so mobile browsers do not mix older game modules with the current UI.
- Fix OrbVault migration/rest initialization for Orbuffs that were already stored before the progression upgrade.
- Add live OrbVault status for energy, level, next energy recharge, next passive XP and Revive Orb count.
- Keep the full OrbVault progression from 3 slots up to 8 slots.
- **Critical fix:** preserve protection for all 8 OrbVault slots in the collection/Fusion/Trade core instead of truncating protection to the first 3.
- Add regression coverage proving slot 4–8 Orbuffs cannot be consumed by Fusion or Trade.
- **Race fix:** Race My Orbuff now uses the player's actually selected active Orbuff rather than falling back to the first owned Orbuff.
- Race automatically selects another usable owned Orbuff if the active one is exhausted or resting in OrbVault, and blocks Race with a clear message if none are usable.
- Add dedicated Race active-Orbuff regression coverage.
- Align Boss Rush copy and the in-game guide with the current economy: 250 coins for the first Boss Rush clear of each boss and 25 coins for replays.
- Expand the in-game guide with current OrbVault, Fusion, Race, energy and revival rules.
- Bump the production beta configuration and launch audits to `5.27-beta.107`.
- Rename active build/deploy validation to Orbuff terminology while retaining legacy internal identifiers where compatibility requires them.

## 5.27-beta.106
- Keep the Zycon Studios splash visible until every ordered gameplay and menu module has finished loading.
- Enable the main menu and emit the public ready signal together, eliminating the visible-but-inert first-tap window.
- Hide Cosmetics and Upgrades in the initial HTML so they cannot intercept input before startup initialization.
- Add regression coverage for end-of-loader readiness and first-paint overlay visibility.

## 5.26-beta.89
- Retry a failed module request up to two times before stopping startup.
- Keep the main menu inactive until the entire ordered module list has loaded.
- Show a localized retry screen when startup cannot recover, preserving browser saves.
- Add regression checks for normal startup, transient/permanent request failures, execution order and recovery.

## 5.26-beta.88
- Clear stored runtime errors when they belong to an older beta build.
- Keep current-build errors available for diagnostics and bug reports.
- Prevent a fixed beta86 error from remaining visible after beta87/88 starts successfully.

## 5.26-beta.87
- Fixed a startup runtime error in language setup after the obsolete Rainbow Puff menu hint was removed.
- Treat the removed hint as an optional element so localization continues without interruption.
- Added build coverage that prevents the null-element crash from returning.

## 5.26-beta.86
- Show owned standard and Common Pufflings first when choosing an empty Vault slot.
- Sort all owned Pufflings consistently by standard set, rarity and name.
- Label each Vault choice with its category and owned count so common choices are easy to find.
- Added build coverage for the common-first Vault picker.

## 5.26-beta.85
- Rendered the compact main navigation directly in the initial HTML so the crowded legacy menu never flashes on startup.
- Hid legacy feature buttons before the first visible frame while retaining them as existing action targets.
- Bound category controls whether the compact navigation is pre-rendered or created as a runtime fallback.
- Matched first-paint and runtime menu styling to prevent layout shifts on slower mobile loads.
- Added build checks that reject regressions to the crowded first paint.

## 5.26-beta.84 — Vault picker
- Made every empty Vault slot tappable and added an in-panel Puffling picker.
- Store the chosen Puffling in the exact slot the player selected, including non-sequential slots.
- Preserve fixed slot positions between sessions while keeping the then-current three-slot protection limit.
- Added keyboard-accessible empty slots, picker cancellation and direct removal from occupied slots.
- Added runtime regression coverage for selecting, preserving and clearing exact Vault slots.

## 5.26-beta.84 — diagnostics
- Fixed false AI Diagnostics repairs when newer overlay menus such as Puffdex, Nursery/Vault, Mystery Shop or Audio settings are open.
- Migrated away from the legacy repair log so old false `Main menu restored` counts are cleared automatically.
- Added an explicit Anti-Cheat baseline sync for the intentional score adjustment after boss victories.
- Deduplicated identical Anti-Cheat warnings and clear stale session flags when a new run starts.
- Added regression coverage for dynamic overlay detection, legacy diagnostic cleanup and boss-transition integrity checks.

## 5.26-beta.84 — progression/runtime
- Fixed incremental height XP so small score increases accumulate instead of rounding down to zero.
- Prevented Vault-protected Pufflings from being consumed by Fusion and improved the player-facing error message.
- Clear an active Puffling automatically when its final owned copy is removed.
- Connected every catalog ability type used by the 50 additional Pufflings to gameplay effects.
- Expanded the Mystery Shop's random Legendary reward to the complete Legendary catalog.
- Require confirmed boss victory before granting boss Puffling rewards, achievement wins or boss XP.
- Normalize malformed Puffling progress, egg inventory and diamond balance saves.
- Added runtime-model regression tests to CI for catalog count, Vault-safe Fusion, active selection, XP accumulation and egg saves.

## 5.26-beta.5
- Adopted `beta42.html` as the cache-safe stable beta entry.
- Removed obsolete Beta 39/polished-renderer experiments, superseded Boss Puff Creator v1 and unused legacy diagnostics/audio files.
- Cached Boss Rush unlock state instead of parsing localStorage during every player-render frame.
- Fixed startup guard so it no longer lowers the first jump; normal first-jump speed now matches regular platform jumps.
- Fixed main soundtrack saved-volume/slider synchronization.
- Made Premium Creator insertion reliable even when Creator is opened long after startup, without polling every 250 ms.
- Localized Boss Rush reward/status and multiplayer flow text across Norwegian, English, German, Spanish and French.
- Fixed System & Support Anti-Cheat reporting to read the real anti-cheat status/flags.
- Added rendering for all achievement headwear rewards that previously could be selected but appeared invisible.
- Strengthened CI validation to syntax-check the full JS directory, reject duplicate/missing active modules, protect the stable loader and prevent removed experiment files from returning.

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
