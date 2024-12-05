import gql from 'graphql-tag'
import {
    ImportTracksMutation,
    ImportTracksMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutationWithErrorNotification } from '@/shared/utils/graphql'
import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'

export function useTracksImportMutation() {
    const mutation = gql`
        ${ERROR_FRAGMENT}

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
                    ...Error
                }
            }
        }
    `

    return useMutationWithErrorNotification<
        ImportTracksMutation,
        ImportTracksMutationVariables
    >(mutation)
}
