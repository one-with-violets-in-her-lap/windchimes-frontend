import gql from 'graphql-tag'
import {
    DeletePlaylistMutation,
    DeletePlaylistMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutationWithErrorNotification } from '@/shared/utils/graphql-operations'

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

    return useMutationWithErrorNotification<
        DeletePlaylistMutation,
        DeletePlaylistMutationVariables
    >(mutation)
}
