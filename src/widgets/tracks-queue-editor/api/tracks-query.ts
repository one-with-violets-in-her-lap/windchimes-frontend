import gql from 'graphql-tag'
import { useLazyQuery } from '@vue/apollo-composable'
import { LOADED_TRACK_FRAGMENT } from '@/entities/tracks'
import {
    GetTracksByReferenceQuery,
    GetTracksByReferenceQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export function useLazyTracksQuery() {
    return useLazyQuery<
        GetTracksByReferenceQuery,
        GetTracksByReferenceQueryVariables
    >(gql`
        ${LOADED_TRACK_FRAGMENT}

        query GetTracksByReference($trackReferences: [TrackReferenceToLoadGraphQL!]!) {
            loadedTracks(trackReferences: $trackReferences) {
                ... on LoadedTracksWrapper {
                    items {
                        ...LoadedTrack
                    }
                }

                ... on GraphQLApiError {
                    name
                }
            }
        }
    `)
}
