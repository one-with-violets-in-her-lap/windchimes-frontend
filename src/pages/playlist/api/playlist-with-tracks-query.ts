import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { PLAYLIST_LOADED_TRACK_FRAGMENT } from '@/entities/tracks'
import {
    GetPlaylistWithTracksQuery,
    GetPlaylistWithTracksQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export function usePlaylistWithTracksQuery(
    playlistId: number,
    tracksToLoadIds?: number[],
) {
    return useQuery<GetPlaylistWithTracksQuery, GetPlaylistWithTracksQueryVariables>(
        gql`
            ${PLAYLIST_LOADED_TRACK_FRAGMENT}

            query GetPlaylistWithTracks($playlistId: Int!, $tracksToLoadIds: [Int!]) {
                playlist(playlistId: $playlistId, tracksToLoadIds: $tracksToLoadIds) {
                    ... on PlaylistWithTracksGraphQL {
                        id
                        createdAt
                        name
                        pictureUrl
                        description

                        tracksReferences {
                            id
                            platform
                            platformId
                        }

                        loadedTracks {
                            ...PlaylistLoadedTrack
                        }
                    }

                    ... on ErrorGraphQL {
                        name
                        explanation
                    }
                }
            }
        `,
        { playlistId, tracksToLoadIds },
    )
}
