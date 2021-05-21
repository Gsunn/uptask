import { alerta, consejo } from '../funciones/notificaciones'

setTimeout(() => {
  console.log(locals.mensajes);
  alerta('asdasdasd')
}, 1000)


const btnEnviar = document.querySelector('#enviar')
btnEnviar.addEventListener('click', (e)=>{
  e.preventDefault()
  console.log(e)  
  //alerta('fsdfsdfsdf')
})

export{ btnEnviar, alerta, consejo }; 

// import {alerta, consejo} from '../funciones/notificaciones'

// //console.log(notificaciones)

// const btn1 = document.querySelector('#btn1')
// // const btn2 = document.querySelector('#btn2')


// btn1.addEventListener('click', (e)=>{
//   console.log('btn1')  
//   alerta('fsdfsdfsdf')
// })

// // btn2.addEventListener('click', (e)=>{
// //     console.log('btn2')  
// //   })

// // const buttons = {
// //     btn1: btn1,
// //     btn2:btn2,
// //     ver: function(){
// //         alerta('prueba')
// //     }
// // }


// export default  btn1;
// // //export default btn2;

// // function ver(){
// //     console.log('ver ver ver')
// // }

// // export { ver, alerta, btn1 }; 