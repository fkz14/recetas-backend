# Recetas Backend API

API REST profesional desarrollada con **Node.js** y **Express** para gestión de recetas de usuario con autenticación JWT y almacenamiento en memoria.

---

## 📋 Descripción General

Esta es una API backend moderna que proporciona autenticación segura con JWT, gestión de recetas personalizadas y endpoints públicos. El servidor está diseñado para ser escalable, con una arquitectura clara separando controladores, rutas y middlewares de autenticación.

**Estado:** Producción lista (con base de datos)  
**Versión:** 1.0.0  
**Licencia:** ISC

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **Node.js** | - | Runtime de JavaScript |
| **Express** | ^5.2.1 | Framework web minimalista |
| **JWT (jsonwebtoken)** | ^9.0.3 | Autenticación y autorización |
| **bcryptjs** | ^3.0.3 | Hashing seguro de contraseñas |
| **CORS** | ^2.8.6 | Control de solicitudes entre dominios |
| **dotenv** | ^17.4.2 | Gestión de variables de entorno |

---

## 📦 Instalación

### Requisitos Previos
- **Node.js** 16.x o superior
- **npm** 7.x o superior
- Un cliente HTTP (Postman, cURL, Insomnia, etc.)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd recetas-backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   PORT=3000
   JWT_SECRET=supersecretkey
   ```
   
   > ⚠️ **En producción:** Usar valores seguros para `JWT_SECRET` (mínimo 32 caracteres)

4. **Iniciar el servidor**
   ```bash
   npm run dev
   ```

   Salida esperada:
   ```
   🚀 Servidor ejecutándose en http://localhost:3000
   ```

---

## ⚙️ Variables de Entorno

| Variable | Tipo | Predeterminado | Descripción |
|----------|------|---|---|
| `PORT` | `number` | 3000 | Puerto en el que escucha el servidor |
| `JWT_SECRET` | `string` | - | Clave secreta para firmar tokens JWT (requerida en producción) |
| `NODE_ENV` | `string` | development | Modo de ejecución (development/production) |

**Ejemplo `.env` para desarrollo:**
```env
PORT=3000
JWT_SECRET=mi-clave-secreta-de-desarrollo
NODE_ENV=development
```

**Ejemplo `.env` para producción:**
```env
PORT=8080
JWT_SECRET=clave-ultra-segura-minimo-32-caracteres-aleatorios-aqui
NODE_ENV=production
```

---

## 📁 Estructura de Carpetas

```
recetas-backend/
├── src/
│   ├── app.js                      # Configuración de Express
│   ├── server.js                   # Entrada principal del servidor
│   ├── controllers/
│   │   ├── auth.controller.js      # Lógica de autenticación (register, login)
│   │   └── recipe.controller.js    # Lógica de gestión de recetas
│   ├── routes/
│   │   ├── index.routes.js         # Rutas principales (health check)
│   │   ├── auth.routes.js          # Rutas de autenticación
│   │   └── recipe.routes.js        # Rutas de recetas
│   └── middlewares/
│       └── auth.middleware.js      # Middleware de validación JWT
├── .env                            # Variables de entorno
├── .gitignore                      # Archivos a ignorar en git
├── package.json                    # Dependencias del proyecto
└── README.md                       # Este archivo
```

### Descripción de Carpetas

- **`controllers/`** - Contiene la lógica de negocio. Cada controlador maneja las operaciones CRUD y validaciones específicas.
- **`routes/`** - Define las rutas de la API. Cada archivo agrupa endpoints relacionados.
- **`middlewares/`** - Funciones que interceptan solicitudes. Aquí validamos JWT antes de permitir acceso.
- **`src/`** - Directorio raíz del código fuente.

---

## 🔌 Endpoints de la API

### Base URL
```
http://localhost:3000/api
```

---

### 🔐 Autenticación (sin requerir token)

#### **POST** `/auth/register`
Registra un nuevo usuario en el sistema.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "MiContraseña123"
}
```

