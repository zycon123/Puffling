import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = process.cwd();
const src = fs.readFileSync(`${root}/js/boss_multiplayer.js`, 'utf8');

// Quick Match must always join the shared 'quickmatch' queue, never a specific
// room pinned by a previous match. race:matched sets multiplayerRoom to the
// server-assigned room once matched, and nothing ever clears it -- without an
// explicit reset, a second Quick Match attempt in the same session (e.g. via
// the "RACE AGAIN" button) reuses the stale, already-finished room instead of
// rejoining the queue, and hangs forever waiting for a room nobody will join.
function el() {
  return { style: {}, textContent: '', value: '', onclick: null, disabled: false, addEventListener() {} };
}
const context = {
  console, Math, Date, JSON, Object, String, Number,
  multiplayerMenuEl: el(), multiplayerStatusEl: el(), roomCodeDisplayEl: el(), roomCodeInputEl: el(),
  bossRushMenuEl: el(), multiplayerHudEl: el(), mpRivalEl: el(), mpYouEl: el(), mpTimerEl: el(),
  bossRushListEl: el(), audioSettingsBtnEl: el(), closeAudioSettingsEl: el(), musicToggleEl: el(), musicVolumeEl: el(),
  bgMusicEl: { pause() {}, volume: 1, paused: true },
  startEl: el(), gameOverEl: el(), missionCompleteEl: el(), shopEl: el(), upgradesEl: el(),
  audioSettingsEl: el(), leaderboardMenuEl: el(),
  document: { addEventListener() {} },
  localStorage: { getItem: () => null, setItem() {} },
  musicEnabled: false, musicVolume: 0.5, lang: 'en',
  score: 0, save: { bank: 0 }, bossStages: [], boss: null,
  startMusic() {}, stopMusic() {}, refreshAudioUI() {}, refreshMenu() {}, persist() {},
  showToast() {}, showMainMenu() {}, spawnBoss() {}, reset() {}, requestAnimationFrame() {},
  loop() {},
  performance: { now: () => 0 },
  setInterval: () => 0, clearInterval() {},
  setTimeout: (fn) => { pendingTimeouts.push(fn); return 0; },
  running: false, paused: false, lastTime: 0,
};
const pendingTimeouts = [];
context.window = context;
vm.createContext(context);
vm.runInContext(src, context, { filename: 'js/boss_multiplayer.js' });

// multiplayerRoom/multiplayerState are top-level `let` bindings in the script,
// so they live in the VM's lexical environment, not as properties on `context`
// -- read/write them by evaluating bare identifiers in the same context.
const getRoom = () => vm.runInContext('multiplayerRoom', context);
const getState = () => vm.runInContext('multiplayerState', context);

// Simulate: a prior race got matched into a specific server-assigned room...
vm.runInContext("multiplayerRoom='RACE_STALE_FROM_PREVIOUS_MATCH'", context);
// ...and finished (finishMultiplayerRace does not touch multiplayerRoom).
assert.equal(getRoom(), 'RACE_STALE_FROM_PREVIOUS_MATCH', 'test setup sanity check');

// A fresh Quick Match attempt (first click, or "RACE AGAIN") must clear it
// synchronously so the transport's roomFor('random') falls back to the shared
// 'quickmatch' queue key instead of the finished room.
context.quickMatch();
assert.equal(getRoom(), '', 'quickMatch() must reset multiplayerRoom so a stale matched room is never reused');
assert.equal(getState(), 'searching', 'quickMatch() must still set the searching state');

// Draining the deferred startMultiplayerRace('random') must not resurrect the
// stale room either -- roomFor('random') should now fall back to 'quickmatch'.
while (pendingTimeouts.length) pendingTimeouts.shift()();
assert.equal(getState(), 'racing', 'the deferred race start should still proceed normally');
assert.equal(getRoom(), '', 'starting the race must not reintroduce the stale room');

// Friend Room flows legitimately need multiplayerRoom to persist (reconnecting
// to the same code), so quickMatch() must be the only thing clearing it here --
// createFriendRoom/joinFriendRoom must still set it deliberately.
context.roomCodeInputEl.value = 'ABCD';
context.joinFriendRoom();
assert.equal(getRoom(), 'ABCD', 'joining a friend room must still set multiplayerRoom');

console.log('✅ Quick Match always rejoins the shared queue instead of a stale matched room');
