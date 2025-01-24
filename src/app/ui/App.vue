<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { App } from '@capacitor/app'
import { useApolloClient } from '@vue/apollo-composable'
import { storeToRefs } from 'pinia'
import { onErrorCaptured } from 'vue'

import { useFatalErrorStore } from '@/app/model/fatal-error-store'

import NotificationsList from '@/widgets/notifications-list/ui/notifications-list.vue'
import PlayerToolbar from '@/widgets/player-toolbar/ui/player-toolbar.vue'

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

            <NotificationsList />
        </div>
    </VApp>
</template>
