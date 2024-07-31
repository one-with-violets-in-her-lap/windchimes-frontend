import { createAuth0 } from '@auth0/auth0-vue'
import { Capacitor } from '@capacitor/core'
import { auth0AuthCallbackUri } from '@/shared/config/auth0-redirect-uri'

export default createAuth0(
    {
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        useRefreshTokens: true,
        useRefreshTokensFallback: false,
        cacheLocation: 'localstorage',
        authorizationParams: {
            redirect_uri: auth0AuthCallbackUri,
        },
    },
    {
        // call redirect callback manually if on android/ios
        skipRedirectCallback: Capacitor.isNativePlatform(),
    },
)
