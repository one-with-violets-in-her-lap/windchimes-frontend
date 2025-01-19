import '@/assets/styles/main.css'
import '@mdi/font/css/materialdesignicons.css'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { createVuetify } from 'vuetify'
// Vuetify
import 'vuetify/styles'

import apolloClient from '@/app/config/apollo-client'
import auth0 from '@/app/config/auth0'
import router from '@/app/config/router'
import { vuetifyConfig } from '@/app/config/vuetify'
import { useFatalErrorStore } from '@/app/model/fatal-error-store'
import App from '@/app/ui/App.vue'

const app = createApp(App)

app.provide(DefaultApolloClient, apolloClient)
app.use(createPinia())
app.use(router)
app.use(createVuetify(vuetifyConfig))
app.use(auth0)

const { handleError, clearError } = useFatalErrorStore()
app.config.errorHandler = handleError
router.afterEach(clearError)

app.mount('#app')
