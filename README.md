# UniBooks — Backend

API REST para la plataforma **UniBooks**, un marketplace de libros universitarios de segunda mano. Construida con Node.js, Express y MongoDB.

El backend ya está desplegado y accesible en la siguiente URL

https://backend-goet.onrender.com
---

## Tecnologías

- **Node.js** v18+
- **Express** v5
- **MongoDB** + Mongoose
- **JWT** para autenticación
- **Cloudinary** para almacenamiento de imágenes
- **Nodemailer** para envío de correos
- **Socket.io**
- **Stripe** (integración en progreso)

---

## Requisitos previos

Antes de empezar asegurate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/)
- Una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (base de datos en la nube)
- Una cuenta en [Cloudinary](https://cloudinary.com/) (almacenamiento de imágenes)
- Una cuenta de correo Gmail o Outlook para el envío de emails

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Misael-g/Backend.git
cd Backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y completá con tus datos:

```bash
cp .env.example .env
```

Abre el archivo `.env` y completá cada variable (ver sección de Variables de entorno).

### 4. Crear el usuario administrador

Antes de usar el sistema por primera vez, ejecutá el script para crear el admin:

```bash
node src/seeds/crearAdmin.js
```

Esto crea un usuario con:
- **Email:** `admin@librosepn.com`
- **Password:** `Admin.1234`

> ⚠️ Cambia el email y la contraseña del admin que vienen configurados por defecto.

### 5. Iniciar el servidor

```bash
npm run dev

```

El servidor corre por defecto en `http://localhost:3000`.

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI_PRODUCTION` | URI de conexión a MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/unibooks` |
| `HOST_MAILTRAP` | Host SMTP para emails | `smtp.gmail.com` |
| `PORT_MAILTRAP` | Puerto SMTP | `587` |
| `USER_MAILTRAP` | Email remitente | `tucorreo@gmail.com` |
| `PASS_MAILTRAP` | Contraseña de aplicación del email | `xxxx xxxx xxxx xxxx` |
| `URL_BACKEND` | URL pública del backend | `https://tu-backend.onrender.com` |
| `URL_FRONTEND` | URL pública del frontend | `https://tu-app.vercel.app` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | `una-cadena-larga-y-aleatoria` |
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud en Cloudinary | `mi-cloud` |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary | `123456789` |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary | `abc123...` |

---

## Colección de Postman

En esta sección se encuentran las colecciones de Postman utilizadas para probar todos los endpoints de la API. 
Descarga los archivos .postman_collection.json 
para importarlos directamente en Postman mediante la opción Import.

[Administrador.postman_collection.json](https://github.com/user-attachments/files/28858171/Administrador.postman_collection.json)

[AutenticacionUsuarios.postman_collection.json](https://github.com/user-attachments/files/28858174/AutenticacionUsuarios.postman_collection.json)

[Busqueda Libros.postman_collection.json](https://github.com/user-attachments/files/28858178/Busqueda.Libros.postman_collection.json)

[Perfiles.postman_collection.json](https://github.com/user-attachments/files/28858184/Perfiles.postman_collection.json)

[Publicación Libros.postman_collection.json](https://github.com/user-attachments/files/28858189/Publicacion.Libros.postman_collection.json)


### Cómo importar

1. Abre **Postman**
2. Click en **Import** (arriba a la izquierda)
3. Arrastrá el archivo `(name).postman_collection.json` o seleccionalo desde tu computadora
4. Click en **Import**

La colección se organiza en 5 carpetas:

| Carpeta | Endpoints |
|---------|-----------|
| 🔐 AutenticacionUsuarios | Registro, Login, Recuperar contraseña |
| 👤 Perfiles | Ver perfil, Actualizar perfil, Cambiar contraseña |
| 📚 Publicación Libros | CRUD de publicaciones, cambio de estado |
| 🔍 Busqueda Libros | Búsqueda por título, categoría y precio |
| 🛡️ Administrador | Gestión de usuarios y publicaciones |

