import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import { CreatePlaylistMutation, CreatePlaylistMutationVariables } from '@/shared/model/graphql-generated-types/graphql'

export function usePlaylistCreationMutation() {
    const mutation = gql`
        mutation CreatePlaylist($playlistData: CreatePlaylistInputGraphQL!) {
            createPlaylist(playlistData: $playlistData) {
                ... on PlaylistGraphQL {
                    id
                }
                
                ... on ErrorGraphQL {
                    name
                    explanation
                }
            }
        }
    `

    return useMutation<CreatePlaylistMutation, CreatePlaylistMutationVariables>(mutation)
}
