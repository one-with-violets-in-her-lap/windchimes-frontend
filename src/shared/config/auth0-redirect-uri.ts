import { Capacitor } from '@capacitor/core'

const onNativePlatform = Capacitor.isNativePlatform()

export let auth0LogoutRedirectUri = `${window.location.origin}/home`
export let auth0AuthCallbackUri = `${window.location.origin}/auth-callback`

if (onNativePlatform) {
    auth0AuthCallbackUri = 'io.windchimes://auth-callback'
    auth0LogoutRedirectUri = 'io.windchimes://home'
}
