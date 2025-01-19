import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import { LOADED_TRACK_FRAGMENT } from '@/entities/tracks'

import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'
import {
    GetPlaylistWithTracksQuery,
    GetPlaylistWithTracksQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

const playlistWithTracksQuery = gql`
    ${LOADED_TRACK_FRAGMENT}
    ${ERROR_FRAGMENT}

    query GetPlaylistWithTracks(
        $playlistId: Int!
        $tracksToLoadIds: [String!]
        $loadFirstTracks: Boolean
    ) {
        playlist(
            playlistId: $playlistId
            tracksToLoadIds: $tracksToLoadIds
            loadFirstTracks: $loadFirstTracks
        ) {
            ... on PlaylistWithLoadedTracksGraphQL {
                id
                createdAt
                name
                pictureUrl
                description
                ownerUserId

                trackReferences {
                    id
                    platform
                    platformId
                }

                loadedTracks {
                    ...LoadedTrack
                }
            }

            ... on GraphQLApiError {
                ...Error
            }
        }
    }
`

export function usePlaylistWithTracksQuery(
    playlistId: number,
    tracksToLoadIds?: string[],
    loadFirstTracks = true,
) {
    return useQuery<GetPlaylistWithTracksQuery, GetPlaylistWithTracksQueryVariables>(
        playlistWithTracksQuery,
        { playlistId, tracksToLoadIds, loadFirstTracks },
    )
}

export function usePlaylistWithTracksLazyQuery(
    playlistId: number,
    tracksToLoadIds?: string[],
    loadFirstTracks = true,
) {
    return useLazyQuery<
        GetPlaylistWithTracksQuery,
        GetPlaylistWithTracksQueryVariables
    >(playlistWithTracksQuery, { playlistId, tracksToLoadIds, loadFirstTracks })
}
