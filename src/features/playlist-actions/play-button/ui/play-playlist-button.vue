<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
    getQueueWithPlaylistAdded,
    PlaylistPlayError,
    playPlaylistInNewQueue,
} from '@/entities/tracks-queue/model/tracks-queue-actions'
import { usePlayerStore } from '@/features/player'
import { usePlaylistWithTracksLazyQuery } from '@/features/playlist-actions/api/playlist-with-tracks-query'
import { useTracksQueueStore } from '@/entities/tracks-queue'
import { DropdownMenu, DropdownButton } from '@/shared/ui/dropdown-menu'
import { useNotificationsStore } from '@/shared/model/notifications'
import { TrackReferenceGraphQl } from '@/shared/model/graphql-generated-types/graphql'

const props = defineProps<{
    playlistId: number
    /**
     * tracks references of a playlist to play. if not specified, loads from server
     */
    tracksReferences?: TrackReferenceGraphQl[]
}>()

const playerStore = usePlayerStore()
const { playTrackFromQueue } = playerStore

const { tracksQueue } = storeToRefs(useTracksQueueStore())

const { showNotification } = useNotificationsStore()

const playlistWithTracksLazyQuery = usePlaylistWithTracksLazyQuery(
    props.playlistId,
    undefined,
    false,
)
const loading = ref(false)

async function handlePlayButtonClick() {
    if (tracksQueue.value.length === 0) {
        await playRightAway()
    }
}

async function playRightAway() {
    loading.value = true

    try {
        tracksQueue.value = await playPlaylistInNewQueue(
            playlistWithTracksLazyQuery,
            props.tracksReferences,
        )

        await playTrackFromQueue(0)
    } catch (error) {
        if (error instanceof PlaylistPlayError) {
            showNotification('error', error.message)
        } else {
            console.error(error)
            showNotification('error', 'Error occurred when playing the playlist')
        }
    } finally {
        loading.value = false
    }
}

async function addToQueue() {
    loading.value = true

    try {
        tracksQueue.value = await getQueueWithPlaylistAdded(
            tracksQueue.value,
            playlistWithTracksLazyQuery,
            props.tracksReferences,
        )

        showNotification('success', 'Added to the end of the queue')
    } catch (error) {
        if (error instanceof PlaylistPlayError) {
            showNotification('error', error.message)
        } else {
            console.error(error)
            showNotification('error', 'Error occurred when playing the playlist')
        }
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <DropdownMenu :disabled="tracksQueue.length === 0 || loading">
        <template #activator="{ props: playMenuActivatorProps }">
            <VBtn
                variant="tonal"
                color="primary"
                prepend-icon="mdi-play"
                :loading="loading"
                v-bind="{ ...playMenuActivatorProps, ...$attrs }"
                @click="handlePlayButtonClick"
            >
                Play
            </VBtn>
        </template>

        <DropdownButton prepend-icon="mdi-play" @click="playRightAway">
            Play right away
        </DropdownButton>

        <DropdownButton prepend-icon="mdi-plus-box-multiple" @click="addToQueue">
            Add to queue
        </DropdownButton>
    </DropdownMenu>
</template>

<style scoped></style>
