import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { teaGreenLightTheme, teaGreenDarkTheme } from '@/app/ui/vuetify-themes'
import '@mdi/font/css/materialdesignicons.css'

import { createPinia } from 'pinia'
import { DefaultApolloClient } from '@vue/apollo-composable'

import App from '@/app/ui/App.vue'
import router from '@/app/config/router'
import auth0 from '@/app/config/auth0'
import apolloClient from '@/app/config/apollo-client'
import { useAppErrorStore } from '@/app/model/app-error-store'

const app = createApp(App)

app.provide(DefaultApolloClient, apolloClient)
app.use(createPinia())
app.use(router)
app.use(
    createVuetify({
        theme: {
            defaultTheme: localStorage.getItem('theme') || 'teaGreenLightTheme',
            themes: { teaGreenLightTheme, teaGreenDarkTheme },
        },
    }),
)
app.use(auth0)

app.config.errorHandler = error => {
    const { handleError } = useAppErrorStore()
    handleError(error)
}

app.mount('#app')
