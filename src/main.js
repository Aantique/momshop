import {createApp} from 'vue'
import App from './App.vue'
import router from '../src/router/router'
import store from '../src/store/store'
import installElementPlus from './plugins/element'
import './assets/css/icon.css'
const app = createApp(App)
installElementPlus(app)
app
    .use(store)
    .use(router)
    .mount('#app')
