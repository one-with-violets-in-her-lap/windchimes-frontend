import type { ThemeDefinition } from 'vuetify'

export const teaGreenLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#FFFFFF',
        'background-contrast': '#1C1C1C',
        surface: '#F4F4F4',
        'surface-2': '#DDDDDD',
        'surface-3': '#C1C1C1',
        'surface-4': '#878787',
        primary: '#60D770',
        'primary-lighten-1': '#81E88F',
        'primary-darken-1': '#68CC76',
        secondary: '#60D770',
        'secondary-darken-1': '#68CC76',
        error: '#E87474',
        info: '#3ca7d8',
        success: '#68CC76',
        warning: '#FFC960',
    },
}

export const teaGreenDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        background: '#1C1C1C',
        'background-contrast': '#FFFFFF',
        surface: '#282828',
        'surface-2': '#353535',
        'surface-3': '#474747',
        'surface-4': '#939393',
        primary: '#60D770',
        'primary-lighten-1': '#81e88f',
        'primary-darken-1': '#68CC76',
        secondary: '#60D770',
        'secondary-darken-1': '#68CC76',
        error: '#e87474',
        info: '#3ca7d8',
        success: '#8DE599',
        warning: '#FFC960',
    },
}
