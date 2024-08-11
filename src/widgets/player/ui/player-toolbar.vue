<script setup lang="ts">
import FullPlayerDrawer from '@/widgets/player/ui/full-player-drawer.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/shared/model/player'
import { getFormattedTimeFromSeconds } from '@/shared/model/get-formatted-time-from-seconds'

const playerStore = usePlayerStore()
const { currentTrack, paused, currentSeconds } = storeToRefs(playerStore)
const { play, pause, setCurrentSeconds } = playerStore

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
                        <span class="text-surface-4">
                            {{ getFormattedTimeFromSeconds(currentSeconds) }}
                        </span>
                    </div>

                    <VSlider
                        class="track-progress-slider"
                        thumb-size="14"
                        track-size="2"
                        center-affix
                        :min="0"
                        :max="currentTrack.secondsDuration"
                        :model-value="currentSeconds"
                        @update:model-value="
                            newValue => setCurrentSeconds(newValue)
                        "
                        @click.stop
                    />
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

.track-progress-slider {
    width: 100%;
    margin-inline: 0 !important;
    height: 30px;
}

.track-name {
    display: inline-block;
    max-width: 70%;
    margin-right: 6px;
}
</style>
