import gql from 'graphql-tag'

import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'
import {
    ImportTracksMutation,
    ImportTracksMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutationWithErrorNotification } from '@/shared/utils/graphql'

export function useTracksImportMutation() {
    const mutation = gql`
        ${ERROR_FRAGMENT}

        mutation ImportTracks(
            $fromPlaylist: PlaylistToImportFromGraphQL!
            $toPlaylistId: Int!
            $replaceExistingTracks: Boolean!
        ) {
            importExternalPlaylistTracks(
                playlistToImportFrom: $fromPlaylist
                playlistToImportToId: $toPlaylistId
                replaceExistingTracks: $replaceExistingTracks
            ) {
                ... on GraphQLApiError {
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
