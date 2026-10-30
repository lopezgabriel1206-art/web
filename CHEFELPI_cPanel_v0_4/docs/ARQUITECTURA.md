# CHEFELPI — Arquitectura técnica (v0.1)

Documento de diseño del primer incremento, basado en el prompt maestro v4.0 del proyecto.

## A. Interpretación de requisitos

CHEFELPI no es una página de enlaces ni una landing estática. Es una aplicación comercial multipágina con visitantes anónimos, consultas por WhatsApp y administración exclusiva del titular.

Reglas de dominio invariables:

1. Sin usuarios públicos, carritos ni cobros online. Abrir WhatsApp **no** confirma un pedido.
2. Platos, precios, entregas, datos de contacto, promociones y reseñas deben proceder de datos reales o quedar pendientes. La ausencia de contenido no se rellena con datos ficticios.
3. Los libros completos de pago nunca deben exponerse en URLs ni respuestas públicas. Muestras autorizadas serán recursos distintos.
4. Opiniones enviadas por visitantes se guardan pendientes y requieren aprobación.
5. Las referencias son inspiraciones visuales; ni Amazon ni eBay están aprobados.
6. Todas las operaciones privadas exigen comprobación **en el servidor**, no solo ocultar botones.
7. El panel visual completo, archivos, sincronizaciones sociales y notificaciones programadas se desarrollarán por incrementos posteriores: un modelo de datos no equivale a una funcionalidad terminada.

## B. Arquitectura propuesta

Stack seleccionado: Next.js 16 (App Router), React 19, TypeScript, Tailwind 4 con tokens CSS propios, Prisma ORM 6.19 y PostgreSQL 17. Tailwind se reserva para futuras utilidades y el diseño base se encuentra en `src/app/globals.css` para conservar los tokens y el control fino de la identidad visual. El pin de Prisma 6.19 responde a su configuración clásica, más simple de migrar en la primera entrega; reevaluar compatibilidad y actualizaciones antes de producción.

```
src/
  app/                       Páginas, metadatos, sitemap, robots y API
    api/auth/                Autenticación y cierre de sesión
    api/admin/               Mutaciones autenticadas
    api/opiniones/            Entrada pública moderada
    admin/                   Panel y pantallas privadas
    comidas/, libros/, ...   Páginas y fichas públicas
  components/
    site/                    Cabecera, pie, tarjetas y catálogos
    forms/                   Formularios públicos
    admin/                   Edición y moderación privadas
  lib/
    auth.ts                  Sesiones HTTP-only y origen
    db.ts                    Instancia Prisma
    content.ts               Consultas públicas y filtros por publicación
    whatsapp-core.mjs        Lógica portable y verificable sin framework
    utils.ts                 Formatos, slugs y validación de URLs
prisma/
  schema.prisma              Modelos y relaciones
  seed.ts                    Inicialización de único usuario administrador por nombre de usuario
public/images/              Fotografía recortada del logotipo proporcionado
docs/                        Arquitectura, roadmap, instrucciones
```

### Separación de responsabilidades

- **UI pública:** muestra únicamente registros publicados. Mantiene estados vacíos para contenido aún no suministrado.
- **API administrativa:** valida sesión, origen, payload, y hace operaciones de base de datos.
- **Datos:** Prisma centraliza modelos y consultas. Nunca se guarda información de negocios directamente en JSX.
- **Sesiones:** token aleatorio de 256 bits en cookie HTTP-only/SameSite, hash SHA-256 del token en base de datos y caducidad. Contraseña con bcrypt. Límite básico de fallos por cuenta.
- **WhatsApp:** mensajes contextuales codificados en `wa.me`, sin crear reservas u órdenes confirmadas.
- **Multimedia privada:** modelo `MediaAsset` y referencia `Book.privateFileKey` previstos; el almacenamiento privado todavía **no** está implementado. No subir ni distribuir libros completos con esta versión.
- **Editor visual:** modelos `PageBlock` y `PageVersion` previstos; el editor visual y los borradores automáticos requieren lógica de publicación y edición en una fase futura.

### Modelos

- Identidad y seguridad: `AdminUser`, `AdminSession`, `LoginAttempt`.
- Configuración: `SiteSetting`.
- Cocina: `Category`, `Dish`, `DeliveryZone`.
- Recetarios: `Book`, `BookPreview`.
- Contenido: `Video`, `SocialLink`, `Promotion`, `Review`.
- Sistema futuro: `MediaAsset`, `PageBlock`, `PageVersion`, `Notification`.

### Riesgos y decisiones abiertas

- El número de WhatsApp visible en la **captura** no se ha usado como número definitivo.
- El logo disponible es una fotografía/captura, no un logo PNG/SVG original de calidad. Se recortaron solo elementos ajenos a la imagen de marca. Pedir un archivo original limpio para producción.
- La página de referencia `https://chefelpi.carrd.co/` no pudo abrirse durante este trabajo. No se atribuyen a ella contenidos no verificados.
- Precios almacenados en centésimos de unidad, con código de moneda **configurable**. Sin moneda configurada, el sitio no asume ARS, VES ni USD; impuestos, condiciones de compra y país operativo deben confirmarse antes del lanzamiento.
- Una app Next con API/BD **no admite exportación 100 % estática** manteniendo la funcionalidad privada. Preparada para despliegue Node (`output: standalone`) y PostgreSQL.
- Datos de IP de formularios requieren configuración correcta de proxy de confianza en producción; límites y protección antispam requieren revisión adicional.
- No hay pruebas de acceso concurrente, cargas, backups restaurados o auditoría profesional de seguridad todavía.

## D. Criterios de aceptación globales

Una función se marca **verificada** solamente después de comprobarse con datos reales de prueba en un entorno ejecutándose con la base de datos. Una ruta que existe sin persistencia validada es solo **implementada en código**. Se documentarán pruebas automáticas, manuales y cualquier fallo.

Pruebas prioritarias: iniciar/cerrar sesión, intentos de login, alta/baja/publicación, formulario WhatsApp con número real configurado, recepción de reseñas pendiente, aprobación, filtrado, accesos no autorizados, vistas móvil y escritorio, modo oscuro, DB persistente tras reinicio, PDF privado no descargable.
