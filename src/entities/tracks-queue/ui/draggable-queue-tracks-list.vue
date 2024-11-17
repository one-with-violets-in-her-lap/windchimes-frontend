<script setup lang="ts">
import DraggableQueueTrack from '@/entities/tracks-queue/ui/draggable-queue-track.vue'
import {
    moveQueueTracks,
    QueueTrackNotFoundError,
} from '@/entities/tracks-queue/model/tracks-queue-actions'
import { QueueItem } from '@/entities/tracks-queue/model/queue-item'
import { DragAndDropList } from '@/shared/ui/drag-and-drop'
import { LoadedTrackFragment } from '@/shared/model/graphql-generated-types/graphql'
import { DragAndDropError } from '@/shared/model/errors'

defineProps<{
    /**
     * actual tracks' data loaded with pagination (infinite scroll)
     */
    loadedTracks: LoadedTrackFragment[]
    currentTrackId: number | undefined
}>()

const allQueueTracks = defineModel<QueueItem[]>('allQueueTracks', { required: true })

function moveBeforeTrack(trackToMoveId: string, beforeTrackId: string) {
    try {
        allQueueTracks.value = moveQueueTracks(
            allQueueTracks.value,
            +trackToMoveId,
            +beforeTrackId,
        )
    } catch (error) {
        if (error instanceof QueueTrackNotFoundError) {
            throw new DragAndDropError(error.message)
        }

        throw new DragAndDropError(`queue drag and drop failed: ${error}`)
    }
}

function deleteTrack(id: number) {
    const trackIndex = allQueueTracks.value.findIndex(track => id === track.id)
    allQueueTracks.value.splice(trackIndex, 1)
}
</script>

<template>
    <DragAndDropList class="tracks-list">
        <template #default="{ dragAndDropListElement }">
            <DraggableQueueTrack
                v-for="(track, index) in loadedTracks"
                :key="track.id"
                :track="track"
                :track-number="index + 1"
                :current-track="currentTrackId === track.id"
                :all-queue-tracks="allQueueTracks"
                :drag-and-drop-parent="dragAndDropListElement"
                @delete="deleteTrack(track.id)"
                @move-before="moveBeforeTrack"
            />
        </template>
    </DragAndDropList>
</template>

<style scoped>
.tracks-list {
    min-height: 200px;
}
</style>
