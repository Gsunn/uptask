//Las tablas necesarias principal y foranea
const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas') //Contiene FK Proyectos
const Usuarios = require('../models/Usuarios')

exports.agregarTarea = async (req, res, next) => {
    //console.log(' agregarTarea')
    //res.send('enviado')
    //console.log(req.body)

    //Obtener proyecto selecionado
    const proyecto = await Proyectos.findOne({
        where: { url: req.params.url }
    })

    //Leer input
    const { tarea, descripcion, usuarioId } = req.body
    const estado = false
    const proyectoId = proyecto.id

    //Insertar en BBDD y redirecion
    //Mantener orden de la tabla
    const resultado = await Tareas.create({ tarea, descripcion, estado, proyectoId, usuarioId })

    //Redireccionar
    if (!resultado) return next()
    res.redirect(`/proyectos/${req.params.url}`)

}

exports.cambiarEstadoTarea = async (req, res, next) => {
    //utiliando patch se accede a los datos con params
    //console.log(req.params)
    const { id } = req.params
    const tarea = await Tareas.findOne({
        where: { id } //como attributo y variable con el valor son iguales se puede unificar  #big literal
    })

    //console.log(tarea)

    //Cambiar estado
    let estado = false
    if (tarea.estado === estado) {
        estado = true
    }
    tarea.estado = estado

    const resultado = await tarea.save()

    if (!resultado) return next()

    res.status(200).send(`La tarea <b>${tarea.tarea}</b> pasa a estado pendiente!`)

}

exports.eliminarTarea = async (req, res, next) => {
    //console.log('eliminarTarea')
    //console.log(req.params) de la url
    //console.log(req.query) recibe mas parametros

    const { idTarea, nombreTarea } = req.query

    const resultado = await Tareas.destroy({ where: { id: idTarea } }) //Elimina la instacia


    if (!resultado) return next()

    res.status(200).send(`La tarea <b>${nombreTarea}</b> ha sido eliminada!`)

}

exports.editarTarea = async (req, res, next) => {
    console.log('editarTarea')
    //console.log(req.params) 

    const { id } = req.params

    //Obtiene la tarea a editar para cargar en el formulario
    const tarea = await Tareas.findOne({
        where: { id },  
        include: [
            { model: Proyectos }
       ] 
    })

    if(!tarea){
        return next()
    }    
    
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where: { usuarioId }})


    // Usuarios a los que asignar tareas
    const usuarios = await Usuarios.findAll()


    // const tareas = await Tareas.findAll({
    //     where:{ proyectoId: tarea.proyecto.id },
    //     //Agrega el modelo completo, con la endidad principal
    //     include: [
    //          { model: Usuarios }
    //     ]
    // })

    res.render('editarTarea', {
        nombreProyecto: tarea.proyecto.nombre,
        nombrePagina: `Editar tarea ${tarea.tarea}`,
        proyectos,
        // tareas,
        tarea,
        usuarios 
    })
}

exports.guardarEdicionTarea = async (req, res, next) => {
    console.log('guardarEdicionTarea');
    console.log(req.params);
    console.log(req.body);

    const { id } = req.params
    const { tarea, descripcion, usuarioId } = req.body

    const tareaEdit = await Tareas.findOne({
        where: { id }, //como attributo y variable con el valor son iguales se puede unificar  #big literal
        include: [
            { model: Proyectos }
        ]
    })

    tareaEdit.tarea = tarea
    tareaEdit.descripcion = descripcion
    tareaEdit.usuarioId = usuarioId

    const resultado = await tareaEdit.save()

    if (!resultado) return next()

    //res.status(200).send(`La tarea <b>${tareaEdit.tarea}</b> ha sido modificada!`)
    console.log(tareaEdit);
    console.log(`/proyectos/${tareaEdit.proyecto.url}`)

    res.redirect(`/proyectos/${tareaEdit.proyecto.url}`)
}