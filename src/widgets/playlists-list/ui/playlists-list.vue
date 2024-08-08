<script setup lang="ts">
import PlaylistCard from '@/entities/playlist/ui/playlist-card.vue'
import LoadingContent from '@/shared/ui/loading-content.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { usePlaylistsQuery } from '../api/playlists-query'

const { user } = useAuth0()

const { loading, error, result, restart } = usePlaylistsQuery(
    user.value?.sub || '',
)
</script>

<template>
    <div v-if="user">
        <LoadingContent :loading="loading" :error="error" @retry="restart">
            <Transition name="slide" appear>
                <div v-if="result">
                    <PlaylistCard
                        v-for="playlist in result.playlists"
                        :key="playlist.id"
                        :playlist="playlist"
                    />
                </div>
            </Transition>
        </LoadingContent>
    </div>
</template>

<style scoped></style>
