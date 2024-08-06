<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { usePlaylistsQuery } from '../api/playlists-query'
import PlaylistCard from '@/entities/playlist/ui/playlist-card.vue'

const { user } = useAuth0()

const { loading, error, result, restart } = usePlaylistsQuery(
    user.value?.sub || '',
)
</script>

<template>
    <div v-if="user">
        <VProgressCircular indeterminate :size="50" v-if="loading" />

        <VAlert
            v-else-if="error"
            title="Something went wrong when loading playlists"
            type="error"
        >
            <p class="my-3"><b>Error:</b> {{ error.message }}</p>

            <VBtn prepend-icon="mdi-reload" @click="restart"> Try again </VBtn>
        </VAlert>

        <Transition v-else-if="result" appear name="playlist-card-slide">
            <ul>
                <PlaylistCard
                    v-for="playlist in result.playlists"
                    :key="playlist.id"
                    :playlist="playlist"
                />
            </ul>
        </Transition>
    </div>
</template>

<style scoped>
.playlist-card-slide-enter-active,
.playlist-card-slide-leave-active {
    transition:
        transform 0.6s ease,
        opacity 0.6s ease;
}

.playlist-card-slide-enter-from,
.playlist-card-slide-leave-to {
    opacity: 0;
    transform: translateX(40px);
}
</style>
