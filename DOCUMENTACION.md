# Documentación Backend — WellSync

> Plataforma de bienestar personal para gestionar hábitos, entrenamientos, registros diarios y más.
> ITESO — Desarrollo de Tecnologías en el Servidor

---

## 1. Descripción del Proyecto

WellSync es una aplicación web de bienestar que permite a los usuarios:

- Gestionar hábitos diarios con metas personalizables
- Registrar entrenamientos con ejercicios, series y repeticiones
- Llevar un registro diario de nivel de energía y hábitos completados
- Visualizar logros y recibir notificaciones en tiempo real
- Buscar ejercicios y calcular calorías quemadas mediante APIs externas
- Iniciar sesión con correo electrónico o Google OAuth
- Subir una foto de perfil almacenada en la nube

El backend expone una API REST documentada con Swagger, utiliza MongoDB como base de datos y está construido con Node.js, Express y TypeScript.

---

## 2. Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| Node.js | 24.x | Entorno de ejecución |
| TypeScript | 5.5 | Tipado estático |
| Express | 4.19 | Framework web |
| MongoDB / Mongoose | 8.5 | Base de datos NoSQL / ODM |
| Socket.io | 4.8 | Comunicación en tiempo real |
| JWT (jsonwebtoken) | 9.0 | Autenticación por tokens |
| bcrypt | 6.0 | Hash de contraseñas |
| Multer | 2.2 | Subida de archivos |
| Cloudinary SDK | 2.10 | Almacenamiento de imágenes en la nube |
| Swagger | 6.x | Documentación de API |
| Jest | 30.x | Pruebas unitarias |
| esbuild | 0.28 | Bundler para producción |
| pnpm | 10.29 | Gestor de paquetes |

---

## 3. Arquitectura

El backend sigue una arquitectura por capas:

```
Cliente (Frontend)
      ↓  HTTP / WebSocket
   [Routes]
      ↓
 [Middlewares]  ← autenticación, validación, subida de archivos
      ↓
 [Controllers]  ← reciben request, delegan a services
      ↓
  [Services]    ← lógica de negocio
      ↓
  [Models]      ← Mongoose schemas
      ↓
   MongoDB
```

Además, se integran APIs externas en la capa de config:

```
  [Services]
      ↓
  [Config]      ← Axios/Cloudinary/SMTP
      ↓
  APIs externas → Google OAuth, ExerciseDB, Calories Burned, Cloudinary, Gmail SMTP
```

### Flujo de datos para una petición típica

```
Request → Router → Middleware authenticate (JWT) → Validator → Controller → Service → Model → Response
```

---

## 4. Modelos de Datos

### 4.1 Usuario (`usuario.model.ts`)

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | String (requerido) | Nombre del usuario |
| `email` | String (único, requerido) | Correo electrónico |
| `password` | String (mín. 6) | Contraseña (opcional si usa Google) |
| `googleId` | String | ID de Google OAuth |
| `fotoPerfil` | String | URL de la foto de perfil (Cloudinary) |
| `resetPasswordToken` | String | Token de recuperación |
| `resetPasswordExpires` | Date | Expiración del token |
| `rol` | Enum: `usuario` / `administrador` | Rol del usuario |
| `fechaRegistro` | Date (default: now) | Fecha de creación |

**Hook**: `pre('save')` hashea la contraseña con bcrypt (salt rounds: 10).  
**Método**: `comparePassword(password)` — verifica la contraseña contra el hash.

### 4.2 Hábito (`habito.model.ts`)

| Campo | Tipo | Descripción |
|---|---|---|
| `usuario` | ObjectId (ref: Usuario) | Dueño del hábito |
| `nombre` | String (requerido) | Nombre del hábito |
| `categoria` | String (requerido) | Categoría |
| `metaDiaria` | String (requerido) | Meta diaria |
| `horarioRecordatorio` | String | Hora de recordatorio |
| `activo` | Boolean (default: true) | Estado activo/inactivo |
| `fechaCreacion` | Date (default: now) | Fecha de creación |

**Índice**: `usuario`

### 4.3 Registro Diario (`registroDiario.model.ts`)

| Campo | Tipo | Descripción |
|---|---|---|
| `usuario` | ObjectId (ref: Usuario) | Dueño del registro |
| `fecha` | String (requerido) | Fecha del registro |
| `nivelEnergia` | Number (1-5) | Nivel de energía |
| `habitosCompletados` | Array de subdocumentos | Hábitos marcados como completados |

