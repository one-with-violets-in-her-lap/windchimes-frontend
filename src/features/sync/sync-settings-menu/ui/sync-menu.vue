<script setup lang="ts">
import { computed } from 'vue'

import { PlaylistPageDataFragment } from '@/shared/model/graphql-generated-types/graphql'
import ErrorAlert from '@/shared/ui/feedback/error-alert.vue'

import { useLazyExternalPlaylistQuery } from '../api/external-playlist-query'

const props = defineProps<{
    playlist: PlaylistPageDataFragment
}>()

const externalPlaylistLinkedQuery = useLazyExternalPlaylistQuery(props.playlist.id)
const externalPlaylistQueryError = computed(() =>
    externalPlaylistLinkedQuery.result.value?.externalPlaylistLinked?.__typename ===
    'GraphQLApiError'
        ? externalPlaylistLinkedQuery.result.value.externalPlaylistLinked
        : externalPlaylistLinkedQuery.error.value,
)
const externalPlaylist = computed(() =>
    externalPlaylistLinkedQuery.result.value?.externalPlaylistLinked?.__typename ===
    'ExternalPlaylistToReadGraphQL'
        ? externalPlaylistLinkedQuery.result.value.externalPlaylistLinked
        : undefined,
)
</script>

<template>
    <VMenu
        :open-delay="100"
        open-on-click
        offset="12px"
        :close-on-content-click="false"
        @update:model-value="
            newValue =>
                newValue === true ? externalPlaylistLinkedQuery.load() : null
        "
    >
        <template #activator="{ props: syncInfoMenuActivatorProps }">
            <VChip
                v-if="playlist.externalPlaylistToSyncWith"
                v-bind="syncInfoMenuActivatorProps"
                color="secondary"
                variant="tonal"
                class="mb-5"
                :prepend-icon="`mdi-${playlist.externalPlaylistToSyncWith.platform.toLowerCase()}`"
            >
                <template #default>
                    Synced with&nbsp;
                    <span class="text-capitalize">
                        {{
                            playlist.externalPlaylistToSyncWith.platform.toLowerCase()
                        }}
                    </span>
                </template>

                <template #append>
                    <VBtn
                        size="22px"
                        variant="flat"
                        icon
                        color="secondary"
                        title="Source playlist info"
                        class="ml-3"
                    >
                        <VIcon icon="mdi-dots-horizontal" size="18px" />
                    </VBtn>
                </template>
            </VChip>
        </template>

        <template #default>
            <VCard
                variant="flat"
                color="background"
                border
                class="rounded-lg"
                elevation="3"
                min-width="260px"
                max-width="300px"
            >
                <VCardText v-if="externalPlaylistLinkedQuery.loading.value">
                    <VProgressCircular
                        color="background-contrast"
                        size="32"
                        class="d-block mx-auto py-5"
                    />
                </VCardText>

                <VCardText v-if="externalPlaylistQueryError">
                    <ErrorAlert
                        :error="externalPlaylistQueryError"
                        title="Failed to load playlist info"
                    />
                </VCardText>

                <Transition name="scale-up" appear>
                    <div v-if="externalPlaylist">
                        <VImg
                            :src="externalPlaylist.pictureUrl || undefined"
                            height="150px"
                            cover
                        />

                        <VCardTitle>
                            <VIcon
                                :icon="`mdi-${playlist.externalPlaylistToSyncWith?.platform.toLowerCase()}`"
                                color="surface-4"
                                size="24px"
                                class="mr-2"
                            />

                            {{ externalPlaylist.name }}
                        </VCardTitle>

                        <VCardSubtitle>
                            {{ externalPlaylist.description }}
                        </VCardSubtitle>

                        <VCardText class="d-flex align-center gc-1">
                            <VIcon icon="mdi-clock" class="mr-1" />

                            Last sync:

                            <time :datetime="new Date().toString()">
                                {{
                                    new Date().toLocaleDateString(undefined, {
                                        dateStyle: 'medium',
                                    })
                                }}
                            </time>
                        </VCardText>

                        <VCardActions>
                            <VBtn
                                color="primary"
                                variant="flat"
                                prepend-icon="mdi-sync"
                                class="flex-grow-1"
                            >
                                Sync
                            </VBtn>

                            <VBtn
                                color="error"
                                variant="tonal"
                                prepend-icon="mdi-close"
                                class="flex-grow-1"
                            >
                                Disable
                            </VBtn>
                        </VCardActions>
                    </div>
                </Transition>
            </VCard>
        </template>
    </VMenu>
</template>

<style scoped></style>
