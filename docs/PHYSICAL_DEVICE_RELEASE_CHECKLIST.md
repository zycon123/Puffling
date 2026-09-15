# Orbuff — Physical device release checklist

Use this checklist on the **same signed release candidate** that will be sent to TestFlight / Google Play Internal testing. Record device model, OS version, build number and pass/fail evidence for each run.

Canonical release candidate at time of writing:
- App: Orbuff
- Bundle/package: `com.zyconstudios.orbuff`
- Version: `5.27.107`
- Build/versionCode: `107`

## Required device matrix

### Android
Test at minimum:
- one current Android phone on a recent Android release;
- one older supported Android phone if available;
- one device with a tall/narrow screen and gesture navigation.

Use the installable CI test APK for early device QA. Before store submission, repeat critical tests using the **signed Play AAB delivered through Google Play Internal testing**.

### iOS
Test at minimum:
- one current iPhone on the current iOS release;
- one smaller/older supported iPhone if available;
- iPad if the production target remains enabled for iPad.

Critical pre-release testing must be repeated using the signed archive delivered through **TestFlight**, not only a simulator build.

## 1. Install / first launch

- [ ] Clean install succeeds.
- [ ] Orbuff icon/name are correct on the home screen/app drawer.
- [ ] No Sky-Puff/Puffling legacy branding appears in launch UI.
- [ ] Splash/loading screen completes without freezing.
- [ ] Main menu is immediately tappable; no first-click unlock bug.
- [ ] Music/audio starts only in allowed platform conditions and can be muted/restored.
- [ ] Safe areas are respected around notch/dynamic island/status/navigation bars.
- [ ] App survives background → foreground without blank/frozen UI.

## 2. Language/localization sweep

For every selectable language:
- [ ] Select language, close/reopen app, confirm selection persists.
- [ ] Main menu is fully translated.
- [ ] Game Guide is fully translated.
- [ ] Orbdex, OrbVault, Nursery, Mystery Shop, Boss Rush and multiplayer menus use the selected language.
- [ ] No Norwegian fallback strings appear when English/German/Spanish/French is selected unless intentionally untranslated proper nouns.
- [ ] Buttons do not clip or overlap on the smallest tested device.

## 3. Starter / save / recovery

- [ ] New user can choose exactly one starter: Airbuff, Rainbuff or Sparkbuff.
- [ ] No unexpected extra Orbuffs are granted before intended rewards.
- [ ] Progress, coins, Diamonds, Orbuff inventory, levels and settings persist after app restart.
- [ ] Force-close during ordinary play; reopen and confirm safe recovery.
- [ ] Corrupted/local recovery path does not freeze the app.
- [ ] Reinstall behavior matches documented local-vs-server persistence expectations.

## 4. Core gameplay to Boss 10

- [ ] Movement/controls respond correctly.
- [ ] Enemy spacing remains survivable; no impossible unavoidable clusters.
- [ ] Enemy spikes do not enlarge collision unfairly.
- [ ] Rainbow Blast fires straight upward from the player position.
- [ ] Boss arena changes movement as designed.
- [ ] No normal enemies spawn during boss fights.
- [ ] Rainbow bar fills at the intended boss multiplier.
- [ ] Boss 1 pattern remains correct.
- [ ] Boss 2–10 patterns do not allow a permanent safe spot.
- [ ] Defeating a boss returns the player to the correct height/progression state.
- [ ] No fall-to-instant-game-over bug after victory.
- [ ] Complete the progression path through Boss 10.
- [ ] Endless play continues after the final boss without hard stop.

## 5. Orbdex / evolution / fusion

- [ ] Orbdex opens/closes reliably and has a working top Back button.
- [ ] Correct Orbuff collection/evolution information is shown.
- [ ] Evolution/Ascension progression persists.
- [ ] Fusion requires both parent Orbuffs to be Ascended/developed and Level 20.
- [ ] No Fusion Crystal is required anywhere.
- [ ] No Fusion Crystal appears as a Mystery Box reward or inventory dependency.
- [ ] Protected OrbVault copies cannot be consumed incorrectly by fusion/trade.

## 6. OrbVault / Nursery

- [ ] All intended OrbVault slots can be reached/unlocked.
- [ ] Empty slot → choose Orbuff workflow works.
- [ ] Standard/non-special Orbuffs can be stored when eligible.
- [ ] Stored/protected Orbuff behavior matches the guide.
- [ ] Removing an Orbuff restores normal usability without losing level/evolution.
- [ ] Nursery eggs/rewards appear correctly and persist.

## 7. Energy / revive / cooldowns

- [ ] Maximum energy is 5.
- [ ] Energy spending is correct.
- [ ] Recharge timer behaves correctly across backgrounding and app restarts.
- [ ] Revive prices match the documented Orbuff rules.
- [ ] Cooldowns cannot be bypassed by simple screen/menu navigation.

