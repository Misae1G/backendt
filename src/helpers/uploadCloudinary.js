import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs-extra'

const MAX_SIZE_MB = 2
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024   // 2097152 bytes


const validarTamano = (file) => {
    if (file.size > MAX_SIZE_BYTES) {
        throw new Error(`La imagen no puede superar los ${MAX_SIZE_MB}MB. Tu archivo pesa ${(file.size / 1024 / 1024).toFixed(2)}MB`)
    }
}


const subirImagenCloudinary = async (filePath, file, folder = 'UniBooks') => {
    validarTamano(file)
    const { secure_url, public_id } = await cloudinary.uploader.upload(filePath, { folder })
    await fs.unlink(filePath)
    return { secure_url, public_id }
}


const eliminarImagenCloudinary = async (public_id) => {
    if (!public_id) return
    await cloudinary.uploader.destroy(public_id)
}

export { subirImagenCloudinary, eliminarImagenCloudinary }
