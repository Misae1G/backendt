import mongoose from 'mongoose'
import Usuario from '../models/Usuario.js'
import Publicacion from '../models/Publicacion.js'
import { eliminarImagenCloudinary } from '../helpers/uploadCloudinary.js'

//  gestion de usuarios 

// listar todos los usuarios registrados

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find({ rol: 'usuario' })
            .select('-password -token -__v')
            .sort({ createdAt: -1 })
 
        res.status(200).json({
            total: usuarios.length,
            usuarios
        })
 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}

// ver  detalle de un usuario

const detalleUsuario = async (req, res) => {
    try {
        const { id } = req.params
 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID inválido: ${id}` })
        }
 
        const usuario = await Usuario.findById(id).select('-password -token -__v')
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }
 
        // ontar publicaciones del usuario
        const totalPublicaciones = await Publicacion.countDocuments({ usuario: id })
 
        res.status(200).json({ usuario, totalPublicaciones })
 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}

// poder activar o desactivar un usuario 

const cambiarStatusUsuario = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID inválido: ${id}` })
        }
 
        if (typeof status !== 'boolean') {
            return res.status(400).json({ msg: 'El campo status debe ser true o false' })
        }
 
        const usuarioBDD = await Usuario.findById(id)
        if (!usuarioBDD) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }
 
        if (usuarioBDD.rol === 'admin') {
            return res.status(403).json({ msg: 'No se puede modificar el status de un administrador' })
        }
 
        usuarioBDD.status = status
        await usuarioBDD.save()
 
        const accion = status ? 'activado' : 'desactivado'
        res.status(200).json({ msg: `Usuario ${accion} exitosamente` })
 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}

// eliminar un usuario y sus publicaciones

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params
 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID inválido: ${id}` })
        }
 
        const usuarioBDD = await Usuario.findById(id)
        if (!usuarioBDD) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }
 
        if (usuarioBDD.rol === 'admin') {
            return res.status(403).json({ msg: 'No se puede eliminar a un administrador' })
        }
 
        // eliminar imagenes de Cloudinary de  sus publicaciones
        const publicaciones = await Publicacion.find({ usuario: id })
        for (const pub of publicaciones) {
            await eliminarImagenCloudinary(pub.imagenID)
        }
 
        // eliminar todas sus publicaciones
        await Publicacion.deleteMany({ usuario: id })
 
        // eliminar el usuario
        await usuarioBDD.deleteOne()
 
        res.status(200).json({ msg: 'Usuario y sus publicaciones eliminados exitosamente' })
 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}

// moderar publiaciones

// listar todas las publicaciones 

const listarTodasPublicaciones = async (req, res) => {
    try {
        const { titulo, categoria, estado, usuario } = req.query
 
        const filtro = {}
 
        if (titulo)    filtro.titulo    = { $regex: titulo, $options: 'i' }
        if (categoria) filtro.categoria = categoria
        if (estado)    filtro.estado    = estado
        if (usuario && mongoose.Types.ObjectId.isValid(usuario)) {
            filtro.usuario = usuario
        }
 
        const publicaciones = await Publicacion.find(filtro)
            .select('-__v -imagenID')
            .populate('usuario', 'nombre email')
            .sort({ createdAt: -1 })
 
        res.status(200).json({
            total: publicaciones.length,
            publicaciones
        })
 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}

//  eliminar cualquier publicacion inapropiada

const eliminarPublicacionAdmin = async (req, res) => {
    try {
        const { id } = req.params
 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID inválido: ${id}` })
        }
 
        const publicacionBDD = await Publicacion.findById(id)
        if (!publicacionBDD) {
            return res.status(404).json({ msg: 'Publicación no encontrada' })
        }
 
        await eliminarImagenCloudinary(publicacionBDD.imagenID)
        await publicacionBDD.deleteOne()
 
        res.status(200).json({ msg: 'Publicación eliminada por el administrador' })
 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}

export {
    listarUsuarios,
    detalleUsuario,
    cambiarStatusUsuario,
    eliminarUsuario,
    listarTodasPublicaciones,
    eliminarPublicacionAdmin
}