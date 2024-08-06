import type { ThemeDefinition } from 'vuetify'

export const teaGreenLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#FFFFFF',
        surface: '#f4f4f4',
        'surface-2': '#ededed',
        'surface-3': '#e2e0e0',
        primary: '#60D770',
        'primary-lighten-1': '#81e88f',
        'primary-darken-1': '#68CC76',
        secondary: '#60D770',
        'secondary-darken-1': '#68CC76',
        error: '#F06060',
        info: '#8DE599',
        success: '#8DE599',
        warning: '#FFC960',
    },
}

export const teaGreenDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        background: '#1c1c1c',
        surface: '#282828',
        'surface-2': '#353535',
        'surface-3': '#474747',
        primary: '#60D770',
        'primary-lighten-1': '#81e88f',
        'primary-darken-1': '#68CC76',
        secondary: '#60D770',
        'secondary-darken-1': '#68CC76',
        error: '#F06060',
        info: '#8DE599',
        success: '#8DE599',
        warning: '#FFC960',
    },
}
