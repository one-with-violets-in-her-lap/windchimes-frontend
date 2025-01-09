import gql from 'graphql-tag'
import {
    DeletePlaylistMutation,
    DeletePlaylistMutationVariables,
    PlaylistsListItemFragment,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutationWithErrorNotification } from '@/shared/utils/graphql'
import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'

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
        update(cache, { data }) {
            cache.modify({
                fields: {
                    playlists(cachedPlaylists, { readField }) {
                        return {
                            ...cachedPlaylists,
                            items: cachedPlaylists.items.filter(
                                (playlist: PlaylistsListItemFragment) =>
                                    data?.deletePlaylist.__typename !==
                                        'PlaylistGraphQL' ||
                                    readField('id', playlist) !==
                                        data.deletePlaylist.id,
                            ),
                        }
                    },
                },
            })
        },
    })
}
