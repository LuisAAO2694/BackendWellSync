# WellSync — Guion para la demo de entrega

Script paso a paso para grabar la demo del CRUD funcionando. Cubre los 6 requisitos de la entrega:

- Conexión a base de datos
- Modelos de datos
- CRUD básico
- APIs REST
- Validaciones básicas
- Manejo de errores

---

## 0. Antes de grabar

Levanta el servidor en tu terminal:

```bash
pnpm dev
```

Espera a ver en pantalla:

```
Conectado a la BD correctamente
app is running in http://localhost:4000
```

> Esto ya demuestra el requisito de **conexión a base de datos**.

Ten Postman abierto (extensión de VS Code o app de escritorio).

**ID de usuario real que vas a usar** (ya existe en la BD, cópialo):

```
6a51aac731cc95dd9ad461de
```

> Cada vez que hagas un POST, copia el `_id` que te regresa la respuesta — lo vas a necesitar para el GET/PUT/DELETE de ese mismo documento.

---

## Parte 1 — CRUD completo de `reportes`

### 1. GET — listar todos

- Método: `GET`
- URL:

```
http://localhost:4000/api/reportes
```

- Send.
- Esperado: `200 OK`, un arreglo (vacío o con datos).

> Demuestra: **API REST**.

---

### 2. POST inválido — validación

- Método: `POST`
- URL:

```
http://localhost:4000/api/reportes
```

- Body → `raw` → dropdown en **JSON** (⚠️ no dejarlo en "JavaScript", si no el body no se interpreta):

```json
{}
```

- Send.
- Esperado: `400 Bad Request` con un arreglo `errors`.

> Demuestra: **validaciones básicas**.

---

### 3. POST válido — crear

- Método: `POST`
- URL:

```
http://localhost:4000/api/reportes
```

- Body → `raw` → `JSON`:

```json
{
  "usuario": "6a51aac731cc95dd9ad461de",
  "tipo": "bug",
  "descripcion": "La app se cierra al abrir el perfil"
}
```

- Send.
- Esperado: `200`, con un `_id` nuevo. **Cópialo.**

> Demuestra: **CRUD (create)** y **modelo de datos**.

---

### 4. GET por id — leer uno

- Método: `GET`
- URL (pega el `_id` copiado):

```
http://localhost:4000/api/reportes/PEGA_AQUI_EL_ID
```

- Send.
- Esperado: `200`, el documento completo.

> Demuestra: **CRUD (read)**.

---

### 5. PUT — actualizar

- Método: `PUT`
- URL:

```
http://localhost:4000/api/reportes/PEGA_AQUI_EL_ID
```

- Body → `raw` → `JSON`:

```json
{
  "estado": "en_proceso"
}
```

- Send.
- Esperado: `200`, con `"estado": "en_proceso"`.

> Demuestra: **CRUD (update)**.

---

### 6. GET a un id inexistente — manejo de errores

- Método: `GET`
- URL:

```
http://localhost:4000/api/reportes/000000000000000000000000
```

- Send.
- Esperado: `404 Not Found`:

```json
{
  "success": false,
  "error": { "message": "Reporte no encontrado", "statusCode": 404 }
}
```

> Demuestra: **manejo de errores**.

---

### 7. DELETE — borrar

- Método: `DELETE`
- URL:

```
http://localhost:4000/api/reportes/PEGA_AQUI_EL_ID
```

- Send.
- Esperado: `200`:

```json
{ "message": "Reporte eliminado correctamente" }
```

> Demuestra: **CRUD (delete)**.

---

## Parte 2 — Repetir el patrón en `logros` (para mostrar que se reutiliza en varios catálogos)

### 8. POST válido

- Método: `POST`
- URL:

```
http://localhost:4000/api/logros
```

- Body → `raw` → `JSON`:

```json
{
  "usuario": "6a51aac731cc95dd9ad461de",
  "tipo": "racha_7_dias"
}
```

- Send. Copia el `_id` nuevo.

### 9. PUT — actualizar

- Método: `PUT`
- URL:

```
http://localhost:4000/api/logros/PEGA_AQUI_EL_ID
```

- Body → `raw` → `JSON`:

```json
{
  "tipo": "racha_30_dias"
}
```

- Send. Esperado: `200`.

### 10. DELETE — limpiar

- Método: `DELETE`
- URL:

```
http://localhost:4000/api/logros/PEGA_AQUI_EL_ID
```

- Send. Esperado: `200`.

---

## Tips para grabar

- Narra en voz alta qué requisito estás mostrando en cada paso (ej. "aquí valido que el campo sea obligatorio...", "aquí manejo el error 404 sin que el servidor truene...").
- No olvides cambiar el dropdown de Body a **JSON** cada vez que mandes un `POST`/`PUT` — si se queda en "Text" o "JavaScript", el body llega vacío y da error 400 aunque los datos estén bien escritos.
- Al terminar, si quieres dejar la BD limpia, borra cualquier documento de prueba que no hayas eliminado durante la demo (`DELETE /api/reportes/:id`, `/api/logros/:id`, etc.).
