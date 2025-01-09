import gql from 'graphql-tag'
import { ApolloClient } from '@apollo/client/core'
import { LOADED_TRACK_FRAGMENT } from '@/entities/tracks'
import {
    GetTrackByReferenceQuery,
    GetTrackByReferenceQueryVariables,
    TrackQueryInput,
} from '@/shared/model/graphql-generated-types/graphql'

export async function queryLoadedTrack(
    client: ApolloClient<any>,
    trackReference: TrackQueryInput,
) {
    const query = gql`
        ${LOADED_TRACK_FRAGMENT}

        query GetTrackByReference($trackReference: TrackReferenceToLoadGraphQL!) {
            loadedTrack(trackReference: $trackReference) {
                ...LoadedTrack
            }
        }
    `

    return await client.query<
        GetTrackByReferenceQuery,
        GetTrackByReferenceQueryVariables
    >({
        query,
        variables: { trackReference },
    })
}
