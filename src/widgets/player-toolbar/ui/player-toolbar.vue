<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import FullPlayerDrawer from '@/widgets/player-toolbar/ui/full-player-drawer.vue'
import {
    usePlayerStore,
    usePlayerShortcuts,
    TrackTimeSlider,
} from '@/features/player'
import { TracksQueueEditorDrawer } from '@/features/tracks-queue-editor'
import DurationTimestamp from '@/shared/ui/duration-timestamp.vue'

const playerStore = usePlayerStore()
const { currentTrack, paused, currentSecond } = storeToRefs(playerStore)
const { play, pause } = playerStore

usePlayerShortcuts()

const fullPlayerOpened = ref(false)
</script>

<template>
    <div>
        <Transition name="slide-up">
            <div
                v-if="currentTrack && !fullPlayerOpened"
                class="elevation-6 player-controls-bar"
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
                            {{ currentTrack.owner.name }}
                            -
                            {{ currentTrack.name }}
                        </div>

                        <DurationTimestamp :seconds-duration="currentSecond" />
                    </div>

                    <TrackTimeSlider @click.stop />
                </div>
            </div>
        </Transition>

        <FullPlayerDrawer v-model:opened="fullPlayerOpened" />

        <TracksQueueEditorDrawer :open-button-visible="Boolean(currentTrack && !fullPlayerOpened)" />
    </div>

</template>

<style scoped>
.player-controls-bar {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    padding: 7px;

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
