<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/features/player'
import { usePlaylistWithTracksLazyQuery } from '@/features/playlist-actions/api/playlist-with-tracks-query'
import { PlaylistsListItemFragment } from '@/shared/model/graphql-generated-types/graphql'
import { DropdownMenu, DropdownButton } from '@/shared/ui/dropdown-menu'
import { useNotificationsStore } from '@/shared/model/notifications'
import {
    getQueueWithPlaylistAdded,
    PlaylistPlayError,
    playPlaylistInNewQueue,
} from '../model/play-playlist'

const props = defineProps<{
    playlist: PlaylistsListItemFragment
}>()

const playerStore = usePlayerStore()
const { playTrackFromQueue } = playerStore
const { tracksQueue } = storeToRefs(playerStore)

const { showNotification } = useNotificationsStore()

const playlistWithTracksLazyQuery = usePlaylistWithTracksLazyQuery(props.playlist.id)
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
            props.playlist.id,
            playlistWithTracksLazyQuery,
        )
        await playTrackFromQueue(0)
    } catch (error) {
        if (error instanceof PlaylistPlayError) {
            showNotification('error', error.message)
        } else {
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
            props.playlist.id,
            playlistWithTracksLazyQuery,
            tracksQueue.value,
        )
    } catch (error) {
        if (error instanceof PlaylistPlayError) {
            showNotification('error', error.message)
        } else {
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
                v-bind="playMenuActivatorProps"
                variant="tonal"
                color="primary"
                prepend-icon="mdi-play"
                :loading="loading"
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
