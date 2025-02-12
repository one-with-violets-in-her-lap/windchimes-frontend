<script setup lang="ts">
import { computed } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'

import { includeLoadedTracksInPlaylistTracks } from '@/entities/playlists'
import { TRACKS_PORTION_SIZE, TrackItem } from '@/entities/tracks'

import type {
    GetDetailedPlaylistQuery,
    LoadedTrackGraphQl,
} from '@/shared/model/graphql-generated-types/graphql'
import { ExcludeGraphQLError } from '@/shared/utils/graphql'

const props = withDefaults(
    defineProps<{
        playlist: ExcludeGraphQLError<GetDetailedPlaylistQuery['playlist']>
        tracks: (LoadedTrackGraphQl | null)[]
        loadMoreOnScrollEnd: boolean
    }>(),
    { loadMoreOnScrollEnd: true },
)

const emit = defineEmits<{
    (event: 'load-more', tracksToLoadIds: string[]): void
}>()

function loadMoreTracks() {
    if (!props.loadMoreOnScrollEnd) {
        return
    }

    const lastLoadedIndex = props.tracks.length - 1

    emit(
        'load-more',
        props.playlist.trackReferences
            .slice(lastLoadedIndex + 1, lastLoadedIndex + TRACKS_PORTION_SIZE + 1)
            .map(trackReference => trackReference.id),
    )
}

const availableTracks = computed(() => {
    return props.tracks.filter(track => track !== null)
})

/**
 * all playlist tracks include tracks that are not loaded via virtual scroll,
 * these are tracks references that have only track's id and platform
 */
const allPlaylistTracks = computed(() =>
    includeLoadedTracksInPlaylistTracks(props.playlist.trackReferences, props.tracks),
)
</script>

<template>
    <VContainer class="mx-0 pa-0">
        <slot name="before-list"></slot>

        <VList
            v-if="playlist.trackReferences.length > 0"
            max-width="1200"
            class="pa-0"
            bg-color="background"
        >
            <RecycleScroller
                :items="availableTracks"
                :item-size="100"
                key-field="id"
                class="tracks-virtual-list"
                @scroll-end="loadMoreTracks"
            >
                <template #default="{ item, index }">
                    <TrackItem
                        :key="item.id"
                        :track="item"
                        :current-playlist="playlist"
                        :playing-options="{
                            tracksToCreateNewQueueFrom: allPlaylistTracks,
                        }"
                        :track-number="index + 1"
                    />
                </template>

                <template #after>
                    <VProgressCircular
                        v-if="
                            loadMoreOnScrollEnd &&
                            tracks.length > 0 &&
                            tracks.length < playlist.trackReferences.length
                        "
                        indeterminate
                        class="mt-3 mb-2"
                        size="40"
                    ></VProgressCircular>
                </template>
            </RecycleScroller>
        </VList>

        <VCard v-else elevation="0">
            <VCardText class="text-surface-4"> No tracks were added yet </VCardText>
        </VCard>
    </VContainer>
</template>

<style scoped>
.tracks-virtual-list {
    height: 600px;
}
</style>
