import type { ThemeDefinition } from 'vuetify'

export const teaGreenLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        'background-contrast': '#1e1e1e',
        background: '#FFFFFF',
        surface: '#F5F5F5',
        'surface-2': '#e0e0e0',
        'surface-3': '#C1C1C1',
        'surface-4': '#878787',
        primary: '#6D71E5',
        secondary: '#FF7759',
        error: '#E87474',
        info: '#3ca7d8',
        success: '#3bbf69',
        warning: '#FFC960',
    },
}

export const teaGreenDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        'background-contrast': '#FFFFFF',
        background: '#1C1C1C',
        surface: '#232323',
        'surface-2': '#353535',
        'surface-3': '#474747',
        'surface-4': '#939393',
        primary: '#6D71E5',
        secondary: '#FF7759',
        error: '#e87474',
        info: '#3ca7d8',
        success: '#3bbf69',
        warning: '#FFC960',
    },
}
