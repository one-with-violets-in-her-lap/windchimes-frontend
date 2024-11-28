<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { PlaylistTrack } from '@/entities/tracks/model/track'
import { useTracksQueueStore } from '@/entities/tracks-queue'
import { useNotificationsStore } from '@/shared/model/notifications'
import { DropdownButton, DropdownMenu } from '@/shared/ui/dropdown-menu'

const props = defineProps<{
    track: PlaylistTrack
}>()

const { showNotification } = useNotificationsStore()
const { tracksQueue, currentTrackId } = storeToRefs(useTracksQueueStore())

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
    <DropdownMenu>
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
    </DropdownMenu>
</template>

<style scoped></style>
