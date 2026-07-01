# ITESO — Tecnologías de Desarrollo en el Servidor
## Definición Proyecto Integrador

---

## Nombre del Proyecto

**WellSync**

---

## Descripción

WellSync es una aplicación web enfocada en el servidor que permite a los usuarios construir y mantener un estilo de vida saludable integral. A través de una sola plataforma, los usuarios pueden registrar y dar seguimiento a sus hábitos diarios de salud como hidratación, sueño, meditación y bienestar mental, así como planificar y ejecutar rutinas de entrenamiento personalizadas.

La app web permite crear rutinas de ejercicio compuestas por múltiples ejercicios, asociarlas a fechas y horarios específicos, marcar su progreso y agregar notas personales sobre cada sesión. Además, cuenta con un sistema de rachas, logros y un registro de nivel de energía diario que ayuda al usuario a correlacionar sus hábitos con su rendimiento físico y mental.

El proyecto estará desarrollado con Node.js siguiendo el patrón de diseño MVC, con autenticación segura mediante JWT y Google OAuth, comunicación en tiempo real con Socket.io, y almacenamiento de archivos en la nube con Cloudinary.

---

## Integrantes

- Camila Briseño García
- Luis Alfonso Acosta Ortiz

---

> ### Tipos de Usuario (Roles y Permisos)
>
> A continuación se presentan los distintos tipos de usuario que manejará la aplicación, además de la autenticación basada en JWT ya contemplada:
>
> | Rol | Descripción | Permisos |
> |---|---|---|
> | **Usuario** | Rol por defecto al registrarse. Es el perfil principal de la aplicación. | Crear, editar y eliminar sus propios hábitos, rutinas, ejercicios y registros de energía. Ver su propio historial, rachas y logros. Subir su foto de perfil. |
> | **Administrador** | Rol con fines de mantenimiento y soporte de la plataforma. | Revisar y dar seguimiento a reportes/tickets enviados por usuarios (ej. errores, contenido inapropiado, fallos en la plataforma). Consultar métricas generales de uso de la app, como usuarios activos en los últimos 7 días o el hábito más popular entre la comunidad (sin acceso a datos sensibles de salud de los usuarios). |
>
> El control de acceso a las rutas de la API se hará mediante el rol incluido como claim dentro del JWT, validado en un middleware de autorización antes de llegar a cada controlador.

---

## Stack de Tecnologías

### Backend

| Tecnología | Descripción |
|---|---|
| Node.js + Express.js | Framework base del servidor y manejo de rutas REST. |
| JWT (jsonwebtoken) | Autenticación segura de rutas y manejo de sesiones. |
| Google OAuth | Implementación de Google OAuth para inicio de sesión con Google. |
| Socket.io | Comunicación en tiempo real para notificaciones y logros desbloqueados. |
| Multer | Middleware para manejo y subida de archivos al servidor. |

### Base de datos

| Tecnología | Descripción |
|---|---|
| MongoDB | Base de datos principal NoSQL para persistencia de datos. |
| Mongoose | ODM (Object Document Mapper) para modelado y validación de datos. |

### Frontend

| Tecnología | Descripción |
|---|---|
| Astro | Framework frontend que consume la REST API del backend. Se despliega de forma independiente. |

---

## Servicios de Terceros (APIs externas)

| Tecnología | Descripción |
|---|---|
| Google OAuth | Inicio de sesión con cuenta de Google mediante Passport.js. |
| ExerciseDB API | Catálogo gratuito de más de 11,000 ejercicios con imágenes, músculos trabajados e instrucciones. |
| CalorieNinjas API | API gratuita de nutrición con más de 100,000 alimentos para sugerencias de dieta. |
| Cloudinary | Almacenamiento de imágenes y archivos del usuario en la nube. |

---

## Proyectos Similares y Referencias

| App | ¿Qué hace? | ¿Qué le falta vs. nuestro proyecto? |
|---|---|---|
| Strava | Seguimiento de actividad física y rutas outdoor. | No tiene seguimiento de hábitos diarios ni registro de nivel de energía. |
| Habitica | Gamificación de hábitos diarios con sistema RPG. | No incluye rutinas de entrenamiento personalizadas con notas. |
| MyFitnessPal | Seguimiento de nutrición y ejercicio general. | No permite crear rutinas propias con notas personales por ejercicio. |

Ninguna de las aplicaciones anteriores combina en un solo lugar el seguimiento de hábitos de salud integral, rutinas de entrenamiento personalizadas con notas por sesión, registro de nivel de energía diario y un sistema de logros y rachas. Esa combinación representa la propuesta de valor única de nuestro proyecto.

---

> ### Riesgos del Proyecto
>
> En esta sección dentifican a continuación los principales riesgos detectados para el desarrollo y operación de WellSync:
>
> | Riesgo | Descripción |
> |---|---|
> | **Dependencia de APIs gratuitas** | Servicios como CalorieNinjas o ExerciseDB pueden presentar caídas de servicio, cambios en su disponibilidad o discontinuación al ser planes gratuitos. |
> | **Seguridad de datos sensibles** | La app maneja datos personales de salud (energía, hábitos, bienestar mental), lo cual requiere especial cuidado en su almacenamiento y acceso. |

---
