<script setup lang="ts">
import { useSetPlaylistForTracksSyncMutation } from '@/features/sync/setup-sync-button/api/set-playlist-for-tracks-sync-mutation'

import { TracksImportFormData } from '@/entities/tracks-import-form-dialog'

import { useNotificationsStore } from '@/shared/model/notifications'
import ShineEffectWrapper from '@/shared/ui/shine-effect-wrapper.vue'

const props = defineProps<{
    playlistId: number
    tracksImportFormData: Partial<TracksImportFormData>
    tracksImportFormValid: boolean
    disabled?: boolean
}>()

const { showNotification } = useNotificationsStore()

const setPlaylistForTracksSyncMutation = useSetPlaylistForTracksSyncMutation()

async function handleSyncSetup() {
    if (!props.tracksImportFormValid) {
        return
    }

    const tracksImportFormData =
        props.tracksImportFormData as Required<TracksImportFormData>

    const result = await setPlaylistForTracksSyncMutation.mutate({
        externalPlaylistPlatform: tracksImportFormData.platform,
        externalPlaylistUrl: tracksImportFormData.playlistToImportUrl,
        playlistToLinkToId: props.playlistId,
    })

    if (
        result?.data?.setPlaylistForTracksSync.__typename ===
        'SetPlaylistForTracksSyncMutationResult'
    ) {
        showNotification('success', 'Success. You can sync your playlists now')
    } else if (
        result?.data?.setPlaylistForTracksSync.__typename ===
        'ExternalPlaylistNotAvailableErrorGraphQL'
    ) {
        showNotification(
            'error',
            'Error occurred. Perhaps you entered invalid or private url',
        )
    } else {
        showNotification('error', 'Unknown error occurred')
    }
}
</script>

<template>
    <ShineEffectWrapper class="flex-grow-1" :shine-disabled="disabled">
        <VBtn
            variant="flat"
            color="primary"
            prepend-icon="mdi-creation"
            type="button"
            width="100%"
            :loading="setPlaylistForTracksSyncMutation.loading.value"
            :disabled="disabled"
            @click="handleSyncSetup"
        >
            Setup sync
        </VBtn>
    </ShineEffectWrapper>
</template>

<style scoped></style>
