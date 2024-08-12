<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/shared/model/player'

const opened = defineModel<boolean>('opened', { required: true })

const playerStore = usePlayerStore()
const { playNextTrack, playPreviousTrack } = playerStore
const { currentTrack } = storeToRefs(playerStore)

const skipButtonsLocked = ref(false)

async function lockSkipButtonsUntilFinished(promise: Promise<void>) {
    skipButtonsLocked.value = true
    await promise
    skipButtonsLocked.value = false
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
                size="50px"
                class="mr-5 skip-button"
                :class="{ 'skip-button-locked': skipButtonsLocked }"
                color="surface-3"
                variant="flat"
                @click="lockSkipButtonsUntilFinished(playPreviousTrack())"
            >
                <VIcon icon="mdi-skip-backward" size="40px" />
            </VBtn>

            <VAvatar
                tile
                rounded
                variant="outlined"
                color="surface-3"
                size="170px"
                class="mb-4"
            >
                <VImg
                    v-if="currentTrack?.pictureUrl"
                    :src="currentTrack.pictureUrl"
                />
                <VIcon v-else icon="mdi-music" size="100px" />
            </VAvatar>

            <VBtn
                icon
                size="50px"
                class="ml-5 skip-button"
                :class="{ 'skip-button-locked': skipButtonsLocked }"
                color="surface-3"
                variant="flat"
                @click="lockSkipButtonsUntilFinished(playNextTrack())"
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
    transition: opacity 0.5s ease;
}

.skip-button-locked {
    opacity: 0.4;
    animation-name: pulse;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
    animation-direction: alternate;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(0.7);
    }
}
</style>
