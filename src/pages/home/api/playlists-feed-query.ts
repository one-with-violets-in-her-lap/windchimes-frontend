import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import {
    GetPlaylistsFeedQueryVariables,
    GetPlaylistsFeedQuery,
} from '@/shared/model/graphql-generated-types/graphql'
import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'

export const PLAYLISTS_LIST_ITEM_FRAGMENT = gql`
    fragment PlaylistsListItem on PlaylistGraphQL {
        id
        createdAt
        name
        pictureUrl
        tracksReferences {
            id
        }
    }
`

export function usePlaylistsFeedQuery(currentUserId?: string) {
    return useQuery<GetPlaylistsFeedQuery, GetPlaylistsFeedQueryVariables>(
        gql`
            ${PLAYLISTS_LIST_ITEM_FRAGMENT}
            ${ERROR_FRAGMENT}

            query GetPlaylistsFeed(
                $currentUserId: String
                $excludeOwnedPlaylists: Boolean
            ) {
                personalPlaylists: playlists(ownerUserId: $currentUserId) {
                    ... on ErrorGraphQL {
                        ...Error
                    }

                    ... on PlaylistGraphQLListResponseWrapperGraphQL {
                        items {
                            ...PlaylistsListItem
                        }
                    }
                }

                otherPublicPlaylists: playlists(
                    excludeOwnedPlaylists: $excludeOwnedPlaylists
                ) {
                    ... on ErrorGraphQL {
                        ...Error
                    }

                    ... on PlaylistGraphQLListResponseWrapperGraphQL {
                        items {
                            ...PlaylistsListItem
                        }
                    }
                }
            }
        `,
        {
            currentUserId: currentUserId,
            excludeOwnedPlaylists: currentUserId !== undefined,
        },
    )
}
