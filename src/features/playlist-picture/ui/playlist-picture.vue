<script setup lang="ts">
import { ref } from 'vue'
import { VHover } from 'vuetify/components'

import { PlaylistPageDataWithTracksFragment } from '@/shared/model/graphql-generated-types/graphql'
import { useNotificationsStore } from '@/shared/model/notifications'
import { useHoverAvailable } from '@/shared/utils/responsiveness'

const props = defineProps<{
    playlist: PlaylistPageDataWithTracksFragment
    currentUserOwnsThePlaylist: boolean
}>()

const { showNotification } = useNotificationsStore()

const hoverAvailable = useHoverAvailable()

const fileInput = ref<HTMLInputElement>()
function showFileBrowser() {
    fileInput.value?.click()
}

const playlistPictureActionsOpened = ref(false)
function handlePictureClick() {
    if (!props.currentUserOwnsThePlaylist) {
        return
    }

    if (props.playlist.pictureUrl !== null) {
        playlistPictureActionsOpened.value = true
    } else {
        showFileBrowser()
    }
}

function handleNewPictureUpload() {
    if (!fileInput.value) {
        return
    }

    if (!fileInput.value.files || !fileInput.value.files[0]) {
        showNotification(
            'error',
            'You must select a file to change the playlist picture',
        )
        return
    }

    const file = fileInput.value.files[0]
    showNotification('success', file.name)
}
</script>

<template>
    <div>
        <VHover v-slot="{ isHovering, props: hoverTargetProps }">
            <component
                :is="currentUserOwnsThePlaylist ? 'button' : 'div'"
                v-bind="hoverTargetProps"
                class="playlist-picture-container"
                @click="handlePictureClick"
            >
                <VImg
                    v-if="playlist.pictureUrl"
                    :src="playlist.pictureUrl"
                    tile
                    height="100%"
                    width="100%"
                    cover
                    class="rounded-xl"
                />

                <VSheet
                    v-else
                    color="surface"
                    width="100%"
                    height="100%"
                    class="d-flex justify-center align-center rounded-xl"
                >
                    <VIcon icon="mdi-playlist-music" color="surface-3" size="100px" />
                </VSheet>

                <VOverlay
                    :model-value="
                        isHovering === true &&
                        currentUserOwnsThePlaylist &&
                        hoverAvailable
                    "
                    contained
                    opacity="0.2"
                    class="rounded-xl"
                    content-class="w-100 h-100 pa-3 d-flex flex-column align-center justify-end"
                >
                    <VSheet class="px-2 py-1 rounded" color="white">
                        Click to change
                    </VSheet>
                </VOverlay>
            </component>
        </VHover>

        <VDialog v-model="playlistPictureActionsOpened" max-width="700px">
            <VCard title="Playlist picture" variant="flat">
                <VCardActions class="pa-5 pt-0">
                    <VBtn color="primary" variant="flat" @click="showFileBrowser">
                        Upload new
                    </VBtn>

                    <VBtn color="primary"> Set to default </VBtn>
                </VCardActions>
            </VCard>
        </VDialog>

        <input type="file" ref="fileInput" hidden @input="handleNewPictureUpload" />
    </div>
</template>

<style scoped>
.playlist-picture-container {
    width: 190px;
    height: 190px;
    margin-bottom: 16px;
    position: relative;
}
</style>
