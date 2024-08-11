<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/shared/model/player'

const playerStore = usePlayerStore()
const { currentTrack } = storeToRefs(playerStore)

const opened = defineModel<boolean>('opened', { required: true })
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
                class="mr-5"
                color="surface-3"
                variant="flat"
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
                class="ml-5"
                color="surface-3"
                variant="flat"
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
</style>
