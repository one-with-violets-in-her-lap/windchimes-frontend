import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import {
    GetPlaylistsFeedQueryVariables,
    GetPlaylistsFeedQuery,
} from '@/shared/model/graphql-generated-types/graphql'
import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'

export const PLAYLISTS_LIST_ITEM_FRAGMENT = gql`
    fragment PlaylistsListItem on PlaylistToReadGraphQL {
        id
        createdAt
        name
        pictureUrl
        trackCount
    }
`

export function usePlaylistsFeedQuery(currentUserId?: string) {
    return useQuery<GetPlaylistsFeedQuery, GetPlaylistsFeedQueryVariables>(
        gql`
            ${PLAYLISTS_LIST_ITEM_FRAGMENT}

            query GetPlaylistsFeed(
                $currentUserId: String
            ) {
                personalPlaylists: playlists(
                    filters: { ownerUserId: $currentUserId }
                ) {
                    ...PlaylistsListItem
                }

                otherPublicPlaylists: playlists(
                    filters: { excludeOwnerUserId: $currentUserId }
                ) {
                    ...PlaylistsListItem
                }
            }
        `,
        {
            currentUserId: currentUserId,
        },
    )
}