## 8. Mystery Shop / chance rewards

- [ ] Mystery Shop opens/closes without freeze.
- [ ] Displayed odds match runtime rewards exactly.
- [ ] Reward table contains 500 Coins 38%, 1000 Coins 26%, Rare Egg 18%, Epic Egg 11%, Legendary Egg 6%, Random Legendary Orbuff 1%.
- [ ] No Fusion Crystal reward remains.
- [ ] Three-box egg combination uses the displayed 70/25/5 rarity odds.
- [ ] Earned Diamonds spend correctly.
- [ ] Paid Diamond controls remain unavailable/fail-closed in the current release candidate.

## 9. Boss Rush

- [ ] Boss Rush window is not shown automatically on app startup.
- [ ] Menu opens/closes every time without freezing.
- [ ] Only defeated/unlocked bosses are available.
- [ ] Boss replay launches correctly.
- [ ] Reward is granted exactly once per completed run as designed.
- [ ] Returning to main menu leaves the app responsive.

## 10. Quick/Friend Race

Test with two physical devices on different networks if possible.

- [ ] Quick Race matchmaking works.
- [ ] Friend room code create/join works.
- [ ] Same account cannot occupy both race slots.
- [ ] Both players receive the same deterministic course where required.
- [ ] Rival ghost/position updates correctly.
- [ ] Selected eligible Orbuff is locked/validated correctly.
- [ ] Each Orbuff attack ability respects match limit and cooldown.
- [ ] Network interruption/reconnect does not duplicate rewards or corrupt race state.
- [ ] Finish/result settlement is authoritative and consistent on both devices.
- [ ] Ranked result/rating updates only once.

## 11. Trade / online inventory

- [ ] Trade only uses server-authoritative eligible inventory.
- [ ] Protected OrbVault copies cannot be traded.
- [ ] Duplicate/ownership counts remain correct after successful trade.
- [ ] Cancelled/failed trade does not remove items.
- [ ] Network interruption during trade does not duplicate or lose inventory.

## 12. Leaderboard / identity privacy

- [ ] Score submission works after a valid run.
- [ ] Public leaderboard displays generated aliases like `Orbuff-XXXXXX`, not the player's local free-text name.
- [ ] Local high-score display may still use the local player name as intended.
- [ ] Invalid/anti-cheat-blocked submissions stay local and are not published.
- [ ] Account-linked score is removed through authenticated guest-account deletion.

## 13. Account deletion / privacy

- [ ] Privacy Policy opens from System & Support.
- [ ] External account-deletion page opens correctly.
- [ ] Guest Account ID is visible/copyable.
- [ ] In-app account deletion requires the authenticated guest identity.
- [ ] Successful deletion clears/revokes server-linked account state.
- [ ] Deleted identity cannot silently reconnect as the old account.
- [ ] App recovers to a usable local/new-identity state after deletion.

## 14. Network failure behavior

Repeat key online actions while toggling Wi‑Fi/mobile data:
- [ ] app startup remains usable if backend is unavailable;
- [ ] leaderboard failure does not block local play;
- [ ] Race failure returns a clear recoverable state;
- [ ] trade failure is atomic;
- [ ] no infinite loading overlays remain;
- [ ] returning network restores online functions without full reinstall.

## 15. Performance / thermal / battery sanity

Run at least one 30–60 minute session per platform:
- [ ] no progressive frame-rate collapse;
- [ ] no runaway memory symptoms or repeated crash;
- [ ] device does not become abnormally hot for simple 2D gameplay;
- [ ] audio does not multiply/stack after repeated menu/boss transitions;
- [ ] touch latency remains acceptable after extended play.

## 16. Store-build-only checks

### Google Play Internal
- [ ] Signed AAB installs through Play Internal testing.
- [ ] Package is `com.zyconstudios.orbuff`.
- [ ] Version/versionCode are correct.
- [ ] Play integrity/signing details are as expected.
- [ ] No debug/test-only labels or endpoints are exposed.

### TestFlight
- [ ] Signed archive uploads and processes successfully.
- [ ] Bundle ID/version/build are correct.
- [ ] TestFlight install launches and networks correctly.
- [ ] No signing/entitlement prompts or missing-resource failures occur.

## Exit criteria

Do not promote the candidate to public production until:
- all critical sections above pass on at least one real Android phone and one real iPhone;
- any supported iPad path has been tested or intentionally removed from supported devices;
- no launch/loading/menu freeze remains;
- account deletion and privacy links work in the store-distributed build;
- the final screenshots are captured from the same behavior users will receive;
- signed artifacts have been tested through Play Internal and TestFlight.