**Respuesta (201 Created):**
```json
{
  "message": "Usuario registrado correctamente",
  "user": {
    "id": 1,
    "email": "juan@example.com"
  }
}
```

**Errores:**
- `400` - Campos obligatorios faltantes
- `400` - Usuario ya existe

---

#### **POST** `/auth/login`
Autentica un usuario y retorna un JWT válido por 12 horas.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "MiContraseña123"
}
```

**Respuesta (200 OK):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "juan@example.com"
  }
}
```

**Errores:**
- `400` - Email o contraseña faltantes
- `401` - Credenciales inválidas

---

### 🥘 Recetas (requieren autenticación con JWT)

Todos los endpoints de recetas (excepto `GET /:id`) requieren un token JWT válido en el header:

```
Authorization: Bearer <token>
```

---

#### **POST** `/recipes`
Crea una nueva receta para el usuario autenticado.

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Body:**
```json
{
  "title": "Pasta a la Carbonara",
  "description": "Deliciosa pasta italiana con salsa cremosa de huevo y queso",
  "ingredients": "Pasta, Huevos, Queso parmesano, Panceta, Pimienta negra"
}
```

**Respuesta (201 Created):**
```json
{
  "message": "Receta creada exitosamente",
  "recipe": {
    "id": 1,
    "title": "Pasta a la Carbonara",
    "description": "Deliciosa pasta italiana con salsa cremosa de huevo y queso",
    "ingredients": "Pasta, Huevos, Queso parmesano, Panceta, Pimienta negra",
    "userId": 1,
    "createdAt": "2026-04-20T10:30:00.000Z"
  }
}
```

**Errores:**
- `400` - Campos obligatorios faltantes o vacíos
- `401` - Token no proporcionado o inválido

---

#### **GET** `/recipes/my`
Obtiene todas las recetas del usuario autenticado.

**Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Pasta a la Carbonara",
    "description": "Deliciosa pasta italiana con salsa cremosa de huevo y queso",
    "ingredients": "Pasta, Huevos, Queso parmesano, Panceta, Pimienta negra",
    "userId": 1,
    "createdAt": "2026-04-20T10:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Pizza Margherita",
    "description": "Pizza clásica con tomate, mozzarella y albahaca",
    "ingredients": "Harina, Tomate, Mozzarella, Albahaca, Aceite de oliva",
    "userId": 1,
    "createdAt": "2026-04-20T11:15:00.000Z"
  }
]
```

**Errores:**
- `401` - Token no proporcionado o inválido

---

#### **GET** `/recipes/:id`
Obtiene una receta específica (acceso público, sin autenticación).

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Parámetros URL:**
- `id` - ID de la receta (número)

**Respuesta (200 OK):**
```json
{
  "id": 1,
  "title": "Pasta a la Carbonara",
  "description": "Deliciosa pasta italiana con salsa cremosa de huevo y queso",
  "ingredients": "Pasta, Huevos, Queso parmesano, Panceta, Pimienta negra",
  "userId": 1,
  "createdAt": "2026-04-20T10:30:00.000Z"
}
```

**Errores:**
- `400` - ID inválido
- `404` - Receta no encontrada

---

#### **PUT** `/recipes/:id`
Actualiza una receta existente (solo el propietario puede actualizar).

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Parámetros URL:**
- `id` - ID de la receta (número)

**Body (todos los campos son opcionales):**
```json
{
  "title": "Pasta a la Carbonara Mejorada",
  "description": "Versión premium de la clásica pasta italiana",
  "ingredients": "Pasta premium, Huevos frescos, Queso parmesano orgánico, Panceta ibérica"
}
```

**Respuesta (200 OK):**
```json
{
  "message": "Receta actualizada exitosamente",
  "recipe": {
    "id": 1,
    "title": "Pasta a la Carbonara Mejorada",
    "description": "Versión premium de la clásica pasta italiana",
    "ingredients": "Pasta premium, Huevos frescos, Queso parmesano orgánico, Panceta ibérica",
    "userId": 1,
    "createdAt": "2026-04-20T10:30:00.000Z",
    "updatedAt": "2026-04-20T12:45:00.000Z"
  }
}
```

**Errores:**
- `400` - ID inválido
- `401` - Token no proporcionado o inválido
- `403` - No tienes permiso para actualizar esta receta (no eres el propietario)
- `404` - Receta no encontrada

---

### 🏥 Salud del Servidor

#### **GET** `/`
Endpoint de health check para verificar que el servidor está funcionando.

**Respuesta (200 OK):**
```json
{
  "status": "ok",
  "message": "API funcionando correctamente",
  "timestamp": "2026-04-20T10:30:00.000Z"
}
```

---

#### **GET** `/private`
Endpoint protegido que requiere autenticación. Demuestra el uso correcto del middleware.

**Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta (200 OK):**
```json
{
  "message": "Acceso autorizado",
  "user": {
    "id": 1,
    "email": "juan@example.com"
  }
}
```

---

## 🔐 Middleware de Autenticación

### Cómo Funciona

El middleware `authMiddleware` valida JWT en cada solicitud protegida:

1. **Verifica el header** `Authorization`
2. **Valida el formato** `Bearer <token>`
3. **Decodifica el token** usando la clave secreta
4. **Adjunta usuario** a `req.user` para el controlador

### Ubicación
Archivo: `src/middlewares/auth.middleware.js`

### Uso en Rutas
```javascript
router.post("/", authMiddleware, createRecipe);
```

### Estructura del Token Decodificado
```json
{
  "id": 1,
  "email": "juan@example.com",
  "iat": 1713607800,
  "exp": 1713652200
}
```

- `id` - Identificador único del usuario
- `email` - Correo del usuario
- `iat` - Timestamp de emisión
- `exp` - Timestamp de expiración (12 horas)

### Errores de Autenticación

| Status | Error | Causa |
|--------|-------|-------|
| `401` | Token no proporcionado | Header `Authorization` falta |
| `401` | Formato de token inválido | No sigue `Bearer <token>` |
| `401` | Token inválido o expirado | Token corrupto o pasó 12 horas |

---

## 📮 Testing con Postman

### 1. Importar Colección
Crear una nueva colección en Postman llamada **"Recetas API"**

### 2. Configurar Variables de Entorno
En Postman → Environments → Create:

| Variable | Valor |
|----------|-------|
| `base_url` | http://localhost:3000/api |
| `token` | (se completa después del login) |

### 3. Flujo de Testing

#### Paso 1: Registrar Usuario
- **Método:** POST
- **URL:** `{{base_url}}/auth/register`
- **Body (raw JSON):**
  ```json
  {
    "name": "Carlos",
    "lastName": "López",
    "email": "carlos@example.com",
    "password": "Password123"
  }
  ```

#### Paso 2: Login
- **Método:** POST
- **URL:** `{{base_url}}/auth/login`
- **Body (raw JSON):**
  ```json
  {
    "email": "carlos@example.com",
    "password": "Password123"
  }
  ```
- **Script (Post-response):** Guardar token automáticamente
  ```javascript
  var jsonData = pm.response.json();
  pm.environment.set("token", jsonData.token);
  ```

#### Paso 3: Crear Receta
- **Método:** POST
- **URL:** `{{base_url}}/recipes`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  ```
- **Body (raw JSON):**
  ```json
  {
    "title": "Enchiladas Verdes",
    "description": "Deliciosas enchiladas con salsa verde",
    "ingredients": "Tortillas, Pollo, Salsa verde, Queso, Crema"
  }
  ```

