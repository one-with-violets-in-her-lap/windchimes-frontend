import { PlaylistTrack } from '@/entities/track/model/track'
import { shuffle } from '@/shared/utils/shuffle'
import { TrackReferenceGraphQl } from '@/shared/model/graphql-generated-types/graphql'

/**
 * shuffles remaining part of a tracks queue
 *
 * @param currentTrackId id of a track to determine remaining part of a queue.
 * if not set, the whole queue is shuffled
 *
 * @returns new shuffled tracks queue
 */
export function shuffleNextQueueTracks(
    tracksQueue: (PlaylistTrack | TrackReferenceGraphQl)[],
    currentTrackId?: number,
) {
    let currentTrackIndex = tracksQueue.findIndex(
        track => track.id === currentTrackId,
    )

    if (currentTrackIndex === -1) {
        currentTrackIndex = 0
    }

    const partToShuffleStartIndex = currentTrackIndex + 1

    const shuffledQueuePart = shuffle(tracksQueue.slice(partToShuffleStartIndex))

    const queueWithNextTracksShuffled = [...tracksQueue]

    shuffledQueuePart.forEach((track, shuffledQueueTrackIndex) => {
        queueWithNextTracksShuffled[
            partToShuffleStartIndex + shuffledQueueTrackIndex
        ] = track
    })

    return queueWithNextTracksShuffled
}
