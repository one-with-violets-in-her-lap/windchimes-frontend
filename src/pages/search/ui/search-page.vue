<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'

import { useTracksSearchQuery } from '@/pages/search/api/tracks-search'

import { TrackItem } from '@/entities/tracks'

import { FatalError } from '@/shared/model/errors'
import LoadingContent from '@/shared/ui/feedback/loading-content.vue'

const route = useRoute()
const searchQuery = computed(() => route.query['search-query'])
if (!searchQuery.value) {
    throw new FatalError(
        'search-url-broken-error',
        'Search failed because your link is broken',
    )
}

watch(searchQuery, () => {
    if (searchQuery.value) {
        tracksSearchQuery.refetch({ searchQuery: searchQuery.value?.toString() })
    }
})

const { mdAndDown } = useDisplay()

const tracksSearchQuery = useTracksSearchQuery(searchQuery.value.toString())
const error = computed(() => {
    if (
        tracksSearchQuery.result.value?.loadedTracks.__typename === 'GraphQLApiError'
    ) {
        return tracksSearchQuery.result.value.loadedTracks
    } else {
        return tracksSearchQuery.error.value
    }
})

const foundTracks = computed(() =>
    tracksSearchQuery.result.value?.loadedTracks.__typename === 'LoadedTracksWrapper'
        ? tracksSearchQuery.result.value.loadedTracks
        : undefined,
)

const availableTracks = computed(() =>
    foundTracks.value?.items.filter(track => track !== null),
)
</script>

<template>
    <VContainer>
        <h1 class="text-h3 mb-1">Search</h1>

        <p class="text-surface-4 mb-8">"{{ searchQuery }}"</p>

        <LoadingContent
            :loading="tracksSearchQuery.loading.value"
            :error
            skeleton="list-item-three-line"
            @retry="tracksSearchQuery.restart"
        >
            <VRow v-if="foundTracks">
                <VCol
                    v-for="(track, index) in availableTracks"
                    :key="track.id"
                    :cols="mdAndDown ? 12 : 6"
                >
                    <TrackItem
                        :track
                        :track-number="index + 1"
                        :playing-options="{
                            tracksToCreateNewQueueFrom: availableTracks,
                        }"
                    />
                </VCol>
            </VRow>
        </LoadingContent>
    </VContainer>
</template>

<style scoped></style>
