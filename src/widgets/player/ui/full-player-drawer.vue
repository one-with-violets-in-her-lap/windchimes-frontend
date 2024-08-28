<script setup lang="ts">
import TrackTimeSlider from '@/features/player/track-time-slider/ui/track-time-slider.vue'
import VolumeMenuButton from '@/features/player/volume-menu-button/ui/volume-menu-button.vue'
import DurationTimestamp from '@/shared/ui/duration-timestamp.vue'
import { storeToRefs } from 'pinia'
import anime from 'animejs'
import { usePlayerStore } from '@/features/player/model/player-store'
import { useNotificationsStore } from '@/shared/model/notifications'

const opened = defineModel<boolean>('opened', { required: true })

const playerStore = usePlayerStore()
const { playNextTrack, playPreviousTrack, shuffleQueue, pause, play } = playerStore
const { currentTrack, currentSecond, loop, paused } = storeToRefs(playerStore)
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
    shuffleQueue()
    showNotification('success', 'next tracks will appear in random order')
}
</script>

<template>
    <VNavigationDrawer
        v-model="opened"
        location="bottom"
        rounded
        class="player-drawer"
    >
        <div v-if="currentTrack" class="drawer-content-wrapper">
            <div class="d-flex align-center gc-3 w-100 justify-center mb-2">
                <VBtn
                    icon
                    class="skip-button"
                    color="surface-2"
                    variant="flat"
                    @click="
                        animateSkipButtonsUntilFinished(
                            playPreviousTrack().catch(error => {}),
                        )
                    "
                >
                    <VIcon icon="mdi-skip-backward" size="40px" />
                </VBtn>

                <button class="pause-button" @click="paused ? play() : pause()">
                    <VAvatar
                        tile
                        rounded
                        variant="outlined"
                        color="surface-3"
                        class="current-track-picture"
                    >
                        <VImg
                            v-if="currentTrack?.pictureUrl"
                            :src="currentTrack.pictureUrl"
                        />
                        <VIcon v-else icon="mdi-music" size="100" />
                    </VAvatar>

                    <VOverlay
                        contained
                        v-model="paused"
                        content-class="d-flex justify-center align-center w-100 h-100"
                    >
                        <VIcon icon="mdi-pause" color="white" size="60" />
                    </VOverlay>
                </button>

                <VBtn
                    icon
                    class="skip-button"
                    color="surface-2"
                    variant="flat"
                    @click="
                        animateSkipButtonsUntilFinished(
                            playNextTrack().catch(error => {}),
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

                <VBtn
                    variant="flat"
                    :color="loop ? 'primary' : 'surface-2'"
                    icon="mdi-repeat"
                    class="mr-auto ml-2"
                    @click="loop = !loop"
                />
            </div>
        </div>
    </VNavigationDrawer>
</template>

<style scoped>
.player-drawer {
    padding: 20px;
    background-color: rgba(var(--v-theme-background), 0.85);
    backdrop-filter: blur(3px);
    height: 78% !important;
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

.pause-button {
    position: relative;
    flex-shrink: 1;
    width: 75%;
    max-width: 170px;
}

.current-track-picture {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
}
</style>
