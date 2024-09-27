<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTracksImportMutation } from '@/features/playlist-actions/api/tracks-import-mutation'
import { usePlaylistDeletionMutation } from '@/features/playlist-actions/api/playlist-deletion-mutation'
import {
    TracksImportFormData,
    TracksImportFormDialog,
} from '@/entities/tracks-import-form-dialog'
import { useNotificationsStore } from '@/shared/model/notifications'
import { ExcludeGraphQLError } from '@/shared/utils/exclude-graphql-error'
import { GetPlaylistWithTracksQuery } from '@/shared/model/graphql-generated-types/graphql'
import { PlaylistFormData, PlaylistFormDialog } from '@/entities/playlists'
import { usePlaylistUpdateMutation } from '../api/playlist-update-mutation'

const props = defineProps<{
    playlist: ExcludeGraphQLError<GetPlaylistWithTracksQuery['playlist']>
}>()

const emit = defineEmits<{
    (event: 'update'): void
}>()

const { showNotification } = useNotificationsStore()
const router = useRouter()

const tracksImportDialogOpened = ref(false)
const tracksImportMutation = useTracksImportMutation()

async function importTracks(tracksImportFormData: Required<TracksImportFormData>) {
    const result = await tracksImportMutation.mutate({
        fromPlaylist: {
            platform: tracksImportFormData.platform,
            url: tracksImportFormData.playlistToImportUrl,
        },
        toPlaylistId: props.playlist.id,
        replaceExistingTracks: tracksImportFormData.replaceExistingTracks,
    })

    if (result?.data?.importTracks.__typename === 'ErrorGraphQL') {
        showNotification('error', result.data.importTracks.explanation)
    } else if (result?.data?.importTracks.__typename === 'PlaylistGraphQL') {
        emit('update')
        showNotification('success', 'Imported successfully')
        tracksImportDialogOpened.value = false
    }
}

const deletionMutation = usePlaylistDeletionMutation()
async function deletePlaylist() {
    const result = await deletionMutation.mutate({
        playlistId: props.playlist.id,
    })

    if (result?.data?.deletePlaylist.__typename === 'ErrorGraphQL') {
        showNotification('error', result.data.deletePlaylist.explanation)
        return
    }

    showNotification('success', 'Deleted the playlist')

    router.push('/')
}

const updateMutation = usePlaylistUpdateMutation()
const updateFormDialogVisible = ref(false)
async function updatePlaylist(formData: PlaylistFormData) {
    const result = await updateMutation.mutate({
        playlistId: props.playlist.id,
        newData: formData,
    })

    if (result?.data?.updatePlaylist?.__typename === 'ErrorGraphQL') {
        showNotification('error', result.data.updatePlaylist.explanation)
        return
    }

    showNotification('success', 'Updated the playlist')

    emit('update')

    updateFormDialogVisible.value = false
}
</script>

<template>
    <div class="d-flex align-center gc-3 mb-7">
        <TracksImportFormDialog
            v-model:opened="tracksImportDialogOpened"
            :loading="tracksImportMutation.loading.value"
            @submit="importTracks"
        />

        <VMenu>
            <template v-slot:activator="{ props: menuActivatorProps }">
                <VBtn
                    icon="mdi-dots-vertical"
                    variant="text"
                    v-bind="menuActivatorProps"
                ></VBtn>
            </template>

            <VList>
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

                                    <VBtn @click="isActive.value = false">
                                        Cancel
                                    </VBtn>
                                </VCardActions>
                            </VCard>
                        </template>
                    </VDialog>
                </VListItem>

                <VListItem>
                    <PlaylistFormDialog
                        title="Edit the playlist"
                        submit-button-text="Update"
                        :loading="updateMutation.loading.value"
                        :initial-form-data="playlist"
                        v-model:visible="updateFormDialogVisible"
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
            </VList>
        </VMenu>
    </div>
</template>

<style scoped></style>
