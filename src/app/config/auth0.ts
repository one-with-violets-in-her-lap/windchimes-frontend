import { createAuth0 } from '@auth0/auth0-vue'
import { Capacitor } from '@capacitor/core'

const onNativePlatform = Capacitor.isNativePlatform()

let redirectUri = 'http://localhost:5173/auth-callback'
if (onNativePlatform) {
    redirectUri = 'io.windchimes://auth-callback'
}

export default createAuth0(
    {
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        useRefreshTokens: true,
        useRefreshTokensFallback: false,
        cacheLocation: 'localstorage',
        authorizationParams: {
            redirect_uri: redirectUri,
        },
    },
    {
        // call redirect callback manually if on android/ios
        skipRedirectCallback: onNativePlatform,
    },
)