**Subdocumento `IHabitoCompletado`**: `{ habito: ObjectId, completado: Boolean }`

### 4.4 Entrenamiento (`entrenamiento.model.ts`)

| Campo | Tipo | Descripción |
|---|---|---|
| `usuario` | ObjectId (ref: Usuario) | Dueño del entrenamiento |
| `fecha` | String (requerido) | Fecha del entrenamiento |
| `hora` | String (requerido) | Hora del entrenamiento |
| `estado` | Enum: `pendiente` / `completado` | Estado |
| `notasGenerales` | String | Notas opcionales |
| `ejercicios` | Array de subdocumentos | Ejercicios realizados |

**Subdocumento `IEjercicio`**: `{ exerciseId, nombre, series, repeticiones, peso, completado, notaPersonal }`

### 4.5 Logro (`logro.model.ts`)

| Campo | Tipo | Descripción |
|---|---|---|
| `usuario` | ObjectId (ref: Usuario) | Dueño del logro |
| `tipo` | String (requerido) | Tipo de logro |
| `habitoRelacionado` | ObjectId (ref: Hábito) | Hábito relacionado (opcional) |
| `fechaObtenido` | Date (default: now) | Fecha de obtención |

### 4.6 Reporte (`reporte.model.ts`)

| Campo | Tipo | Descripción |
|---|---|---|
| `usuario` | ObjectId (ref: Usuario) | Creador del reporte |
| `tipo` | String (requerido) | Tipo de reporte |
| `descripcion` | String (requerido) | Descripción |
| `estado` | Enum: `abierto` / `en_proceso` / `resuelto` | Estado |
| `fechaCreacion` | Date (default: now) | Fecha de creación |

### 4.7 Notificación (`notificacion.model.ts`)

| Campo | Tipo | Descripción |
|---|---|---|
| `usuario` | ObjectId (ref: Usuario) | Destinatario |
| `tipo` | String | Tipo de notificación |
| `mensaje` | String (requerido) | Contenido |
| `leida` | Boolean (default: false) | Estado de lectura |
| `fecha` | Date (default: now) | Fecha de emisión |
| `referenciaId` | ObjectId | ID del recurso relacionado |

---

## 5. Endpoints de la API

La API se encuentra en `http://localhost:3000/api` y está documentada con Swagger en `http://localhost:3000/api/docs`.

### 5.1 Usuarios — `/api/usuarios`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/login` | — | Iniciar sesión (email + password) |
| `POST` | `/google` | — | Iniciar sesión con Google (idToken) |
| `POST` | `/` | — | Registrar nuevo usuario |
| `POST` | `/forgot-password` | — | Solicitar recuperación de contraseña |
| `POST` | `/reset-password` | — | Restablecer contraseña con token |
| `GET` | `/` | Admin | Obtener todos los usuarios |
| `GET` | `/:id` | Usuario/Admin | Obtener usuario por ID |
| `PUT` | `/:id` | Usuario/Admin | Actualizar usuario |
| `POST` | `/:id/foto-perfil` | Usuario/Admin | Subir foto de perfil (multipart) |
| `DELETE` | `/:id` | Admin | Eliminar usuario |

### 5.2 Hábitos — `/api/habitos`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/` | Sí | Obtener todos los hábitos del usuario |
| `GET` | `/:id` | Sí | Obtener hábito por ID |
| `POST` | `/` | Sí | Crear nuevo hábito |
| `PUT` | `/:id` | Sí | Actualizar hábito |
| `DELETE` | `/:id` | Sí | Eliminar hábito |

### 5.3 Registros Diarios — `/api/registros-diarios`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/` | Sí | Obtener todos los registros del usuario |
| `GET` | `/:id` | Sí | Obtener registro por ID |
| `POST` | `/` | Sí | Crear nuevo registro diario |
| `PUT` | `/:id` | Sí | Actualizar registro diario |
| `DELETE` | `/:id` | Sí | Eliminar registro diario |

### 5.4 Entrenamientos — `/api/entrenamientos`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/` | Sí | Obtener todos los entrenamientos |
| `GET` | `/:id` | Sí | Obtener entrenamiento por ID |
| `POST` | `/` | Sí | Crear nuevo entrenamiento |
| `PUT` | `/:id` | Sí | Actualizar entrenamiento |
| `DELETE` | `/:id` | Sí | Eliminar entrenamiento |

