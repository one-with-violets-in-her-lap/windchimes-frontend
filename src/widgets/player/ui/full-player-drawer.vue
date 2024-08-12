<script setup lang="ts">
import { storeToRefs } from 'pinia'
import anime from 'animejs'
import { usePlayerStore } from '@/shared/model/player'

const opened = defineModel<boolean>('opened', { required: true })

const playerStore = usePlayerStore()
const { playNextTrack, playPreviousTrack } = playerStore
const { currentTrack } = storeToRefs(playerStore)

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
        <div>
            <VBtn
                icon
                class="mr-5 skip-button"
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
                size="170px"
            >
                <VImg
                    v-if="currentTrack?.pictureUrl"
                    :src="currentTrack.pictureUrl"
                />
                <VIcon v-else icon="mdi-music" size="100px" />
            </VAvatar>

            <VBtn
                icon
                class="ml-5 skip-button"
                color="surface-3"
                variant="flat"
                @click="animateSkipButtonsUntilFinished(playNextTrack())"
            >
                <VIcon icon="mdi-skip-forward" size="40px" />
            </VBtn>
        </div>
    </VNavigationDrawer>
</template>

<style scoped>
.player-drawer {
    padding: 20px;
    background-color: rgba(var(--v-theme-background), 0.91);
    backdrop-filter: blur(3px);
    height: 78% !important;

    display: flex;
    align-items: center;
    flex-direction: column;
}

.skip-button {
    transition: none;
}
</style>
