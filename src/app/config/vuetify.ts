import { VuetifyOptions } from 'vuetify'

import { teaGreenDarkTheme, teaGreenLightTheme } from '@/app/ui/vuetify-themes'

export const vuetifyConfig: VuetifyOptions = {
    theme: {
        defaultTheme: localStorage.getItem('theme') || 'teaGreenLightTheme',
        themes: { teaGreenLightTheme, teaGreenDarkTheme },
    },
    display: {
        thresholds: {
            xs: 0,
            sm: 500,
            md: 850,
            lg: 1100,
            xl: 1920,
        },
    },
    defaults: {
        VCard: {
            class: 'rounded-lg',
        },
    },
}
