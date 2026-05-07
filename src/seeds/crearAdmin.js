
// scriopt para crear el usuario administrador manualmente

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Usuario from '../models/Usuario.js' 

dotenv.config()

const crearAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI_PRODUCTION)
        console.log(' Conectado a MongoDB')

        const emailAdmin = 'admin@librosepn.com'    // crear un nuevo admin

        const existe = await Usuario.findOne({ email: emailAdmin })
        if (existe) {
            console.log('⚠️  Ya existe un admin con ese email')
            process.exit(0)
        }

        const admin = new Usuario({
            nombre:       'Administrador',
            email:        emailAdmin,
            password:     'Admin1234',                // crear un nuevo admin
            telefono:     '0000000000',
            rol:          'admin',
            confirmEmail: true,
            status:       true
        })

        admin.password = await admin.encryptPassword(admin.password)
        await admin.save()

        console.log('Administrador creado exitosamente')
        console.log(`   Email:    ${emailAdmin}`)
        console.log(`   Password: Admin1234  ← cámbialo después del primer login`)
        process.exit(0)

    } catch (error) {
        console.error(' Error:', error.message)
        process.exit(1)
    }
}

crearAdmin()