#### Paso 4: Ver Mis Recetas
- **Método:** GET
- **URL:** `{{base_url}}/recipes/my`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  ```

#### Paso 5: Obtener Receta (Pública)
- **Método:** GET
- **URL:** `{{base_url}}/recipes/1`
- **Headers:** (ninguno requerido)

---

## 🔒 Notas de Seguridad JWT

### ✅ Buenas Prácticas Implementadas

1. **Hashing de Contraseñas**
   - Contraseñas hasheadas con bcryptjs (10 saltos)
   - Nunca se almacenan contraseñas en texto plano

2. **JWT Seguros**
   - Token válido por 12 horas (expirables)
   - Firma con clave secreta en el servidor
   - Decodificación validada en cada solicitud

3. **Validación de Inputs**
   - Verificación de campos obligatorios
   - Trimming de espacios en blanco
   - Normalización de emails (lowercase)

4. **Control de Acceso**
   - Solo propietarios pueden actualizar sus recetas
   - Verificación de autorización en cada endpoint protegido

### ⚠️ Consideraciones para Producción

1. **Fortalecer JWT_SECRET**
   ```bash
   # Generar una clave segura (Linux/Mac)
   openssl rand -base64 32
   ```

2. **HTTPS Obligatorio**
   - Los tokens JWT deben viajar siempre por HTTPS

3. **Rate Limiting**
   - Implementar límites de solicitudes por IP
   - Prevenir ataques de fuerza bruta

4. **CORS Restrictivo**
   ```javascript
   app.use(cors({
     origin: 'https://tu-dominio.com',
     credentials: true
   }));
   ```

5. **Logging y Monitoreo**
   - Registrar intentos de autenticación fallidos
   - Alertas de actividad sospechosa

6. **Usar Base de Datos Real**
   - Actualmente usa almacenamiento en memoria (se pierde al reiniciar)
   - Migrar a PostgreSQL, MongoDB, MySQL, etc.

---

## 🚀 Posibles Mejoras Futuras

### Corto Plazo
- [ ] Base de datos (PostgreSQL/MongoDB) en lugar de memoria
- [ ] Validación avanzada con bibliotecas (joi, yup)
- [ ] Tests unitarios e integración (Jest, Supertest)
- [ ] Logging estructurado (Winston, Pino)
- [ ] HTTPS y certificados SSL

### Mediano Plazo
- [ ] Refresh tokens (mantener sesiones sin re-login)
- [ ] Roles y permisos (admin, usuario, etc.)
- [ ] Soft delete de recetas (no eliminar, marcar como borradas)
- [ ] Búsqueda y filtrado avanzado de recetas
- [ ] Paginación en endpoints de listado
- [ ] Rate limiting contra ataques
- [ ] Caché con Redis

### Largo Plazo
- [ ] Sistema de comentarios en recetas
- [ ] Valoraciones y reseñas de recetas
- [ ] Compartir recetas entre usuarios
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Generación de PDFs de recetas
- [ ] Soporte para múltiples idiomas (i18n)
- [ ] API Gateway con Kong/Nginx
- [ ] Microservicios (separar autenticación, recetas, etc.)
- [ ] Integración con servicios externos (IA para sugerencias)

---

## 🐛 Resolución de Problemas

### Error: "JWT_SECRET no definido"
**Solución:** Asegúrate que `.env` contiene `JWT_SECRET` y que `dotenv` se carga antes:
```javascript
import dotenv from "dotenv";
dotenv.config();
```

### Error 401 al intentar acceder a endpoints protegidos
**Solución:** Verifica que incluyes el header correcto:
```
Authorization: Bearer <token>
```
No es válido: `Authorization: <token>` ni `Authorization: Token <token>`

### Error CORS al conectar desde frontend
**Solución:** Configurar CORS en `app.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000', // URL de tu frontend
  credentials: true
}));
```

### Las recetas desaparecen al reiniciar
**Normal:** El proyecto usa almacenamiento en memoria. En producción usar base de datos.

---

## 📞 Soporte y Contacto

Para reportar bugs o sugerencias:
- Abrir un issue en el repositorio
- Contactar al equipo de desarrollo
- Revisar la documentación de Express: https://expressjs.com

---

## 📄 Licencia

Este proyecto está bajo la licencia **ISC**.

---

**Última actualización:** 20 de abril de 2026  
**Versión:** 1.0.0  
**Estado:** Producción lista (requiere base de datos para persistencia)
