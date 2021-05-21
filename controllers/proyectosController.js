const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas') //Contiene FK Proyectos
const Usuarios = require('../models/Usuarios')

exports.proyectosHome = async (req, res)=>{

    //console.log(res.locals.usuario)

    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where: { usuarioId }})

    res.render('Index', {
        nombrePagina: 'Proyectos',
        proyectos
    })
}

exports.formularioProyecto = async (req, res)=>{

    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where: { usuarioId }})

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req, res)=>{

    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where: { usuarioId }})
    
    const { nombre } = req.body

    let errores = []

    if(!nombre){
        errores.push({'texto' : 'Dar nombre al proyecto'})
    }

    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos 
        })
    }else{
        //No hay errores
        //Insertar en BBDD
        const usuarioId =  res.locals.usuario.id
        //Nombre proyecto, usuario propietario
        await Proyectos.create({ nombre, usuarioId })
        res.redirect('/') //redirige a proyectosHome
    }
}

/**
 * Obtiene informacion sobre un proyecto
 */
exports.proyectoPorUrl = async (req, res, next)=>{
    //listado de proyectos menu lateral
    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyectos.findAll({where: { usuarioId }})

    //proyecto seleccionado
    const proyectoPromise = Proyectos.findOne({
        where:{
            url: req.params.url,
            usuarioId
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

    //Consulta de las tareas del proyecto
    const tareas = await Tareas.findAll({
        where:{ proyectoId: proyecto.id },
        //Agrega el modelo completo, con la endidad principal
        // include: [
        //     { model: Proyectos }
        // ]
        include: [
             { model: Usuarios }
        ]
    })

    //No hay resultado
    if(!proyecto) return next()

    // Usuarios a los que asignar tareas
    const usuarios = await Usuarios.findAll()

    //Renderizado de la vista


    console.log(tareas)

    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas,
        usuarios
    })
}


exports.formularioEditar = async (req, res) => {
    //listado de proyectos menu lateral
    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyectos.findAll({where: { usuarioId }})

    const proyectoPromise = Proyectos.findOne({
        where:{
            id: req.params.id,
            usuarioId
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

    console.log(proyecto)

    //No hay resultado
    //if(!proyecto) return next()

    //render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyecto,
        proyectos
     })
}


exports.actulizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where: { usuarioId }})
    
    const { nombre } = req.body

    let errores = []

    if(!nombre){
        errores.push({'texto' : 'Dar nombre al proyecto'})
    }

    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos 
        })
    }else{
        //No hay errores
        //Insertar en BBDD
        await Proyectos.update(
                { nombre : nombre },
                { where : { id : req.params.id} }
            )
        res.redirect('/') //redirige a proyectosHome
    }
}


exports.eliminarProyecto = async (req, res, next) => {
    //req, query o params datos enviados hacia el servidor
    //console.log(req.query)
    const {urlProyecto, nameProyecto} = req.query
    const resultado = await Proyectos.destroy({ where: { url :  urlProyecto } })

    if(!resultado) return next()

    res.status(200).send(`El proyecto  <b>${nameProyecto}</b> ha sido eliminado.`)

}