const assert=require('assert');
const fs=require('fs');
const path=require('path');
const cors=require('./cors');

function mockRes(){
  const headers={};
  return {
    headers,
    statusCode:0,
    body:'',
    ended:false,
    setHeader(name,value){headers[name.toLowerCase()]=value;},
    writeHead(status,extra={}){this.statusCode=status;for(const [k,v] of Object.entries(extra))headers[k.toLowerCase()]=v;},
    end(body=''){this.body=body;this.ended=true;}
  };
}

// allowedOrigin: exact-match allowlist, never falls back to a wildcard.
assert.strictEqual(cors.allowedOrigin({headers:{origin:'https://zycon123.github.io'}}),'https://zycon123.github.io','web build must be allowed');
assert.strictEqual(cors.allowedOrigin({headers:{origin:'capacitor://localhost'}}),'capacitor://localhost','iOS Capacitor must be allowed');
assert.strictEqual(cors.allowedOrigin({headers:{origin:'http://localhost'}}),'http://localhost','Android Capacitor WebView must be allowed');
assert.strictEqual(cors.allowedOrigin({headers:{origin:'null'}}),'null','Electron file:// origin (serialized as the string "null") must be allowed');
assert.strictEqual(cors.allowedOrigin({headers:{origin:'https://evil.example'}}),'','unrecognized origins must not be echoed back');
assert.strictEqual(cors.allowedOrigin({headers:{}}),'','missing Origin header yields no CORS header (same-origin/non-browser request)');

// applyCors sets the header only for allowed origins, via setHeader (so it merges with a later writeHead).
{
  const res=mockRes();
  const origin=cors.applyCors({headers:{origin:'https://zycon123.github.io'}},res);
  assert.strictEqual(origin,'https://zycon123.github.io');
  assert.strictEqual(res.headers['access-control-allow-origin'],'https://zycon123.github.io');
}
{
  const res=mockRes();
  cors.applyCors({headers:{origin:'https://evil.example'}},res);
  assert.strictEqual(res.headers['access-control-allow-origin'],undefined,'disallowed origin must not get a CORS header');
}

// handlePreflight only intercepts OPTIONS, and responds 204 with allow-methods/allow-headers.
{
  const res=mockRes();
  const handled=cors.handlePreflight({method:'GET',headers:{origin:'https://zycon123.github.io'}},res,'GET,POST,OPTIONS');
  assert.strictEqual(handled,false,'non-OPTIONS requests are not intercepted');
}
{
  const res=mockRes();
  const handled=cors.handlePreflight({method:'OPTIONS',headers:{origin:'https://zycon123.github.io'}},res,'GET,POST,OPTIONS');
  assert.strictEqual(handled,true);
  assert.strictEqual(res.statusCode,204);
  assert.strictEqual(res.headers['access-control-allow-origin'],'https://zycon123.github.io');
  assert.strictEqual(res.headers['access-control-allow-methods'],'GET,POST,OPTIONS');
  assert.ok(res.headers['access-control-allow-headers'].includes('authorization'),'preflight must allow the Authorization header for Bearer tokens');
  assert.ok(res.ended);
}

// Static guard: every *_http.js handler must wire in the shared CORS module.
// A handler that forgets this is invisible to server-side tests (which call
// functions directly, bypassing the browser's CORS enforcement entirely) but
// silently breaks every browser-based client -- this is exactly the bug this
// check exists to catch.
const dir=__dirname;
const httpFiles=fs.readdirSync(dir).filter(f=>/_http\.js$/.test(f));
assert.ok(httpFiles.length>=7,`expected at least 7 *_http.js handlers, found ${httpFiles.length}`);
for(const file of httpFiles){
  const src=fs.readFileSync(path.join(dir,file),'utf8');
  assert.ok(/require\(['"]\.\/cors['"]\)/.test(src),`${file} does not require ./cors`);
  assert.ok(/cors\.applyCors|cors\.handlePreflight/.test(src)||/\{[^}]*allowedOrigin[^}]*\}=require\(['"]\.\/cors['"]\)/.test(src),`${file} requires ./cors but never calls into it`);
}

console.log('cors_check: ok (%d handlers verified)',httpFiles.length);
