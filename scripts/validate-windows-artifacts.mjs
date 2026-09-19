import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const {version}=JSON.parse(fs.readFileSync('package.json','utf8'));
const out='dist/desktop';
const files=[`Orbuff-${version}-x64-Setup.exe`,`Orbuff-${version}-x64-Portable.exe`,'win-unpacked/Orbuff.exe'];
const records=files.map(file=>{
 const bytes=fs.readFileSync(path.join(out,file));
 assert.ok(bytes.length>1024*1024,`${file}: executable is unexpectedly small`);
 assert.equal(bytes.toString('ascii',0,2),'MZ',`${file}: missing Windows DOS header`);
 const pe=bytes.readUInt32LE(0x3c);
 assert.equal(bytes.toString('ascii',pe,pe+4),'PE\0\0',`${file}: missing Windows PE header`);
 return {file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
});
assert.notEqual(records[0].sha256,records[1].sha256,'Installer and portable packages must be distinct binaries');
assert.ok(fs.statSync(path.join(out,'win-unpacked/resources/app.asar')).size>0,'Packaged game archive must exist');
fs.writeFileSync(path.join(out,'windows-artifacts.json'),JSON.stringify({version,artifacts:records},null,2)+'\n');
for(const record of records)console.log(`PASS ${record.file} (${record.bytes} bytes) SHA256 ${record.sha256}`);
