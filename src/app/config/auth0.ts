import { createAuth0 } from '@auth0/auth0-vue'
import { Capacitor } from '@capacitor/core'

let redirectUri = 'http://localhost:5173/auth-callback'
if (Capacitor.isNativePlatform()) {
    redirectUri =
        'io.multisourceplayer.multisourceplayer://' +
        'multi-source-player.eu.auth0.com/capacitor/' +
        'io.multisourceplayer.multisourceplayer/auth-callback'
}

console.log('uri:', redirectUri)

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
    { skipRedirectCallback: true },
)
