<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { storeToRefs } from 'pinia'
import anime from 'animejs'
import { TrackTimeSlider, VolumeMenuButton, usePlayerStore } from '@/features/player'
import { CurrentTrackThumbnail } from '@/entities/tracks'
import { LOOP_MODES } from '@/entities/tracks-queue/model/tracks-queue'
import { useNotificationsStore } from '@/shared/model/notifications'
import DurationTimestamp from '@/shared/ui/duration-timestamp.vue'

const opened = defineModel<boolean>('opened', { required: true })

const playerStore = usePlayerStore()
const { playNextTrack, playPreviousTrack, shuffleQueue, pause, play, audio } =
    playerStore
const { currentTrack, currentSecond, loopMode, paused } = storeToRefs(playerStore)
const { showNotification } = useNotificationsStore()

const { mobile } = useDisplay()

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
    shuffleQueue()
    showNotification('success', 'next tracks will appear in random order')
}
</script>

<template>
    <VNavigationDrawer
        v-model="opened"
        width="500"
        temporary
        rounded
        class="player-drawer"
        :location="mobile ? 'bottom' : 'left'"
        :class="{ 'player-side-drawer': !mobile }"
    >
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
                    @click="animateSkipButtonsUntilFinished(playNextTrack())"
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

            <TrackTimeSlider class="track-time-slider" />

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
                                loopMode !== 'looping disabled'
                                    ? 'primary'
                                    : 'surface-2'
                            "
                            :icon="
                                loopMode === 'loop current track'
                                    ? 'mdi-repeat-once'
                                    : 'mdi-repeat'
                            "
                            class="mr-auto ml-2"
                            v-bind="tooltipActivatorProps"
                            @click="
                                loopMode =
                                    LOOP_MODES[
                                        LOOP_MODES.findIndex(
                                            mode => mode === loopMode,
                                        ) + 1
                                    ] || 'looping disabled'
                            "
                        />
                    </template>

                    {{ loopMode }}
                </VTooltip>
            </div>
        </div>
    </VNavigationDrawer>
</template>

<style scoped>
.player-drawer {
    padding: 20px;
    background-color: rgba(var(--v-theme-background), 0.8);
    backdrop-filter: blur(3px);
}

.player-side-drawer {
    height: 100% !important;
    top: 0px !important;
}

.drawer-content-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.skip-button {
    transition: none;
}

.track-time-slider {
    width: 90% !important;
    margin-bottom: 8px;
}
</style>
