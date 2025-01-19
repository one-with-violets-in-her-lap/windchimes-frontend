import { useAuth0 } from '@auth0/auth0-vue'
import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'

import { auth0LogoutRedirectUri } from '@/shared/config/auth0-redirect-uri'

export function useCurrentAccountActions() {
    const { loginWithRedirect, logout } = useAuth0()

    async function requestLogIn() {
        if (Capacitor.isNativePlatform()) {
            await loginWithRedirect({
                openUrl(url) {
                    Browser.open({ url })
                },
            })
        } else {
            await loginWithRedirect()
        }
    }

    async function requestLogout() {
        const options = { logoutParams: { returnTo: auth0LogoutRedirectUri } }

        if (Capacitor.isNativePlatform()) {
            await logout({
                ...options,
                openUrl(url) {
                    Browser.open({ url })
                },
            })
        } else {
            await logout(options)
        }
    }

    return { requestLogIn, requestLogout }
}
