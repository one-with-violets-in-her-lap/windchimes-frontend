import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'
import {
    DeletePlaylistPictureMutation,
    DeletePlaylistPictureMutationVariables,
    UpdatePlaylistPictureMutation,
    UpdatePlaylistPictureMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export function useUpdatePlaylistPictureMutation() {
    const mutation = gql`
        ${ERROR_FRAGMENT}

        mutation UpdatePlaylistPicture($playlistId: Int!, $picture: Upload!) {
            updatePlaylistPicture(playlistId: $playlistId, picture: $picture) {
                ... on GraphQLApiError {
                    ...Error
                }

                ... on PlaylistNewPicture {
                    url
                }
            }
        }
    `

    return useMutation<
        UpdatePlaylistPictureMutation,
        UpdatePlaylistPictureMutationVariables
    >(mutation, {
        update(cache, _, { variables }) {
            cache.evict({
                fieldName: 'playlist',
                args: { playlistId: variables?.playlistId, loadFirstTracks: true },
            })
        },
    })
}

export function useDeletePlaylistPictureMutation() {
    const mutation = gql`
        ${ERROR_FRAGMENT}

        mutation DeletePlaylistPicture($playlistId: Int!) {
            deletePlaylistPicture(playlistId: $playlistId) {
                ...Error
            }
        }
    `

    return useMutation<
        DeletePlaylistPictureMutation,
        DeletePlaylistPictureMutationVariables
    >(mutation, {
        update(cache, _, { variables }) {
            cache.evict({
                fieldName: 'playlist',
                args: { playlistId: variables?.playlistId, loadFirstTracks: true },
            })
        },
    })
}
