<script setup lang="ts">
import { computed } from 'vue'

import { PlaylistPageDataFragment } from '@/shared/model/graphql-generated-types/graphql'
import { vAnime } from '@/shared/ui/animejs-directives'
import ErrorAlert from '@/shared/ui/feedback/error-alert/error-alert.vue'
import { showTemporaryNotification } from '@/shared/utils/notifications'

import { useDisableSyncMutation } from '../api/disable-sync-mutation'
import { useLazyExternalPlaylistQuery } from '../api/external-playlist-query'
import { usePerformSyncMutation } from '../api/perform-sync-mutation'
import SyncButtonWithConfirmation from './sync-button-with-confirmation.vue'

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

const disableSyncMutation = useDisableSyncMutation()
async function handleSyncDisable(closeMenu: VoidFunction) {
    const result = await disableSyncMutation.mutate({ playlistId: props.playlist.id })

    if (
        result?.data?.disablePlaylistSync &&
        'is_error_response' in result.data.disablePlaylistSync
    ) {
        showTemporaryNotification(
            'error',
            'Something wrong happened while disabling the sync',
        )
        console.error('Sync disabling failed:', result.data.disablePlaylistSync)
    } else {
        showTemporaryNotification('success', 'Sync disabled, playlist unlinked')
    }

    closeMenu()
}

const performSyncMutation = usePerformSyncMutation()
async function handleSync(closeMenu: VoidFunction) {
    const result = await performSyncMutation.mutate({ playlistId: props.playlist.id })

    if (
        result?.data?.syncPlaylistTracksWithExternalPlaylist.__typename ===
        'ExternalPlaylistNotAvailableErrorGraphQL'
    ) {
        showTemporaryNotification(
            'error',
            'Playlist on a platform you linked for sync ' +
                'is no longer available. Perhaps it became private',
        )
    } else if (
        result?.data?.syncPlaylistTracksWithExternalPlaylist &&
        'isErrorResponse' in result.data.syncPlaylistTracksWithExternalPlaylist
    ) {
        showTemporaryNotification('error', 'Something wrong happened while syncing')
        console.error(
            'Sync disabling failed:',
            result.data.syncPlaylistTracksWithExternalPlaylist,
        )
    } else if (
        result?.data?.syncPlaylistTracksWithExternalPlaylist.__typename ===
        'TracksSyncResult'
    ) {
        showTemporaryNotification('success', 'Sync completed')
    }

    closeMenu()
}
</script>

<template>
    <VMenu
        :open-delay="100"
        open-on-click
        offset="12px"
        height="350px"
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
                        class="d-block mx-auto py-14"
                    />
                </VCardText>

                <VCardText v-else-if="externalPlaylistQueryError">
                    <ErrorAlert
                        :error="externalPlaylistQueryError"
                        title="Failed to load playlist info"
                        @retry="externalPlaylistLinkedQuery.restart()"
                    />
                </VCardText>

                <Transition name="scale-up" appear mode="out-in">
                    <div
                        v-if="externalPlaylist && !performSyncMutation.loading.value"
                    >
                        <VImg
                            v-show="externalPlaylist.pictureUrl !== null"
                            :src="externalPlaylist.pictureUrl || undefined"
                            height="150px"
                            cover
                        />

                        <VSheet
                            color="surface"
                            height="150px"
                            class="align-center justify-center"
                            :class="{
                                'd-none': externalPlaylist.pictureUrl !== null,
                                'd-flex': externalPlaylist.pictureUrl === null,
                            }"
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

                        <VCardSubtitle v-show="externalPlaylist.description">
                            {{ externalPlaylist.description }}
                        </VCardSubtitle>

                        <VCardText class="d-flex align-center gc-1 py-3">
                            <VIcon icon="mdi-clock" color="surface-4" class="mr-1" />

                            Last sync:

                            <time
                                :datetime="
                                    playlist.externalPlaylistToSyncWith?.lastSyncAt
                                "
                            >
                                {{
                                    new Date(
                                        playlist.externalPlaylistToSyncWith?.lastSyncAt,
                                    ).toLocaleString(undefined, {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    })
                                }}
                            </time>
                        </VCardText>

                        <VCardActions class="flex-wrap gr-3">
                            <SyncButtonWithConfirmation
                                @sync-confirm="
                                    handleSync(() => (isActive.value = false))
                                "
                            />

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

                            <VBtn
                                color="background-contrast"
                                variant="outlined"
                                prepend-icon="mdi-open-in-new"
                                class="flex-grow-1 ml-0"
                                target="_blank"
                                :href="externalPlaylist.originalPageUrl"
                            >
                                Open on
                                {{ playlist.externalPlaylistToSyncWith?.platform }}
                            </VBtn>
                        </VCardActions>
                    </div>

                    <VCardText v-else-if="performSyncMutation.loading.value">
                        <VIcon
                            v-anime="{ rotate: 360, duration: 900, loop: true }"
                            icon="mdi-sync"
                            size="50px"
                            class="sync-in-progress-icon"
                        />
                    </VCardText>
                </Transition>
            </VCard>
        </template>
    </VMenu>
</template>

<style scoped>
.sync-in-progress-icon {
    margin: 0 auto;
    padding: 60px 0px;
    transform-origin: center center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.scale-up-leave-active {
    transition-duration: 0.15s;
}
</style>
