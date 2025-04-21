<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { usePlayerStore } from '@/features/player'

const playerStore = usePlayerStore()
const { volume } = storeToRefs(playerStore)
const { setVolume } = playerStore
</script>

<template>
    <VMenu width="180px" location="bottom center">
        <template #activator="{ props }">
            <VBtn
                variant="flat"
                color="surface-2"
                icon="mdi-volume-high"
                class="mr-auto ml-2"
                v-bind="props"
            />
        </template>

        <VSheet class="mt-2" color="surface-2" border>
            <VSlider
                thumb-size="14"
                track-size="2"
                :min="0"
                :max="1"
                class="w-75 mx-auto"
                color="primary"
                :model-value="volume"
                @update:model-value="setVolume"
                @click.stop
            />
        </VSheet>
    </VMenu>
</template>

<style scoped></style>
