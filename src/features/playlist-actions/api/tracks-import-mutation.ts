import gql from 'graphql-tag'
import {
    ImportTracksMutation,
    ImportTracksMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutationWithErrorNotification } from '@/shared/utils/graphql-operations'

export function useTracksImportMutation() {
    const mutation = gql`
        mutation ImportTracks(
            $fromPlaylist: PlaylistToImportFromGraphQL!
            $toPlaylistId: Int!
            $replaceExistingTracks: Boolean!
        ) {
            importTracks(
                fromPlaylist: $fromPlaylist
                toPlaylistId: $toPlaylistId
                replaceExistingTracks: $replaceExistingTracks
            ) {
                ... on PlaylistGraphQL {
                    id
                    tracksReferences {
                        id
                        platformId
                        platform
                    }
                }

                ... on ErrorGraphQL {
                    name
                    explanation
                }
            }
        }
    `

    return useMutationWithErrorNotification<
        ImportTracksMutation,
        ImportTracksMutationVariables
    >(mutation)
}
