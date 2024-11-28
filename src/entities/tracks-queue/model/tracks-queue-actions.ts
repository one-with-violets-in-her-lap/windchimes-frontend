import { useLazyQuery } from '@vue/apollo-composable'
import { QueueItem, type TracksQueue } from '@/entities/tracks-queue/model/queue-item'
import { shuffle } from '@/shared/utils/shuffle'
import {
    GetPlaylistWithTracksQuery,
    GetPlaylistWithTracksQueryVariables,
    TrackReferenceGraphQl,
} from '@/shared/model/graphql-generated-types/graphql'

const PLAYLIST_QUERY_ERROR_MESSAGE =
    "Couldn't request playlist tracks from the server"

export class QueueTrackNotFoundError extends Error {
    constructor(explanation: string) {
        super(explanation)
    }
}

export class PlaylistPlayError extends Error {
    constructor(message = 'Failed to play the playlist') {
        super(message)
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
export function clearQueue(tracksQueue: QueueItem[], currentTrackId?: number) {
    if (!currentTrackId) {
        return []
    }

    const currentTrackInQueue = tracksQueue.find(track => track.id === currentTrackId)

    if (currentTrackInQueue) {
        return [currentTrackInQueue]
    } else {
        throw new QueueTrackNotFoundError(
            `can't find a current track with id ${currentTrackId} to keep ` +
                'while clearing the queue',
        )
    }
}

type PlaylistWithTracksQuery = ReturnType<
    typeof useLazyQuery<
        GetPlaylistWithTracksQuery,
        GetPlaylistWithTracksQueryVariables
    >
>

/**
 * creates new tracks queue with tracks from playlist requested with specified query
 *
 * @param playlistLazyQuery query to get playlist tracks references with
 *
 * @param playlistTracks already loaded playlist tracks reference. if specified, the
 * function **uses them instead of sending a query to the server**
 *
 * @returns new tracks queue
 */
export async function playPlaylistInNewQueue(
    playlistLazyQuery: PlaylistWithTracksQuery,
    playlistTracks?: TrackReferenceGraphQl[],
) {
    if (playlistTracks !== undefined) {
        return [...playlistTracks]
    }

    try {
        const playlistWithTracks =
            playlistLazyQuery.result.value === undefined
                ? await playlistLazyQuery.load()
                : playlistLazyQuery.result.value

        if (!playlistWithTracks) {
            throw new PlaylistPlayError(PLAYLIST_QUERY_ERROR_MESSAGE)
        }

        if (playlistWithTracks.playlist?.__typename !== 'PlaylistWithTracksGraphQL') {
            throw new PlaylistPlayError(
                playlistWithTracks.playlist?.__typename === 'ErrorGraphQL'
                    ? playlistWithTracks.playlist.explanation
                    : PLAYLIST_QUERY_ERROR_MESSAGE,
            )
        }

        if (playlistWithTracks.playlist.tracksReferences.length === 0) {
            throw new PlaylistPlayError('This playlist does not have any tracks')
        }

        return [...playlistWithTracks.playlist.tracksReferences]
    } catch (error) {
        console.error(error)
        throw new PlaylistPlayError()
    }
}

/**
 * creates new tracks queue with tracks from playlist
 * (_requested with query specified in `playlistToAddLazyQuery`_)
 * added to the end of the query
 *
 * @param playlistLazyQuery query to get playlist tracks references with
 *
 * @param playlistTracks already loaded playlist tracks reference. if specified, the
 * function **uses them instead of sending a query to the server**
 *
 * @returns new tracks queue
 */
export async function getQueueWithPlaylistAdded(
    currentTracksQueue: TracksQueue,
    playlistToAddLazyQuery: PlaylistWithTracksQuery,
    playlistTracks?: TrackReferenceGraphQl[],
) {
    if (playlistTracks !== undefined) {
        return [...currentTracksQueue, ...playlistTracks]
    }

    try {
        const playlistWithTracks =
            playlistToAddLazyQuery.result.value === undefined
                ? await playlistToAddLazyQuery.load()
                : playlistToAddLazyQuery.result.value

        if (!playlistWithTracks) {
            throw new PlaylistPlayError(PLAYLIST_QUERY_ERROR_MESSAGE)
        }

        if (playlistWithTracks.playlist?.__typename !== 'PlaylistWithTracksGraphQL') {
            throw new PlaylistPlayError(
                playlistWithTracks.playlist?.__typename === 'ErrorGraphQL'
                    ? playlistWithTracks.playlist.explanation
                    : PLAYLIST_QUERY_ERROR_MESSAGE,
            )
        }

        if (playlistWithTracks.playlist.tracksReferences.length === 0) {
            throw new PlaylistPlayError('This playlist does not have any tracks')
        }

        return [
            ...currentTracksQueue,
            ...playlistWithTracks.playlist.tracksReferences,
        ]
    } catch (error) {
        console.error(error)
        throw new PlaylistPlayError()
    }
}
