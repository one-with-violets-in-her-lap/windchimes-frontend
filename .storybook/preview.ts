import '@mdi/font/css/materialdesignicons.css'
import { type Preview, setup } from '@storybook/vue3-vite'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

import { vuetifyConfig } from '../src/app/config/vuetify'
import '../src/assets/styles/main.css'

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'todo',
        },
    },
}

setup(app => app.use(createVuetify(vuetifyConfig)))

export default preview
