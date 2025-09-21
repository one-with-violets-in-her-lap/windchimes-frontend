<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useDisplay } from 'vuetify'

import { usePlaylistsFeedQuery } from '@/pages/home/api/playlists-feed-query'

import { PlaylistsBoard } from '@/widgets/playlists-board'

import PlaylistCreationDialog from '@/features/playlist-creation-dialog/ui/playlist-creation-dialog.vue'

import { usePreferencesStore } from '@/entities/preferences'

import LoadingContent from '@/shared/ui/feedback/loading-content.vue'
import { showTemporaryNotification } from '@/shared/utils/notifications'

const { user } = useAuth0()

const { hideDiscoverSectionOnHomePage } = storeToRefs(usePreferencesStore())
watch(hideDiscoverSectionOnHomePage, () => {
    // Fetch public playlists data for discover section only if it's missing
    if (result.value?.otherPublicPlaylists === undefined) {
        refetch({
            currentUserId: user.value?.sub,
            authorized: user.value !== undefined,
            skipOtherPublicPlaylists: hideDiscoverSectionOnHomePage.value,
        })
    }
})
function hideDiscoverSectionWithNotification() {
    hideDiscoverSectionOnHomePage.value = true
    showTemporaryNotification(
        'success',
        'Section is hidden now. To make it appear back, go to preferences (top bar right corner)',
    )
}

const { loading, error, result, restart, refetch } = usePlaylistsFeedQuery(
    user.value?.sub,
    hideDiscoverSectionOnHomePage.value,
)

const { mdAndUp } = useDisplay()
</script>

<template>
    <div class="position-relative">
        <div class="primary-lighting" :class="{ 'lighting-desktop': mdAndUp }"></div>
        <div
            class="secondary-lighting"
            :class="{ 'lighting-desktop': mdAndUp }"
        ></div>

        <div class="position-relative pa-3" :class="{ 'pa-8': mdAndUp }">
            <h1 class="text-h3 font-weight-bold mb-6">MUSIC</h1>

            <LoadingContent
                error-alert-title="Something went wrong when loading playlists"
                :loading="loading"
                :error="error"
                @retry="restart"
            >
                <section v-if="user && result" class="mb-14">
                    <PlaylistCreationDialog />

                    <PlaylistsBoard
                        :playlists="result.personalPlaylists"
                        :no-playlists-message="'You don\'t have any playlists'"
                    />
                </section>

                <p v-else class="mb-14">
                    Collect and listen to music from various streaming platforms in
                    one convenient app
                    <br />
                    Log in to create your own playlist, you can import your tracks
                    automatically
                </p>

                <section v-if="!hideDiscoverSectionOnHomePage">
                    <h2
                        class="text-h4 font-weight-bold mb-6 d-flex align-center gc-3"
                    >
                        <VBtn
                            v-tooltip="'Hide discover section'"
                            variant="flat"
                            icon="mdi-close"
                            density="compact"
                            @click="hideDiscoverSectionWithNotification"
                        >
                        </VBtn>

                        <VIcon icon="mdi-headphones" size="32px" color="surface-3" />
                        <span class="mr-2">DISCOVER</span>
                    </h2>

                    <PlaylistsBoard
                        v-if="result?.otherPublicPlaylists"
                        :playlists="result.otherPublicPlaylists"
                        :no-playlists-message="'There aren\'t any playlists to discover currently'"
                        class="mb-6"
                    />
                </section>
            </LoadingContent>
        </div>
    </div>
</template>

<style scoped>
.primary-lighting {
    position: absolute;
    top: 15px;
    right: 0px;
    width: 140px;
    height: 140px;
    background-color: color-mix(in srgb, var(--color-primary), transparent 60%);
    filter: blur(88px);
}

.secondary-lighting {
    position: absolute;
    top: 70px;
    right: 200px;
    width: 80px;
    height: 80px;
    filter: blur(122px);
    background: color-mix(in srgb, var(--color-primary), transparent 80%);
}

.primary-lighting.lighting-desktop {
    width: 250px;
    height: 241px;
    right: 0px;
    top: 15px;
    filter: blur(150px);
}

.secondary-lighting.lighting-desktop {
    width: 157px;
    height: 157px;
    right: 400px;
    top: -30px;
    filter: blur(150px);
}
</style>
