<script setup lang="ts">
import TrackTimeSlider from '@/features/player/track-time-slider/ui/track-time-slider.vue'
import VolumeMenuButton from '@/features/player/volume-menu-button/ui/volume-menu-button.vue'
import DurationTimestamp from '@/shared/ui/duration-timestamp.vue'
import { storeToRefs } from 'pinia'
import anime from 'animejs'
import { usePlayerStore } from '@/entities/player/model/player-store'

const opened = defineModel<boolean>('opened', { required: true })

const playerStore = usePlayerStore()
const { playNextTrack, playPreviousTrack, shuffleQueue } = playerStore
const { currentTrack, currentSecond, loop } = storeToRefs(playerStore)

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
            <div class="d-flex align-center gc-3 w-100 justify-center mb-2">
                <VBtn
                    icon
                    class="skip-button"
                    color="surface-3"
                    variant="flat"
                    @click="
                        animateSkipButtonsUntilFinished(
                            playPreviousTrack().catch(error => {}),
                        )
                    "
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
            </span>

            <TrackTimeSlider class="track-time-slider" />

            <div class="mb-3 text-surface-3">
                <DurationTimestamp :seconds-duration="currentSecond" />
                -
                <DurationTimestamp
                    :seconds-duration="currentTrack.secondsDuration"
                />
            </div>

            <div class="d-flex justify-center ga-2">
                <VolumeMenuButton />

                <VBtn
                    variant="flat"
                    color="surface-2"
                    icon="mdi-shuffle"
                    class="mr-auto ml-2"
                    @click="shuffleQueue"
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

.current-track-picture {
    flex-shrink: 1;
    width: 75%;
    height: auto;
    aspect-ratio: 1/1;
    max-width: 200px;
}
</style>
