const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// Referencia al modelo donde autenticar
const Usuarios = require('../models/Usuarios')

// local strategy - login con credenticales propios
passport.use(
    new LocalStrategy(
        // por defecto se espera usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        //Consulta a la BBDD
        async (email, password, done) => {

            //console.log('passport use')

            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email, 
                        activo: 1
                    }
                })

                //Verificar password
                if(!usuario.verificarPassword(password)){
                    //console.log('acceso denegado')
                    return done(null, false, {
                        message: 'Acceso denegado.'
                    })
                }

                //console.log('Acceso aprobado');
                //Acceso aprobado
                return done(null, usuario)

            } catch (error) {
                //console.log('Usuario no existe');
                //Usuario no existe
                return done(null, false, {
                    message: 'Usuario no existe.'
                })
            }
        }
))


// serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport