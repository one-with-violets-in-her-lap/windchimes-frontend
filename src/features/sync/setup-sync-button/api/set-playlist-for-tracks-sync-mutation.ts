import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'
import {
    SetPlaylistForTracksSyncMutation,
    SetPlaylistForTracksSyncMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export function useSetPlaylistForTracksSyncMutation() {
    const mutationDocument = gql`
        ${ERROR_FRAGMENT}

        mutation SetPlaylistForTracksSync(
            $playlistToLinkToId: Int!
            $externalPlaylistPlatform: Platform!
            $externalPlaylistUrl: String!
        ) {
            setPlaylistForTracksSync(
                playlistToLinkToId: $playlistToLinkToId
                externalPlaylistPlatform: $externalPlaylistPlatform
                externalPlaylistUrl: $externalPlaylistUrl
            ) {
                ... on SetPlaylistForTracksSyncMutationResult {
                    externalPlaylistLinked {
                        description
                        name
                        pictureUrl
                        originalPageUrl
                    }
                }

                ... on GraphQLApiError {
                    ...Error
                }

                ... on ValidationErrorGraphQL {
                    ...Error
                    dotSeparatedFieldLocation
                }

                ... on ExternalPlaylistNotAvailableErrorGraphQL {
                    ...Error
                }
            }
        }
    `
    return useMutation<
        SetPlaylistForTracksSyncMutation,
        SetPlaylistForTracksSyncMutationVariables
    >(mutationDocument, {
        refetchQueries: ['GetDetailedPlaylist'],
    })
}
