<script setup lang="ts">
import { PlaylistTrack } from '@/entities/tracks'

import WaveformVisualizer from '@/shared/ui/waveform-visualizer.vue'

defineProps<{
    currentTrack: PlaylistTrack
    audioElement?: HTMLAudioElement
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
            size="100%"
            class="current-track-picture"
        >
            <VImg v-if="currentTrack?.pictureUrl" :src="currentTrack.pictureUrl" />
            <VIcon v-else icon="mdi-music" size="100px" />
        </VAvatar>

        <VOverlay
            :model-value="true"
            theme="light"
            contained
            content-class="d-flex justify-center align-center w-100 h-100"
        >
            <Transition name="scale-up">
                <VIcon v-show="paused" icon="mdi-pause" color="white" size="60" />
            </Transition>

            <Transition name="scale-up">
                <WaveformVisualizer
                    v-show="!paused"
                    :audio="audioElement"
                    class="w-100"
                />
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
    height: auto;
    aspect-ratio: 1/1;
}

.scale-up-leave-active,
.scale-up-enter-active {
    position: absolute;
}
</style>
