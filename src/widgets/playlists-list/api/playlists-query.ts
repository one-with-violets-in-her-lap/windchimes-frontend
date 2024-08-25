import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import {
    GetPlaylistsQueryVariables,
    GetPlaylistsQuery,
} from '@/shared/model/graphql-generated-types/graphql'


export const PLAYLISTS_LIST_ITEM_FRAGMENT = gql`
    fragment PlaylistsListItemFragment on PlaylistGraphQL {
        id
        createdAt
        name
        pictureUrl
        tracksReferences {
            id
        }
    }
`

export function usePlaylistsQuery(ownerAuth0Id: string) {
    return useQuery<GetPlaylistsQuery, GetPlaylistsQueryVariables>(
        gql`
            ${PLAYLISTS_LIST_ITEM_FRAGMENT}

            query GetPlaylists($ownerAuth0Id: String!) {
                playlists(ownerAuth0Id: $ownerAuth0Id) {
                    ... on ErrorGraphQL {
                        name
                        explanation
                    }

                    ... on PlaylistGraphQLListResponseWrapperGraphQL {
                        items {
                            ...PlaylistsListItemFragment
                        }
                    }
                }
            }
        `,
        { ownerAuth0Id: ownerAuth0Id },
    )
}
