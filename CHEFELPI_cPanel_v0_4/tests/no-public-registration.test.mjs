import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

const root = new URL('../', import.meta.url).pathname;

test('no hay endpoints públicos para registrar cuentas', () => {
  const apiAuth = join(root, 'src/app/api/auth');
  assert.deepEqual(readdirSync(apiAuth).sort(), ['login','logout']);
  const login = readFileSync(join(apiAuth, 'login/route.ts'), 'utf8');
  assert.match(login, /findUnique\(\{where:\{username\}\}\)/);
  assert.doesNotMatch(login, /adminUser\.create/);
});

test('el formulario solo solicita usuario y contraseña', () => {
  const form=readFileSync(join(root, 'src/components/admin/LoginForm.tsx'),'utf8');
  assert.match(form, /name="username"/);
  assert.match(form, /name="password"/);
  assert.doesNotMatch(form, /type="email"/);
});

test('la contraseña de inicialización se toma del entorno y no se entrega en el repositorio', () => {
  const seed=readFileSync(join(root, 'prisma/seed.ts'),'utf8');
  assert.match(seed, /process\.env\.ADMIN_PASSWORD/);
  assert.match(seed, /passwordHash: await hash\(password, 12\)/);
  const env=readFileSync(join(root,'.env.example'),'utf8');
  assert.match(env, /ADMIN_PASSWORD=""/);
});
