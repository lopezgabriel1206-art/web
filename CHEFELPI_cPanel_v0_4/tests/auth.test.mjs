import test from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {hashSessionToken,validSessionToken,isStrongAdminPassword,normalizedAdminUsername,validAdminUsername,isAllowedRequestOrigin,SESSION_AGE_SECONDS} from '../src/lib/auth-policy.mjs';

test('token de sesión criptográfico, formato y hash irreversible', () => {
  const token=randomBytes(32).toString('hex');
  assert.equal(validSessionToken(token),true);
  assert.equal(validSessionToken('f'.repeat(63)),false);
  assert.equal(validSessionToken('not-a-token'),false);
  assert.equal(hashSessionToken(token).length,64);
  assert.notEqual(hashSessionToken(token),token);
  assert.equal(SESSION_AGE_SECONDS,86400);
});

test('política de contraseña y normalización de usuario',()=>{
  assert.equal(isStrongAdminPassword('correct horse battery staple'),true);
  assert.equal(isStrongAdminPassword('12345678'),false);
  assert.equal(isStrongAdminPassword('  contraseña-larga  '),false);
  assert.equal(isStrongAdminPassword('🔑'.repeat(20)),false); // bcrypt trunca desde 72 bytes
  assert.equal(normalizedAdminUsername('  ENRIQUEVALLADARES '),'enriquevalladares');
  assert.equal(validAdminUsername('enriquevalladares'),true);
  assert.equal(validAdminUsername('enrique valladares'),false);
  assert.equal(validAdminUsername('super-usuario'),false);
});

test('origen exacto evita dominios parecidos o falsificados',()=>{
  const url='http://localhost:3000/api/auth/login';
  assert.equal(isAllowedRequestOrigin('http://localhost:3000',url),true);
  assert.equal(isAllowedRequestOrigin('http://localhost:3001',url),false);
  assert.equal(isAllowedRequestOrigin('https://evil.example',url),false);
  assert.equal(isAllowedRequestOrigin('https://chefelpi.trycloudflare.com',url,'https://chefelpi.trycloudflare.com'),true);
  assert.equal(isAllowedRequestOrigin('https://evil.chefelpi.trycloudflare.com',url,'https://chefelpi.trycloudflare.com'),false);
  assert.equal(isAllowedRequestOrigin('https://chefelpi.trycloudflare.com.evil.test',url,'https://chefelpi.trycloudflare.com'),false);
  assert.equal(isAllowedRequestOrigin(null,url,'https://chefelpi.trycloudflare.com'),false);
  assert.equal(isAllowedRequestOrigin('https://chefelpi.trycloudflare.com/path',url,'https://chefelpi.trycloudflare.com'),false);
});
