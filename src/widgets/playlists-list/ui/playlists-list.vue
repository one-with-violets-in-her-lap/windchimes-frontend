<script setup lang="ts">
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { useAuth0 } from '@auth0/auth0-vue'
import type { Playlist } from '@/entities/playlist/model/playlist'
import PlaylistCard from '@/entities/playlist/ui/playlist-card.vue'

const { user } = useAuth0()

const { loading, error, result } = useQuery<{
    playlists: Playlist[]
}>(
    gql`
        query GetPlaylists($userId: String!) {
            playlists(userId: $userId) {
                id
                name
                pictureUrl
                tracksCount
            }
        }
    `,
    { userId: user.value?.sub || '' },
)
</script>

<template>
    <div v-if="user">
        <VProgressCircular indeterminate :size="50" v-if="loading" />

        <p v-else-if="error">
            {{ error.message }}
        </p>

        <ul v-else-if="result">
            <PlaylistCard
                v-for="playlist in result.playlists"
                :key="playlist.id"
                :playlist="playlist"
            />
        </ul>
    </div>
</template>

<style scoped></style>
