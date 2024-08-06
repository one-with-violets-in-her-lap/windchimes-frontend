<script setup lang="ts">
import type { Playlist } from '@/entities/playlist/model/playlist'

defineProps<{
    playlist: Playlist
}>()
</script>

<template>
    <VHover>
        <template #default="{ isHovering, props }">
            <VCard
                v-bind="props"
                variant="flat"
                :color="isHovering ? 'primary-lighten-1' : undefined"
                :subtitle="`${playlist.tracksCount} tracks`"
                :to="{ name: 'playlist', params: { id: playlist.id } }"
            >
                <template #title>
                    <h3 class="text-h6 text-wrap">
                        {{ playlist.name }}
                    </h3>
                </template>

                <template #prepend>
                    <VAvatar
                        :image="playlist.pictureUrl || undefined"
                        icon="mdi-playlist-music"
                        color="surface-3"
                        rounded
                        tile
                        size="70px"
                    />
                </template>
            </VCard>
        </template>
    </VHover>
</template>

<style scoped></style>
