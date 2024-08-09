<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCurrentTrackStore } from '@/shared/model/current-track'

const { currentTrack } = storeToRefs(useCurrentTrackStore())
</script>

<template>
    <Transition name="slide-up">
        <VToolbar
            v-if="currentTrack"
            floating
            color="surface"
            elevation="5"
            height="72"
            class="player-controls-bar"
        >
            <VBtn
                icon="mdi-play"
                variant="flat"
                color="primary"
                size="38px"
                class="mr-3"
            />
            <div class="w-100">
                <div class="d-flex">
                    <div class="d-inline-block w-75 text-truncate mr-1">
                        {{ currentTrack.name }}
                    </div>
                    <span class="text-surface-4">1:20</span>
                </div>

                <VSlider
                    class="track-progress-slider"
                    thumb-size="14"
                    track-size="2"
                    center-affix
                />
            </div>
        </VToolbar>
    </Transition>
</template>

<style scoped>
.player-controls-bar {
    position: fixed;
    bottom: 0px;
    left: 0px;

    padding: 0px 7px;
    display: flex;
    align-items: center;
}

.track-progress-slider {
    width: 100%;
    margin-inline: 0 !important;
    height: 30px;
}
</style>
