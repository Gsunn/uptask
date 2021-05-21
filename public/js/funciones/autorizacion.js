//import axios from 'axios'

const btnSubmit = document.querySelector("input[type='submit']")

btnSubmit.addEventListener('click', (e) => { 
    e.preventDefault()
    console.log(e)
    alert('submit')

    // send a POST request
    axios.post('/login', {
        email: 'Finn',
        password: 'Williams'
      });

})