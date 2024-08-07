<script setup lang="ts">
import LoadingContent from '@/shared/ui/loading-content.vue'
import { useRoute } from 'vue-router'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import type {
    GetPlaylistWithTracksQuery,
    GetPlaylistWithTracksQueryVariables,
} from '@/shared/utils/graphql-generated-types/graphql'

const playlistId = useRoute().params.id.toString()

const { loading, error, result } = useQuery<
    GetPlaylistWithTracksQuery,
    GetPlaylistWithTracksQueryVariables
>(
    gql`
        query GetPlaylistWithTracks($playlistId: Int!) {
            playlist(playlistId: $playlistId) {
                id
                name
                pictureUrl
                tracksCount
                description

                tracks {
                    platformId
                    name
                    pictureUrl
                }
            }
        }
    `,
    { playlistId: +playlistId },
)
</script>

<template>
    <LoadingContent :loading="loading" :error="error">
        <div v-if="result?.playlist">
            <VAvatar
                v-if="result.playlist.pictureUrl"
                :image="result.playlist.pictureUrl"
                size="140px"
                tile
                rounded
                variant="outlined"
                color="surface-3"
                class="mb-4"
            />

            <h1 class="text-h5 font-weight-bold mb-1">
                {{ result.playlist.name }}
            </h1>

            <div class="text-surface-4 mb-2">
                <!-- <span class="font-weight-bold">·</span> -->
                <VIcon icon="mdi-playlist-music"/>
                {{ result.playlist.tracksCount }} tracks
            </div>

            <p v-if="result.playlist.description" class="text-subtitle-1 mb-5">
                {{ result.playlist.description }}
            </p>

            <Transition name="scale-up" appear>
                <VList rounded>
                    <VListItem
                        v-for="track in result.playlist.tracks"
                        :key="track.platformId"
                        prepend-icon="mdi-music"
                    >
                        {{ track.name }}
                    </VListItem>
                </VList>
            </Transition>
        </div>
    </LoadingContent>
</template>

<style scoped></style>
