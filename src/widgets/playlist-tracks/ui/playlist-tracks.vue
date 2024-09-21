<script setup lang="ts">
import { computed, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { TrackItem } from '@/features/track'
import { ExcludeGraphQLError } from '@/shared/utils/exclude-graphql-error'
import type {
    GetPlaylistWithTracksQuery,
    TrackReferenceGraphQl,
} from '@/shared/model/graphql-generated-types/graphql'
import { PlaylistTrack } from '@/entities/tracks'

const TRACKS_PORTION_SIZE = 30

const props = defineProps<{
    playlist: ExcludeGraphQLError<GetPlaylistWithTracksQuery['playlist']>
}>()

const emit = defineEmits<{
    (event: 'load-more', tracksToLoadIds: number[]): void
}>()

const loadMoreTriggerElement = ref<HTMLElement>()
useIntersectionObserver(loadMoreTriggerElement, entries => {
    if (entries[0].isIntersecting) {
        const lastLoadedIndex = props.playlist.loadedTracks.length - 1

        emit(
            'load-more',
            props.playlist.tracksReferences
                .slice(lastLoadedIndex + 1, lastLoadedIndex + TRACKS_PORTION_SIZE + 1)
                .map(trackReference => trackReference.id),
        )
    }
})

const availableTracks = computed(() => {
    return props.playlist.loadedTracks.filter(track => track !== null)
})

/**
 * all playlist tracks include tracks that are not loaded via virtual scroll,
 * these are tracks references that have only track's id and platform
 */
const allPlaylistTracks = computed(() => {
    const tracksReferences: (TrackReferenceGraphQl | PlaylistTrack)[] = [
        ...props.playlist.tracksReferences,
    ]

    availableTracks.value.forEach(loadedTrack => {
        const matchingTrackReferenceIndex = tracksReferences.findIndex(
            trackReference => trackReference.id === loadedTrack.id,
        )
        if (matchingTrackReferenceIndex !== -1) {
            tracksReferences[matchingTrackReferenceIndex] = loadedTrack
        }
    })

    return tracksReferences
})
</script>

<template>
    <div>
        <VList v-if="playlist.loadedTracks.length > 0" rounded class="mb-3">
            <TrackItem
                v-for="(track, index) in availableTracks"
                :key="track.id"
                :track="track"
                :all-playlist-tracks="allPlaylistTracks"
                :track-number="index + 1"
            />
        </VList>

        <VCard v-else elevation="0">
            <VCardText class="text-surface-4"> No tracks were added yet </VCardText>
        </VCard>

        <VProgressCircular
            v-if="playlist.loadedTracks.length < playlist.tracksReferences.length"
            ref="loadMoreTriggerElement"
            indeterminate
            size="40"
        ></VProgressCircular>
    </div>
</template>

<style scoped></style>
