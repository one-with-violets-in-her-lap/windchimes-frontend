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
        height="330px"
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
                class="rounded-lg my-2"
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
                            height="130px"
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
                    </div>
                </Transition>
            </VCard>
        </template>
    </VMenu>
</template>

<style scoped></style>
