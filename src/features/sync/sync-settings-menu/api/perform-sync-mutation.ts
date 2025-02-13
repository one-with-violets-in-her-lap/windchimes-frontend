import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import {
    PerformSyncMutation,
    PerformSyncMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export function usePerformSyncMutation() {
    const mutationDocument = gql`
        mutation PerformSync($playlistId: Int!) {
            syncPlaylistTracksWithExternalPlaylist(playlistId: $playlistId) {
                ... on GraphQLApiError {
                    isErrorResponse
                    explanation
                    name
                    technicalExplanation
                }

                ... on NotFoundErrorGraphQL {
                    isErrorResponse
                    explanation
                    name
                    technicalExplanation
                }

                ... on ExternalPlaylistNotAvailableErrorGraphQL {
                    isErrorResponse
                    explanation
                    name
                    technicalExplanation
                }

                ... on TracksSyncResult {
                    updatedTrackReferences {
                        id
                        platform
                        platformId
                    }
                }
            }
        }
    `

    return useMutation<PerformSyncMutation, PerformSyncMutationVariables>(
        mutationDocument,
    )
}
