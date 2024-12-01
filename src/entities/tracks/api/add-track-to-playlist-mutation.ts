import {
    AddTrackToPlaylistMutation,
    AddTrackToPlaylistMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export function useAddTrackToPlaylistMutation() {
    const query = gql`
        mutation AddTrackToPlaylist($playlistsIds: [Int!]!, $trackId: Int!) {
            addTrackToPlaylists(playlistsIds: $playlistsIds, trackId: $trackId) {
                ... on ErrorGraphQL {
                    name
                    technicalExplanation
                    explanation
                }
            }
        }
    `

    return useMutation<
        AddTrackToPlaylistMutation,
        AddTrackToPlaylistMutationVariables
    >(query, {
        update: cache => {
            cache.evict({ id: 'GetPlaylistsFeed', fieldName: 'playlists' })
        },
    })
}
