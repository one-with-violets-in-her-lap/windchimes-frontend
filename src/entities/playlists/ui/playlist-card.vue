<script setup lang="ts">
import { computed } from 'vue'
import { PlaylistsListItemFragmentFragment } from '@/shared/model/graphql-generated-types/graphql'

const props = defineProps<{
    playlist: PlaylistsListItemFragmentFragment
}>()

const formattedCreationDate = computed(() =>
    new Date(props.playlist.createdAt).toLocaleDateString(undefined, {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    }),
)
</script>

<template>
    <VHover>
        <template #default="{ isHovering, props }">
            <VCard
                v-bind="props"
                variant="flat"
                :color="isHovering ? 'surface-2' : undefined"
                :to="{ name: 'playlist', params: { id: playlist.id } }"
                class="mb-4"
            >
                <template #title>
                    <h3 class="text-h6 text-wrap">
                        {{ playlist.name }}
                    </h3>
                </template>

                <template #subtitle>
                    {{ playlist.tracksReferences.length }} tracks ·
                    <time
                        :datetime="playlist.createdAt"
                        :title="new Date(playlist.createdAt).toLocaleString()"
                    >
                        {{ formattedCreationDate }}
                    </time>
                </template>

                <template #prepend>
                    <VAvatar
                        :image="playlist.pictureUrl || undefined"
                        icon="mdi-playlist-music"
                        color="surface-2"
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
