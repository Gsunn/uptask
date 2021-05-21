//import AWN from 'awesome-notifications'

//Set global options
let globalOptions =  {
  position: 'top-right',
  durations: {
      global: 5000,
      success: 1500,
      info: 1500,
      tip: 3000,
      warning: null,
      alert: null
    },
    labels: {
      async: 'Cargando...',
      success: 'Exito'
    },
    messages: {
      async: 'Espere por favor.',
    }
}
// Initialize instance of AWN
const notifier = new AWN(globalOptions)

//notifier.tip('notificaciones activadas.')

const informar = (msg, endpoint = '')=>{
  if(msg.info){
    notifier.info(msg.info[0])
  }

  if(endpoint != ''){
    setTimeout( () => {
      window.location.href = endpoint
    }, 2000)
  }
    
}

const correcto = (msg, endpoint = '')=>{
  console.log("notificacion correcto"); 
  console.log(msg);
  if(msg){
    notifier.success(msg[0])
  }

  if(endpoint != ''){
    setTimeout( () => {
      window.location.href = endpoint
    }, 2000)
  }
    
}

const alerta = (msg)=>{
  //console.log(msg)
  if(msg.error){

      if(msg.error.length === 1){
        notifier.alert(msg.error[0])
        return
      }

      let listView = '<ul>'
  
      for (let i = 0; i < msg.error.length; i++){
          //console.log(msg.error[i]);
          listView += '<li>' + msg.error[i] + '</li>'
  
      }
  
      listView += '<ul>'
      //console.log(listView);
      //notifier.async()
      notifier.alert(listView)
  }

}

const bienvenido = (msg) => {
    //console.log(msg)
    options = {
      position: "bottom-right",
      labels : {
        success: "Bienvenido"
      }
    }

    notifier.success(msg.nombre,options )
}

const consejo = () => {
  // Call one of available functions
  notifier.tip('This is an example of tip')
  //console.log('asdasdasda')
}

const cargando = () =>{
  //console.log('cargando');

  //let promise =  new Promise(resolve => setTimeout(resolve, 1000));

  let promise =  new Promise(resolve => {

      document.addEventListener('DOMContentLoaded', () => {
          console.log('DOM LOADED 2')
          //console.log(res)
          setTimeout(resolve, 1500);
      })

  });

  //notifier.async(promise, resp => notifier.success('Página cargada.'))
  notifier.async(promise, null) //no muestra notificacion
}

const cerrarNotificaciones = () => {
  console.log('cerrar nota');
  notifier.closeToasts()
}