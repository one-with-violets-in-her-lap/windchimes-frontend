<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'

const { user, loginWithRedirect } = useAuth0()

async function logIn() {
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
</script>

<template>
    <span v-if="user">
        {{ user.nickname }}
    </span>

    <VBtn
        v-else
        variant="flat"
        density="compact"
        class="text-capitalize px-0"
        prepend-icon="mdi-login"
        @click="logIn"
    >
        Log in
    </VBtn>
</template>

<style scoped></style>
