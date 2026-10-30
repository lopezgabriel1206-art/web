# CHEFELPI — Instalación en cPanel (Node.js + PostgreSQL)

**Versión del proyecto:** v0.4. Esta entrega es una base de aplicación; tiene módulos pendientes y **no está verificada en un cPanel real**. No equivale a un servicio listo para producción comercial. El panel de acceso requiere base de datos.

## Antes de subir

Entrá a cPanel y verificá que tu plan incluya **Setup Node.js App** (o **Application Manager / Web Apps**) y **PostgreSQL Databases**, o bien permita conectar una base PostgreSQL externa. Si el proveedor ofrece solo PHP y MySQL, **no podrá ejecutar esta aplicación como está**.

Usá Node.js **22 o superior**, si tu hosting lo permite, y acceso a **Terminal/SSH** (o interfaz equivalente para ejecutar `npm`, Prisma y compilación). Es preferible usar un subdominio como `pruebas.tudominio.com` para testear antes del dominio público.

## Paso 1 — Crear carpeta privada de la aplicación

En `Administrador de archivos`, situate en el directorio principal de la cuenta (normalmente `/home/USUARIO/`). Creá una carpeta llamada `chefelpi-app` **FUERA DE `public_html`**. Subí allí el ZIP, extraelo y comprobá que en esa carpeta estén DIRECTAMENTE `app.js`, `package.json`, `src`, `prisma`, `public` y `next.config.ts`.

Nunca coloques `.env`, `node_modules`, o PDFs de pago bajo `public_html`.

## Paso 2 — Crear PostgreSQL

Desde cPanel creá la BD PostgreSQL y un usuario con permisos sobre ella. cPanel puede añadir prefijos al nombre de la base y del usuario. Si PostgreSQL es externo, anotá host, puerto, nombre, usuario y contraseña. **MySQL/MariaDB no reemplaza PostgreSQL** para este proyecto sin cambios de código.

## Paso 3 — Crear archivo privado `.env`

Desde cPanel, copiá `.env.example` a `.env` en `chefelpi-app` (nunca en `public_html`). Configurá:

```env
DATABASE_URL="postgresql://USUARIO:CLAVE@HOST:5432/NOMBRE_BASE?schema=public"
ADMIN_USERNAME="enriquevalladares"
ADMIN_PASSWORD="ELEGIR_UNA_CONTRASENA_NUEVA_Y_SEGURA"
REVIEW_HASH_PEPPER="SECRETO_ALEATORIO_LARGO_Y_UNICO"
NEXT_PUBLIC_SITE_URL="https://tudominio.com"
APP_ALLOWED_ORIGINS=""
NODE_ENV="production"
```

Usá **una clave nueva**: la contraseña que se mencionó anteriormente en el chat no debe reutilizarse para una aplicación publicada. Escapá correctamente los símbolos especiales de la contraseña de PostgreSQL en la URL (por ejemplo `@`, `#`, `%`). No pongas `.env` en GitHub.

El `POSTGRES_PASSWORD` del `.env.example` es solo para Docker local, no hace falta en cPanel cuando la BD está administrada por el hosting.

## Paso 4 — Crear la aplicación Node.js en cPanel

Buscá **Setup Node.js App** > **Create Application**. Configurá:

- **Node.js version:** 22.x (o posterior compatible).
- **Application mode:** Production.
- **Application root:** `chefelpi-app` (relativa al inicio de tu cuenta).
- **Application URL:** tu dominio o subdominio.
- **Application startup file:** `app.js`.

Guardá. Si el panel usa *Application Manager* o *Web Apps*, la interfaz puede diferir. El proveedor debe permitir una app Next.js que escuche en `process.env.PORT` (el archivo `app.js` ya lo hace).

## Paso 5 — Dependencias, BD, administrador y compilación

Desde **Terminal de cPanel** (o SSH):

```bash
cd ~/chefelpi-app
npm install --include=dev
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run build
```

**Importante:** en entornos CloudLinux `Setup Node.js App` puede mostrar un comando para activar el entorno virtual de Node. Ejecutalo **antes** de usar `npm`, si tu proveedor lo requiere.

`npm run db:seed` **crea un solo administrador** y falla si ya existe alguno. Ejecutalo solo la primera vez. Luego **borrá `ADMIN_PASSWORD` del `.env`** y reiniciá la aplicación. La contraseña solo queda guardada en la BD como hash bcrypt. La cuenta no se crea al subir el ZIP.

**Migraciones:** la carpeta `prisma/migrations` incorpora una migración SQL inicial. Si la base tiene tablas o datos previos, no la ejecutes sin revisar el estado y realizar un respaldo.

**Compilación:** necesita memoria disponible y acceso a npm. Algunos hostings compartidos limitan los recursos o la ejecución de Next.js; el proveedor debe confirmar compatibilidad.

## Paso 6 — Iniciar y verificar

En **Setup Node.js App**, iniciá o reiniciá la aplicación. Abrí:

- `https://tudominio.com/` — página pública.
- `https://tudominio.com/admin/login` — inicio de sesión privado.
- `https://tudominio.com/admin` — panel (requiere sesión).

Verificá HTTPS, navegación, acceso con usuario/clave nueva, rechazo de credenciales erróneas, cierre de sesión, creación de categoría y persistencia tras reinicio. No compartas una URL de administración abierta antes de estas comprobaciones.

Si falla, revisá el *Passenger log* o registro de Node.js, la instalación de dependencias, la BD, `DATABASE_URL`, la migración y el resultado de `npm run build`.

## Seguridad y límites

- Esta versión **no** implementa todos los módulos del prompt maestro: faltan editor visual, biblioteca multimedia, gestión completa de libros/videos, versiones, etc.
- Autenticación inicial no sustituye una auditoría de seguridad, límites globales de intentos, backups y monitoreo de producción.
- No hay base de datos incluida en el ZIP ni contraseñas pregrabadas.
- Las fotografías/libros completos privados requieren almacenamiento seguro adicional cuando se implementen.
- Si **no existe** Setup Node.js App/Application Manager, la carpeta no funcionará simplemente copiándola a `public_html`: usá la vista previa estática independiente o cambiá de plan/proveedor.
