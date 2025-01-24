<script setup lang="ts">
import { computed } from 'vue'

import { PlaylistsListItemFragment } from '@/shared/model/graphql-generated-types/graphql'

const props = defineProps<{
    playlist: PlaylistsListItemFragment
    hidePubliclyAvailablePlaylistNote?: boolean
}>()

const formattedCreationDate = computed(() =>
    new Date(props.playlist.createdAt).toLocaleDateString(undefined, {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    }),
)

const link = computed(() => ({ name: 'playlist', params: { id: props.playlist.id } }))
</script>

<template>
    <VHover>
        <template #default="{ props: hoverTargetProps, isHovering }">
            <VCard
                v-bind="{ ...hoverTargetProps, ...$attrs }"
                variant="flat"
                :color="isHovering ? 'surface-2' : 'surface'"
                max-width="320px"
                class="playlist-card d-flex flex-column rounded-lg"
            >
                <RouterLink :to="link" class="text-surface-2">
                    <VImg
                        v-if="playlist.pictureUrl"
                        :src="playlist.pictureUrl"
                        rounded
                        tile
                        height="220px"
                        cover
                    />

                    <VSheet
                        v-else
                        color="surface-2"
                        height="220px"
                        width="100%"
                        class="d-flex justify-center align-center"
                    >
                        <VIcon
                            icon="mdi-playlist-music"
                            color="surface"
                            size="200px"
                        />
                    </VSheet>
                </RouterLink>

                <VCardItem class="pa-4 pb-0">
                    <VCardTitle class="mb-2">
                        <RouterLink
                            :to="link"
                            class="d-block text-decoration-none text-background-contrast"
                        >
                            <h3 class="text-h6 text-truncate">
                                <VIcon
                                    v-if="
                                        playlist.publiclyAvailable &&
                                        !hidePubliclyAvailablePlaylistNote
                                    "
                                    v-tooltip="{
                                        text: 'Publicly available',
                                        openOnClick: true,
                                    }"
                                    size="22px"
                                    color="surface-4"
                                    icon="mdi-account-multiple"
                                    class="mr-1"
                                />

                                {{ playlist.name }}
                            </h3>
                        </RouterLink>
                    </VCardTitle>

                    <VCardSubtitle opacity="0.4" class="mb-1">
                        {{ playlist.trackCount }} tracks ·

                        <time
                            :datetime="playlist.createdAt"
                            :title="new Date(playlist.createdAt).toLocaleString()"
                        >
                            {{ formattedCreationDate }}
                        </time>
                    </VCardSubtitle>

                    <!-- <VCardSubtitle opacity="0.4">
                        <span v-if="playlist.publiclyAvailable">
                            <VIcon icon="mdi-account-multiple" /> Public
                        </span>
                    </VCardSubtitle> -->
                </VCardItem>

                <VCardActions class="pa-4 gc-1 mt-auto">
                    <slot name="append-playlist-action-buttons"></slot>

                    <VBtn
                        variant="text"
                        color="primary"
                        append-icon="mdi-arrow-right"
                        :to="link"
                    >
                        Open
                    </VBtn>
                </VCardActions>
            </VCard>
        </template>
    </VHover>
</template>
