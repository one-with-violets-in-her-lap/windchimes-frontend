<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useFatalErrorStore } from '@/app/model/fatal-error-store'

import PlaylistTracks from '@/widgets/playlist-tracks/ui/playlist-tracks.vue'

import {
    PlaylistActionsButtons,
    usePlaylistWithTracksQuery,
} from '@/features/playlist-actions'
import { PlaylistPicture } from '@/features/playlist-picture'
import { PlaylistTracksSearchField } from '@/features/playlist-tracks-search'
import type { SearchState } from '@/features/playlist-tracks-search/model/search'

import { NotFoundError } from '@/shared/model/errors'
import ExpandableParagraph from '@/shared/ui/expandable-paragraph.vue'
import LoadingContent from '@/shared/ui/feedback/loading-content.vue'

const playlistId = useRoute().params.id.toString()

const { handleError } = useFatalErrorStore()

const searchState = ref<SearchState>({
    enabled: false,
    filteredTracks: [],
})

const { loading, error, result, restart, fetchMore, onResult, refetch } =
    usePlaylistWithTracksQuery(+playlistId)
onResult(() => {
    if (!result.value) {
        return
    }

    if (result.value.playlist?.__typename !== 'PlaylistDetailedWithLoadedTracksGraphQL') {
        handleError(new NotFoundError('Playlist not found'))
    }
})
const playlist = computed(() =>
    result.value?.playlist?.__typename === 'PlaylistDetailedWithLoadedTracksGraphQL'
        ? result.value.playlist
        : undefined,
)

const { user } = useAuth0()
const userOwnsPlaylist = computed(
    () =>
        playlist.value && user.value && playlist.value.ownerUserId === user.value.sub,
)

const tracks = computed(() =>
    searchState.value.enabled
        ? searchState.value.filteredTracks
        : playlist.value?.loadedTracks,
)

function loadMoreTracks(ids: string[]) {
    fetchMore({
        variables: {
            tracksToLoadIds: ids,
        },
        updateQuery(previousData, { fetchMoreResult }) {
            if (
                !previousData.playlist ||
                !fetchMoreResult?.playlist ||
                previousData.playlist.__typename !==
                    'PlaylistDetailedWithLoadedTracksGraphQL' ||
                fetchMoreResult.playlist.__typename !==
                    'PlaylistDetailedWithLoadedTracksGraphQL'
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
        error-alert-title="Something went wrong when loading playlist"
        :error="error"
        @retry="restart"
    >
        <div v-if="playlist && tracks">
            <PlaylistPicture
                :playlist="playlist"
                :current-user-owns-the-playlist="userOwnsPlaylist === true"
            />

            <h1 class="text-h5 font-weight-bold mb-3">
                {{ playlist.name }}
            </h1>

            <div class="text-surface-4 mb-5 d-flex ga-3 flex-wrap">
                <time
                    class="flex-shrink-0"
                    :datetime="playlist.createdAt"
                    :title="new Date(playlist.createdAt).toLocaleString()"
                >
                    <VIcon icon="mdi-calendar mr-1" />

                    {{
                        new Date(playlist.createdAt).toLocaleDateString(undefined, {
                            dateStyle: 'medium',
                        })
                    }}
                </time>

                <span class="flex-shrink-0">
                    <VIcon icon="mdi-playlist-music" />

                    {{ playlist.trackReferences.length }} tracks
                </span>

                <span
                    v-if="playlist.publiclyAvailable && userOwnsPlaylist"
                    class="flex-shrink-0"
                >
                    <VIcon icon="mdi-account-multiple" />

                    Public
                </span>
            </div>

            <ExpandableParagraph
                v-if="playlist.description"
                class="playlist-description text-subtitle-1 mb-5"
            >
                {{ playlist.description }}
            </ExpandableParagraph>

            <PlaylistActionsButtons
                :playlist="playlist"
                :user-is-owner="playlist.ownerUserId === user?.sub"
                class="mb-13"
                @update="refetch()"
            />

            <Transition name="scale-up" appear>
                <PlaylistTracks
                    :playlist="playlist"
                    :tracks="tracks"
                    :load-more-on-scroll-end="!searchState.enabled"
                    @load-more="loadMoreTracks"
                >
                    <template #before-list>
                        <PlaylistTracksSearchField
                            v-model:search-state="searchState"
                            :loaded-tracks="playlist.loadedTracks"
                        />
                    </template>
                </PlaylistTracks>
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
