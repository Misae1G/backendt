// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'
import fileUpload from 'express-fileupload'

// Importar rutas
import routerUsuarios from './routers/usuario_routes.js'
import routerPublicaciones from './routers/publicacion_routes.js'
import routerAdmin from './routers/admin_routes.js'

// Inicializaciones
const app = express()
dotenv.config()

// Configuración Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Middlewares
app.use(express.json())
app.use(cors({
    origin: process.env.URL_FRONTEND,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// ⚠️ CAMBIO CLAVE: useTempFiles: false → usa memoria (compatible con Vercel)
app.use(fileUpload({
    useTempFiles: false,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
}))

// Variables globales
app.set('port', process.env.PORT || 3000)

// Ruta principal
app.get('/', (req, res) => res.send("Server on - UniBooks"))

// Rutas
app.use('/api', routerUsuarios)
app.use('/api', routerPublicaciones)
app.use('/api', routerAdmin)

// Manejo de rutas no encontradas
app.use((req, res) => res.status(404).json({ msg: 'Endpoint no encontrado - 404' }))

export default app