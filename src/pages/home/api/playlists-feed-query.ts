import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import {
    GetPlaylistsFeedQuery,
    GetPlaylistsFeedQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export const PLAYLISTS_LIST_ITEM_FRAGMENT = gql`
    fragment PlaylistsListItem on PlaylistToReadGraphQL {
        id
        createdAt
        name
        pictureUrl
        publiclyAvailable
        ownerUserId
        trackCount
    }
`

export function usePlaylistsFeedQuery(
    currentUserId?: string,
    skipOtherPublicPlaylists = false,
) {
    return useQuery<GetPlaylistsFeedQuery, GetPlaylistsFeedQueryVariables>(
        gql`
            ${PLAYLISTS_LIST_ITEM_FRAGMENT}

            query GetPlaylistsFeed(
                $authorized: Boolean!
                $currentUserId: String
                $skipOtherPublicPlaylists: Boolean!
            ) {
                personalPlaylists: playlists(
                    filters: { ownerUserId: $currentUserId }
                ) @include(if: $authorized) {
                    ...PlaylistsListItem
                }

                otherPublicPlaylists: playlists(
                    filters: { excludeOwnerUserId: $currentUserId }
                    limit: 7
                ) @skip(if: $skipOtherPublicPlaylists) {
                    ...PlaylistsListItem
                }
            }
        `,
        {
            authorized: currentUserId !== undefined,
            currentUserId,
            skipOtherPublicPlaylists,
        },
    )
}
