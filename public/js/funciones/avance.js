export const actualizarAvance = ()=>{
    //selecionar tareas
    const tareas = document.querySelectorAll('li.tarea')

    if(tareas.length){
        //Seleccionar tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo')

        //Calcular avance
        const avance = (tareasCompletas.length / tareas.length) * 100

        //Mostrar avance
        const porcentaje = document.querySelector('#porcentaje')
        porcentaje.style.width = avance.toFixed(2) + '%'

        return avance

    }
}

export const limpiarAvance = () => {
    const porcentaje = document.querySelector('#porcentaje')
    porcentaje.style.width = 0 + '%'
}