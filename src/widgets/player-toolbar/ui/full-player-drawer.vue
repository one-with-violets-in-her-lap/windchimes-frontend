<script setup lang="ts">
import anime from 'animejs'
import { storeToRefs } from 'pinia'

import {
    LoopMode,
    TrackProgressBar,
    VolumeMenuButton,
    usePlayerStore,
} from '@/features/player'

import { CurrentTrackThumbnail } from '@/entities/tracks'
import { shuffleQueue, useTracksQueueStore } from '@/entities/tracks-queue'
import TrackOptionsDropdown from '@/entities/tracks/ui/track-options-dropdown.vue'

import { useNotificationsStore } from '@/shared/model/notifications'
import DurationTimestamp from '@/shared/ui/duration-timestamp.vue'
import ResponsiveDrawer from '@/shared/ui/responsive-drawer.vue'

const opened = defineModel<boolean>('opened', { required: true })

const playerStore = usePlayerStore()
const { playNextTrack, playPreviousTrack, pause, play, audio, toggleLoopMode } =
    playerStore
const { currentSecond, loopMode, paused } = storeToRefs(playerStore)

const { tracksQueue, currentQueueItem, currentTrack } =
    storeToRefs(useTracksQueueStore())

const { showNotification } = useNotificationsStore()

let pulseAnimation: anime.AnimeInstance | undefined = undefined
async function animateSkipButtonsUntilFinished(promise: Promise<void>) {
    if (!pulseAnimation) {
        pulseAnimation = anime({
            targets: '.skip-button',
            opacity: 0.5,
            scale: 0.7,
            duration: 600,
            loop: true,
            direction: 'alternate',
            autoplay: false,
            easing: 'linear',
        })
    }

    pulseAnimation.play()

    await promise

    pulseAnimation.seek(0)
    pulseAnimation.pause()
}

function shuffleTracksQueue() {
    // TODO: rewrite shuffling with new queue items identifiers
    tracksQueue.value = shuffleQueue(tracksQueue.value, currentQueueItem.value?.id)
    showNotification('success', 'next tracks will appear in random order')
}
</script>

<template>
    <ResponsiveDrawer v-model:opened="opened">
        <div v-if="currentTrack" class="drawer-content-wrapper">
            <div class="d-flex align-center gc-3 w-100 justify-center mb-2">
                <VBtn
                    icon
                    class="skip-button"
                    color="surface-2"
                    variant="flat"
                    @click="animateSkipButtonsUntilFinished(playPreviousTrack())"
                >
                    <VIcon icon="mdi-skip-backward" size="40px" />
                </VBtn>

                <CurrentTrackThumbnail
                    :paused="paused"
                    :audio="audio"
                    :current-track="currentTrack"
                    @click="paused ? play() : pause()"
                />

                <VBtn
                    icon
                    class="skip-button"
                    color="surface-2"
                    variant="flat"
                    @click="
                        animateSkipButtonsUntilFinished(
                            playNextTrack({ doNotLoop: true }),
                        )
                    "
                >
                    <VIcon icon="mdi-skip-forward" size="40px" />
                </VBtn>
            </div>

            <h3 class="text-h5 text-center">
                {{ currentTrack.name }}
            </h3>

            <span class="text-h6 mb-1 text-center text-surface-4">
                {{ currentTrack.owner.name }}
                <VIcon
                    :icon="`mdi-${currentTrack.platform.toLowerCase()}`"
                    size="22"
                    class="ml-1"
                />
            </span>

            <TrackProgressBar class="track-progress-bar" />

            <div class="mb-3 text-surface-3">
                <DurationTimestamp :seconds-duration="currentSecond" />
                -
                <DurationTimestamp :seconds-duration="currentTrack.secondsDuration" />
            </div>

            <div class="d-flex justify-center ga-2">
                <VolumeMenuButton />

                <VBtn
                    variant="flat"
                    color="surface-2"
                    icon="mdi-shuffle"
                    class="mr-auto ml-2"
                    @click="shuffleTracksQueue"
                />

                <VTooltip open-on-click open-delay="3000ms">
                    <template #activator="{ props: tooltipActivatorProps }">
                        <VBtn
                            variant="flat"
                            :color="
                                loopMode !== LoopMode.Disabled
                                    ? 'primary'
                                    : 'surface-2'
                            "
                            :icon="
                                loopMode === LoopMode.LoopCurrentTrack
                                    ? 'mdi-repeat-once'
                                    : 'mdi-repeat'
                            "
                            class="mr-auto ml-2"
                            v-bind="tooltipActivatorProps"
                            @click="toggleLoopMode"
                        />
                    </template>

                    {{ loopMode }}
                </VTooltip>

                <TrackOptionsDropdown
                    :track="currentTrack"
                    v-slot:activator="{ menuActivatorProps }"
                >
                    <VBtn
                        variant="flat"
                        color="background-contrast"
                        icon="mdi-dots-horizontal"
                        v-bind="menuActivatorProps"
                    />
                </TrackOptionsDropdown>
            </div>
        </div>
    </ResponsiveDrawer>
</template>

<style scoped>
.drawer-content-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.skip-button {
    transition: none;
}

.track-progress-bar {
    width: 90% !important;
    margin-bottom: 8px;
}
</style>
