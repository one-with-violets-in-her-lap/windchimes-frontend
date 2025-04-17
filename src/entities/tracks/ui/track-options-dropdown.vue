<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useTracksQueueStore } from '@/entities/tracks-queue'
import { PlaylistTrack } from '@/entities/tracks/model/track'
import AddToPlaylistSheet from '@/entities/tracks/ui/add-to-playlist-sheet.vue'
import DeleteFromPlaylistSheet from '@/entities/tracks/ui/delete-from-playlist-sheet.vue'

import { PlaylistBasicInfoFragment } from '@/shared/model/graphql-generated-types/graphql'
import { DropdownButton, DropdownMenu } from '@/shared/ui/dropdown-menu'
import { IgnoreTypename } from '@/shared/utils/graphql'
import { showTemporaryNotification } from '@/shared/utils/notifications'

const props = defineProps<{
    track: PlaylistTrack
    currentPlaylist?: IgnoreTypename<PlaylistBasicInfoFragment>
}>()

const { user } = useAuth0()

const tracksQueueStore = useTracksQueueStore()
const { createQueueItem } = tracksQueueStore
const { tracksQueue, currentQueueItemId } = storeToRefs(tracksQueueStore)

const addToPlaylistSheetOpened = ref(false)
const deleteFromPlaylistsSheetOpened = ref(false)

async function playNext() {
    const currentQueueItem = tracksQueue.value.findIndex(
        track => track.id === currentQueueItemId.value,
    )

    if (currentQueueItem !== -1) {
        const newTracksQueue = [...tracksQueue.value]
        newTracksQueue.splice(currentQueueItem + 1, 0, createQueueItem(props.track))

        tracksQueue.value = newTracksQueue

        showTemporaryNotification('success', 'Track will be played next')
    }
}

async function addToQueue() {
    tracksQueue.value = [...tracksQueue.value, createQueueItem(props.track)]
    showTemporaryNotification('success', 'Track will be played next')
}
</script>

<template>
    <DropdownMenu close-on-content-click>
        <template #activator="{ props: menuActivatorProps }">
            <slot name="activator" :menu-activator-props> </slot>
        </template>

        <DropdownButton
            prepend-icon="mdi-open-in-new"
            :href="track.originalPageUrl"
            target="_blank"
        >
            Open original
        </DropdownButton>

        <DropdownButton prepend-icon="mdi-play-box-multiple" @click="playNext">
            Play next
        </DropdownButton>

        <DropdownButton prepend-icon="mdi-playlist-plus" @click="addToQueue">
            Add to queue
        </DropdownButton>

        <DropdownButton
            v-if="user?.sub"
            prepend-icon="mdi-plus"
            @click="addToPlaylistSheetOpened = true"
        >
            Add to the playlists
        </DropdownButton>

        <DropdownButton
            v-if="user?.sub"
            prepend-icon="mdi-delete"
            @click="deleteFromPlaylistsSheetOpened = true"
        >
            Remove from playlists
        </DropdownButton>
    </DropdownMenu>

    <AddToPlaylistSheet
        v-if="user?.sub"
        v-model:opened="addToPlaylistSheetOpened"
        :track
        :current-user-id="user.sub"
    />

    <DeleteFromPlaylistSheet
        v-if="user?.sub"
        v-model:opened="deleteFromPlaylistsSheetOpened"
        :current-playlist
        :track
        :current-user-id="user.sub"
    />
</template>

<style scoped></style>
