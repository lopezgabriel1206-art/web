# CHEFELPI v0.3 — Guía de acceso del administrador

## Antes de empezar

Esta versión **no** es un archivo HTML que se pueda abrir con doble clic ni el ZIP anterior que se servía con Python. Es una aplicación Next.js que ejecuta código privado en el servidor y requiere PostgreSQL. El ZIP contiene el proyecto fuente completo de la versión v0.3 (no sus paquetes npm). No incluye ninguna contraseña ni sesión preconfigurada: la cuenta se crea cuando se ejecuta `npm run db:seed` contra PostgreSQL, no al abrir el ZIP.

### Windows: requisitos

1. Instalar Node.js 22 o superior (Node 20.9+ es el mínimo de Next.js 16).
2. Instalar PostgreSQL localmente, **o** Docker Desktop para iniciar PostgreSQL con `docker compose`.
3. Descomprimir este ZIP y abrir CMD en la carpeta raíz del proyecto (donde está `package.json`).

### Paso 1. Configurar datos secretos

Copiar `.env.example` a `.env`:

```cmd
copy .env.example .env
notepad .env
```

Elegir una contraseña propia fuerte para la base de datos y colocar el **mismo valor** en `POSTGRES_PASSWORD` y en la parte de contraseña de `DATABASE_URL`. Si usás caracteres especiales en una contraseña de una URL, deben codificarse correctamente. Para simplificar en pruebas podés elegir una clave alfanumérica larga y aleatoria. Dejá `ADMIN_USERNAME="enriquevalladares"` como está. Definí `ADMIN_PASSWORD` con la contraseña inicial elegida (14 a 128 caracteres, máximo 72 bytes UTF-8). No la escribimos en ningún archivo público ni la incluimos en el ZIP. La contraseña enviada por chat debería cambiarse antes de publicar la plataforma. Reemplazar también `REVIEW_HASH_PEPPER` por una cadena larga aleatoria.

**No compartir el archivo `.env`, especialmente al publicar el código.**

### Paso 2. Iniciar PostgreSQL

Si tenés Docker Desktop funcionando:

```cmd
docker compose up -d
```

Si instalaste PostgreSQL directamente, tenés que crear el usuario `chefelpi` y la base `chefelpi`, o cambiar `DATABASE_URL` para usar un usuario/base existente. No iniciar otro PostgreSQL en el mismo puerto 5432.

### Paso 3. Preparar el proyecto

```cmd
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

El comando `db:seed` crea **solo una cuenta administradora**, utilizando el nombre de usuario `enriquevalladares` y la contraseña del `.env`. **No hay ninguna opción de registro público.** Si ya existe una cuenta, no la sobrescribe. Después de que confirme que se creó, **quitá `ADMIN_PASSWORD` de `.env`** y guardá la contraseña en un gestor de contraseñas. No ejecutes `db:seed` de nuevo como método de recuperación.

### Paso 4. Entrar al panel

Abrí en Chrome:

- Web pública: http://localhost:3000
- Inicio de sesión: http://localhost:3000/admin/login
- Panel: http://localhost:3000/admin
- Cuenta y cambio de contraseña: http://localhost:3000/admin/cuenta

La web muestra un vínculo discreto **Administración** en su pie. Los visitantes pueden ver el formulario, pero no el contenido del panel sin credenciales válidas.

### Paso 5. Compartir con alguien (túnel temporal)

**No publiques el panel administrativo sin revisar primero la seguridad de tu instalación.** Para una prueba controlada, iniciá Next.js (`npm run dev`) y abrí otra terminal en la que está instalado cloudflared:

```cmd
cloudflared.exe tunnel --url http://127.0.0.1:3000
```

Para que el inicio de sesión funcione **desde el enlace externo**, agregá el origen HTTPS exacto generado por Cloudflare a `APP_ALLOWED_ORIGINS` en tu `.env` y reiniciá Next.js. Ejemplo del formato:

```env
APP_ALLOWED_ORIGINS="https://direccion-generada.trycloudflare.com"
```

No pongas `*` ni cualquier otro comodín. El enlace puede cambiar en cada sesión. Mantené la consola de Next.js y la de Cloudflare abiertas. Cerrá las dos para terminar la prueba.

**Importante**: al usar un túnel, cualquiera que conozca el enlace puede ver la parte pública y también la pantalla de login. Por eso el administrador debe usar una contraseña fuerte y no compartir las credenciales. No es recomendable exponer un servidor de desarrollo a personas desconocidas.

## Seguridad del inicio de sesión

- Contraseñas hasheadas con bcrypt (12 rondas), sin almacenarlas en texto plano.
- Cookie de sesión `HttpOnly`, `SameSite=Lax` y `Secure` en producción HTTPS; el token guardado en PostgreSQL está hasheado.
- Autenticación comprobada en el servidor para páginas privadas y operaciones de administración implementadas.
- Límite de 5 intentos fallidos por nombre de usuario en 15 minutos (mínimo básico; agregar límites por IP/proxy fiable para producción).
- Orígenes de peticiones verificados exactamente. Configurables para el túnel con `APP_ALLOWED_ORIGINS`.
- Cierre de sesión que revoca la sesión en la base de datos.
- Cambio de contraseña en `/admin/cuenta` con verificación de la clave actual y revocación de las demás sesiones.
- `robots: noindex` en rutas administrativas (esto **no sustituye** la autorización).

## Qué NO está terminado

Este incremento completa **el módulo básico de autenticación y cuenta**. Los módulos avanzados del prompt maestro (biblioteca de medios, editor visual, carga/privacidad de PDF, gestión completa de libros y videos, notificaciones y automatizaciones) **no quedan terminados por instalar el login**.

## Diagnóstico

```cmd
npm run test:unit
npm run db:generate
npm run typecheck
npm run lint
npm run build
```

Si el login muestra `503`, verificá PostgreSQL y `DATABASE_URL`. Si muestra `403 Origen no autorizado` desde Cloudflare, comprobá `APP_ALLOWED_ORIGINS` con la dirección HTTPS exacta y reiniciá la aplicación. Si muestra `429`, se superaron los intentos disponibles; esperá 15 minutos. Si `/admin` redirige a `/admin/login`, no existe una sesión válida.
