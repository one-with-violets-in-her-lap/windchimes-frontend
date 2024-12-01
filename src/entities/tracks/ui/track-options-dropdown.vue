<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuth0 } from '@auth0/auth0-vue'
import { PlaylistTrack } from '@/entities/tracks/model/track'
import { useTracksQueueStore } from '@/entities/tracks-queue'
import { useNotificationsStore } from '@/shared/model/notifications'
import { DropdownButton, DropdownMenu } from '@/shared/ui/dropdown-menu'
import AddToPlaylistDialog from '@/entities/tracks/ui/add-to-playlist-window.vue'

const props = defineProps<{
    track: PlaylistTrack
}>()

const { user } = useAuth0()

const { showNotification } = useNotificationsStore()
const { tracksQueue, currentTrackId } = storeToRefs(useTracksQueueStore())

const addToPlaylistWindowOpened = ref(false)

async function playNext() {
    const currentTrackIndex = tracksQueue.value.findIndex(
        track => track.id === currentTrackId.value,
    )

    if (currentTrackIndex !== -1) {
        const newTracksQueue = [...tracksQueue.value]
        newTracksQueue.splice(currentTrackIndex + 1, 0, props.track)

        tracksQueue.value = newTracksQueue

        showNotification('success', 'Track will be played next')
    }
}

async function addToQueue() {
    tracksQueue.value = [...tracksQueue.value, props.track]
    showNotification('success', 'Track will be played next')
}
</script>

<template>
    <DropdownMenu close-on-content-click>
        <template #activator="{ props }">
            <VBtn
                v-bind="props"
                icon="mdi-dots-horizontal"
                variant="text"
                density="comfortable"
                @click.stop
            ></VBtn>
        </template>

        <DropdownButton prepend-icon="mdi-play-box-multiple" @click="playNext">
            Play next
        </DropdownButton>

        <DropdownButton prepend-icon="mdi-playlist-plus" @click="addToQueue">
            Add to queue
        </DropdownButton>

        <DropdownButton
            prepend-icon="mdi-plus"
            @click="addToPlaylistWindowOpened = true"
        >
            Add to the playlist
        </DropdownButton>
    </DropdownMenu>

    <AddToPlaylistDialog
        v-if="user?.sub"
        v-model:opened="addToPlaylistWindowOpened"
        :track
        :current-user-id="user.sub"
    />
</template>

<style scoped></style>
