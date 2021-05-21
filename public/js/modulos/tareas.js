import Swal from 'sweetalert2'
import axios from 'axios'

import { actualizarAvance, limpiarAvance } from '../funciones/avance'

const tareas = document.querySelector('.listado-pendientes')

//Si hay tareas cargadas
if(tareas){
    console.log('tareas')

    //Eventos
    document.addEventListener('DOMContentLoaded', () => {
        console.log('addEventlistener')
        limpiarAvance()
        setTimeout(function(){actualizarAvance()}, 10);
    })


    tareas.addEventListener('click', (e)=>{
        // console.log(e.target)
        // console.log(e.target.classList)
        if(e.target.classList.contains('estado')){
            //console.log('Actualizando')
            const icono = e.target
            const idTarea = icono.parentElement.parentElement.dataset.tarea
            //console.log(idTarea)

            //Request hacia /tareas/:id #consultar routes
            const url = `${location.origin}/tareas/${idTarea}`
            
            axios.patch(url, { idTarea })
                .then((response)=>{
                    if(response.status === 200){
                        if(icono.classList.contains('enProceso')){
                            icono.classList.remove('fas', 'fa-mug-hot', 'enProceso')
                            icono.classList.add('far', 'fa-check-circle', 'completo')
                            //Avance proyecto
                            limpiarAvance()
                            let avance = actualizarAvance()

                            if(avance === 100){

                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Tareas completadas!',
                                    showConfirmButton: true,
                                    //timer: 3000
                                  })
                            }
                        }else{
                            Swal.fire({
                                title: '¿Deseas cambiar el estado de la tarea?',
                                html: response.data, //${tarea.name}
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Si, cambiar',
                                cancelButtonText: 'No, cancelar',
                            }).then((result) => {
                                //console.log('pendiente')
                                if (result.value) {
                                    icono.classList.remove('far', 'fa-check-circle', 'completo')
                                    icono.classList.add('fas', 'fa-mug-hot', 'enProceso')
                                    //Avance proyecto
                                    limpiarAvance()
                                    actualizarAvance()
                                }
                            })

                        }
                    }
                })
                .catch(()=>{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        html: 'Algo fue mal.</b>.',
                        footer: '<a href>¿Qué ha pasado?</a>'
                    })
                })
                


        }else if(e.target.classList.contains('fa-trash-alt')){
            // console.log('Eliminando')
            const tareaHTML = e.target.parentElement.parentElement
            const nombreTarea = tareaHTML.firstChild.textContent
            const idTarea = tareaHTML.dataset.tarea

            Swal.fire({
                title: '¿Deseas eliminar la tarea?',
                html: `La tarea <b>${nombreTarea}</b> será eliminada y no se podrá recuperar!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`
                    axios.delete(url, { params: { idTarea, nombreTarea } })
                        .then((response) => {
                            if (response.status === 200) {
                                Swal.fire(
                                    'Eliminada!',
                                    response.data,
                                    'success'
                                )
                                //Busca el padre y borra al hijo
                                const parentHTML = tareaHTML.parentElement
                                //Elimina del DOM el elemento selecionado
                                tareaHTML.parentElement.removeChild(tareaHTML) 
                                let numChilds = parentHTML.childElementCount
                                if(numChilds  === 0){
                                    const listado = document.querySelector('.listado-pendientes')
                                    listado.firstChild.innerHTML = '<p>No hay tareas en este proyecto.</p>'
                                }
                                //Avance proyecto
                                limpiarAvance()
                                actualizarAvance()
                            }
                        })
                }
            })
        }
        // else if(e.target.classList.contains('fa-pencil-alt')){ 
        //     alert(e.target)
          
        // }
    })
}

//export default tareas