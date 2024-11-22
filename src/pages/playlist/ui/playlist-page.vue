<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import LoadingContent from '@/shared/ui/feedback/loading-content.vue'
import PlaylistTracks from '@/widgets/playlist-tracks/ui/playlist-tracks.vue'
import { useRoute } from 'vue-router'
import { useFatalErrorStore } from '@/app/model/fatal-error-store'
import {
    PlaylistActionsButtons,
    usePlaylistWithTracksQuery,
} from '@/features/playlist-actions'
import { NotFoundError } from '@/shared/model/errors'
import ExpandableParagraph from '@/shared/ui/expandable-paragraph.vue'

const playlistId = useRoute().params.id.toString()

const { user } = useAuth0()

const { handleError } = useFatalErrorStore()

const { loading, error, result, restart, fetchMore, onResult, refetch } =
    usePlaylistWithTracksQuery(+playlistId)
onResult(() => {
    if (!result.value) {
        return
    }

    if (result.value.playlist?.__typename !== 'PlaylistWithTracksGraphQL') {
        handleError(new NotFoundError('Playlist not found'))
    }
})

function loadMoreTracks(ids: number[]) {
    fetchMore({
        variables: {
            tracksToLoadIds: ids,
        },
        updateQuery(previousData, { fetchMoreResult }) {
            if (
                !previousData.playlist ||
                !fetchMoreResult?.playlist ||
                previousData.playlist.__typename !== 'PlaylistWithTracksGraphQL' ||
                fetchMoreResult.playlist.__typename !== 'PlaylistWithTracksGraphQL'
            ) {
                return previousData
            }

            return {
                ...previousData,
                playlist: {
                    ...previousData.playlist,
                    loadedTracks: [
                        ...(previousData.playlist.loadedTracks || []),
                        ...(fetchMoreResult.playlist.loadedTracks || []),
                    ],
                },
            }
        },
    })
}
</script>

<template>
    <LoadingContent
        :loading="loading && !result"
        skeleton="list-item-three-line"
        :error="error"
        @retry="restart"
    >
        <div
            v-if="
                result?.playlist &&
                result.playlist.__typename === 'PlaylistWithTracksGraphQL'
            "
        >
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
                    :title="new Date(result.playlist.createdAt).toLocaleString()"
                >
                    {{
                        new Date(result.playlist.createdAt).toLocaleDateString(
                            undefined,
                            { dateStyle: 'medium' },
                        )
                    }}
                </time>

                <VIcon icon="mdi-playlist-music" />

                {{ result.playlist.tracksReferences.length }} tracks
            </div>

            <ExpandableParagraph
                v-if="result.playlist.description"
                class="playlist-description text-subtitle-1 mb-5"
            >
                {{ result.playlist.description }}
            </ExpandableParagraph>

            <PlaylistActionsButtons
                v-if="result.playlist.ownerUserId === user?.sub"
                :playlist="result.playlist"
                @update="refetch()"
            />

            <Transition name="scale-up" appear>
                <PlaylistTracks
                    :playlist="result.playlist"
                    @load-more="loadMoreTracks"
                />
            </Transition>
        </div>
    </LoadingContent>
</template>

<style scoped>
.playlist-description {
    white-space: pre-wrap;
    max-width: 800px;
}
</style>
