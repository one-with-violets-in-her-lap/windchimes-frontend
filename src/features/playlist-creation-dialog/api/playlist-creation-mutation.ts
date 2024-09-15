import gql from 'graphql-tag'
import {
    CreatePlaylistMutation,
    CreatePlaylistMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutationWithErrorNotification } from '@/shared/utils/graphql-operations'

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

    return useMutationWithErrorNotification<
        CreatePlaylistMutation,
        CreatePlaylistMutationVariables
    >(mutation, { refetchQueries: ['GetPlaylists'] })
}
