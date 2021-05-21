const { check, validationResult } = require('express-validator')
const enviarEmail  = require('../handlers/email')

const Usuarios = require('../models/Usuarios')

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en UpTask'
    })
}

exports.crearCuenta = async (req, res) => {
    console.log('crearCuenta')
    //leer datos
    //console.log(req.body)
    const { email, password, nombre, apellidos } = req.body

    //let chk = check(email,'Must be a valid email of 65 to 130 chars').isEmail().isLength({ min: 25 , max: 30})

    //console.log(chk)

    try{
        //crear usuario
        await Usuarios.create({
            email, 
            password, 
            nombre, 
            apellidos
        })

        //Crear URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`

        //Crear el objeto de usuario
        const usuario = { email }

        // enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Activar cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmarCuenta'
        })

        //Redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tú cuenta')
        res.redirect('/iniciar-sesion')

    }catch(error){
        console.log('CATCH')
        console.log(error)
        if(error.errors)
            req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en UpTask',
            email,      //autorelleno
            password,   //autorelleno
            nombre,     //autorelleno
            apellidos   //autorelleno
        })
    }
  
}

exports.formIniciarSesion = (req, res) => {
    console.log('formIniciarSesion')

    //req.flash('correcto', 'Tú password se ha modificado correctamente')

    console.log(res.locals.mensajes)
    const  { mensajes }  = res.locals
    
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar sesión UpTask',
        mensajes
    })
}

exports.formResetPassword = (req, res) =>{
    //View engine∫
    console.log('formResetPassword');
    const { info } = res.locals.mensajes
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer contraseña',
        info
    })
}

exports.confirmarCuenta = async (req, res) => {
    //res.json(req.params.correo)
    const usuario = await Usuarios.findOne({
        where: {
            email : req.params.correo
        }
    })

    if(!usuario){
        req.flash('error', 'La cuenta no existe')
        res.redirect('/crear-cuenta')
    }

    usuario.activo = 1
    await usuario.save()

    req.flash('correcto', 'Cuenta activada')
    res.redirect('/iniciar-sesion')
}