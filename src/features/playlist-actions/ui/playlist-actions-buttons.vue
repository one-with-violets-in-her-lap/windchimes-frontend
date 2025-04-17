<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { usePlaylistDeletionMutation } from '@/features/playlist-actions/api/playlist-deletion-mutation'
import { usePlaylistUpdateMutation } from '@/features/playlist-actions/api/playlist-update-mutation'
import { useTracksImportMutation } from '@/features/playlist-actions/api/tracks-import-mutation'
import PlayPlaylistButton from '@/features/playlist-actions/play-button/ui/play-playlist-button.vue'
import { SetupSyncButton } from '@/features/sync/setup-sync-button'

import { PlaylistFormData, PlaylistFormDialog } from '@/entities/playlists'
import {
    TracksImportFormData,
    TracksImportFormDialog,
} from '@/entities/tracks-import-form-dialog'

import { GetDetailedPlaylistQuery } from '@/shared/model/graphql-generated-types/graphql'
import { DropdownMenu } from '@/shared/ui/dropdown-menu'
import { ExcludeGraphQLError } from '@/shared/utils/graphql'
import { showTemporaryNotification } from '@/shared/utils/notifications'

const props = defineProps<{
    playlist: ExcludeGraphQLError<GetDetailedPlaylistQuery['playlist']>
    userIsOwner: boolean
}>()

const emit = defineEmits<{
    (event: 'update'): void
}>()

const router = useRouter()

const tracksImportDialog = ref({
    opened: false,
    formValid: false,
    formData: {},
})

const tracksImportMutation = useTracksImportMutation()

async function importTracks() {
    if (!tracksImportDialog.value.formValid) {
        return
    }

    const tracksImportFormData = tracksImportDialog.value
        .formData as Required<TracksImportFormData>

    const result = await tracksImportMutation.mutate({
        fromPlaylist: {
            platform: tracksImportFormData.platform,
            url: tracksImportFormData.playlistToImportUrl,
        },
        toPlaylistId: props.playlist.id,
        replaceExistingTracks: tracksImportFormData.replaceExistingTracks,
    })

    if (
        result?.data?.importExternalPlaylistTracks?.__typename === 'GraphQLApiError'
    ) {
        showTemporaryNotification(
            'error',
            result.data.importExternalPlaylistTracks.explanation,
        )
    } else if (result?.data?.importExternalPlaylistTracks === null) {
        emit('update')
        showTemporaryNotification('success', 'Imported successfully')
        tracksImportDialog.value.opened = false
    } else {
        showTemporaryNotification('error', 'An unknown error occurred')
    }
}

const deletionMutation = usePlaylistDeletionMutation()
async function deletePlaylist() {
    const result = await deletionMutation.mutate({
        playlistId: props.playlist.id,
    })

    if (result?.data?.deletePlaylist?.__typename === 'GraphQLApiError') {
        showTemporaryNotification('error', result.data.deletePlaylist.explanation)
        return
    }

    showTemporaryNotification('success', 'Deleted the playlist')
    router.push('/')
}

const updateMutation = usePlaylistUpdateMutation()
const updateFormDialogVisible = ref(false)
async function updatePlaylist(formData: PlaylistFormData) {
    const result = await updateMutation.mutate({
        playlistId: props.playlist.id,
        newData: formData,
    })

    if (result?.data?.updatePlaylist?.__typename === 'GraphQLApiError') {
        showTemporaryNotification('error', result.data.updatePlaylist.explanation)
        return
    }

    showTemporaryNotification('success', 'Updated the playlist')

    emit('update')

    updateFormDialogVisible.value = false
}
</script>

<template>
    <div class="d-flex align-center ga-3 flex-wrap">
        <PlayPlaylistButton
            :playlist-id="playlist.id"
            :tracks-references="playlist.trackReferences"
            variant="flat"
        />

        <TracksImportFormDialog
            v-if="userIsOwner"
            v-model:opened="tracksImportDialog.opened"
            v-model:form-data="tracksImportDialog.formData"
            v-model:form-valid="tracksImportDialog.formValid"
            :loading="tracksImportMutation.loading.value"
            @submit="importTracks"
        >
            <template #additional-action-buttons="{ formValid }">
                <SetupSyncButton
                    :playlist-id="playlist.id"
                    :tracks-import-form-data="tracksImportDialog.formData"
                    :tracks-import-form-valid="tracksImportDialog.formValid"
                    :disabled="!formValid"
                    @sync-finished="tracksImportDialog.opened = false"
                />
            </template>
        </TracksImportFormDialog>

        <DropdownMenu v-if="userIsOwner">
            <template #activator="{ props: menuActivatorProps }">
                <VBtn
                    icon="mdi-dots-horizontal"
                    variant="text"
                    v-bind="menuActivatorProps"
                ></VBtn>
            </template>

            <VListItem>
                <VDialog max-width="500px">
                    <template #activator="{ props: activatorProps }">
                        <VBtn
                            prepend-icon="mdi-delete"
                            variant="text"
                            v-bind="activatorProps"
                        >
                            Delete
                        </VBtn>
                    </template>

                    <template #default="{ isActive }">
                        <VCard>
                            <VCardTitle class="text-wrap">
                                Are you sure you want to delete?
                            </VCardTitle>

                            <VCardActions class="justify-start">
                                <VBtn
                                    color="error"
                                    variant="flat"
                                    :loading="deletionMutation.loading.value"
                                    @click="
                                        async () => {
                                            await deletePlaylist()
                                            isActive.value = false
                                        }
                                    "
                                >
                                    Delete
                                </VBtn>

                                <VBtn @click="isActive.value = false"> Cancel </VBtn>
                            </VCardActions>
                        </VCard>
                    </template>
                </VDialog>
            </VListItem>

            <VListItem>
                <PlaylistFormDialog
                    v-model:visible="updateFormDialogVisible"
                    title="Edit the playlist"
                    submit-button-text="Update"
                    :loading="updateMutation.loading.value"
                    :initial-form-data="playlist"
                    @submit="updatePlaylist"
                >
                    <template #activator="{ activatorProps }">
                        <VBtn
                            prepend-icon="mdi-pencil"
                            variant="text"
                            v-bind="activatorProps"
                        >
                            Edit
                        </VBtn>
                    </template>
                </PlaylistFormDialog>
            </VListItem>
        </DropdownMenu>
    </div>
</template>

<style scoped></style>
