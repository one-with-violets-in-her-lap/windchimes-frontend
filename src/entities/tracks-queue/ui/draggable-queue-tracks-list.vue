<script setup lang="ts">
import { TrackItem } from '@/features/track'
import { QueueItem } from '@/entities/tracks-queue/model/queue-item'
import { DragAndDropItem, DragAndDropList } from '@/shared/ui/drag-and-drop'
import { DragAndDropError } from '@/shared/model/errors'
import { LoadedTrackFragment } from '@/shared/model/graphql-generated-types/graphql'

defineProps<{
    /**
     * actual tracks' data loaded with pagination (infinite scroll)
     */
    loadedTracks: LoadedTrackFragment[]
}>()

const allQueueTracks = defineModel<QueueItem[]>('allQueueTracks', { required: true })

function moveBeforeTrack(trackToMoveId: string, beforeTrackId: string) {
    console.log('ids', trackToMoveId, beforeTrackId)

    const trackToMoveIndex = allQueueTracks.value.findIndex(
        track => `${track.id}` === trackToMoveId,
    )
    const beforeTrackIndex = allQueueTracks.value.findIndex(
        track => `${track.id}` === beforeTrackId,
    )

    console.log(
        `placing ${trackToMoveId} (prev index: ${trackToMoveIndex}) ` +
            `at the index ${beforeTrackIndex}`,
    )

    if (beforeTrackIndex === -1 || trackToMoveIndex === -1) {
        throw new DragAndDropError('')
    }

    const trackToMoveData = allQueueTracks.value[trackToMoveIndex]

    console.log('tracks to move', trackToMoveData)

    allQueueTracks.value.splice(trackToMoveIndex, 1)
    allQueueTracks.value.splice(beforeTrackIndex, 0, trackToMoveData)
}
</script>

<template>
    <DragAndDropList name="slide-left">
        <template #default="{ dragAndDropListElement }">
            <DragAndDropItem
                v-for="(track, index) in loadedTracks"
                :drag-and-drop-parent="dragAndDropListElement"
                :id="`${track.id}`"
                :key="track.id"
                @move-before="moveBeforeTrack"
            >
                <TrackItem
                    :track-number="index + 1"
                    :track="track"
                    :all-playlist-tracks="allQueueTracks"
                />
            </DragAndDropItem>
        </template>
    </DragAndDropList>
</template>
