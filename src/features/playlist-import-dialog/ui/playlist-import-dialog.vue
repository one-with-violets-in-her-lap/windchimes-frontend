<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlaylistImportMutation } from '@/features/playlist-import-dialog/api/playlist-import-mutation'
import { Platform } from '@/entities/platform/model/platform'
import { useNotificationsStore } from '@/shared/model/notifications'

const router = useRouter()
const { showNotification } = useNotificationsStore()

const platformSelectItems = Object.values(Platform).map(platform => ({
    title: platform[0].toUpperCase() + platform.toLowerCase().slice(1),
    value: platform,
}))

const dialogVisible = ref(false)
const playlistImportForm = reactive({
    valid: false,
    data: {
        playlistPlatform: null,
        playlistUrl: '',
    },
})

const playlistImportMutation = usePlaylistImportMutation()
playlistImportMutation.onError(error => {
    showNotification('error', `Unexpected error: "${error.message}"`)
})

function isNotEmpty(value: string | null) {
    return Boolean(value && value.trim().length > 0)
}

async function importPlaylist() {
    if (!playlistImportForm.data.playlistPlatform) {
        return
    }

    const result = await playlistImportMutation.mutate({
        platform: playlistImportForm.data.playlistPlatform,
        playlistUrl: playlistImportForm.data.playlistUrl,
    })

    if (result?.data?.importPlaylist.__typename === 'ErrorGraphQL') {
        showNotification('error', result.data.importPlaylist.explanation)
    } else if (result?.data?.importPlaylist.__typename === 'PlaylistGraphQL') {
        playlistImportForm.data = {
            playlistPlatform: null,
            playlistUrl: '',
        }

        dialogVisible.value = false

        router.push({
            name: 'playlist',
            params: { id: result.data.importPlaylist.id },
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
                Import playlist
            </VBtn>
        </template>

        <VCard title="Import playlist" elevation="0">
            <template #text>
                <VForm
                    v-model="playlistImportForm.valid"
                    @submit.prevent="importPlaylist"
                >
                    <VSelect
                        v-model="playlistImportForm.data.playlistPlatform"
                        label="Platform"
                        placeholder="Choose"
                        variant="outlined"
                        :rules="[isNotEmpty]"
                        :items="platformSelectItems"
                    />

                    <VTextField
                        v-model="playlistImportForm.data.playlistUrl"
                        label="Playlist url"
                        placeholder="https://..."
                        :rules="[isNotEmpty]"
                        variant="outlined"
                    />

                    <div class="d-flex ga-3 items-center flex-wrap">
                        <VBtn
                            variant="flat"
                            color="primary"
                            prepend-icon="mdi-check"
                            type="submit"
                            :disabled="!playlistImportForm.valid"
                            :loading="playlistImportMutation.loading.value"
                        >
                            Submit
                        </VBtn>

                        <VBtn
                            variant="tonal"
                            color="error"
                            prepend-icon="mdi-close"
                            @click="dialogVisible = false"
                        >
                            Close
                        </VBtn>
                    </div>
                </VForm>
            </template>
        </VCard>
    </VDialog>
</template>

<style scoped></style>
