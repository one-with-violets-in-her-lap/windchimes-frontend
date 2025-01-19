import { LoadedQueueItem, QueueItem } from '@/entities/tracks-queue'

import { LoadedTrackFragment } from '@/shared/model/graphql-generated-types/graphql'
import { ArrayPartIndices } from '@/shared/utils/arrays'

export function insertLoadedTracks(
    tracksQueue: QueueItem[],
    queuePart: ArrayPartIndices,
    loadedTracks: (LoadedTrackFragment | null)[],
) {
    const availableTracks = loadedTracks.filter(track => track !== null)

    const newTracksQueue = [...tracksQueue]

    const loadedQueueItems: LoadedQueueItem[] = availableTracks.map(
        (track, index) => {
            const queueItem = newTracksQueue[index + queuePart.startIndex]

            return {
                ...queueItem,
                track,
            }
        },
    )

    newTracksQueue.splice(
        queuePart.startIndex,
        availableTracks.length,
        ...loadedQueueItems,
    )

    return newTracksQueue
}
