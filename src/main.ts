import { createApp } from 'vue'
// Pinia kept as placeholder per user request
// import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/styles/global.css'
import './assets/styles/animations.css'

const app = createApp(App)

// app.use(createPinia())

app.mount('#app')
