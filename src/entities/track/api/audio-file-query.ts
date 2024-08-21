import gql from 'graphql-tag'
import { type ApolloClient } from '@apollo/client/core'
import type { PlaylistTrack } from '@/entities/track/model/track'
import type {
    GetTrackAudioFileUrlQuery,
    GetTrackAudioFileUrlQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export async function queryTrackAudioFile(
    client: ApolloClient<any>,
    track: PlaylistTrack,
) {
    const audioFileQuery = gql`
        query GetTrackAudioFileUrl($trackToReadData: TrackAudioFileQueryInput!) {
            trackAudioFile(trackToReadData: $trackToReadData) {
                ... on TrackAudioFileGraphQL {
                    url
                }

                ... on ErrorGraphQL {
                    name
                    explanation
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
            trackToReadData: {
                platform: track.platform,
                platformId: track.platformId,
                audioFileEndpointUrl: track.audioFileEndpointUrl,
            },
        },
    })
}
