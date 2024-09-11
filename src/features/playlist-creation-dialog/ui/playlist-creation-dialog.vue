<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlaylistCreationMutation } from '@/features/playlist-creation-dialog/api/playlist-creation-mutation'
import { useNotificationsStore } from '@/shared/model/notifications'

const router = useRouter()
const { showNotification } = useNotificationsStore()

const dialogVisible = ref(false)
const playlistForm = reactive({
    valid: false,
    data: {
        name: '',
        description: ''
    },
})

const playlistCreationMutation = usePlaylistCreationMutation()
playlistCreationMutation.onError(error => {
    showNotification('error', `Unexpected error: "${error.message}"`)
})

function isNotEmpty(value: string | null) {
    return Boolean(value && value.trim().length > 0)
}

async function createPlaylist() {
    const result = await playlistCreationMutation.mutate({
        playlistData: playlistForm.data,
    })

    if (result?.data?.createPlaylist.__typename === 'ErrorGraphQL') {
        showNotification('error', result.data.createPlaylist.explanation)
    } else if (result?.data?.createPlaylist.__typename === 'PlaylistGraphQL') {
        playlistForm.data = {
            name: '',
            description: '',
        }

        dialogVisible.value = false

        router.push({
            name: 'playlist',
            params: { id: result.data.createPlaylist.id },
        })
    }
}
</script>

<template>
    <VDialog v-model="dialogVisible">
        <template #activator="{ props: activatorProps }">
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

        <VCard title="Create playlist" elevation="0">
            <template #text>
                <VForm
                    v-model="playlistForm.valid"
                    @submit.prevent="createPlaylist"
                >
                    <VTextField
                        v-model="playlistForm.data.name"
                        label="Name"
                        placeholder="Playlist 1"
                        :rules="[isNotEmpty]"
                        variant="outlined"
                    />

                    <VTextarea
                        v-model="playlistForm.data.description"
                        label="Description"
                        rows="6"
                        placeholder="Playlist 1"
                        variant="outlined"
                    />

                    <div class="d-flex ga-3 items-center flex-wrap">
                        <VBtn
                            variant="flat"
                            color="primary"
                            prepend-icon="mdi-check"
                            type="submit"
                            :disabled="!playlistForm.valid"
                            :loading="playlistCreationMutation.loading.value"
                        >
                            Create
                        </VBtn>

                        <VBtn
                            variant="tonal"
                            color="error"
                            prepend-icon="mdi-close"
                            @click="dialogVisible = false"
                        >
                            Cancel
                        </VBtn>
                    </div>
                </VForm>
            </template>
        </VCard>
    </VDialog>
</template>

<style scoped></style>
