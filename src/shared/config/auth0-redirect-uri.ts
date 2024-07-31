import { Capacitor } from '@capacitor/core'

const onNativePlatform = Capacitor.isNativePlatform()

export let auth0LogoutRedirectUri = 'http://localhost:5173/'

if (onNativePlatform) {
    auth0LogoutRedirectUri = 'io.windchimes://'
}

export const auth0AuthCallbackUri = auth0LogoutRedirectUri + 'auth-callback'
