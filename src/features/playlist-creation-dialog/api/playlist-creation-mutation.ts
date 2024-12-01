import gql from 'graphql-tag'
import {
    CreatePlaylistMutation,
    CreatePlaylistMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutationWithErrorNotification } from '@/shared/utils/graphql-operations'
import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'

export function usePlaylistCreationMutation() {
    const mutation = gql`
        ${ERROR_FRAGMENT}

        mutation CreatePlaylist($playlistData: CreatePlaylistInputGraphQL!) {
            createPlaylist(playlistData: $playlistData) {
                ... on PlaylistGraphQL {
                    id
                }

                ... on ErrorGraphQL {
                    ...Error
                }
            }
        }
    `

    return useMutationWithErrorNotification<
        CreatePlaylistMutation,
        CreatePlaylistMutationVariables
    >(mutation, { refetchQueries: ['GetPlaylistsFeed'] })
}
