<script setup lang="ts">
import FullPlayerDrawer from '@/widgets/player/ui/full-player-drawer.vue'
import TrackTimeSlider from '@/features/track-time-slider/ui/track-time-slider.vue'
import DurationTimestamp from '@/shared/ui/duration-timestamp.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/entities/player/model/player-store'

const playerStore = usePlayerStore()
const { currentTrack, paused, currentSecond } = storeToRefs(playerStore)
const { play, pause } = playerStore

const fullPlayerOpened = ref(false)
</script>

<template>
    <div>
        <Transition name="slide-up">
            <VToolbar
                v-if="currentTrack && !fullPlayerOpened"
                floating
                elevation="5"
                height="72"
                class="player-controls-bar"
                @click="fullPlayerOpened = true"
            >
                <VBtn
                    :icon="paused ? 'mdi-play' : 'mdi-pause'"
                    variant="flat"
                    color="primary"
                    size="38px"
                    class="mr-3"
                    @click.stop="() => (paused ? play() : pause())"
                />

                <div class="w-100">
                    <div class="d-flex">
                        <div class="track-name text-truncate">
                            {{ currentTrack.name }}
                        </div>

                        <DurationTimestamp :seconds-duration="currentSecond" />
                    </div>

                    <TrackTimeSlider @click.stop />
                </div>
            </VToolbar>
        </Transition>

        <FullPlayerDrawer v-model:opened="fullPlayerOpened" />
    </div>
</template>

<style scoped>
.player-controls-bar {
    position: fixed;
    bottom: 0px;
    left: 0px;

    padding: 0px 7px;
    display: flex;
    align-items: center;

    background-color: rgba(var(--v-theme-surface), 0.85);
    backdrop-filter: blur(3px);
}

.track-name {
    display: inline-block;
    max-width: 70%;
    margin-right: 6px;
}
</style>
