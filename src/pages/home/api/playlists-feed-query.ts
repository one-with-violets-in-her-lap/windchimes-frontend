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

export function usePlaylistsFeedQuery(currentUserId?: string) {
    return useQuery<GetPlaylistsFeedQuery, GetPlaylistsFeedQueryVariables>(
        gql`
            ${PLAYLISTS_LIST_ITEM_FRAGMENT}

            query GetPlaylistsFeed($currentUserId: String) {
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