### 5.5 Logros — `/api/logros`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/` | Sí | Obtener todos los logros |
| `GET` | `/:id` | Sí | Obtener logro por ID |
| `POST` | `/` | Sí | Crear nuevo logro |
| `PUT` | `/:id` | Sí | Actualizar logro |
| `DELETE` | `/:id` | Sí | Eliminar logro |

### 5.6 Reportes — `/api/reportes`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/` | Sí | Obtener todos los reportes |
| `GET` | `/:id` | Sí | Obtener reporte por ID |
| `POST` | `/` | Sí | Crear nuevo reporte |
| `PUT` | `/:id` | Sí | Actualizar reporte |
| `DELETE` | `/:id` | Sí | Eliminar reporte |

### 5.7 Notificaciones — `/api/notificaciones`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/` | Sí | Obtener todas las notificaciones |
| `PATCH` | `/leer-todas` | Sí | Marcar todas como leídas |
| `PATCH` | `/:id/leer` | Sí | Marcar una notificación como leída |

### 5.8 Ejercicios (ExerciseDB) — `/api/ejercicios`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/buscar?search=:query` | Sí | Buscar ejercicios por nombre |
| `GET` | `/` | Sí | Listar ejercicios con filtros |
| `GET` | `/:exerciseId` | Sí | Obtener detalle de un ejercicio |

**Parámetros de filtro**: `name`, `bodyParts`, `equipments`, `targetMuscles`, `limit`

### 5.9 Calorías (Calories Burned) — `/api/calorias`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/calcular?activity=:act&weight=:kg&duration=:min` | Sí | Calcular calorías quemadas |

### 5.10 Documentación — `/api/docs`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/` | — | Interfaz Swagger UI con la documentación completa de la API |

> **Total: 37 endpoints** (2 públicos de auth, 2 públicos de recuperación, 33 protegidos)

---

## 6. Autenticación y Autorización

### 6.1 JWT (JSON Web Token)

El sistema utiliza JWT para autenticar a los usuarios. El flujo es:

1. El usuario inicia sesión (`POST /api/usuarios/login`) con email y contraseña, o con Google (`POST /api/usuarios/google`)
2. El servidor valida las credenciales y genera un token JWT con la carga útil `{ id, rol }`
3. El frontend almacena el token y lo envía en cada petición protegida mediante el header `Authorization: Bearer <token>`

### 6.2 Middleware `authenticate`

- Extrae el token del header `Authorization`
- Verifica el token con `jwt.verify()` usando la clave secreta (`JWT_SECRET`)
- Si es válido, adjunta `req.usuario` con `{ id, rol }` a la petición
- Si no hay token o es inválido, responde con **401 Unauthorized**

### 6.3 Middleware `authorize`

- Recibe uno o más roles permitidos (`authorize('administrador')` o `authorize('usuario', 'administrador')`)
- Verifica que `req.usuario.rol` esté incluido en los roles permitidos
- Si no coincide, responde con **403 Forbidden**

### 6.4 Google OAuth

- El frontend obtiene un `idToken` de Google mediante la librería de Google Identity Services
- Envía el `idToken` al backend en `POST /api/usuarios/google`
- El backend verifica el token con `google-auth-library` (OAuth2Client)
- Si el usuario ya existe con ese `googleId`, inicia sesión
- Si el correo ya está registrado pero sin Google, vincula la cuenta
- Si no existe, crea un nuevo usuario
- Devuelve un JWT de sesión

---

## 7. APIs Externas Integradas

### 7.1 Google OAuth

- **Propósito**: Autenticación sin contraseña mediante cuenta de Google
- **Librería**: `google-auth-library` (OAuth2Client)
- **Flujo**: Token-based (el frontend envía el `idToken`, el backend lo verifica)
- **Config**: `GOOGLE_CLIENT_ID`
- **Archivo**: `src/config/google.ts`

### 7.2 ExerciseDB (RapidAPI)

- **Propósito**: Base de datos de ejercicios con imágenes y videos
- **Endpoint base**: `https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com`
- **Autenticación**: `X-RapidAPI-Key` + `X-RapidAPI-Host`
- **Funcionalidades**: búsqueda por nombre, filtros por parte del cuerpo/equipo/músculo, detalle por ID
- **Archivo**: `src/config/exercisedb.ts`, `src/services/ejercicios.service.ts`

