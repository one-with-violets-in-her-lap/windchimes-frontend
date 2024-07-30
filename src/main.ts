import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { teaGreenTheme } from '@/app/ui/vuetify-themes'
import '@mdi/font/css/materialdesignicons.css'

import { createPinia } from 'pinia'

import App from '@/app/ui/App.vue'
import router from '@/app/config/router'
import auth0 from '@/app/config/auth0'
import { useAppErrorStore } from '@/app/model/app-error-store'

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
app.use(auth0)

app.config.errorHandler = error => {
    const { handleError } = useAppErrorStore()
    handleError(error)
}

app.mount('#app')
