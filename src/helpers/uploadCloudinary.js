import { v2 as cloudinary } from 'cloudinary'

const MAX_SIZE_MB = 2
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

const validarTamano = (file) => {
    if (file.size > MAX_SIZE_BYTES) {
        throw new Error(`La imagen no puede superar los ${MAX_SIZE_MB}MB. Tu archivo pesa ${(file.size / 1024 / 1024).toFixed(2)}MB`)
    }
}

// ⚠️ CAMBIO: sube desde buffer en memoria en lugar de tempFilePath
const subirImagenCloudinary = async (file, folder = 'UniBooks') => {
    validarTamano(file)

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error)
                resolve({ secure_url: result.secure_url, public_id: result.public_id })
            }
        ).end(file.data) // file.data es el Buffer cuando useTempFiles: false
    })
}

const eliminarImagenCloudinary = async (public_id) => {
    if (!public_id) return
    await cloudinary.uploader.destroy(public_id)
}

export { subirImagenCloudinary, eliminarImagenCloudinary }