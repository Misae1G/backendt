import { body } from 'express-validator'

//  Para el usuario 

export const reglasRegistro = [

    body('nombre')
        .trim()
        .notEmpty()
            .withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 50 })
            .withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
            .withMessage('El nombre solo puede contener letras y espacios'),

    body('email')
        .trim()
        .notEmpty()
            .withMessage('El email es obligatorio')
        .isEmail()
            .withMessage('El email no tiene un formato válido')
        .normalizeEmail(),           // convierte a lowercase y limpia alias

    body('password')
        .notEmpty()
            .withMessage('El password es obligatorio')
        .isLength({ min: 8 })
            .withMessage('El password debe tener mínimo 8 caracteres')
        .matches(/[A-Z]/)
            .withMessage('El password debe tener al menos una letra mayúscula')
        .matches(/[0-9]/)
            .withMessage('El password debe tener al menos un número'),

    body('telefono')
        .trim()
        .notEmpty()
            .withMessage('El teléfono es obligatorio')
        .matches(/^09\d{8}$/)
            .withMessage('El teléfono debe empezar con 09 y tener exactamente 10 dígitos'),

    body('carrera')
        .optional({ checkFalsy: true })   // acepta null, undefined o string vacío
        .trim()
        .isLength({ min: 3, max: 80 })
            .withMessage('La carrera debe tener entre 3 y 80 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
            .withMessage('La carrera solo puede contener letras y espacios')
]

export const reglasLogin = [

    body('email')
        .trim()
        .notEmpty()
            .withMessage('El email es obligatorio')
        .isEmail()
            .withMessage('El email no tiene un formato válido')
        .normalizeEmail(),

    body('password')
        .notEmpty()
            .withMessage('El password es obligatorio')
]

export const reglasRecuperarPassword = [

    body('email')
        .trim()
        .notEmpty()
            .withMessage('El email es obligatorio')
        .isEmail()
            .withMessage('El email no tiene un formato válido')
        .normalizeEmail()
]

export const reglasNuevoPassword = [

    body('password')
        .notEmpty()
            .withMessage('El password es obligatorio')
        .isLength({ min: 8 })
            .withMessage('El password debe tener mínimo 8 caracteres')
        .matches(/[A-Z]/)
            .withMessage('El password debe tener al menos una letra mayúscula')
        .matches(/[0-9]/)
            .withMessage('El password debe tener al menos un número'),

    body('confirmpassword')
        .notEmpty()
            .withMessage('Debes confirmar el password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Los passwords no coinciden')
            }
            return true
        })
]


export const reglasActualizarPerfil = [

    body('nombre')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 50 })
            .withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
            .withMessage('El nombre solo puede contener letras y espacios'),

    body('email')
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
            .withMessage('El email no tiene un formato válido')
        .normalizeEmail(),

    body('telefono')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^09\d{8}$/)
            .withMessage('El teléfono debe empezar con 09 y tener exactamente 10 dígitos'),

    body('carrera')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3, max: 80 })
            .withMessage('La carrera debe tener entre 3 y 80 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
            .withMessage('La carrera solo puede contener letras y espacios')
]


export const reglasCambiarPassword = [

    body('passwordactual')
        .notEmpty()
            .withMessage('El password actual es obligatorio'),

    body('passwordnuevo')
        .notEmpty()
            .withMessage('El nuevo password es obligatorio')
        .isLength({ min: 8 })
            .withMessage('El nuevo password debe tener mínimo 8 caracteres')
        .matches(/[A-Z]/)
            .withMessage('El nuevo password debe tener al menos una letra mayúscula')
        .matches(/[0-9]/)
            .withMessage('El nuevo password debe tener al menos un número')
]

//  reglas para las  publciones

const CATEGORIAS_VALIDAS = [
    'Matemáticas', 'Física', 'Programación', 'Electrónica',
    'Química', 'Administración', 'Economía', 'Humanidades', 'Inglés', 'Otros'
]

// rechaza cadenas q son solo caracteres repetidos o sin vocales
const soloBasura = /^[^aeiouáéíóuAEIOUÁÉÍÓÚ]{8,}$/

export const reglasCrearPublicacion = [

    body('titulo')
        .trim()
        .notEmpty()
            .withMessage('El título es obligatorio')
        .isLength({ min: 5, max: 100 })
            .withMessage('El título debe tener entre 5 y 100 caracteres')
        .custom(val => {
            if (soloBasura.test(val)) throw new Error('El título no parece válido')
            return true
        }),

    body('descripcion')
        .trim()
        .notEmpty()
            .withMessage('La descripción es obligatoria')
        .isLength({ min: 10, max: 500 })
            .withMessage('La descripción debe tener entre 10 y 500 caracteres'),

    body('precio')
        .notEmpty()
            .withMessage('El precio es obligatorio')
        .isFloat({ gt: 0 })
            .withMessage('El precio debe ser un número mayor a 0')
        .toFloat(),

    body('categoria')
        .trim()
        .notEmpty()
            .withMessage('La categoría es obligatoria')
        .isIn(CATEGORIAS_VALIDAS)
            .withMessage(`Categoría inválida. Opciones: ${CATEGORIAS_VALIDAS.join(', ')}`)
]

export const reglasEditarPublicacion = [

    body('titulo')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 5, max: 100 })
            .withMessage('El título debe tener entre 5 y 100 caracteres')
        .custom(val => {
            if (soloBasura.test(val)) throw new Error('El título no parece válido')
            return true
        }),

    body('descripcion')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 10, max: 500 })
            .withMessage('La descripción debe tener entre 10 y 500 caracteres'),

    body('precio')
        .optional({ checkFalsy: true })
        .isFloat({ gt: 0 })
            .withMessage('El precio debe ser un número mayor a 0')
        .toFloat(),

    body('categoria')
        .optional({ checkFalsy: true })
        .trim()
        .isIn(CATEGORIAS_VALIDAS)
            .withMessage(`Categoría inválida. Opciones: ${CATEGORIAS_VALIDAS.join(', ')}`)
]

export const reglasEstado = [

    body('estado')
        .notEmpty()
            .withMessage('El estado es obligatorio')
        .isIn(['disponible', 'vendido'])
            .withMessage('Estado inválido. Usa "disponible" o "vendido"')
]