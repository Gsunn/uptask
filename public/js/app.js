//Carga los script JS de las vistas
//Crea el bundle con los script necesarios
import proyectos from './modulos/proyectos'
import tareas from './modulos/tareas'

//import sesion from './modulos/sesion'

//-import { alerta, consejo, cargando, cerrarNotificaciones } from './funciones/notificaciones'


// import { actualizarAvance, limpiarAvance } from './funciones/avance'

// document.addEventListener('DOMContentLoaded', () => {
//     console.log('addEventlistener')
//     limpiarAvance()
//     setTimeout(function(){actualizarAvance()}, 10);
// })

// (function(){
//     switch(location.pathname){
//         case '/iniciar-sesion':
//         case '/crear-cuenta':    
//             cargando()
//             //import  login from './modulos/autorizacion'
//             break
//     }
// })()

//cargando()

//console.log('app.js')

document.addEventListener('DOMContentLoaded', (res,req) => {
    console.log('DOM LOADED')
    // console.log(res)
    // console.log(req)
    //setTimeout(() => cerrarNotificaciones(), 1500);
})