import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const platform = String(process.argv[2] || '').toLowerCase();
if (!['android', 'ios'].includes(platform)) {
  throw new Error('Usage: node scripts/configure-native-release.mjs <android|ios>');
}

const release = JSON.parse(await readFile(path.join(root, 'release.config.json'), 'utf8'));
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));

if (!/^\d+\.\d+\.\d+$/.test(String(release.version))) {
  throw new Error(`Invalid native version: ${release.version}`);
}
if (!Number.isInteger(release.buildNumber) || release.buildNumber < 1) {
  throw new Error(`Invalid buildNumber: ${release.buildNumber}`);
}
if (pkg.version !== release.version) {
  throw new Error(`package.json version ${pkg.version} does not match release.config.json ${release.version}`);
}

async function configureAndroid() {
  const candidates = [
    path.join(root, 'android/app/build.gradle'),
    path.join(root, 'android/app/build.gradle.kts')
  ];
  let target = null;
  let source = null;
  for (const candidate of candidates) {
    try {
      source = await readFile(candidate, 'utf8');
      target = candidate;
      break;
    } catch {}
  }
  if (!target) throw new Error('Android app Gradle file was not found. Run `npx cap add android` first.');

  const versionCodePattern = /versionCode\s*(?:=\s*)?\d+/;
  const versionNamePattern = /versionName\s*(?:=\s*)?["'][^"']+["']/;
  if (!versionCodePattern.test(source)) throw new Error('Could not locate Android versionCode.');
  if (!versionNamePattern.test(source)) throw new Error('Could not locate Android versionName.');

  const kotlin = target.endsWith('.kts');
  source = source.replace(versionCodePattern, kotlin ? `versionCode = ${release.buildNumber}` : `versionCode ${release.buildNumber}`);
  source = source.replace(versionNamePattern, kotlin ? `versionName = "${release.version}"` : `versionName "${release.version}"`);
  await writeFile(target, source);

  const verified = await readFile(target, 'utf8');
  if (!new RegExp(`versionCode\\s*(?:=\\s*)?${release.buildNumber}\\b`).test(verified)) {
    throw new Error('Android versionCode verification failed.');
  }
  if (!new RegExp(`versionName\\s*(?:=\\s*)?["']${release.version.replaceAll('.', '\\.') }["']`).test(verified)) {
    throw new Error('Android versionName verification failed.');
  }
  console.log(`Configured Android ${release.version} (${release.buildNumber})`);
}

async function configureIos() {
  const target = path.join(root, 'ios/App/App.xcodeproj/project.pbxproj');
  let source = await readFile(target, 'utf8');
  const marketingMatches = source.match(/MARKETING_VERSION = [^;]+;/g) || [];
  const buildMatches = source.match(/CURRENT_PROJECT_VERSION = [^;]+;/g) || [];
  if (!marketingMatches.length) throw new Error('Could not locate iOS MARKETING_VERSION.');
  if (!buildMatches.length) throw new Error('Could not locate iOS CURRENT_PROJECT_VERSION.');

  source = source.replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${release.version};`);
  source = source.replace(/CURRENT_PROJECT_VERSION = [^;]+;/g, `CURRENT_PROJECT_VERSION = ${release.buildNumber};`);
  await writeFile(target, source);

  const verified = await readFile(target, 'utf8');
  if (!verified.includes(`MARKETING_VERSION = ${release.version};`)) throw new Error('iOS marketing version verification failed.');
  if (!verified.includes(`CURRENT_PROJECT_VERSION = ${release.buildNumber};`)) throw new Error('iOS build number verification failed.');
  console.log(`Configured iOS ${release.version} (${release.buildNumber})`);
}

if (platform === 'android') await configureAndroid();
else await configureIos();
