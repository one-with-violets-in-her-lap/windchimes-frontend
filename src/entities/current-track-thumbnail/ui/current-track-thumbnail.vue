<script setup lang="ts">
import WaveformVisualizer from '@/shared/ui/waveform-visualizer.vue'

import { PlaylistTrack } from '@/entities/track/model/track'

defineProps<{
    currentTrack: PlaylistTrack
    audio: HTMLAudioElement
    paused: boolean
}>()
</script>

<template>
    <button class="pause-button">
        <VAvatar
            tile
            rounded
            variant="outlined"
            color="surface-3"
            class="current-track-picture"
        >
            <VImg v-if="currentTrack?.pictureUrl" :src="currentTrack.pictureUrl" />
            <VIcon v-else icon="mdi-music" size="100" />
        </VAvatar>

        <VOverlay
            :model-value="true"
            contained
            content-class="d-flex justify-center align-center w-100 h-100"
        >
            <Transition name="scale-up">
                <VIcon v-show="paused" icon="mdi-pause" color="white" size="60" />
            </Transition>

            <Transition name="scale-up">
                <WaveformVisualizer v-show="!paused" :audio="audio" class="w-100" />
            </Transition>
        </VOverlay>
    </button>
</template>

<style scoped>
.pause-button {
    position: relative;
    flex-shrink: 1;
    width: 75%;
    max-width: 170px;
}

.current-track-picture {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
}
</style>
