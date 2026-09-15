import fs from 'node:fs';

const required = [
  'ORBUFF_IOS_DISTRIBUTION_CERT_BASE64',
  'ORBUFF_IOS_CERT_PASSWORD',
  'ORBUFF_IOS_PROVISIONING_PROFILE_BASE64',
  'ORBUFF_APPLE_TEAM_ID'
];

const present = required.filter(name => String(process.env[name] || '').trim().length > 0);
if (present.length !== 0 && present.length !== required.length) {
  const missing = required.filter(name => !present.includes(name));
  console.error(`iOS production signing is partially configured. Missing: ${missing.join(', ')}`);
  process.exit(1);
}

if (present.length === required.length) {
  for (const asset of ['assets/logo.svg', 'assets/logo-dark.svg']) {
    if (!fs.existsSync(asset)) {
      console.error(`Production iOS signing requires approved Orbuff native artwork: ${asset}`);
      process.exit(1);
    }
  }
  const teamId = String(process.env.ORBUFF_APPLE_TEAM_ID || '').trim();
  if (!/^[A-Z0-9]{10}$/.test(teamId)) {
    console.error('ORBUFF_APPLE_TEAM_ID must be a 10-character Apple Team ID.');
    process.exit(1);
  }
  console.log('iOS production signing secret set and Orbuff artwork are fully configured.');
} else {
  console.log('iOS production signing secrets are not configured; signed IPA generation remains disabled.');
}
