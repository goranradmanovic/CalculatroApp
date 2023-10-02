import { createApp } from 'vue'
import App from './App.vue'
// import './assets/main.css'
import './assets/tailwind.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMinus, faDivide, faXmark, faEquals, faPercent, faAngleUp } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faMinus, faDivide, faXmark, faEquals, faPercent, faAngleUp)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
