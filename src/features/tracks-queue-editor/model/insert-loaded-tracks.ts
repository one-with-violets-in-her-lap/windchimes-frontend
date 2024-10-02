import { QueueItem } from '@/entities/tracks-queue'
import { LoadedTrackFragment } from '@/shared/model/graphql-generated-types/graphql'
import { ArrayPartIndices } from '@/shared/utils/array-part-indices'

export function insertLoadedTracks(
    tracksQueue: QueueItem[],
    queuePart: ArrayPartIndices,
    tracks: (LoadedTrackFragment | null)[],
) {
    const availableTracks = tracks.filter(track => track !== null)

    const newTracksQueue = [...tracksQueue]

    newTracksQueue.splice(
        queuePart.startIndex,
        availableTracks.length,
        ...availableTracks,
    )

    return newTracksQueue
}
