import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { teaGreenTheme } from '@/themes/tea-green'
import '@mdi/font/css/materialdesignicons.css'

import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(
    createVuetify({
        theme: {
            defaultTheme: 'teaGreenTheme',
            themes: { teaGreenTheme },
        },
    }),
)

app.mount('#app')
