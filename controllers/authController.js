const passport = require('passport')
const { Op } = require("sequelize")
//Exporta el modelo de usuario para poder hacer consultas en la BBDD
const Usuarios = require('../models/Usuarios')

const crypto = require('crypto')    //Generar Token
const bcrypt = require('bcrypt')    //Passwords

const enviarEmail = require('../handlers/email')

// autenticar el usuario
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/iniciar-sesion',
    failureFlash : true,
    badRequestMessage: 'Ambos campos son obligatorios.'
})

//Funcion para revisar si el usuario esta logeado o no 
exports.usuarioAutenticado = (req, res, next)=>{

    //Si esta autenticado, adelante
    if(req.isAuthenticated()){
        return next()
    }


    //Si no esta autenticado redirigir al formulario
    return res.redirect('/iniciar-sesion')

}

//Función que cierra sesino de ususario
exports.cerrarSesion = (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion')  //login
    })
}

//Genera un token si el usuaio es valido
exports.enviarToken = async (req, res) => {
    // - Verificar que el usuario existe
    //const email = req.body.email
    console.log('enviarToken');
    console.log(req.body)

    const { email } = req.body
    const usuario = await Usuarios.findOne({ where: { email }})

    if(email === ""){
        req.flash('error', 'Email esta vacío')
        res.redirect('/resetPassword')
    }

    //Si no existe el usuario
    if(!usuario){
        req.flash('info', 'Email no existe')
        res.redirect('/resetPassword')
    }

    //Usuario existe Token y expiracion
    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expira = Date.now() + 3600000 * 3 //valido por una hora GMT + 2

    // usuario.expira = Date().toLocaleString("es-ES");

    // Guardar en BBDD
    await usuario.save()


    //url de reset
    const resetUrl = `http://${req.headers.host}/resetPassword/${usuario.token}`

    console.log(resetUrl)

    //Envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject : 'Password Reset',
        resetUrl,
        archivo : 'restablecerPassword'
    })

    req.flash('info', 'Se envio un email a tu correo')
    res.redirect('/resetPassword')
    //res.redirect('/iniciar-sesion')

}

exports.validarToken = async (req, res) => {
   // res.json(req.params.token)
   const usuario = await Usuarios.findOne({
       where: {
           token: req.params.token
       }
    })
    
    //No hay usuario
    if(!usuario){
        req.flash('error', 'No válido')
        res.redirect('/resetPassword')
    }

    // Formulario para generar nuevo password
    res.render('nuevoPassword',{
        nombrePagina : 'Nuevo password'
    })

    //console.log(usuario);
}

//Cambiar password
exports.actulizarPassword = async (req, res) => {
    console.log('actulizarPassword')

    // Verificar token y fecha de expiracion de token
    const usuario = await Usuarios.findOne({
        where: {
            token : req.params.token,
            expira : {
                [Op.gte] : Date.now() + 3600000 * 2
            }
        }
    })

    if(!usuario){
        req.flash('error', 'No válido')
        res.redirect('/resetPassword')
    }

    //Hashear el nuevo password
    usuario.password =  bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    usuario.token = null
    usuario.expira = null

    await usuario.save()
    //console.log(req.params.token);
    req.flash('correcto', 'Tú password se ha modificado correctamente')
    res.redirect('/iniciar-sesion')

}