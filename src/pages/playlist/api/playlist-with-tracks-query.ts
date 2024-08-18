import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import {
    GetPlaylistWithTracksQuery,
    GetPlaylistWithTracksQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export function usePlaylistWithTracksQuery(playlistId: number) {
    return useQuery<
        GetPlaylistWithTracksQuery,
        GetPlaylistWithTracksQueryVariables
    >(
        gql`
            query GetPlaylistWithTracks($playlistId: Int!, $tracksOffset: Int) {
                playlist(playlistId: $playlistId, tracksOffset: $tracksOffset) {
                    id
                    createdAt
                    name
                    pictureUrl
                    tracksCount
                    description

                    tracks {
                        items {
                            id
                            platform
                            platformId
                            name
                            secondsDuration
                            pictureUrl
                            audioFileEndpointUrl

                            owner {
                                name
                            }
                        }
                        totalItemsCount
                    }
                }
            }
        `,
        { playlistId },
    )
}
