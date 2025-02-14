import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import {
    DisableSyncMutation,
    DisableSyncMutationVariables,
    GetDetailedPlaylistQueryVariables,
    PlaylistPageDataFragment,
} from '@/shared/model/graphql-generated-types/graphql'

export function useDisableSyncMutation() {
    const mutationDocument = gql`
        mutation DisableSync($playlistId: Int!) {
            disablePlaylistSync(playlistId: $playlistId) {
                ... on GraphQLApiError {
                    isErrorResponse
                    explanation
                    name
                    technicalExplanation
                }

                ... on ValidationErrorGraphQL {
                    isErrorResponse
                    dotSeparatedFieldLocation
                    explanation
                    name
                    technicalExplanation
                }
            }
        }
    `

    return useMutation<DisableSyncMutation, DisableSyncMutationVariables>(
        mutationDocument,
        {
            update(cache, _, { variables }) {
                if (!variables?.playlistId) {
                    return
                }

                cache.writeFragment<
                    Partial<PlaylistPageDataFragment>,
                    GetDetailedPlaylistQueryVariables
                >({
                    id:
                        'PlaylistDetailedWithLoadedTracksGraphQL:' +
                        variables.playlistId,
                    fragment: gql`
                        fragment PlaylistToDisableSyncFor on PlaylistDetailedWithLoadedTracksGraphQL {
                            externalPlaylistToSyncWith {
                                platform
                            }
                        }
                    `,
                    data: {
                        externalPlaylistToSyncWith: null,
                    },
                })
            },
        },
    )
}
