<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { usePlaylistCreationMutation } from '@/features/playlist-creation-dialog/api/playlist-creation-mutation'

import { PlaylistFormData, PlaylistFormDialog } from '@/entities/playlists'

import { useNotificationsStore } from '@/shared/utils/notifications'

const router = useRouter()
const { showNotification } = useNotificationsStore()

const dialogVisible = ref(false)

const playlistCreationMutation = usePlaylistCreationMutation()

async function createPlaylist(formData: PlaylistFormData) {
    const result = await playlistCreationMutation.mutate({
        playlistData: formData,
    })

    if (result?.data?.createPlaylist.__typename === 'GraphQLApiError') {
        showNotification('error', result.data.createPlaylist.explanation)
    } else if (
        result?.data?.createPlaylist.__typename === 'PlaylistDetailedGraphQL'
    ) {
        dialogVisible.value = false

        router.push({
            name: 'playlist',
            params: { id: result.data.createPlaylist.id },
        })
    }
}
</script>

<template>
    <PlaylistFormDialog
        submit-button-text="Create"
        title="Create playlist"
        :loading="playlistCreationMutation.loading.value"
        @submit="createPlaylist"
    >
        <template #activator="{ activatorProps }">
            <VBtn
                variant="flat"
                color="primary"
                prepend-icon="mdi-plus"
                class="mb-6"
                v-bind="activatorProps"
            >
                Create playlist
            </VBtn>
        </template>
    </PlaylistFormDialog>
</template>

<style scoped></style>
