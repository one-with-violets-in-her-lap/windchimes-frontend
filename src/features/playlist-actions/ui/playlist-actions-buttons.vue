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
import {
    GetPlaylistWithTracksQuery,
    TrackReferenceGraphQl,
} from '@/shared/model/graphql-generated-types/graphql'

const props = defineProps<{
    playlist: ExcludeGraphQLError<GetPlaylistWithTracksQuery['playlist']>
}>()

const emit = defineEmits<{
    (event: 'update-tracks', newTracks: TrackReferenceGraphQl[]): void
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
        emit('update-tracks', result.data.importTracks.tracksReferences)
        showNotification('success', 'Imported successfully')
        tracksImportDialogOpened.value = false
    }
}

const playlistDeletionMutation = usePlaylistDeletionMutation()
async function deletePlaylist() {
    await playlistDeletionMutation.mutate({
        playlistId: props.playlist.id,
    })
    showNotification('success', 'Deleted the playlist')

    router.push('/')
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
            <template v-slot:activator="{ props }">
                <VBtn icon="mdi-dots-vertical" variant="text" v-bind="props"></VBtn>
            </template>

            <VList>
                <VListItem>
                    <VDialog>
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
                                        :loading="
                                            playlistDeletionMutation.loading.value
                                        "
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
                    <VBtn prepend-icon="mdi-pencil" variant="text"> Edit </VBtn>
                </VListItem>
            </VList>
        </VMenu>
    </div>
</template>

<style scoped></style>
