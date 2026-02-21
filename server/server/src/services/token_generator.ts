import { validateAuth } from "./auth_validator";

export async function generateToken(body:any)
{
  validateAuth(body);
  const secret = '52';
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const msgData = enc.encode(body.email);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);

  const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return base64;
}