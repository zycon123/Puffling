import fs from 'node:fs';
import assert from 'node:assert/strict';

// js/orbuff_menu_localization.js translates hardcoded Norwegian strings by
// regex replacement. A `\b` (word-boundary) placed immediately after a
// non-ASCII symbol (an emoji, an arrow, a checkmark) with nothing but the
// pattern's own end following it can never match: `\b` requires one side to
// be a word character and the other not, and in JS's non-unicode-mode regex
// every non-ASCII character already counts as "not a word character", so a
// symbol followed immediately by end-of-pattern gives \b two non-word sides.
// This exact bug silently disabled 5 real translations (e.g. the Orbdex
// "Trykk for evolution →" evolution hint, "AKTIV ORBUFF ✓", two "🔒" labels),
// leaving them permanently in Norwegian for every non-Norwegian player.
const src=fs.readFileSync('js/orbuff_menu_localization.js','utf8');

// Extract every [/pattern/flags, ...] regex literal's raw source text.
const re=/\[\/((?:[^/\\]|\\.)*)\/([a-z]*)\s*,/g;
const offenders=[];
let m;
while((m=re.exec(src))){
  const pattern=m[1];
  // A literal `\b` (backslash-b, not an escaped backslash) at the very end
  // of the pattern, immediately preceded by a non-ASCII character.
  if(/[^\x00-\x7F]\\b$/.test(pattern))offenders.push(pattern);
}

assert.deepEqual(offenders,[],
  `Found ${offenders.length} localization regex pattern(s) ending in a dead trailing \\b right after a non-ASCII symbol (can never match, so that string never translates): ${JSON.stringify(offenders)}`);

console.log('✅ No localization regex ends in an unmatchable trailing word-boundary after a symbol/emoji');
