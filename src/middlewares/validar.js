import { validationResult } from 'express-validator'


const validar = (req, res, next) => {
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({
            msg: 'Error de validación',
            errores: errores.array().map(e => ({
                campo: e.path,
                mensaje: e.msg
            }))
        })
    }
    next()
}

export default validar