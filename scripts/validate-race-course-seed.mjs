import fs from 'node:fs';
import vm from 'node:vm';

const src=fs.readFileSync('js/race_course_seed.js','utf8');
const fail=msg=>{console.error(`❌ ${msg}`);process.exitCode=1;};
const ok=msg=>console.log(`✅ ${msg}`);
function make(){const context={window:{},console,Math};context.window=context;vm.runInNewContext(src,context,{filename:'race_course_seed.js'});return context.SkyPuffRaceCourse;}
function course(seed,count=60){const C=make();C.activate(seed);C.begin(700);const out=[];for(let i=0;i<count;i++)out.push(C.nextPlatform(620));return out;}

const a=course('server-seed-123'),b=course('server-seed-123'),c=course('server-seed-xyz');
if(JSON.stringify(a)!==JSON.stringify(b))fail('Same courseSeed did not produce identical platform sequence');
else ok('Same courseSeed produces an identical 60-platform course');
if(JSON.stringify(a)===JSON.stringify(c))fail('Different courseSeed produced the same platform sequence');
else ok('Different courseSeed changes the Race course');
for(let i=0;i<a.length;i++){
 const p=a[i];
 if(p.courseIndex!==i)fail(`Platform index drifted at ${i}`);
 if(i&&!(p.y<a[i-1].y))fail(`Platform Y is not strictly ascending in course order at ${i}`);
 if(p.x<12||p.x+p.w>608.001)fail(`Platform ${i} is outside the 620px playfield`);
 if(p.move!==false)fail('Ranked Race seeded platforms must be static for cross-client fairness');
}
if(!process.exitCode)ok('Seeded platforms stay ordered, in-bounds and static');
const server=fs.readFileSync('server/index.js','utf8');
const sync=fs.readFileSync('js/race_course_sync.js','utf8');
const world=fs.readFileSync('js/world_helpers.js','utf8');
const loader=fs.readFileSync('game.js','utf8');
for(const token of ['courseSeed','COURSE_VERSION','makeCourseSeed','roomCourse'])if(!server.includes(token))fail(`Race server missing ${token}`);
for(const token of ["T.on('race:start'",'C.activate','C.begin','reset()'])if(!sync.includes(token))fail(`Race course sync missing ${token}`);
if(!world.includes('course.nextPlatform(W)'))fail('World platform generator does not consume seeded Race platforms');
if(!loader.includes("'js/race_course_seed.js'")||!loader.includes("'js/race_course_sync.js'"))fail('Race course modules are missing from browser loader');
if(!process.exitCode)ok('Server, client sync, world generator and loader are wired for courseSeed');
if(process.exitCode)process.exit(process.exitCode);
console.log('✅ Deterministic Race course validation passed');
