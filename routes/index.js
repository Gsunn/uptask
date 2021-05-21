const express = require('express')
const router = express.Router()

//importar express validator
const { body } = require('express-validator') //body => req.body en controller

//Importar controladores
const proyectosController = require ('../controllers/proyectosController')
const tareasController = require ('../controllers/tareasController')
const usuariosController = require ('../controllers/usuariosController')
const authController = require ('../controllers/authController')

module.exports = ()=>{
    //ruta para el Home
    router.get('/', 
                authController.usuarioAutenticado,
                proyectosController.proyectosHome)

    router.get('/nuevo-proyecto', 
                authController.usuarioAutenticado,
                proyectosController.formularioProyecto)

    router.post('/nuevo-proyecto',
                authController.usuarioAutenticado, 
                body('nombre').not().isEmpty().trim().escape(),
                proyectosController.nuevoProyecto)

    router.get('/proyectos/:url', 
                authController.usuarioAutenticado,
                proyectosController.proyectoPorUrl)
     
    //#region  Proyectos
        //Actulizar proyecto
        router.get('/proyecto/editar/:id', 
                    authController.usuarioAutenticado,
                    proyectosController.formularioEditar)
        
        router.post('/nuevo-proyecto/:id', 
                    authController.usuarioAutenticado,
                    body('nombre').not().isEmpty().trim().escape(),
                    proyectosController.actulizarProyecto)

        //Eliminar proyecto
        router.delete('/proyectos/:url', 
                        authController.usuarioAutenticado,
                        proyectosController.eliminarProyecto)

    //#endregion Proyectos

    //#region  Tareas

        //crear tarea
        router.post('/proyectos/:url', 
                    authController.usuarioAutenticado,
                    tareasController.agregarTarea)

        //Actualizar tarea
        //patch es difierente de put(actualizar), utilizado solo para cambiar una parte del registro
        //en este caso el estado BOOLEAN
        router.patch('/tareas/:id', 
                    authController.usuarioAutenticado,
                    tareasController.cambiarEstadoTarea)

        //Eliminar tarea
        router.delete('/tareas/:id', 
                    authController.usuarioAutenticado,
                    tareasController.eliminarTarea)

        //Editar tarea, cargar formulario
        router.get('/editar-tarea/:id', 
                    authController.usuarioAutenticado,
                    tareasController.editarTarea)

        //Editar tarea, guardar modificacion
        router.post('/editar-tarea/:id', 
                    authController.usuarioAutenticado,
                    tareasController.guardarEdicionTarea)

    //#endregion Tareas


    //#region Cuentas

        router.get('/crear-cuenta', usuariosController.formCrearCuenta) //para mostar el formulario
        router.post('/crear-cuenta', usuariosController.crearCuenta)  //submit
        router.get('/confirmar/:correo', usuariosController.confirmarCuenta)

    //#endregion Cuentas

     
    //#region Sesion

        router.get('/iniciar-sesion', usuariosController.formIniciarSesion)  //para mostar el formulario
        router.post('/iniciar-sesion', authController.autenticarUsuario)  //submit


    //#endregion Sesion


    router.get('/cerrar-sesion', authController.cerrarSesion)

    //Nueva Password

    router.get('/resetPassword',  usuariosController.formResetPassword)

    router.post('/resetPassword', authController.enviarToken)

    router.get('/resetPassword/:token', authController.validarToken)

    router.post('/resetPassword/:token', authController.actulizarPassword)
    
    return router

}

