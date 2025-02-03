import { QueueItem } from '@/entities/tracks-queue/model/queue-item'

import { shuffle } from '@/shared/utils/arrays'

export class QueueTrackNotFoundError extends Error {
    constructor(explanation: string) {
        super(explanation)
    }
}

/**
 * shuffles remaining part of a tracks queue
 *
 * @param currentTrackId id of a track to determine remaining part of a queue.
 * if not set, the whole queue is shuffled
 *
 * @returns new shuffled tracks queue
 */
export function shuffleQueue(tracksQueue: QueueItem[], currentTrackId?: number) {
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

/**
 * moves some queue track before other track in a given tracks queue
 * @param trackToMoveId track to move id
 * @param beforeTrackId some other track id before which track specified in `trackToMoveId` param need to be placed
 * @returns new tracks queue with tracks moved
 */
export function moveQueueTracks(
    tracksQueue: QueueItem[],
    trackToMoveId: number,
    beforeTrackId: number,
) {
    const trackToMoveIndex = tracksQueue.findIndex(
        track => track.id === trackToMoveId,
    )
    const beforeTrackIndex = tracksQueue.findIndex(
        track => track.id === beforeTrackId,
    )

    console.log(
        `placing ${trackToMoveId} (prev index: ${trackToMoveIndex}) ` +
            `at the index ${beforeTrackIndex}`,
    )

    if (trackToMoveIndex === -1) {
        throw new QueueTrackNotFoundError(
            `track to move with id ${trackToMoveId} cant be found`,
        )
    }

    if (beforeTrackIndex === -1) {
        throw new QueueTrackNotFoundError(
            'cannot move track because a track before which it should be ' +
                `placed (\`beforeTrackId\` param) cant be found by id ${beforeTrackId}`,
        )
    }

    const trackToMoveData = tracksQueue[trackToMoveIndex]

    const queueWithMovedTracks = [...tracksQueue]
    queueWithMovedTracks.splice(trackToMoveIndex, 1)
    queueWithMovedTracks.splice(beforeTrackIndex, 0, trackToMoveData)

    return queueWithMovedTracks
}

/**
 * deletes all queue tracks except for the current playing one
 * (_if `currentTrackId` is specified_)
 * @returns new queue with cleared tracks (_empty list or a list with current track_)
 */
export function clearQueue(tracksQueue: QueueItem[], currentQueueItemId?: number) {
    if (!currentQueueItemId) {
        return []
    }

    const currentTrackInQueue = tracksQueue.find(
        item => item.id === currentQueueItemId,
    )

    if (currentTrackInQueue) {
        return [currentTrackInQueue]
    } else {
        throw new QueueTrackNotFoundError(
            `can't find a current queue item with id ${currentQueueItemId} to keep ` +
                'while clearing the queue',
        )
    }
}
