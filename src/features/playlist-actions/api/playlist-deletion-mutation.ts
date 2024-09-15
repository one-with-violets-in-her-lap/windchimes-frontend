import gql from 'graphql-tag'
import {
    DeletePlaylistMutation,
    DeletePlaylistMutationVariables,
    PlaylistsListItemFragmentFragment,
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
    >(mutation, {
        update(cache, { data }) {
            cache.modify({
                fields: {
                    playlists(cachedPlaylists, { readField }) {
                        return {
                            ...cachedPlaylists,
                            items: cachedPlaylists.items.filter(
                                (playlist: PlaylistsListItemFragmentFragment) =>
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
