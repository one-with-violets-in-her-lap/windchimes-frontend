<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import FullPlayerDrawer from '@/widgets/player-toolbar/ui/full-player-drawer.vue'
import {
    usePlayerStore,
    usePlayerShortcuts,
    TrackProgressBar,
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
    <div class="position-fix h-100">
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
                    <div class="playing-track-line">
                        <div class="track-name text-truncate">
                            {{ currentTrack.owner.name }}
                            -
                            {{ currentTrack.name }}
                        </div>

                        <DurationTimestamp
                            :seconds-duration="currentSecond"
                            class="d-none d-sm-block"
                        />
                    </div>

                    <TrackProgressBar @click.stop />
                </div>
            </div>
        </Transition>

        <FullPlayerDrawer v-model:opened="fullPlayerOpened" />

        <TracksQueueEditorDrawer
            :open-button-visible="Boolean(currentTrack && !fullPlayerOpened)"
        />
    </div>
</template>

<style scoped lang="scss">
.player-controls-bar {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    padding: 7px;

    display: flex;
    align-items: center;

    background-color: rgba(var(--v-theme-surface), 0.7);
    backdrop-filter: blur(3px);
}

.playing-track-line {
    display: flex;
    justify-content: start;
    column-gap: 13px;
    padding-right: 90px;
    overflow: hidden;
}
</style>
