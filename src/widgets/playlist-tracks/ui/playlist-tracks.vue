<script setup lang="ts">
import { computed } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import { TRACKS_PORTION_SIZE, TrackItem } from '@/entities/tracks'
import { includeLoadedTracksInPlaylistTracks } from '@/entities/playlists'
import { ExcludeGraphQLError } from '@/shared/utils/graphql'
import type { GetPlaylistWithTracksQuery } from '@/shared/model/graphql-generated-types/graphql'

const props = defineProps<{
    playlist: ExcludeGraphQLError<GetPlaylistWithTracksQuery['playlist']>
}>()

const emit = defineEmits<{
    (event: 'load-more', tracksToLoadIds: string[]): void
}>()

function loadMoreTracks() {
    const lastLoadedIndex = props.playlist.loadedTracks.length - 1

    emit(
        'load-more',
        props.playlist.trackReferences
            .slice(lastLoadedIndex + 1, lastLoadedIndex + TRACKS_PORTION_SIZE + 1)
            .map(trackReference => trackReference.id),
    )
}

const availableTracks = computed(() => {
    return props.playlist.loadedTracks.filter(track => track !== null)
})

/**
 * all playlist tracks include tracks that are not loaded via virtual scroll,
 * these are tracks references that have only track's id and platform
 */
const allPlaylistTracks = computed(() =>
    includeLoadedTracksInPlaylistTracks(
        props.playlist.trackReferences,
        props.playlist.loadedTracks,
    ),
)
</script>

<template>
    <VList v-if="playlist.trackReferences.length > 0" max-width="1200">
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
                    :playing-options="{
                        tracksToCreateNewQueueFrom: allPlaylistTracks,
                    }"
                    :track-number="index + 1"
                />
            </template>

            <template #after>
                <VProgressCircular
                    v-if="
                        playlist.loadedTracks.length > 0 &&
                        playlist.loadedTracks.length <
                            playlist.trackReferences.length
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
</template>

<style scoped>
.tracks-virtual-list {
    height: 600px;
}
</style>
