<script setup lang="ts">
import { computed } from 'vue'

import { PlaylistPageDataFragment } from '@/shared/model/graphql-generated-types/graphql'
import { useNotificationsStore } from '@/shared/model/notifications'
import ErrorAlert from '@/shared/ui/feedback/error-alert.vue'

import { useDisableSyncMutation } from '../api/disable-sync-mutation'
import { useLazyExternalPlaylistQuery } from '../api/external-playlist-query'
import { usePerformSyncMutation } from '../api/perform-sync-mutation'
import SyncButtonWithConfirmation from './sync-button-with-confirmation.vue'

const props = defineProps<{
    playlist: PlaylistPageDataFragment
}>()

const { showNotification } = useNotificationsStore()

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

const disableSyncMutation = useDisableSyncMutation()
async function handleSyncDisable(closeMenu: VoidFunction) {
    const result = await disableSyncMutation.mutate({ playlistId: props.playlist.id })

    if (
        result?.data?.disablePlaylistSync &&
        'is_error_response' in result.data.disablePlaylistSync
    ) {
        showNotification('error', 'Something wrong happened while disabling the sync')
        console.error('Sync disabling failed:', result.data.disablePlaylistSync)
    } else {
        showNotification('success', 'Sync disabled, playlist unlinked')
    }

    closeMenu()
}

const performSyncMutation = usePerformSyncMutation()
async function handleSync(closeMenu: VoidFunction) {
    const result = await performSyncMutation.mutate()

    if (
        result?.data?.syncPlaylistTracksWithExternalPlaylist.__typename ===
        'ExternalPlaylistNotAvailableErrorGraphQL'
    ) {
        showNotification(
            'error',
            'Playlist on a platform you linked for sync ' +
                'is no longer available. Perhaps it became private',
        )
    } else if (
        result?.data?.syncPlaylistTracksWithExternalPlaylist &&
        'isErrorResponse' in result.data.syncPlaylistTracksWithExternalPlaylist
    ) {
        showNotification('error', 'Something wrong happened while syncing')
        console.error(
            'Sync disabling failed:',
            result.data.syncPlaylistTracksWithExternalPlaylist,
        )
    } else if (
        result?.data?.syncPlaylistTracksWithExternalPlaylist.__typename ===
        'TracksSyncResult'
    ) {
        showNotification('success', 'Sync completed')
    }
}
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

        <template #default="{ isActive }">
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
                            v-show="externalPlaylist.pictureUrl"
                            :src="externalPlaylist.pictureUrl || undefined"
                            height="150px"
                            cover
                        />

                        <VSheet
                            v-show="!externalPlaylist.pictureUrl"
                            color="surface"
                            height="150px"
                            class="d-flex align-center justify-center"
                        >
                            <VIcon
                                icon="mdi-playlist-music"
                                size="50px"
                                color="surface-3"
                            />
                        </VSheet>

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
                            <SyncButtonWithConfirmation />

                            <VBtn
                                color="error"
                                variant="tonal"
                                prepend-icon="mdi-close"
                                class="flex-grow-1"
                                :loading="disableSyncMutation.loading.value"
                                @click="
                                    handleSyncDisable(() => (isActive.value = false))
                                "
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
