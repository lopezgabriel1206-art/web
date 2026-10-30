# Manual inicial para el administrador de CHEFELPI (v0.2)

## Iniciar sesión

Abrí `/admin/login`, ingresá el usuario `enriquevalladares` y la contraseña creada con `npm run db:seed` y presioná **Entrar al panel**. Desde el pie de página pública existe un enlace **Administración**. No existe registro público ni usuarios visitantes. La cuenta administrativa se inicializa una sola vez mediante `npm run db:seed` en el servidor.

## Cambiar la contraseña

Accedé al apartado **Mi cuenta**. Ingresá la contraseña actual, elegí una nueva de al menos 14 caracteres y confirmala. Se invalidan las demás sesiones. Después de guardar, la sesión del navegador actual se renueva.

## Cerrar sesión

En el menú del panel, presioná **Cerrar sesión**. Esto revoca la sesión almacenada en PostgreSQL.

## Administrar contenidos implementados

- **Categorías:** crear/eliminar categorías (los platos de una categoría eliminada no se borran).
- **Comidas:** registrar, publicar, ocultar y eliminar platos. La edición completa posterior todavía está pendiente.
- **Opiniones:** moderar reseñas recibidas, que comienzan en estado pendiente.
- **Configuración:** cambiar WhatsApp, correo público y moneda.

## Pendientes

El resto del panel solicitado en el prompt maestro (editor visual, biblioteca de medios, libros PDF privados, promociones, videos, backups y notificaciones completas) aún no está listo. No se debe considerar este incremento como el proyecto final.

## Ayuda de instalación

Ver `docs/GUIA_INICIO_SESION.md` para instrucciones exactas en Windows, PostgreSQL y Cloudflare.
