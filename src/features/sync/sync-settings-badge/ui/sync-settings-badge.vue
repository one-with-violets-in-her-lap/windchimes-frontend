<script setup lang="ts">
import { PlaylistPageDataFragment } from '@/shared/model/graphql-generated-types/graphql'

defineProps<{
    playlist: PlaylistPageDataFragment
}>()
</script>

<template>
    <VChip
        v-if="playlist.externalPlaylistToSyncWith"
        color="secondary"
        variant="tonal"
        :prepend-icon="`mdi-${playlist.externalPlaylistToSyncWith.platform.toLowerCase()}`"
    >
        <template #default>
            Synced with&nbsp;
            <span class="text-capitalize">
                {{ playlist.externalPlaylistToSyncWith.platform.toLowerCase() }}
            </span>
        </template>

        <template #append>
            <VBtn
                v-tooltip="'Perform sync'"
                size="20px"
                variant="flat"
                icon
                color="secondary"
                title="Source playlist info"
                class="ml-4"
            >
                <VIcon icon="mdi-sync" size="16px" />
            </VBtn>

            <VBtn
                size="20px"
                variant="text"
                icon
                color="secondary"
                title="Source playlist info"
                class="ml-3"
            >
                <VIcon icon="mdi-information-outline" size="22px" />
            </VBtn>

            <VBtn
                v-tooltip="'Disable sync'"
                size="20px"
                variant="flat"
                icon
                color="secondary"
                title="Disable sync"
                class="ml-3"
            >
                <VIcon icon="mdi-close" size="16px" />
            </VBtn>
        </template>
    </VChip>
</template>

<style scoped></style>
