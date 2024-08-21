import gql from 'graphql-tag'
import { ApolloClient } from '@apollo/client/core'
import { PLAYLIST_LOADED_TRACK_FRAGMENT } from '@/entities/track/api/playlist-loaded-track-fragment'
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
        ${PLAYLIST_LOADED_TRACK_FRAGMENT}

        query GetTrackByReference($trackReference: TrackQueryInput!) {
            track(trackReference: $trackReference) {
                ...PlaylistLoadedTrack
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
