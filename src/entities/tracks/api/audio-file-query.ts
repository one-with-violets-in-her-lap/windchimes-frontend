import { type ApolloClient } from '@apollo/client/core'
import gql from 'graphql-tag'

import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'
import type {
    GetTrackAudioFileUrlQuery,
    GetTrackAudioFileUrlQueryVariables,
    TrackReferenceToLoadGraphQl,
} from '@/shared/model/graphql-generated-types/graphql'

export async function queryTrackAudioFile(
    client: ApolloClient<any>,
    track: TrackReferenceToLoadGraphQl & { audioFileEndpointUrl?: string | null },
) {
    const audioFileQuery = gql`
        ${ERROR_FRAGMENT}

        query GetTrackAudioFileUrl(
            $platform: Platform!
            $platformId: String!
            $audioFileEndpointUrl: String
        ) {
            trackAudioFile(
                platform: $platform
                platformId: $platformId
                audioFileEndpointUrl: $audioFileEndpointUrl
            ) {
                ... on TrackAudioFileGraphQL {
                    url
                }

                ... on GraphQLApiError {
                    ...Error
                }
            }
        }
    `

    return await client.query<
        GetTrackAudioFileUrlQuery,
        GetTrackAudioFileUrlQueryVariables
    >({
        query: audioFileQuery,
        variables: {
            platform: track.platform,
            platformId: track.platformId,
            audioFileEndpointUrl: track.audioFileEndpointUrl,
        },
    })
}
