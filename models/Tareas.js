const Sequilize = require('sequelize')  //ORM
const db = require('../config/db')      //configuracion conexion a BBDD

//Entidad principal
const Proyectos = require('./Proyectos')
const Usuarios = require('./Usuarios')

const Tareas = db.define('tareas', {
    id: {
        type: Sequilize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequilize.STRING(100),
    descripcion: Sequilize.STRING(255),
    estado: Sequilize.BOOLEAN
})

Tareas.belongsTo(Proyectos) // FK 1:1 
Tareas.belongsTo(Usuarios)
// , {
//     foreignKey: {
//       name: 'usuarioId',
//     }
// })
//Proyectos.hasMany(Tareas)   // 1:m iria en el otro modelo

module.exports = Tareas
