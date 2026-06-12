import mongoose from 'mongoose'
import Publicacion from '../models/Publicacion.js'
import { subirImagenCloudinary, eliminarImagenCloudinary } from '../helpers/uploadCloudinary.js'

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']

const validarTipoImagen = (file) => {
    if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
        throw new Error('Formato no permitido. Solo se aceptan imágenes JPG, PNG o WEBP')
    }
}

//  Crear una nueva publicacion de libro

const crearPublicacion = async (req, res) => {
    try {
        const { titulo, descripcion, precio, categoria } = req.body

        if (!titulo || !descripcion || !precio || !categoria) {
            return res.status(400).json({ msg: 'Los campos título, descripción, precio y categoría son obligatorios' })
        }

        const nuevaPublicacion = new Publicacion({
            titulo,
            descripcion,
            precio,
            categoria,
            usuario: req.usuarioHeader._id
        })

        if (req.files?.imagen) {
            const file = req.files.imagen
            validarTipoImagen(file)
            const { secure_url, public_id } = await subirImagenCloudinary(file)
            nuevaPublicacion.imagen = secure_url
            nuevaPublicacion.imagenID = public_id
        }

        await nuevaPublicacion.save()
        res.status(201).json({ msg: 'Publicación creada exitosamente', publicacion: nuevaPublicacion })

    } catch (error) {
        console.error(error)
        if (error.message.includes('MB') || error.message.includes('Formato')) {
            return res.status(400).json({ msg: error.message })
        }
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}


//  Listar publicaciones con filtros 
const listarPublicaciones = async (req, res) => {
    try {
        const { titulo, categoria, precioMin, precioMax, estado } = req.query

        // Construir filtro dinamicamente
        const filtro = {}

        // Estado: por defecto solo disponible"
        filtro.estado = estado === 'vendido' ? 'vendido' : 'disponible'

        // Busqueda de título sin importar mayusculas minusculas
        if (titulo) {
            filtro.titulo = { $regex: titulo, $options: 'i' }
        }

        // filtro por categoria exacta
        if (categoria) {
            filtro.categoria = categoria
        }

        // rango de precio
        if (precioMin || precioMax) {
            filtro.precio = {}
            if (precioMin) filtro.precio.$gte = Number(precioMin)
            if (precioMax) filtro.precio.$lte = Number(precioMax)
        }

        const publicaciones = await Publicacion.find(filtro)
            .select('-__v -imagenID')
            .populate('usuario', 'nombre email telefono')
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


//    detalle de una publicacion
const detallePublicacion = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: `ID inválido: ${id}` })
        }

        const publicacion = await Publicacion.findById(id)
            .select('-__v -imagenID')
            .populate('usuario', 'nombre email telefono')

        if (!publicacion) {
            return res.status(404).json({ msg: 'Publicación no encontrada' })
        }

        res.status(200).json(publicacion)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}


//   Editar una publicacion propia
const editarPublicacion = async (req, res) => {
    try {
        const { id } = req.params
        const { titulo, descripcion, precio, categoria } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: `ID inválido: ${id}` })
        }

        const publicacionBDD = await Publicacion.findById(id)
        if (!publicacionBDD) {
            return res.status(404).json({ msg: 'Publicación no encontrada' })
        }

        // Solo el dueño puede editar
        if (publicacionBDD.usuario.toString() !== req.usuarioHeader._id.toString()) {
            return res.status(403).json({ msg: 'No tienes permisos para editar esta publicación' })
        }

        publicacionBDD.titulo      = titulo      ?? publicacionBDD.titulo
        publicacionBDD.descripcion = descripcion ?? publicacionBDD.descripcion
        publicacionBDD.precio      = precio      ?? publicacionBDD.precio
        publicacionBDD.categoria   = categoria   ?? publicacionBDD.categoria

        if (req.files?.imagen) {
            const file = req.files.imagen
            validarTipoImagen(file)
            await eliminarImagenCloudinary(publicacionBDD.imagenID)
            const { secure_url, public_id } = await subirImagenCloudinary(file)
            publicacionBDD.imagen   = secure_url
            publicacionBDD.imagenID = public_id
        }

        await publicacionBDD.save()
        res.status(200).json({ msg: 'Publicación actualizada exitosamente', publicacion: publicacionBDD })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}


//   estado del libro disponible  vendido
const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params
        const { estado } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: `ID inválido: ${id}` })
        }

        if (!['disponible', 'vendido'].includes(estado)) {
            return res.status(400).json({ msg: 'Estado inválido. Usa "disponible" o "vendido"' })
        }

        const publicacionBDD = await Publicacion.findById(id)
        if (!publicacionBDD) {
            return res.status(404).json({ msg: 'Publicación no encontrada' })
        }

        if (publicacionBDD.usuario.toString() !== req.usuarioHeader._id.toString()) {
            return res.status(403).json({ msg: 'No tienes permisos para modificar esta publicación' })
        }

        publicacionBDD.estado = estado
        await publicacionBDD.save()

        res.status(200).json({ msg: `Estado actualizado a "${estado}"`, publicacion: publicacionBDD })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}


// Eliminar una publicacin propia
const eliminarPublicacion = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: `ID inválido: ${id}` })
        }

        const publicacionBDD = await Publicacion.findById(id)
        if (!publicacionBDD) {
            return res.status(404).json({ msg: 'Publicación no encontrada' })
        }

        // Solo el dueño puede eliminar
        if (publicacionBDD.usuario.toString() !== req.usuarioHeader._id.toString()) {
            return res.status(403).json({ msg: 'No tienes permisos para eliminar esta publicación' })
        }

        await eliminarImagenCloudinary(publicacionBDD.imagenID)
        await publicacionBDD.deleteOne()

        res.status(200).json({ msg: 'Publicación eliminada exitosamente' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}


//  Listar mis propias publicaciones
const misPublicaciones = async (req, res) => {
    try {
        const publicaciones = await Publicacion.find({ usuario: req.usuarioHeader._id })
            .select('-__v -imagenID')
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


export {
    crearPublicacion,
    listarPublicaciones,
    detallePublicacion,
    editarPublicacion,
    cambiarEstado,
    eliminarPublicacion,
    misPublicaciones
}