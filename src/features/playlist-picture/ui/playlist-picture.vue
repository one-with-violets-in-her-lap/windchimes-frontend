<script setup lang="ts">
import { computed, ref } from 'vue'
import { VHover } from 'vuetify/components'

import { PlaylistPageDataFragment } from '@/shared/model/graphql-generated-types/graphql'
import { showTemporaryNotification } from '@/shared/utils/notifications'
import { useHoverAvailable } from '@/shared/utils/responsiveness'

import {
    useDeletePlaylistPictureMutation,
    useUpdatePlaylistPictureMutation,
} from '../api/playlist-picture-mutations'

const props = defineProps<{
    playlist: PlaylistPageDataFragment
    currentUserOwnsThePlaylist: boolean
}>()

const hoverAvailable = useHoverAvailable()

// Unix timestamp to append as a query param to picture url to refresh the cache
const pictureCacheRefreshTimestamp = ref(new Date().getTime())
function refreshPictureCache() {
    pictureCacheRefreshTimestamp.value = new Date().getTime()
}
const pictureUrl = computed(() =>
    props.playlist.pictureUrl
        ? `${props.playlist.pictureUrl}?cache_refresh_timestamp=${pictureCacheRefreshTimestamp.value}`
        : undefined,
)

const fileInput = ref<HTMLInputElement>()
function showFileBrowser() {
    fileInput.value?.click()
}

const updatePlaylistPictureMutation = useUpdatePlaylistPictureMutation()
const deletePlaylistPictureMutation = useDeletePlaylistPictureMutation()
const loading = computed(
    () =>
        updatePlaylistPictureMutation.loading.value ||
        deletePlaylistPictureMutation.loading.value,
)

const playlistPictureActionsOpened = ref(false)
function handlePictureClick() {
    if (props.playlist.pictureUrl !== null) {
        playlistPictureActionsOpened.value = true
    } else if (props.currentUserOwnsThePlaylist) {
        showFileBrowser()
    }
}

/*
    Pic must be clickable for file upload by owner and for picture full
    view dialog opening by other users
*/
const playlistPictureClickable = computed(
    () => props.currentUserOwnsThePlaylist || pictureUrl.value !== undefined,
)

async function handleNewPictureUpload() {
    playlistPictureActionsOpened.value = false

    if (!fileInput.value) {
        return
    }

    if (!fileInput.value.files || !fileInput.value.files[0]) {
        showTemporaryNotification(
            'error',
            'You must select a file to change the playlist picture',
        )
        return
    }

    const file = fileInput.value.files[0]

    try {
        const pictureUploadResult = await updatePlaylistPictureMutation.mutate({
            picture: file,
            playlistId: props.playlist.id,
        })

        if (
            pictureUploadResult?.data?.updatePlaylistPicture.__typename ===
            'GraphQLApiError'
        ) {
            showTemporaryNotification(
                'error',
                pictureUploadResult?.data?.updatePlaylistPicture.explanation,
            )
            return
        }

        refreshPictureCache()
    } catch (error) {
        showTemporaryNotification(
            'error',
            'Something went wrong while uploading your picture',
        )
    }
}

async function handlePictureDeletion() {
    playlistPictureActionsOpened.value = false

    try {
        const pictureDeletionResult = await deletePlaylistPictureMutation.mutate({
            playlistId: props.playlist.id,
        })

        if (
            pictureDeletionResult?.data?.deletePlaylistPicture?.__typename ===
            'GraphQLApiError'
        ) {
            showTemporaryNotification(
                'error',
                pictureDeletionResult?.data?.deletePlaylistPicture.explanation,
            )
        }
    } catch (error) {
        showTemporaryNotification(
            'error',
            'Something went wrong while deleting the picture',
        )
    }
}
</script>

<template>
    <div>
        <VHover v-slot="{ isHovering, props: hoverTargetProps }">
            <Component
                :is="playlistPictureClickable ? 'button' : 'div'"
                :disabled="loading"
                v-bind="hoverTargetProps"
                class="playlist-picture-container"
                @click="handlePictureClick"
            >
                <VImg
                    v-if="pictureUrl"
                    :key="pictureUrl"
                    :src="pictureUrl"
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
                        hoverAvailable &&
                        playlistPictureClickable
                    "
                    contained
                    opacity="0.2"
                    class="rounded-xl"
                    theme="light"
                    content-class="w-100 h-100 pa-3 d-flex flex-column align-center justify-end"
                    style="z-index: 0"
                >
                    <VSheet class="px-2 py-1 rounded text-body-2" color="white">
                        Click to view
                        <span v-if="currentUserOwnsThePlaylist">or change</span>
                    </VSheet>
                </VOverlay>

                <VOverlay
                    :model-value="loading"
                    contained
                    opacity="0.2"
                    class="rounded-xl"
                    content-class="w-100 h-100 pa-3 d-flex flex-column align-center justify-center"
                    style="z-index: 0"
                >
                    <VProgressCircular indeterminate color="white" size="large" />
                </VOverlay>
            </Component>
        </VHover>

        <VDialog
            v-model="playlistPictureActionsOpened"
            max-width="700px"
            min-width="320px"
        >
            <VCard title="Playlist picture" variant="flat" color="background">
                <VCardItem v-if="pictureUrl">
                    <div class="d-flex justify-center">
                        <VImg
                            :src="pictureUrl"
                            :aspect-ratio="1 / 1"
                            max-width="560px"
                            min-width="300px"
                            cover
                            class="rounded-lg"
                        />
                    </div>
                </VCardItem>

                <VCardActions v-if="currentUserOwnsThePlaylist" class="pa-5 pt-0">
                    <VBtn color="primary" variant="flat" @click="showFileBrowser">
                        Upload new
                    </VBtn>

                    <VBtn color="primary" @click="handlePictureDeletion">
                        Set to default
                    </VBtn>
                </VCardActions>
            </VCard>
        </VDialog>

        <input ref="fileInput" type="file" hidden @input="handleNewPictureUpload" />
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
