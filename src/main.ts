import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { monoTheme } from '@/themes/mono'

import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createVuetify({
    theme: {
        defaultTheme: 'monoTheme',
        themes: { monoTheme }
    }
}))

app.mount('#app')
