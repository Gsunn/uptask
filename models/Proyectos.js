const Sequilize = require('sequelize')  //ORM
const db = require('../config/db')      //configuracion conexion a BBDD
const slug = require('slug')            //para crear url amigables
const shortid = require('shortid')

const Proyectos = db.define('proyectos' ,{
    id: {
        type: Sequilize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequilize.STRING(100),
    url: Sequilize.STRING(125),
    usuarioId: Sequilize.INTEGER(3), //FK usuarios
}, {
    hooks: {
        beforeCreate(proyecto){
            //Se ejecuta antes de insertar en BBDD
            //console.log('Antes de insertar en BBDD')
            const url = slug(proyecto.nombre).toLowerCase()
            proyecto.url = `${url}-${shortid.generate()}`
        }
    }
})

module.exports = Proyectos