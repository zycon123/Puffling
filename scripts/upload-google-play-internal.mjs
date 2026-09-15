import fs from 'node:fs';
import { GoogleAuth } from 'google-auth-library';

const PACKAGE_NAME='com.zyconstudios.orbuff';
const EXPECTED_VERSION_CODE='107';
const AAB=String(process.env.ORBUFF_PLAY_AAB||'').trim();
const rawCredentials=String(process.env.ORBUFF_PLAY_SERVICE_ACCOUNT_JSON||'').trim();

function fail(message){throw new Error(message);}
async function responseJson(response,label){
  const text=await response.text();
  let body={};try{body=text?JSON.parse(text):{};}catch{body={raw:text};}
  if(!response.ok)fail(`${label}_http_${response.status}:${JSON.stringify(body).slice(0,800)}`);
  return body;
}

if(!AAB||!fs.existsSync(AAB))fail('signed_aab_missing');
if(!rawCredentials)fail('play_service_account_missing');
let credentials;try{credentials=JSON.parse(rawCredentials);}catch{fail('play_service_account_invalid_json');}
if(credentials?.type!=='service_account'||!credentials?.client_email||!credentials?.private_key)fail('play_service_account_invalid');

const auth=new GoogleAuth({credentials,scopes:['https://www.googleapis.com/auth/androidpublisher']});
const client=await auth.getClient();
const tokenResult=await client.getAccessToken();
const accessToken=typeof tokenResult==='string'?tokenResult:tokenResult?.token;
if(!accessToken)fail('play_access_token_missing');

const headers={authorization:`Bearer ${accessToken}`};
const api=`https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(PACKAGE_NAME)}`;
let editId='';
let committed=false;

try{
  const edit=await responseJson(await fetch(`${api}/edits`,{
    method:'POST',headers:{...headers,'content-type':'application/json'},body:'{}'
  }),'edit_insert');
  editId=String(edit?.id||'');if(!editId)fail('edit_id_missing');

  const uploadUrl=`https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/${encodeURIComponent(PACKAGE_NAME)}/edits/${encodeURIComponent(editId)}/bundles?uploadType=media`;
  const bundle=await responseJson(await fetch(uploadUrl,{
    method:'POST',headers:{...headers,'content-type':'application/octet-stream'},body:fs.readFileSync(AAB)
  }),'bundle_upload');
  const versionCode=String(bundle?.versionCode??'');
  if(versionCode!==EXPECTED_VERSION_CODE)fail(`unexpected_version_code:${versionCode||'missing'}`);

  const trackBody={
    track:'internal',
    releases:[{
      name:'Orbuff 5.27.107 (107)',
      versionCodes:[versionCode],
      status:'completed'
    }]
  };
  await responseJson(await fetch(`${api}/edits/${encodeURIComponent(editId)}/tracks/internal`,{
    method:'PUT',headers:{...headers,'content-type':'application/json'},body:JSON.stringify(trackBody)
  }),'track_update');

  await responseJson(await fetch(`${api}/edits/${encodeURIComponent(editId)}:validate`,{
    method:'POST',headers
  }),'edit_validate');

  await responseJson(await fetch(`${api}/edits/${encodeURIComponent(editId)}:commit?changesInReviewBehavior=ERROR_IF_IN_REVIEW`,{
    method:'POST',headers
  }),'edit_commit');
  committed=true;
  console.log(`Google Play Internal upload committed for ${PACKAGE_NAME} versionCode ${versionCode}.`);
}catch(error){
  if(editId&&!committed){
    try{await fetch(`${api}/edits/${encodeURIComponent(editId)}`,{method:'DELETE',headers});}catch{}
  }
  throw error;
}
