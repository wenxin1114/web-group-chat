import { createApp } from 'vue'
import {install} from '@icon-park/vue-next/es/all';
import './style.css'
import '@icon-park/vue-next/styles/index.css';
import App from './App.vue'
import axios from './http'
import router from './router'
import store from './store';

const app = createApp(App)
app.config.globalProperties.$axios = axios
install(app);
app.use(router)
app.use(store)
app.mount('#app')
