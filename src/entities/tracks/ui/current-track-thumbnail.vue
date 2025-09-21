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

        <div class="overlay">
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
        </div>
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

.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.15);
}

.scale-up-leave-active,
.scale-up-enter-active {
    position: absolute;
}
</style>
