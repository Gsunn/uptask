//Principal
const express = require('express')
const routes =  require('./routes')
const path = require ('path')                   //acceso a ficheros
const bodyParser = require('body-parser')       //parsear formularios
const flash = require('connect-flash')          //special area of the session used for storing messages
const session = require('express-session')      //
const cookieParser = require('cookie-parser')   //
const passport = require('./config/passport')   //Trae la configuracion de passport


//helpers con funciones
const helpers = require('./helpers')  // ./ indica que no es una archivo interno del core

//Conexion BBDD
const db = require('./config/db')

//Importar Modelos de la BBDD
require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')


// db.authenticate()
//     .then(() =>{ console.log('Conexion con db OK!') })
//     .catch(error => console.log(error))


db.sync()
    .then(() =>{ console.log('Conexion con db OK!') })
    .catch(error => console.log(error))

//Crear una app de express - Primero en cargar
const app = express()

//carga de archivos estaticos js/css/images
app.use(express.static('public'))

//Habilita PUG View Engine
app.set('view engine', 'pug')

//Habilitar body parser para leer datos del formulario
//app.use(bodyParser.urlencoded({extended: true}))
//app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Agregar flash messages
app.use(flash());

//Sesiones permiten navegar entre distintas paginas sin volver a autenticar
app.use(session({
    secret: 'supersecreto',
    save: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser())

//Agregar carpeta de las vistas
app.set('views', path.join(__dirname, './views'))

//Pasar vardump a la aplicacion
app.use((req, res, next)=>{
    //console.log(req.user)
    res.locals.vardump = helpers.vardump //Crea variables para estar disponible en toda la aplicacion
    res.locals.mensajes = req.flash()
    res.locals.usuario = {...req.user} || null  //Informacion del usuario logueado
    next() //Cuando completa la accion pasa a la siguiente
})


app.use('/', routes())

//Servidor en el puerto ...
app.listen(3000)

