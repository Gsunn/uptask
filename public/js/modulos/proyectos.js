import Swal from 'sweetalert2'
import axios from 'axios'

// import { actualizarAvance } from '../funciones/avance'

// document.addEventListener('DOMContentLoaded', () => {
//     actualizarAvance()
// })

const btnEliminar = document.querySelector('#eliminar-proyecto')

//Verifca que el boton eta disponible en la vista
if (btnEliminar) {

    btnEliminar.addEventListener('click', (e) => {
        const urlProyecto = e.target.dataset.proyectoUrl
        const nameProyecto = e.target.dataset.proyectoName
        // console.log(urlProyecto)
        // console.log(nameProyecto)

        Swal.fire({
            title: '¿Deseas eliminar el proyecto?',
            html: `El proyecto <b>${nameProyecto}</b> será eliminado y no se podrá recuperar!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar',
        }).then((result) => {
            if (result.value) {

                const url = `${location.origin}/proyectos/${urlProyecto}`
                //console.log(url)
               
                axios.delete(url, { params: { urlProyecto : urlProyecto, nameProyecto : nameProyecto } })
                    .then((response) => {
                        if(response.status === 200){
                            Swal.fire(
                                'Proyecto eliminado!',
                                response.data,
                                'success'
                            ).then((result) => {
                                setTimeout(()=>{
                                    //redicionar al inicio
                                    window.location.href = '/'
                                    }, 1000)
                            })
                        }
                    })
                    .catch(()=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            html: `No se pudo eliminar <b>${nameProyecto}</b>.`,
                            footer: '<a href>¿Qué ha pasado?</a>'
                        })
                    })
            }//if
        })
    })

}

export default btnEliminar