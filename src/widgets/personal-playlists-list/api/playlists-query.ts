import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import {
    GetPlaylistsQueryVariables,
    GetPlaylistsQuery,
} from '@/shared/model/graphql-generated-types/graphql'

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

export function usePlaylistsQuery(ownerUserId: string) {
    return useQuery<GetPlaylistsQuery, GetPlaylistsQueryVariables>(
        gql`
            ${PLAYLISTS_LIST_ITEM_FRAGMENT}

            query GetPlaylists($ownerUserId: String!) {
                playlists(ownerUserId: $ownerUserId) {
                    ... on ErrorGraphQL {
                        name
                        explanation
                    }

                    ... on PlaylistGraphQLListResponseWrapperGraphQL {
                        items {
                            ...PlaylistsListItem
                        }
                    }
                }
            }
        `,
        { ownerUserId },
    )
}
