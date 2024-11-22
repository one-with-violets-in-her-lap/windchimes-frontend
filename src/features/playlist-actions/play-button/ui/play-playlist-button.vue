<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/features/player'
import { usePlaylistWithTracksLazyQuery } from '@/features/playlist-actions/api/playlist-with-tracks-query'
import { PlaylistsListItemFragment } from '@/shared/model/graphql-generated-types/graphql'
import { DropdownMenu, DropdownButton } from '@/shared/ui/dropdown-menu'
import { useNotificationsStore } from '@/shared/model/notifications'

const props = defineProps<{
    playlist: PlaylistsListItemFragment
}>()

const playerStore = usePlayerStore()
const { playTrackFromQueue } = playerStore
const { tracksQueue } = storeToRefs(playerStore)

const { showNotification } = useNotificationsStore()

const playlistWithTracksLazyQuery = usePlaylistWithTracksLazyQuery(props.playlist.id)

async function playRightAway() {
    const PLAYLIST_QUERY_ERROR_MESSAGE =
        "Couldn't request playlist tracks from the server"

    const playlistWithTracks = await playlistWithTracksLazyQuery.load()

    if (!playlistWithTracks) {
        showNotification('error', PLAYLIST_QUERY_ERROR_MESSAGE)
        return
    }

    if (playlistWithTracks.playlist?.__typename !== 'PlaylistWithTracksGraphQL') {
        showNotification(
            'error',
            playlistWithTracks.playlist?.__typename === 'ErrorGraphQL'
                ? playlistWithTracks.playlist.explanation
                : PLAYLIST_QUERY_ERROR_MESSAGE,
        )
        return
    }

    if (playlistWithTracks.playlist.tracksReferences.length === 0) {
        showNotification('error', 'This playlist does not have any tracks')
        return
    }

    tracksQueue.value = [...playlistWithTracks.playlist.tracksReferences]
    await playTrackFromQueue(0)
}
</script>

<template>
    <DropdownMenu :disabled="tracksQueue.length === 0">
        <template #activator="{ props: playMenuActivatorProps }">
            <VBtn
                v-bind="playMenuActivatorProps"
                variant="tonal"
                color="primary"
                prepend-icon="mdi-play"
                :loading="playlistWithTracksLazyQuery.loading.value"
                @click="playRightAway"
            >
                Play
            </VBtn>
        </template>

        <DropdownButton prepend-icon="mdi-play"> Play right away </DropdownButton>

        <DropdownButton prepend-icon="mdi-plus-box-multiple">
            Add to queue
        </DropdownButton>
    </DropdownMenu>
</template>

<style scoped></style>
