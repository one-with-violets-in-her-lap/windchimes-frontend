import { Capacitor } from '@capacitor/core'

const onNativePlatform = Capacitor.isNativePlatform()

export let auth0LogoutRedirectUri = 'http://localhost:5173/home'
export let auth0AuthCallbackUri = 'http://localhost:5173/auth-callback'

if (onNativePlatform) {
    auth0AuthCallbackUri = 'io.windchimes://auth-callback'
    auth0LogoutRedirectUri = 'io.windchimes://home'
}
