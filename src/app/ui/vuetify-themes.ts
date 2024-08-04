import type { ThemeDefinition } from 'vuetify'

export const teaGreenLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#FFFFFF',
        surface: '#f2f2f2',
        'surface-darken-1': '#ededed',
        'surface-darken-2': '#e2e0e0',
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
        background: '#282828',
        surface: '#353535',
        'surface-darken-1': '#353535',
        'surface-darken-2': '#353535',
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
