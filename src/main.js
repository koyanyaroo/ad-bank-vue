import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './index.css'

// ← Set this once so you don’t repeat the full URL everywhere
axios.defaults.baseURL = 'https://ad-finance-bank.test/api/v1'

const token = localStorage.getItem('auth_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

createApp(App)
    .use(router)
    .mount('#app')
