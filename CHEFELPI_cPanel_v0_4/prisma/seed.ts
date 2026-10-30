import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { isStrongAdminPassword, normalizedAdminUsername, validAdminUsername } from '../src/lib/auth-policy.mjs';

const db = new PrismaClient();
const username = normalizedAdminUsername(process.env.ADMIN_USERNAME || 'enriquevalladares');
const password = process.env.ADMIN_PASSWORD;

async function main() {
  if (!validAdminUsername(username)) {
    throw new Error('ADMIN_USERNAME debe tener entre 3 y 40 caracteres: letras minúsculas, números o guion bajo.');
  }
  if (!isStrongAdminPassword(password)) {
    throw new Error('Definí ADMIN_PASSWORD en el archivo .env (14–128 caracteres; máximo 72 bytes UTF-8).');
  }

  // Importante: ni una API pública ni un formulario crean administradores.
  // Solo esta inicialización local, que se ejecuta explícitamente, crea UNA cuenta.
  const count = await db.adminUser.count();
  if (count !== 0) {
    throw new Error('Ya existe un administrador. No se creó ni modificó ninguna cuenta.');
  }
  await db.adminUser.create({
    data: {username, name: 'Chefelpi', passwordHash: await hash(password, 12)},
  });
  console.log(`Cuenta administrativa inicial creada para el usuario ${username}.`);
  console.log('Ahora eliminá ADMIN_PASSWORD de .env y guardá la clave en un gestor de contraseñas.');
}

main().catch(error => {console.error(error);process.exitCode=1;}).finally(() => db.$disconnect());
