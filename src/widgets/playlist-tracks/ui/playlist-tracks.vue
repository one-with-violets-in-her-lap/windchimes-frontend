<script setup lang="ts">
import { computed, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import TrackItem from '@/features/track/ui/track-item.vue'
import { ExcludeGraphQLError } from '@/shared/utils/exclude-graphql-error'
import type { GetPlaylistWithTracksQuery } from '@/shared/model/graphql-generated-types/graphql'

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
                .slice(
                    lastLoadedIndex,
                    lastLoadedIndex + TRACKS_PORTION_SIZE + 1,
                )
                .map(trackReference => trackReference.id),
        )
    }
})

const availableTracks = computed(() => {
    return props.playlist.loadedTracks.filter(track => track !== null)
})
</script>

<template>
    <div>
        <VList rounded class="mb-3">
            <TrackItem
                v-for="(track, index) in availableTracks"
                :key="track.id"
                :track="track"
                :all-playlist-tracks="availableTracks"
                :track-number="index + 1"
            />
        </VList>

        <VProgressCircular
            v-if="
                props.playlist.loadedTracks.length <
                props.playlist.tracksReferences.length
            "
            ref="loadMoreTriggerElement"
            indeterminate
            size="40"
        ></VProgressCircular>
    </div>
</template>

<style scoped></style>