### 7.3 Calories Burned (RapidAPI — API-Ninjas)

- **Propósito**: Calcular calorías quemadas según actividad, peso y duración
- **Endpoint base**: `https://calories-burned-by-api-ninjas.p.rapidapi.com`
- **Autenticación**: `X-RapidAPI-Key` + `X-RapidAPI-Host`
- **Endpoint**: `/v1/caloriesburned`
- **Archivo**: `src/config/calorias.ts`, `src/services/calorias.service.ts`

### 7.4 Cloudinary

- **Propósito**: Almacenamiento y entrega de fotos de perfil en la nube
- **Flujo**: Multer recibe el archivo en memoria → se sube a Cloudinary como base64 → se guarda la URL en MongoDB → la foto anterior se elimina automáticamente
- **Carpeta**: `wellsync/perfiles`
- **Formatos permitidos**: JPG, PNG, WEBP
- **Límite**: 2 MB por archivo
- **Archivo**: `src/config/cloudinary.ts`, `src/middlewares/upload.ts`

### 7.5 SMTP / Nodemailer

- **Propósito**: Envío de correos electrónicos para recuperación de contraseña
- **Servidor**: Gmail SMTP (`smtp.gmail.com:587`)
- **Autenticación**: App password
- **Archivo**: `src/config/email.ts`, `src/services/email.service.ts`

---

## 8. Middlewares

### 8.1 Autenticación (`auth.ts`)

- `authenticate` — verifica JWT y adjunta `req.usuario`
- `authorize(...roles)` — restringe acceso por rol

### 8.2 Subida de Archivos (`upload.ts`)

- Configura Multer con `memoryStorage()` (no guarda en disco)
- Acepta solo JPG, PNG, WEBP
- Límite de 2 MB
- Convierte errores de Multer a `AppError` para consistencia

### 8.3 Manejador de Errores Global (`middlewares.ts`)

- Captura cualquier error lanzado con `next(err)`
- Si es `AppError`, responde con su `statusCode` y `message`
- Si es un error no controlado, responde con **500 Internal Server Error** y un mensaje genérico

### 8.4 Validadores (`middlewares/validators/`)

Cada validador recolecta errores en un arreglo `string[]`:

| Archivo | Funciones | Valida |
|---|---|---|
| `usuario.validator.ts` | `validateCreateUsuario`, `validateUpdateUsuario`, `validateForgotPassword`, `validateResetPassword`, `validateGoogleLogin` | Nombre, email, contraseña, rol, token |
| `habito.validator.ts` | `validateCreateHabito`, `validateUpdateHabito` | Nombre, categoría, meta, booleano |
| `registroDiario.validator.ts` | `validateCreateRegistroDiario`, `validateUpdateRegistroDiario` | Fecha, nivel energía, ObjectId |
| `entrenamiento.validator.ts` | `validateCreateEntrenamiento`, `validateUpdateEntrenamiento` | Fecha, hora, estado, ejercicios |
| `logro.validator.ts` | `validateCreateLogro`, `validateUpdateLogro` | Tipo, fecha, ObjectId |
| `reporte.validator.ts` | `validateCreateReporte`, `validateUpdateReporte` | Tipo, descripción, estado |

Si hay errores, responden con **400 Bad Request** y el arreglo de errores. Si todo está bien, llaman a `next()`.

---

## 9. Pruebas Unitarias

### Configuración

- **Framework**: Jest 30.x con `ts-jest`
- **Entorno**: Node
- **Setup**: `src/test/setup.ts` — define variables de entorno para pruebas
- **Helpers**: `src/test/test-utils.ts` — `mockReq()` y `mockRes()` tipados

### Suites de prueba (12 suites, 104 tests)

| Archivo | Tests | Cobertura |
|---|---|---|
| `services/__tests__/usuario.service.test.ts` | 9 bloques | CRUD, login, Google OAuth, forgot/reset password |
| `middlewares/__tests__/auth.test.ts` | 2 bloques | authenticate (4 casos), authorize (4 casos) |
| `middlewares/__tests__/middlewares.test.ts` | 1 bloque | errorHandler (AppError, Error genérico) |
| `config/__tests__/jwt.test.ts` | 1 bloque | Lectura de variables de entorno |
| `types/__tests__/http-status.test.ts` | 1 bloque | Valores del enum HttpStatus |
| `utils/__tests__/utils.test.ts` | 1 bloque | AppError (statusCode, isOperational) |
| 6 validadores (`*validator.test.ts`) | 10 bloques | Validación de cada recurso |

