<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { App } from '@capacitor/app'
import { useApolloClient } from '@vue/apollo-composable'
import { storeToRefs } from 'pinia'
import { onErrorCaptured, onMounted } from 'vue'

import { useFatalErrorStore } from '@/app/model/fatal-error-store'

import { NotificationsQueue } from '@/widgets/notifications-queue'
import PlayerToolbar from '@/widgets/player-toolbar/ui/player-toolbar.vue'

import {
    initializePlayer,
    usePlayerMediaLoadErrorNotifications,
} from '@/features/player'

import AppBar from './app-bar.vue'

const fatalErrorStore = useFatalErrorStore()
const { handleError } = fatalErrorStore
const { error } = storeToRefs(fatalErrorStore)
onErrorCaptured(handleError)

const { client: apolloClient } = useApolloClient()

const { handleRedirectCallback, isLoading } = useAuth0()

// listens to redirect to `io.windchimes://auth-callback?state=...&code=....` deep link
App.addListener('appUrlOpen', async event => {
    if (event.url.includes('state') && event.url.includes('code')) {
        await handleRedirectCallback(event.url)
        apolloClient.resetStore()
    }
})

onMounted(() => {
    initializePlayer()
})
usePlayerMediaLoadErrorNotifications()
</script>

<template>
    <VApp>
        <div v-if="!isLoading" class="root-container">
            <AppBar />

            <main class="main-content-container">
                <RouterView v-if="!error" />

                <div v-else>
                    {{ error.explanation }}
                </div>
            </main>

            <PlayerToolbar />

            <NotificationsQueue />
        </div>
    </VApp>
</template>
