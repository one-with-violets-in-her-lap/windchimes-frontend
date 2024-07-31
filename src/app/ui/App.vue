<script setup lang="ts">
import { onErrorCaptured } from 'vue'
import { storeToRefs } from 'pinia'
import { App } from '@capacitor/app'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAppErrorStore } from '@/app/model/app-error-store'
import NavigationBar from '@/widgets/navigation-bar/ui/navigation-bar.vue'

const appErrorStore = useAppErrorStore()
const { handleError } = appErrorStore
const { error } = storeToRefs(appErrorStore)

onErrorCaptured(handleError)

const { handleRedirectCallback, isLoading } = useAuth0()

// listens to redirect to `io.windchimes://auth-callback?state=...&code=....` deep link
App.addListener('appUrlOpen', async event => {
    if (event.url.includes('state') && event.url.includes('code')) {
        await handleRedirectCallback(event.url)
    }
})
</script>

<template>
    <div class="root-container" v-if="!isLoading">
        <NavigationBar />

        <main class="main-content-container">
            <RouterView v-if="!error" />

            <div v-else>
                {{ error.explanation }}
            </div>
        </main>
    </div>
</template>

<style>
@import url('@/assets/styles/typography.css');

.root-container {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    overflow: hidden;
}

.main-content-container {
    flex-grow: 1;
    padding: 15px 12px;
    background-color: rgb(var(--v-theme-background));
}
</style>
