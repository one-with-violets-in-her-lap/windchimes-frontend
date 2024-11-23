import { useLazyQuery } from '@vue/apollo-composable'
import { TracksQueue } from '@/entities/tracks-queue'
import {
    GetPlaylistWithTracksQuery,
    GetPlaylistWithTracksQueryVariables,
    TrackReferenceGraphQl,
} from '@/shared/model/graphql-generated-types/graphql'

export class PlaylistPlayError extends Error {
    constructor(message = 'Failed to play the playlist') {
        super(message)
    }
}

const PLAYLIST_QUERY_ERROR_MESSAGE =
    "Couldn't request playlist tracks from the server"

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
