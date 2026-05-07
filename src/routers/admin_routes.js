import { Router } from 'express'
import {
    listarUsuarios,
    detalleUsuario,
    cambiarStatusUsuario,
    eliminarUsuario,
    listarTodasPublicaciones,
    eliminarPublicacionAdmin
} from '../controllers/admin_controller.js'
import { verificarAdmin } from '../middlewares/JWT.js'


const router = Router()

// rutas de admin  protegidas con verificarAdmin

// gestion de usuarios 

router.get('/admin/usuarios', verificarAdmin, listarUsuarios)
router.get('/admin/usuario/:id', verificarAdmin, detalleUsuario)
router.patch('/admin/usuario/:id/status',verificarAdmin, cambiarStatusUsuario)
router.delete('/admin/usuario/:id', verificarAdmin, eliminarUsuario)


//  publicaciones 
router.get('/admin/publicaciones',verificarAdmin, listarTodasPublicaciones)
router.delete('/admin/publicacion/:id',verificarAdmin, eliminarPublicacionAdmin)

export default router