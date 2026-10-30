# CHEFELPI v0.4 — Paquete para cPanel

**ATENCIÓN:** Esta es la aplicación Node.js (Next.js), no una carpeta HTML para `public_html`. Requiere que el hosting permita **Node.js 22+, PostgreSQL y compilación con npm**. Primero seguí **[`docs/INSTALAR_EN_CPANEL.md`](docs/INSTALAR_EN_CPANEL.md)**. La contraseña no viene en este paquete; se define al crear la cuenta.

**Estado:** base funcional en código para autenticación, contenido y funciones descritas en README; no se pudo compilar ni verificar contra un hosting real en este entorno. Módulos avanzados del prompt maestro siguen pendientes.

---

# CHEFELPI — Plataforma gastronómica

Versión v0.3 de una aplicación **Next.js multipágina** diseñada a partir del prompt maestro CHEFELPI v4.0. El sitio público, la autenticación y varios flujos de administración están implementados en código. **No está finalizado ni validado para su despliegue en producción**; ver el estado en `docs/HOJA_DE_RUTA.md`.

**Para instalarla en Windows y probar el login, comenzar por [`docs/GUIA_INICIO_SESION.md`](docs/GUIA_INICIO_SESION.md).**

## 1. Requisitos

- Node.js 22+ recomendado (Next.js 16 requiere Node >=20.9).
- npm, acceso a internet para instalar las dependencias.
- PostgreSQL (el `docker-compose.yml` facilita una instalación local si hay Docker).
- Un archivo `.env` válido con credenciales locales, nunca compartidas ni subidas al repositorio.

## 2. Instalación local

```bash
cp .env.example .env
# Editar .env y definir DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD y REVIEW_HASH_PEPPER
npm install
# Opcional si se dispone de Docker, usar la misma clave en ambos sitios:
# export POSTGRES_PASSWORD='una-clave-segura'
# docker compose up -d
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Abrir `http://localhost:3000`. Acceso privado en `http://localhost:3000/admin/login`.

El comando `db:seed` crea la cuenta inicial del usuario **`enriquevalladares`** y se detiene si ya existe un administrador. Utiliza una contraseña larga (mínimo 14 caracteres). Tras inicializar, eliminar `ADMIN_PASSWORD` del entorno activo y mantenerla en un gestor de contraseñas. No guardar credenciales en el código. **La cuenta no existe hasta ejecutar `npm run db:seed` con PostgreSQL funcionando.** La contraseña entregada por chat debe cambiarse antes de publicar el panel en internet.

**Importantísimo:** La variable `POSTGRES_PASSWORD` de Docker debe coincidir con la contraseña incluida en `DATABASE_URL`. El archivo `.env` usa nombres de ejemplo, no claves válidas. La base de datos conserva datos mediante el volumen `chefelpi_pg`.

## 3. Verificación

```bash
npm run test:unit   # pruebas puras de sesión, política de acceso y WhatsApp
npm run db:generate
npm run typecheck
npm run lint
npm run build
```

**Limitaciones de validación de esta entrega:** las pruebas unitarias no sustituyen las pruebas integradas. No se pudo ejecutar `npm install`, `typecheck`, `lint`, `build` ni migraciones porque el entorno de elaboración no dispone de conexión a npm/servidor PostgreSQL. Se requiere verificarlos en un entorno apto. No inferir que la plataforma está libre de errores a partir de los tests unitarios.

## 4. Estructura

Ver `docs/ARQUITECTURA.md`. El modelo Prisma enumera funciones previstas, pero **un modelo no significa que exista ya una pantalla de administración**. Esta versión incluye:

- Inicio, Sobre Chefelpi, Comidas, ficha de plato, Pedidos personalizados, Libros, ficha de libro, Videos, Promociones, Opiniones y Contacto.
- Menú superior y desplegables; menú completo y barra inferior en móviles.
- Modo claro/oscuro con preferencia del sistema y guardado del usuario.
- Catálogo de comidas con búsqueda y filtro por categoría.
- Mensajes de pedidos, libros y consultas por WhatsApp, cuando se configura el número oficial.
- Panel privado con acceso por nombre de usuario (sin registro público), token de sesión del lado servidor y cierre de sesión.
- Página de cuenta `/admin/cuenta`: cambio de contraseña con verificación de clave actual, hash bcrypt y revocación de sesiones antiguas.
- Enlace de Administración desde el pie de página pública.
- Crear/eliminar categorías, crear/publicar/ocultar/eliminar platos, establecer WhatsApp, correo y moneda.
- Envío público de opiniones pendientes, límites básicos y aprobación/rechazo/ocultación desde panel.
- Consultas públicas de libros, videos, promociones y contactos que podrán poblarse con contenido real mediante desarrollos adicionales.

## 5. Seguridad y limitaciones de v0.2

- Las cookies de administrador son HTTP-only, SameSite Lax y Secure en producción; tokens aleatorios solo se guardan hasheados en PostgreSQL.
- Las mutaciones privadas requieren sesión vigente, validación de origen y entradas básicas comprobadas.
- El login limita intentos por usuario; para producción se necesita control global adicional por IP/red fiable, monitoreo, bloqueo gradual y evaluación profesional.
- Las reseñas se guardan pendientes, con tope por IP hasheada; el hash requiere `REVIEW_HASH_PEPPER`, y la configuración de proxy de confianza debe revisarse antes de publicar.
- **Los libros de pago NO se pueden subir ni distribuir con esta versión**. El modelo permite almacenar una futura clave privada, pero falta implementar un bucket privado y ACL verificadas. El código público no consulta `privateFileKey`.
- Media gallery, editor visual, autoguardado, versiones, gestor de backups, sincronizaciones API, cargas de archivos, panel de libros/videos/promociones, zonas y horarios todavía están pendientes.
- No existe pasarela de pagos ni integración de WhatsApp Business API; `wa.me` abre el chat del usuario.
- La fotografía del emblema se recortó de la captura proporcionada para excluir bandas negras y número de teléfono; reemplazar por el archivo original de marca si está disponible.
- La antigua página `https://chefelpi.carrd.co/` no pudo consultarse automáticamente; por eso no se extrajo contenido como si hubiera sido verificado.

## 6. Publicación posterior

Esta edición para cPanel usa un servidor Next.js administrado por Passenger desde `app.js`. No usar `next export`: destruiría la API y las rutas administrativas. Antes de publicar: alojamiento HTTPS, PostgreSQL gestionada/respaldada, revisar variables, ejecutar migraciones, auditoría de autorización y formularios, backups probados, almacenamiento seguro de multimedia, suite de pruebas y dominio. Configurar `NEXT_PUBLIC_SITE_URL` para el sitio definitivo y los orígenes adicionales temporales de pruebas en `APP_ALLOWED_ORIGINS`; no usar comodines. El servidor de desarrollo también necesita permitir los hostnames de túneles en `allowedDevOrigins` (configurado desde esa misma variable).

## Documentación adicional

- `docs/ARQUITECTURA.md`: resumen técnico, diseño y modelos.
- `docs/HOJA_DE_RUTA.md`: doce fases, criterios, estados y dependencias.
- `docs/MANUAL_ADMIN.md`: manual inicial de las funciones implementadas.
- `docs/GUIA_INICIO_SESION.md`: instrucciones para probar acceso y cuenta del administrador en Windows y mediante túnel temporal.