**Mocking**: Las pruebas usan `jest.mock()` para simular Mongoose, `jsonwebtoken`, `google-auth-library` y el servicio de email.

---

## 10. Despliegue (Render)

### Build

```bash
pnpm build
# → Compila con esbuild. Genera dist/index.js
# → bcrypt está marcado como external (se resuelve desde node_modules)
```

### Start

```bash
pnpm start
# → node dist/index.js
```

### Variables de entorno requeridas

```
MONGO_URI=url de la base de datos
JWT_SECRET=clave_secreta_jwt
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=tu_id_de_google
EXERCISEDB_API_KEY=tu_rapidapi_key
EXERCISEDB_API_HOST=edb-with-videos-and-images-by-ascendapi.p.rapidapi.com
CALORIAS_API_KEY=tu_rapidapi_key
CALORIAS_API_HOST=calories-burned-by-api-ninjas.p.rapidapi.com
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_app_password
EMAIL_FROM=WellSync <tu_correo@gmail.com>
CORS_ORIGIN=*
```

### Comandos en el panel de Render

| Campo | Valor |
|---|---|
| Build Command | `pnpm build` |
| Start Command | `pnpm start` |
| Node Version | 20+ (LTS) |

> **Nota**: Las fotos de perfil se almacenan en Cloudinary, no en el disco del servidor. No hay riesgo de pérdida de imágenes al redeployar.

---

## 11. Configuración y Ejecución Local

### Prerrequisitos

- Node.js 20+
- pnpm 10+
- MongoDB (local o Atlas)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd BackendWellSync

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores correspondientes

# 4. Compilar
pnpm build

# 5. Iniciar servidor
pnpm start
```

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm start` | Inicia el servidor en producción |
| `pnpm dev` | Inicia con nodemon + hot reload |
| `pnpm build` | Compila TypeScript con esbuild |
| `pnpm test` | Ejecuta las pruebas unitarias |
| `pnpm lint` | Ejecuta ESLint |
| `pnpm format` | Formatea el código con Prettier |

### Seed

El archivo `src/seed.ts` crea un usuario administrador por defecto:

- **Email**: `admin@wellsync.com`
- **Password**: `admin123`

---

## 12. Estructura del Proyecto

```
src/
├── app.ts                    # Configuración de Express
├── index.ts                  # Punto de entrada del servidor
├── seed.ts                   # Seed de administrador
├── config/                   # Configuraciones
│   ├── db.ts                 # Conexión a MongoDB
│   ├── jwt.ts                # Configuración JWT
│   ├── google.ts             # Google OAuth
│   ├── exercisedb.ts         # Cliente ExerciseDB
│   ├── calorias.ts           # Cliente Calories Burned
│   ├── cloudinary.ts         # Configuración Cloudinary
│   ├── email.ts              # Transporte SMTP
│   └── swagger.ts            # Especificación OpenAPI
├── controllers/              # Manejadores de rutas
├── services/                 # Lógica de negocio
├── models/                   # Schemas de Mongoose (7 modelos)
├── routes/                   # Definición de rutas (9 archivos)
├── middlewares/              # Middlewares
│   ├── auth.ts               # JWT + roles
│   ├── upload.ts             # Multer + Cloudinary
│   ├── middlewares.ts        # Error handler
│   └── validators/           # Validadores de entrada
├── sockets/
│   └── sockets.ts            # Socket.io
├── types/
│   └── http-status.ts        # Códigos HTTP
├── utils/
│   └── utils.ts              # AppError
└── test/
    ├── setup.ts              # Configuración de Jest
    └── test-utils.ts         # Helpers de prueba
```

---

## 13. WebSockets (Socket.io)

El servidor utiliza Socket.io para notificaciones en tiempo real.

### Conexión

```js
const socket = io('http://localhost:3000', {
    auth: { token: 'jwt_token_aqui' },
});
```

### Eventos

| Evento | Dirección | Descripción |
|---|---|---|
| `connect` | Cliente → Servidor | Conexión autenticada |
| `notificacion` | Servidor → Cliente | Nueva notificación emitida |

Cada usuario se une a una sala con su ID, por lo que solo recibe sus propias notificaciones.

---

*Documentación generada el 20 de julio de 2026.*

[Volver al índice principal](README.md)