<script setup lang="ts">
import LoadingContent from '@/shared/ui/loading-content.vue'
import PlaylistTracks from '@/widgets/playlist-tracks/ui/playlist-tracks.vue'
import { useRoute } from 'vue-router'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import type {
    GetPlaylistWithTracksQuery,
    GetPlaylistWithTracksQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

const playlistId = useRoute().params.id.toString()

// crap needs refactoring
const { loading, error, result, restart, fetchMore } = useQuery<
    GetPlaylistWithTracksQuery,
    GetPlaylistWithTracksQueryVariables
>(
    gql`
        query GetPlaylistWithTracks($playlistId: Int!, $tracksOffset: Int) {
            playlist(playlistId: $playlistId, tracksOffset: $tracksOffset) {
                id
                createdAt
                name
                pictureUrl
                tracksCount
                description

                tracks {
                    items {
                        id
                        platformId
                        name
                        platform
                        secondsDuration
                        pictureUrl

                        owner {
                            name
                        }
                    }
                    totalItemsCount
                }
            }
        }
    `,
    { playlistId: +playlistId },
)
</script>

<template>
    <LoadingContent
        :loading="loading && !result"
        skeleton="list-item-three-line"
        :error="error"
        @retry="restart"
    >
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

            <div class="text-surface-4 mb-5">
                <VIcon icon="mdi-calendar mr-1" />

                <time
                    class="mr-3"
                    :datetime="result.playlist.createdAt"
                    :title="
                        new Date(result.playlist.createdAt).toLocaleString()
                    "
                >
                    {{
                        new Date(result.playlist.createdAt).toLocaleDateString(
                            undefined,
                            { dateStyle: 'medium' },
                        )
                    }}
                </time>

                <VIcon icon="mdi-playlist-music" />

                {{ result.playlist.tracksCount }} tracks
            </div>

            <p v-if="result.playlist.description" class="text-subtitle-1 mb-7">
                {{ result.playlist.description }}
            </p>

            <Transition name="scale-up" appear>
                <PlaylistTracks
                    :playlist="result.playlist"
                    @load-more="
                        fetchMore({
                            variables: {
                                tracksOffset:
                                    result.playlist.tracks.items.length,
                            },
                            updateQuery(previousData, { fetchMoreResult }) {
                                if (
                                    !previousData.playlist ||
                                    !fetchMoreResult?.playlist
                                ) {
                                    return previousData
                                }

                                return {
                                    ...previousData,
                                    playlist: {
                                        ...previousData.playlist,
                                        tracks: {
                                            ...previousData.playlist.tracks,
                                            items: [
                                                ...(previousData.playlist.tracks
                                                    .items || []),
                                                ...(fetchMoreResult.playlist
                                                    .tracks.items || []),
                                            ],
                                        },
                                    },
                                }
                            },
                        })
                    "
                />
            </Transition>
        </div>
    </LoadingContent>
</template>

<style scoped></style>
