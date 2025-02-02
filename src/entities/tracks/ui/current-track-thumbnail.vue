<script setup lang="ts">
import { PlaylistTrack } from '@/entities/tracks'

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
            size="100%"
            class="current-track-picture"
        >
            <VImg v-if="currentTrack?.pictureUrl" :src="currentTrack.pictureUrl" />
            <VIcon v-else icon="mdi-music" size="100px" />
        </VAvatar>

        <VOverlay
            :model-value="paused"
            theme="light"
            contained
            content-class="d-flex justify-center align-center w-100 h-100"
        >
            <VIcon v-show="paused" icon="mdi-pause" color="white" size="60" />
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
