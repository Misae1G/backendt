import { Router } from 'express'
import { 
    registro,
    confirmarEmail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    login,
    perfil,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/usuario_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
import validar from '../middlewares/validar.js'
import {
    reglasRegistro,
    reglasLogin,
    reglasRecuperarPassword,
    reglasNuevoPassword,
    reglasActualizarPerfil,
    reglasCambiarPassword
} from '../middlewares/validaciones.js'

const router = Router()

// rutas piblicas
router.post('/registro',reglasRegistro,validar, registro)
router.get('/confirmar/:token',confirmarEmail)
router.post('/recuperarpassword',reglasRecuperarPassword,validar,recuperarPassword)
router.get('/recuperarpassword/:token',comprobarTokenPassword)
router.post('/nuevopassword/:token',reglasNuevoPassword,validar,crearNuevoPassword)
router.post('/login',reglasLogin,validar, login)

// Rutas privadas
router.get('/perfil',verificarTokenJWT,perfil)
router.put('/actualizarperfil/:id',verificarTokenJWT,reglasActualizarPerfil,validar,actualizarPerfil)
router.put('/actualizarpassword',verificarTokenJWT,reglasCambiarPassword,validar,actualizarPassword)


export default router