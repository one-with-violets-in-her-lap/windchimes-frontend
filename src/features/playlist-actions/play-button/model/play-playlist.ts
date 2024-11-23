import { useLazyQuery } from '@vue/apollo-composable'
import {
    GetPlaylistWithTracksQuery,
    GetPlaylistWithTracksQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { TracksQueue } from '@/entities/tracks-queue'

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

export async function playPlaylistInNewQueue(
    playlistId: number,
    playlistLazyQuery: PlaylistWithTracksQuery,
) {
    try {
        const playlistWithTracks =
            playlistLazyQuery.result.value === undefined
                ? await playlistLazyQuery.load(null, { playlistId })
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
        throw new PlaylistPlayError()
    }
}

export async function getQueueWithPlaylistAdded(
    playlistToAddId: number,
    playlistToAddLazyQuery: PlaylistWithTracksQuery,
    currentTracksQueue: TracksQueue,
) {
    try {
        const playlistWithTracks =
            playlistToAddLazyQuery.result.value === undefined
                ? await playlistToAddLazyQuery.load(null, {
                      playlistId: playlistToAddId,
                  })
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
        throw new PlaylistPlayError()
    }
}
