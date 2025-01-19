import { PlaylistTrack } from '@/entities/tracks'

import { TrackReferenceToReadGraphQl } from '@/shared/model/graphql-generated-types/graphql'

/**
 * get playlist tracks with already loaded tracks references replaced
 *
 * @param playlistTracksReferences all playlist tracks as **references**
 * (no data, only platform and id)
 *
 * @param loadedTracks loaded tracks that match some tracks references
 * from `playlistTracksReferences`
 *
 * @example
 * const playlistTracks = [
 *     { platform: Platform.Youtube, platformId: '123', id: 1 },
 *     { platform: Platform.Soundcloud, platformId: '456', id: 2 },
 * ]
 *
 * const loadedTracks = [
 *     {
 *         platform: Platform.Soundcloud,
 *         platformId: '456',
 *         id: 2,
 *         name: 'track loaded from soundcloud',
 *         // ... other data
 *     },
 * ]
 *
 * const result = includeLoadedTracksInPlaylistTracks(playlistTracks, loadedTracks)
 *
 * // result
 * [
 *     { platform: Platform.Youtube, platformId: '123', id: 1 },
 *     {
 *         platform: Platform.Soundcloud,
 *         platformId: '456',
 *         id: 2,
 *         name: 'track loaded from soundcloud',
 *         // ... other data
 *     },
 * ]
 */
export function includeLoadedTracksInPlaylistTracks(
    playlistTracksReferences: TrackReferenceToReadGraphQl[],
    loadedTracks: (PlaylistTrack | null)[],
) {
    const tracks: (TrackReferenceToReadGraphQl | PlaylistTrack)[] = [
        ...playlistTracksReferences,
    ]
    const unavailableTracksIds: string[] = []

    loadedTracks.forEach((loadedTrack, index) => {
        if (loadedTrack === null) {
            unavailableTracksIds.push(tracks[index].id)
            return
        }

        const matchingTrackReferenceIndex = tracks.findIndex(
            trackReference => trackReference.id === loadedTrack?.id,
        )

        if (matchingTrackReferenceIndex !== -1) {
            tracks[matchingTrackReferenceIndex] = loadedTrack
        }
    })

    return tracks.filter(
        trackReference => !unavailableTracksIds.includes(trackReference.id),
    )
}
