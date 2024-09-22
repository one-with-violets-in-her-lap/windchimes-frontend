<script setup lang="ts">
import { TrackItem } from '@/features/track'
import { QueueItem } from '@/entities/tracks-queue/model/queue-item'
import DraggableItem from '@/shared/ui/drag-and-drop-item.vue'
import { LoadedTrackFragment } from '@/shared/model/graphql-generated-types/graphql'

defineProps<{
    /**
     * actual tracks' data loaded with pagination (infinite scroll)
     */
    loadedTracks: LoadedTrackFragment[]
}>()

const allQueueTracks = defineModel<QueueItem[]>('allQueueTracks', { required: true })

function swapTracks(track1Id: string, track2Id: string) {
    console.log('ids', track1Id, track2Id)

    const track1Index = allQueueTracks.value.findIndex(
        track => `${track.id}` === track1Id,
    )
    const track2Index = allQueueTracks.value.findIndex(
        track => `${track.id}` === track2Id,
    )

    console.log('indices', track1Index, track2Index)

    if (track1Index === -1 || track2Index === -1) {
        return
    }

    const [track1, track2] = [
        allQueueTracks.value[track1Index],
        allQueueTracks.value[track2Index],
    ]

    console.log('tracks', track1, track2)

    allQueueTracks.value[track1Index] = track2
    allQueueTracks.value[track2Index] = track1
}
</script>

<template>
    <TransitionGroup name="slide-left">
        <DraggableItem
            v-for="(track, index) in loadedTracks"
            :id="`${track.id}`"
            :key="track.id"
            @swap="swapTracks"
        >
            <TrackItem
                :track-number="index + 1"
                :track="track"
                :all-playlist-tracks="allQueueTracks"
            />
        </DraggableItem>
    </TransitionGroup>
</template>
