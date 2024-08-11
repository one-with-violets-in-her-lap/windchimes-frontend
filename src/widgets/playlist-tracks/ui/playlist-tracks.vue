<script setup lang="ts">
import { computed, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import TrackItem from '@/features/track/ui/track-item.vue'
import type { GetPlaylistWithTracksQuery } from '@/shared/model/graphql-generated-types/graphql'

const props = defineProps<{
    playlist: NonNullable<GetPlaylistWithTracksQuery['playlist']>
}>()

const emit = defineEmits<{
    (event: 'load-more', offset: number): void
}>()

const loadMoreTriggerElement = ref<HTMLElement>()
useIntersectionObserver(loadMoreTriggerElement, entries => {
    if (entries[0].isIntersecting) {
        emit('load-more', props.playlist.tracks.items.length)
    }
})

const availableTracks = computed(() => {
    return props.playlist.tracks.items.filter(track => track !== null)
})
</script>

<template>
    <div>
        <VList rounded class="mb-3">
            <TrackItem
                v-for="(track, index) in availableTracks"
                :key="track.platformId"
                :track="track"
                :track-number="index + 1"
            />
        </VList>

        <VProgressCircular
            v-if="
                props.playlist.tracks.items.length <
                props.playlist.tracks.totalItemsCount
            "
            ref="loadMoreTriggerElement"
            indeterminate
            size="40"
        ></VProgressCircular>
    </div>
</template>

<style scoped></style>
