<script setup lang="ts">
import PlaylistCard from '@/entities/playlist/ui/playlist-card.vue'
import LoadingContent from '@/shared/ui/loading-content.vue'
import { computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { usePlaylistsQuery } from '@/widgets/playlists-list/api/playlists-query'

const { user } = useAuth0()

const { loading, error, result, restart } = usePlaylistsQuery(user.value?.sub || '')
const playlistsQueryError = computed(() => {
    if (result.value?.playlists.__typename === 'ErrorGraphQL') {
        return result.value.playlists
    } else {
        return null
    }
})
</script>

<template>
    <div v-if="user">
        <LoadingContent
            :loading="loading"
            :error="playlistsQueryError || error"
            @retry="restart"
        >
            <Transition name="slide-left" appear>
                <div v-if="result?.playlists.__typename === 'PlaylistGraphQLListResponseWrapperGraphQL'">
                    <PlaylistCard
                        v-for="playlist in result.playlists.items"
                        :key="playlist.id"
                        :playlist="playlist"
                    />
                </div>
            </Transition>
        </LoadingContent>
    </div>
</template>

<style scoped></style>
