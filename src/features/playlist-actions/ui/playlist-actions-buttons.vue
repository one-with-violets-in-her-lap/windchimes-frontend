<script setup lang="ts">
import { ref } from 'vue'
import { useTracksImportMutation } from '@/features/playlist-actions/api/tracks-import-mutation'
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

const tracksImportDialogOpened = ref(false)
const tracksImportMutation = useTracksImportMutation()
async function importTracks(tracksImportFormData: Required<TracksImportFormData>) {
    const result = await tracksImportMutation.mutate({
        fromPlaylist: {
            platform: tracksImportFormData.platform,
            url: tracksImportFormData.playlistToImportUrl,
        },
        toPlaylistId: props.playlist.id,
    })

    if (result?.data?.importTracks.__typename === 'ErrorGraphQL') {
        showNotification('error', result.data.importTracks.explanation)
    } else if (result?.data?.importTracks.__typename === 'PlaylistGraphQL') {
        emit('update-tracks', result.data.importTracks.tracksReferences)
        tracksImportDialogOpened.value = false
    }
}
</script>

<template>
    <div class="d-flex align-center gc-3 mb-7">
        <TracksImportFormDialog
            v-model:opened="tracksImportDialogOpened"
            @submit="importTracks"
        />

        <VMenu>
            <template v-slot:activator="{ props }">
                <VBtn icon="mdi-dots-vertical" variant="text" v-bind="props"></VBtn>
            </template>

            <VList>
                <VListItem>
                    <VBtn prepend-icon="mdi-delete" variant="text"> Delete </VBtn>
                </VListItem>

                <VListItem>
                    <VBtn prepend-icon="mdi-pencil" variant="text"> Edit </VBtn>
                </VListItem>
            </VList>
        </VMenu>
    </div>
</template>

<style scoped></style>
