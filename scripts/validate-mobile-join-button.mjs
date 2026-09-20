import fs from 'node:fs';
import assert from 'node:assert/strict';

// The Race My Orbuff "Friend Code" row lays out its input and Join button
// with plain `display:flex` (no flex-shrink protection), unlike every other
// input+button row in this codebase, which either use CSS grid's `auto`
// track (Trade's join row) or a fixed min-width (the audio settings
// toggle). Combined with the visual-polish pass adding `overflow:hidden` to
// every button (for the shine highlight) and a right-padding fix on mobile
// overlay cards (to clear the floating audio button), the flex row got
// narrow enough on phone-width screens that the browser shrank #joinRoomBtn
// below its own content width -- silently clipping "JOIN" to "JOI" instead
// of showing it. Guards against removing the flex-shrink:0 fix.
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('style.css','utf8');

assert.ok(/id="roomCodeInput"[^>]*style="[^"]*flex:1/.test(html),
  'test is stale: roomCodeInput no longer uses flex:1 in a flex row (re-check whether the clipping risk still applies)');
assert.ok(/id="joinRoomBtn"/.test(html),'test is stale: joinRoomBtn no longer exists');
assert.ok(/#joinRoomBtn\s*\{[^}]*flex-shrink:\s*0/.test(css),
  '#joinRoomBtn must have flex-shrink:0, or its label clips on narrow/mobile screens where the flex row has little room');

console.log('✅ Join Friend Code button is protected from flex-shrink clipping on mobile');
