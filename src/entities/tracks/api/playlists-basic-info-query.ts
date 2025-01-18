import gql from 'graphql-tag'
import { useLazyQuery } from '@vue/apollo-composable'
import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'
import {
    GetPlaylistsBasicInfoQuery,
    GetPlaylistsBasicInfoQueryVariables,
    PlaylistsFiltersGraphQl,
} from '@/shared/model/graphql-generated-types/graphql'

export function useLazyPlaylistsBasicInfoQuery(filters: PlaylistsFiltersGraphQl) {
    const query = gql`
        query GetPlaylistsBasicInfo($filters: PlaylistsFiltersGraphQL!) {
            playlists(filters: $filters) {
                id
                name
            }
        }
    `

    return useLazyQuery<
        GetPlaylistsBasicInfoQuery,
        GetPlaylistsBasicInfoQueryVariables
    >(query, { filters })
}
