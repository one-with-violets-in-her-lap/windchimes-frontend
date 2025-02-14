import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import {
    SetPlaylistForTracksSyncMutation,
    SetPlaylistForTracksSyncMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export function useSetPlaylistForTracksSyncMutation() {
    const mutationDocument = gql`
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
                    }
                }

                ... on GraphQLApiError {
                    explanation
                    name
                    technicalExplanation
                }

                ... on ValidationErrorGraphQL {
                    dotSeparatedFieldLocation
                    explanation
                    name
                    technicalExplanation
                }

                ... on ExternalPlaylistNotAvailableErrorGraphQL {
                    explanation
                    name
                    technicalExplanation
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
