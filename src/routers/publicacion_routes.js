import { Router } from 'express'
import {
    crearPublicacion,
    listarPublicaciones,
    detallePublicacion,
    editarPublicacion,
    cambiarEstado,
    eliminarPublicacion,
    misPublicaciones
} from '../controllers/publicacion_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
import validar from '../middlewares/validar.js'
import {
    reglasCrearPublicacion,
    reglasEditarPublicacion,
    reglasEstado
} from '../middlewares/validaciones.js'

const router = Router()

// rutas publicas
router.get('/publicaciones',listarPublicaciones)
router.get('/publicacion/:id',detallePublicacion)

// rutas privadas
router.post('/publicacion',verificarTokenJWT, reglasCrearPublicacion,validar,crearPublicacion)
router.get('/mis-publicaciones',verificarTokenJWT, misPublicaciones)
router.put('/publicacion/:id',verificarTokenJWT, reglasEditarPublicacion,validar,editarPublicacion)
router.patch('/publicacion/:id/estado',verificarTokenJWT, reglasEstado,validar,cambiarEstado)
router.delete('/publicacion/:id',verificarTokenJWT, eliminarPublicacion)

export default router