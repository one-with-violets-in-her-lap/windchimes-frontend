import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/features/player'
import { ArrayPartIndices } from '@/shared/utils/array-part-indices'
import { LoadedTrackFragment } from '@/shared/model/graphql-generated-types/graphql'

export function useTracksQueueActions() {
    const playerStore = usePlayerStore()
    const { tracksQueue, currentTrack } = storeToRefs(playerStore)
    const { shuffleQueue } = playerStore

    function insertLoadedTracks(
        queuePart: ArrayPartIndices,
        tracks: (LoadedTrackFragment | null)[],
    ) {
        const availableTracks = tracks.filter(track => track !== null)
    
        tracksQueue.value.splice(
            queuePart.startIndex,
            availableTracks.length,
            ...availableTracks,
        )
    }

    function clearQueue() {
        const currentTrackInQueue = tracksQueue.value.find(track => track.id === currentTrack.value?.id)

        if (currentTrackInQueue) {
            tracksQueue.value = [currentTrackInQueue]
        }
    }

    return { insertLoadedTracks, clearQueue, shuffleQueue }
}
