import { useLazyQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import {
    GetPlaylistsBasicInfoQuery,
    GetPlaylistsBasicInfoQueryVariables,
    PlaylistsFiltersGraphQl,
} from '@/shared/model/graphql-generated-types/graphql'

const PLAYLIST_BASIC_INFO_FRAGMENT = gql`
    fragment PlaylistBasicInfo on PlaylistToReadGraphQL {
        id
        name
    }
`

export function useLazyPlaylistsBasicInfoQuery(filters: PlaylistsFiltersGraphQl) {
    const query = gql`
        ${PLAYLIST_BASIC_INFO_FRAGMENT}

        query GetPlaylistsBasicInfo($filters: PlaylistsFiltersGraphQL!) {
            playlists(filters: $filters) {
                ...PlaylistBasicInfo
            }
        }
    `

    return useLazyQuery<
        GetPlaylistsBasicInfoQuery,
        GetPlaylistsBasicInfoQueryVariables
    >(query, { filters })
}
