<script setup lang="ts">
import TrackTimeSlider from '@/features/track-time-slider/ui/track-time-slider.vue'
import { storeToRefs } from 'pinia'
import anime from 'animejs'
import { usePlayerStore } from '@/shared/model/player'

const opened = defineModel<boolean>('opened', { required: true })

const playerStore = usePlayerStore()
const { playNextTrack, playPreviousTrack, rewind } = playerStore
const { currentTrack, currentSecond, volume } = storeToRefs(playerStore)

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
</script>

<template>
    <VNavigationDrawer
        v-model="opened"
        location="bottom"
        rounded
        class="player-drawer"
    >
        <div v-if="currentTrack" class="drawer-content-wrapper">
            <div class="d-flex align-center gc-2 w-100 justify-center">
                <VBtn
                    icon
                    class="skip-button"
                    color="surface-3"
                    variant="flat"
                    @click="animateSkipButtonsUntilFinished(playPreviousTrack())"
                >
                    <VIcon icon="mdi-skip-backward" size="40px" />
                </VBtn>

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
                    <VIcon v-else icon="mdi-music" size="100px" />
                </VAvatar>

                <VBtn
                    icon
                    class="skip-button"
                    color="surface-3"
                    variant="flat"
                    @click="animateSkipButtonsUntilFinished(playNextTrack())"
                >
                    <VIcon icon="mdi-skip-forward" size="40px" />
                </VBtn>
            </div>

            <TrackTimeSlider
                class="track-time-slider"
            />
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
}

.current-track-picture {
    flex-shrink: 1;
    width: 75%;
    height: auto;
    max-width: 200px;
}
</style>
