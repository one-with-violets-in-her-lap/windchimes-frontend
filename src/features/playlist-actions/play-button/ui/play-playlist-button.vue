<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { usePlayerStore } from '@/features/player'
import { usePlaylistWithTracksLazyQuery } from '@/features/playlist-actions/api/detailed-playlist-query'

import {
    QueuePlaylistOperationError,
    useTracksQueueStore,
} from '@/entities/tracks-queue'

import { TrackReferenceToReadGraphQl } from '@/shared/model/graphql-generated-types/graphql'
import { DropdownButton, DropdownMenu } from '@/shared/ui/dropdown-menu'
import { showTemporaryNotification } from '@/shared/utils/notifications'

const PLAYLIST_QUERY_ERROR_MESSAGE =
    "Couldn't request playlist tracks from the server"

const props = defineProps<{
    playlistId: number
    /**
     * tracks references of a playlist to play. if not specified, loads from server
     */
    tracksReferences?: TrackReferenceToReadGraphQl[]
}>()

const { playNextTrack } = usePlayerStore()

const tracksQueueStore = useTracksQueueStore()
const { addPlaylistToQueue, replaceQueueWithPlaylist } = tracksQueueStore
const { tracksQueue } = storeToRefs(tracksQueueStore)

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

async function handlePlaylistTracksLoading() {
    let playlistTracksReferences = props.tracksReferences

    if (!playlistTracksReferences) {
        const playlistWithTracks =
            playlistWithTracksLazyQuery.result.value === undefined
                ? await playlistWithTracksLazyQuery.load()
                : playlistWithTracksLazyQuery.result.value

        if (!playlistWithTracks) {
            throw new QueuePlaylistOperationError(PLAYLIST_QUERY_ERROR_MESSAGE)
        }

        if (
            playlistWithTracks.playlist?.__typename !==
            'PlaylistDetailedWithLoadedTracksGraphQL'
        ) {
            throw new QueuePlaylistOperationError(
                playlistWithTracks.playlist?.__typename === 'GraphQLApiError'
                    ? playlistWithTracks.playlist.explanation
                    : PLAYLIST_QUERY_ERROR_MESSAGE,
            )
        }

        playlistTracksReferences = playlistWithTracks.playlist.trackReferences
    }

    return playlistTracksReferences
}

async function playRightAway() {
    loading.value = true

    try {
        const playlistTracksReferences = await handlePlaylistTracksLoading()
        replaceQueueWithPlaylist(playlistTracksReferences)
    } catch (error) {
        if (error instanceof QueuePlaylistOperationError) {
            showTemporaryNotification(
                'error',
                error.message || 'Error occurred when playing the playlist',
            )
        } else {
            console.error(error)
            showTemporaryNotification(
                'error',
                'Error occurred when playing the playlist',
            )
        }
    } finally {
        loading.value = false
    }

    await playNextTrack({ doNotLoop: true })
}

async function addToQueue() {
    loading.value = true

    try {
        addPlaylistToQueue(await handlePlaylistTracksLoading())
        showTemporaryNotification('success', 'Added to the end of the queue')
    } catch (error) {
        if (error instanceof QueuePlaylistOperationError) {
            showTemporaryNotification(
                'error',
                error.message || 'Error occurred when playing the playlist',
            )
        } else {
            console.error(error)
            showTemporaryNotification(
                'error',
                'Error occurred when playing the playlist',
            )
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
