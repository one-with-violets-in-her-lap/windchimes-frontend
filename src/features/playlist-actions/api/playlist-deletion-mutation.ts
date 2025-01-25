import gql from 'graphql-tag'

import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'
import {
    DeletePlaylistMutation,
    DeletePlaylistMutationVariables,
    PlaylistsListItemFragment,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutationWithErrorNotification } from '@/shared/utils/graphql'

export function usePlaylistDeletionMutation() {
    const mutation = gql`
        ${ERROR_FRAGMENT}

        mutation DeletePlaylist($playlistId: Int!) {
            deletePlaylist(playlistToDeleteId: $playlistId) {
                ... on GraphQLApiError {
                    ...Error
                }
            }
        }
    `

    return useMutationWithErrorNotification<
        DeletePlaylistMutation,
        DeletePlaylistMutationVariables
    >(mutation, {
        update(cache) {
            cache.evict({ fieldName: 'playlists' })
        },
    })
}
