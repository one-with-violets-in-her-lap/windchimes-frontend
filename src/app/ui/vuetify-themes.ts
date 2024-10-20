import type { ThemeDefinition } from 'vuetify'

export const teaGreenLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        'background-contrast': '#1e1e1e',
        background: '#FFFFFF',
        surface: '#efefef',
        'surface-2': '#DDDDDD',
        'surface-3': '#C1C1C1',
        'surface-4': '#878787',
        primary: '#715AFF',
        'primary-lighten-1': '#715AFF',
        'primary-darken-1': '#715AFF',
        secondary: '#715AFF',
        'secondary-darken-1': '#715AFF',
        error: '#E87474',
        info: '#3ca7d8',
        success: '#68CC76',
        warning: '#FFC960',
    },
}

export const teaGreenDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        'background-contrast': '#FFFFFF',
        background: '#1C1C1C',
        surface: '#282828',
        'surface-2': '#353535',
        'surface-3': '#474747',
        'surface-4': '#939393',
        primary: '#715AFF',
        'primary-lighten-1': '#715AFF',
        'primary-darken-1': '#715AFF',
        secondary: '#715AFF',
        'secondary-darken-1': '#715AFF',
        error: '#e87474',
        info: '#3ca7d8',
        success: '#8DE599',
        warning: '#FFC960',
    },
}
