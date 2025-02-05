<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'

import { usePlaylistWithTracksQuery } from '@/features/playlist-actions'

import { TrackItem } from '@/entities/tracks'

import { FatalError } from '@/shared/model/errors'
import LoadingContent from '@/shared/ui/feedback/loading-content.vue'

const route = useRoute()
const searchQuery = computed(() => route.query['search-query'])

const { mdAndDown } = useDisplay()

if (!searchQuery.value) {
    throw new FatalError(
        'search-url-broken-error',
        'Search failed because your link is broken',
    )
}

// Tracks mocked for now
const { loading, error, result, restart } = usePlaylistWithTracksQuery(571)

const playlist = computed(() =>
    result.value?.playlist?.__typename === 'PlaylistWithLoadedTracksGraphQL'
        ? result.value.playlist
        : undefined,
)

const tracks = computed(() =>
    playlist.value?.loadedTracks.filter(track => track !== null),
)
</script>

<template>
    <VContainer>
        <h1 class="text-h3 mb-1">Search</h1>

        <p class="text-surface-4 mb-8">"{{ searchQuery }}"</p>

        <LoadingContent
            :loading
            :error
            skeleton="list-item-three-line"
            @retry="restart"
        >
            <VRow v-if="playlist?.loadedTracks">
                <VCol
                    v-for="(track, index) in tracks"
                    :key="track.id"
                    :cols="mdAndDown ? 12 : 6"
                >
                    <TrackItem
                        :track
                        :track-number="index + 1"
                        :playing-options="{
                            tracksToCreateNewQueueFrom: tracks,
                        }"
                    />
                </VCol>
            </VRow>
        </LoadingContent>
    </VContainer>
</template>

<style scoped></style>
