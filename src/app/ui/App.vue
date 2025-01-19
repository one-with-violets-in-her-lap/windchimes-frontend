<script setup lang="ts">
import NavigationBar from '@/widgets/navigation-bar/ui/navigation-bar.vue'
import PlayerToolbar from '@/widgets/player-toolbar/ui/player-toolbar.vue'
import NotificationsList from '@/widgets/notifications-list/ui/notifications-list.vue'

import { onErrorCaptured } from 'vue'
import { storeToRefs } from 'pinia'
import { useApolloClient } from '@vue/apollo-composable'
import { App } from '@capacitor/app'
import { useAuth0 } from '@auth0/auth0-vue'
import { useFatalErrorStore } from '@/app/model/fatal-error-store'

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
            <NavigationBar />

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
