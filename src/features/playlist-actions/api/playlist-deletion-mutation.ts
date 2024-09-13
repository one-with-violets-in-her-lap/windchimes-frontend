import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import { DeletePlaylistMutation, DeletePlaylistMutationVariables } from '@/shared/model/graphql-generated-types/graphql'

export function usePlaylistDeletionMutation() {
    const mutation = gql`
        mutation DeletePlaylist($playlistId: Int!) {
            deletePlaylist(playlistId: $playlistId) {
                ... on PlaylistGraphQL {
                    id
                    name
                }

                ... on ErrorGraphQL {
                    name
                    explanation
                }
            }
        }
    `

    return useMutation<DeletePlaylistMutation, DeletePlaylistMutationVariables>(mutation)
}
