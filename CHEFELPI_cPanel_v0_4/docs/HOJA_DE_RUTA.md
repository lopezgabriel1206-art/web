# CHEFELPI — Plan de desarrollo y verificaciones

Estado al entregar v0.1: **implementado en código** no significa **probado contra Next/PostgreSQL**, porque el entorno de elaboración no dispone de acceso a npm ni una instancia PostgreSQL. Las únicas pruebas ejecutadas satisfactoriamente son las unitarias puras de WhatsApp.

| Fase | Entregable / dependencia | Criterio de aceptación | Estado v0.1 |
|---|---|---|---|
| 1. Preparación y arquitectura | Esqueleto, TypeScript, Prisma, variables, documentación. | `npm install`, migración y `npm run build` sin errores en entorno conectado. | Archivos creados; **instalación y build pendientes**. |
| 2. Sistema de diseño | Paleta, logo, componentes, tema claro/oscuro. | Estilos y foco correctos en rutas y ambos temas. | Código inicial; QA visual pendiente. |
| 3. Navegación y estructura pública | Menú superior, submenús, barra inferior móvil, rutas. | Cada enlace navega a la ruta y funciona con teclado/tacto. | Código inicial; QA navegador pendiente. |
| 4. BD y administración segura | Migraciones, administrador único, sesión, escritorio, configuración. | Acceso negado sin sesión; persistencia tras reinicio. | Sesiones, login, logout y cambio de contraseña en código; instalación y prueba integrada de BD pendientes. |
| 5. Comidas y WhatsApp | CRUD completo, categorías, pedidos, zonas. | Alta, edición, búsqueda, filtro y mensajes correctos. | Crear/publicar/eliminar, búsqueda/filtro y formularios; edición y entregas pendientes. |
| 6. Libros PDF | CRUD libros, muestras, custodia privada. | Solo muestra autorizada pública; PDF completo inaccesible. | Modelos, catálogo, detalle y mensajes; admin/almacenamiento pendiente. |
| 7. Videos y redes | Gestión, embeds autorizados, APIs condicionales. | URLs válidas, fallback manual y métricas verificadas. | Modelos, galería y enlaces configurables en BD; panel/sync pendiente. |
| 8. Opiniones y promociones | Entrada, moderación, vigencias, panel de promociones. | Reseñas no aprobadas ocultas; promociones vencidas no visibles. | API reseñas/moderación, filtros de vigencia; CRUD de promos pendiente. |
| 9. Editor y multimedia | D&D, guardar borradores, preview, versiones, storage. | La publicación requiere confirmación; recuperación funciona. | Solo modelos; funcionalidad pendiente. |
| 10. Notificaciones | Eventos reales, estados persistentes, deduplicación. | Los avisos existen por evento y pueden marcarse leídos. | Se crea evento al recibir reseña; interfaz/lectura pendiente. |
| 11. Calidad | Pruebas E2E, accesibilidad, seguridad, rendimiento. | Suite verde + revisión manual desktop/móvil. | 2 pruebas unitarias de WhatsApp aprobadas; faltan E2E, build, auditorías. |
| 12. Publicación y documentación | Manual, variables, backups, servidor/dominio. | Despliegue reproducible y recuperación probada. | Guías iniciales; despliegue final pendiente. |

## Dependencias entre fases

1 → 2 y 3. Fase 4 habilita 5, 6, 7, 8, 9 y 10. La fase 9 depende también de los modelos y flujos de las fases 5 a 8. La fase 11 valida el conjunto, y la 12 documenta y prepara la publicación.

## E. Material y accesos pendientes

- Fotografías oficiales y archivo de logo de alta calidad (idealmente SVG o PNG sin artefactos de captura).
- Datos biográficos autorizados de Chefelpi y descripción comercial definitiva.
- Menú real: nombres, ingredientes, porciones, fotos, precios, disponibilidad, información verificada de alérgenos.
- Recetarios completos privados, portadas, muestras autorizadas, descripciones y precios.
- Zonas de entrega, días/horarios, costos, condiciones y políticas de cancelación.
- Número **confirmado** de WhatsApp con prefijo internacional, correo y enlaces oficiales de redes.
- Publicaciones y videos verificados; credenciales/permisos OAuth de API sociales si se quiere automatización de popularidad.
- Reseñas auténticas con consentimiento; promociones reales con vigencias.
- Hosting Node + base PostgreSQL + almacenamiento privado de archivos y copias de seguridad.
- Dominio, HTTPS, cuenta administrativa e identidad de la persona que deberá operar y mantener la plataforma.

## Próximo incremento recomendado

Instalar dependencias, levantar PostgreSQL, ejecutar migraciones y semilla, correr pruebas manuales y compilación; corregir lo observado antes de ampliar módulos. Después implementar CRUD completo de comidas, zonas y libros, con almacenamiento privado seguro.
