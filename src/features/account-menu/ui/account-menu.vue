<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { auth0LogoutRedirectUri } from '@/shared/config/auth0-redirect-uri'

const { user, loginWithRedirect, logout } = useAuth0()

async function queryLogIn() {
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

async function queryLogout() {    
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
</script>

<template>
    <VMenu v-if="user">
        <template #activator="{ props }">
            <button v-bind="props">
                <VAvatar
                    :image="user.picture"
                    color="surface-darken-1"
                    icon="mdi-user"
                    class="mr-2"
                />
                {{ user.nickname }}
                <VIcon icon="mdi-chevron-down" />
            </button>
        </template>

        <VList>
            <VListItem>
                <VBtn flat @click="queryLogout" class="text-capitalize">
                    Logout
                </VBtn>
            </VListItem>
        </VList>
    </VMenu>

    <VBtn
        v-else
        variant="flat"
        density="compact"
        class="text-capitalize px-0"
        prepend-icon="mdi-login"
        @click="queryLogIn"
    >
        Log in
    </VBtn>
</template>

<style scoped></style>
