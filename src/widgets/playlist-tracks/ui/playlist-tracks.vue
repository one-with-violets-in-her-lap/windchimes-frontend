<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
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
</script>

<template>
    <div>
        <VList rounded class="mb-3">
            <VListItem
                v-for="track in playlist.tracks.items"
                :key="track.platformId"
                prepend-icon="mdi-music"
            >
                {{ track.name }}
            </VListItem>
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
