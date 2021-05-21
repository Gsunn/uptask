const Sequilize = require('sequelize')  //ORM
const db = require('../config/db')   
const bcrypt = require('bcrypt')
   //configuracion conexion a BBDD
const Proyectos = require('./Proyectos')

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequilize.INTEGER(3),
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequilize.STRING(25),
    apellidos:  Sequilize.STRING(100),
    email: {
        type: Sequilize.STRING(60),
        allowNull: false,
        validate:{
            isEmail: { msg: 'Agrega un correo valido.' },
            notEmpty: { msg: 'El email esta vacío.'}
        },
        unique:{
            args: true,
            msg: 'Usuario ya registrado.'
        } 
    },
    password: {
        type: Sequilize.STRING(60),
        allowNull: false,
        validate:{
            notEmpty: { msg: 'El password esta vacío.'}
        } 
    },
    activo: {
        type: Sequilize.INTEGER,
        defaultValue: 0
    },
    token: Sequilize.STRING(40),
    expira: Sequilize.DATE,

},{
    hooks: {
        beforeCreate(usuario){
            //console.log(usuario)
            usuario.password =  bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
        }
    }
})

//Metodos personalizados, NO UTILIR ARROW FUNCTION
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

//Define las relaciones con otras tablas
Usuarios.hasMany(Proyectos) // 1:m 

module.exports = Usuarios
