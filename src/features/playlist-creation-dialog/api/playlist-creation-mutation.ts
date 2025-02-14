import gql from 'graphql-tag'

import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'
import {
    CreatePlaylistMutation,
    CreatePlaylistMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutationWithErrorNotification } from '@/shared/utils/graphql'

export function usePlaylistCreationMutation() {
    const mutation = gql`
        ${ERROR_FRAGMENT}

        mutation CreatePlaylist($playlistData: PlaylistToCreateGraphQL!) {
            createPlaylist(playlist: $playlistData) {
                ... on PlaylistDetailedGraphQL {
                    id
                }

                ... on GraphQLApiError {
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
