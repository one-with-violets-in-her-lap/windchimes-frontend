import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import { LOADED_TRACK_FRAGMENT } from '@/entities/tracks'

import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'
import {
    GetDetailedPlaylistQuery,
    GetDetailedPlaylistQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

const PLAYLIST_PAGE_DATA_FRAGMENT = gql`
    ${LOADED_TRACK_FRAGMENT}

    fragment PlaylistPageData on PlaylistDetailedWithLoadedTracksGraphQL {
        id
        createdAt
        name
        pictureUrl
        description
        publiclyAvailable
        ownerUserId

        trackReferences {
            id
            platform
            platformId
        }

        loadedTracks {
            ...LoadedTrack
        }

        externalPlaylistToSyncWith {
            id
            platform
        }
    }
`

const DETAILED_PLAYLIST_QUERY_DOCUMENT = gql`
    ${PLAYLIST_PAGE_DATA_FRAGMENT}
    ${ERROR_FRAGMENT}

    query GetDetailedPlaylist(
        $playlistId: Int!
        $tracksToLoadIds: [String!]
        $loadFirstTracks: Boolean
    ) {
        playlist(
            playlistId: $playlistId
            tracksToLoadIds: $tracksToLoadIds
            loadFirstTracks: $loadFirstTracks
        ) {
            ... on PlaylistDetailedWithLoadedTracksGraphQL {
                ...PlaylistPageData
            }

            ... on GraphQLApiError {
                ...Error
            }
        }
    }
`

export function useDetailedPlaylistQuery(
    playlistId: number,
    tracksToLoadIds?: string[],
    loadFirstTracks = true,
) {
    return useQuery<GetDetailedPlaylistQuery, GetDetailedPlaylistQueryVariables>(
        DETAILED_PLAYLIST_QUERY_DOCUMENT,
        { playlistId, tracksToLoadIds, loadFirstTracks },
    )
}

export function usePlaylistWithTracksLazyQuery(
    playlistId: number,
    tracksToLoadIds?: string[],
    loadFirstTracks = true,
) {
    return useLazyQuery<GetDetailedPlaylistQuery, GetDetailedPlaylistQueryVariables>(
        DETAILED_PLAYLIST_QUERY_DOCUMENT,
        { playlistId, tracksToLoadIds, loadFirstTracks },
    )
}
