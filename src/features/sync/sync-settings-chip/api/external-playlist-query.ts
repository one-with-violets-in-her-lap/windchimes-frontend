import { useLazyQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import {
    GetExternalPlaylistLinkedQuery,
    GetExternalPlaylistLinkedQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export function useLazyExternalPlaylistQuery(parentPlaylistId: number) {
    const queryDocument = gql`
        fragment ExternalPlaylistInfo on ExternalPlaylistToReadGraphQL {
            description
            name
            pictureUrl
        }

        query GetExternalPlaylistLinked($parentPlaylistId: Int!) {
            externalPlaylistLinked(playlistId: $parentPlaylistId) {
                ... on GraphQLApiError {
                    explanation
                    name
                    technicalExplanation
                }

                ... on ExternalPlaylistToReadGraphQL {
                    ...ExternalPlaylistInfo
                }
            }
        }
    `

    return useLazyQuery<
        GetExternalPlaylistLinkedQuery,
        GetExternalPlaylistLinkedQueryVariables
    >(queryDocument, { parentPlaylistId })
}
