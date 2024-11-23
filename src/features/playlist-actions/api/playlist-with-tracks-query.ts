import gql from 'graphql-tag'
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import { LOADED_TRACK_FRAGMENT } from '@/entities/tracks'
import {
    GetPlaylistWithTracksQuery,
    GetPlaylistWithTracksQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'

const playlistWithTracksQuery = gql`
    ${LOADED_TRACK_FRAGMENT}
    ${ERROR_FRAGMENT}

    query GetPlaylistWithTracks(
        $playlistId: Int!
        $tracksToLoadIds: [Int!]
        $loadFirstTracks: Boolean
    ) {
        playlist(
            playlistId: $playlistId
            tracksToLoadIds: $tracksToLoadIds
            loadFirstTracks: $loadFirstTracks
        ) {
            ... on PlaylistWithTracksGraphQL {
                id
                createdAt
                name
                pictureUrl
                description
                ownerUserId

                tracksReferences {
                    id
                    platform
                    platformId
                }

                loadedTracks {
                    ...LoadedTrack
                }
            }

            ... on ErrorGraphQL {
                ...Error
            }
        }
    }
`

export function usePlaylistWithTracksQuery(
    playlistId: number,
    tracksToLoadIds?: number[],
    loadFirstTracks = true,
) {
    return useQuery<GetPlaylistWithTracksQuery, GetPlaylistWithTracksQueryVariables>(
        playlistWithTracksQuery,
        { playlistId, tracksToLoadIds, loadFirstTracks },
    )
}

export function usePlaylistWithTracksLazyQuery(
    playlistId: number,
    tracksToLoadIds?: number[],
    loadFirstTracks = true,
) {
    return useLazyQuery<
        GetPlaylistWithTracksQuery,
        GetPlaylistWithTracksQueryVariables
    >(playlistWithTracksQuery, { playlistId, tracksToLoadIds, loadFirstTracks })
}
