import gql from 'graphql-tag'
import { useLazyQuery } from '@vue/apollo-composable'
import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'
import {
    GetPlaylistsBasicInfoQuery,
    GetPlaylistsBasicInfoQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export function useLazyPlaylistsBasicInfoQuery(currentUserId: string) {
    const query = gql`
        ${ERROR_FRAGMENT}

        query GetPlaylistsBasicInfo($currentUserId: String!) {
            playlists(filters: { ownerUserId: $currentUserId }) {
                id
                name
            }
        }
    `

    return useLazyQuery<
        GetPlaylistsBasicInfoQuery,
        GetPlaylistsBasicInfoQueryVariables
    >(query, { currentUserId })
}
