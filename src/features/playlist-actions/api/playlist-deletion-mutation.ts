import gql from 'graphql-tag'
import {
    DeletePlaylistMutation,
    DeletePlaylistMutationVariables,
    PlaylistsListItemFragment,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutationWithErrorNotification } from '@/shared/utils/graphql-operations'
import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'

export function usePlaylistDeletionMutation() {
    const mutation = gql`
        ${ERROR_FRAGMENT}

        mutation DeletePlaylist($playlistId: Int!) {
            deletePlaylist(playlistId: $playlistId) {
                ... on PlaylistGraphQL {
                    id
                    name
                }

                ... on ErrorGraphQL {
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
