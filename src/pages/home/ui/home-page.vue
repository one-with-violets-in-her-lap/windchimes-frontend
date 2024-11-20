<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuth0 } from '@auth0/auth0-vue'
import { usePlaylistsFeedQuery } from '@/pages/home/api/playlists-feed-query'
import PlaylistCreationDialog from '@/features/playlist-creation-dialog/ui/playlist-creation-dialog.vue'
import { PlaylistsBoard } from '@/entities/playlists'
import LoadingContent from '@/shared/ui/feedback/loading-content.vue'

const { user } = useAuth0()

const { loading, error, result, restart } = usePlaylistsFeedQuery(user.value?.sub)
const { mdAndUp } = useDisplay()

const playlistsFeedQueryError = computed(() => {
    if (
        result.value?.personalPlaylists.__typename === 'ErrorGraphQL' &&
        result.value.personalPlaylists.name !== 'unauthorized-error'
    ) {
        return result.value.personalPlaylists
    } else if (result.value?.otherPublicPlaylists.__typename === 'ErrorGraphQL') {
        return result.value.otherPublicPlaylists
    } else {
        return null
    }
})
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
                :loading="loading"
                :error="playlistsFeedQueryError || error"
                @retry="restart"
            >
                <section
                    v-if="
                        user &&
                        result?.personalPlaylists.__typename ===
                            'PlaylistGraphQLListResponseWrapperGraphQL'
                    "
                    class="mb-14"
                >
                    <PlaylistCreationDialog />

                    <PlaylistsBoard
                        :playlists="result.personalPlaylists.items"
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

                <section>
                    <h2
                        class="text-h4 font-weight-bold mb-6 d-flex align-center gc-3"
                    >
                        DISCOVER
                        <VIcon icon="mdi-headphones" size="32px" color="surface-3" />
                    </h2>

                    <PlaylistsBoard
                        v-if="
                            result?.otherPublicPlaylists.__typename ===
                            'PlaylistGraphQLListResponseWrapperGraphQL'
                        "
                        :playlists="result.otherPublicPlaylists.items"
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
    background: rgb(125, 128, 218, 0.85);
    filter: blur(68px);
}

.secondary-lighting {
    position: absolute;
    top: 70px;
    right: 200px;
    width: 80px;
    height: 80px;
    filter: blur(62px);
    background: rgb(255, 119, 89, 0.9);
}

.primary-lighting.lighting-desktop {
    width: 250px;
    height: 241px;
    right: 0px;
    top: 15px;
    filter: blur(120px);
}

.secondary-lighting.lighting-desktop {
    width: 157px;
    height: 157px;
    right: 400px;
    top: -30px;
    filter: blur(120px);
}
</style>
