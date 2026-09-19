// Shared CORS allowlist for all HTTP handlers. Browsers block cross-origin
// fetch() responses that lack a matching Access-Control-Allow-Origin header,
// even when the server itself processed the request successfully -- a gap
// here silently breaks every client on every platform, not just one origin.
const ALLOWED=new Set([
  'https://zycon123.github.io', // production web build (GitHub Pages)
  'capacitor://localhost',      // iOS native app (Capacitor)
  'http://localhost',           // Android native app (Capacitor WebView)
  'https://localhost',
  'null'                        // Electron desktop build (file:// pages serialize Origin as "null")
]);
function allowedOrigin(req){
  const origin=String(req.headers.origin||'');
  if(!origin)return '';
  return ALLOWED.has(origin)?origin:'';
}
function applyCors(req,res){
  const origin=allowedOrigin(req);
  if(origin)res.setHeader('access-control-allow-origin',origin);
  return origin;
}
function handlePreflight(req,res,methods='GET,POST,OPTIONS'){
  if(req.method!=='OPTIONS')return false;
  const origin=applyCors(req,res);
  const headers={'access-control-allow-methods':methods,'access-control-allow-headers':'content-type,authorization','access-control-max-age':'600'};
  if(origin)headers['access-control-allow-origin']=origin;
  res.writeHead(204,headers);res.end();return true;
}
module.exports={allowedOrigin,applyCors,handlePreflight};
