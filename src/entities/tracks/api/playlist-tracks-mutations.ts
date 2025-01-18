import {
    AddTrackToPlaylistMutation,
    AddTrackToPlaylistMutationVariables,
    DeleteTrackFromPlaylistsMutation,
    DeleteTrackFromPlaylistsMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export function useAddTrackToPlaylistMutation() {
    const mutation = gql`
        mutation AddTrackToPlaylist($playlistsIds: [Int!]!, $trackId: String!) {
            addTracksToPlaylists(
                tracks: [{ id: $trackId, playlistsIdsToAddTo: $playlistsIds }]
            ) {
                ... on GraphQLApiError {
                    name
                    technicalExplanation
                    explanation
                }
            }
        }
    `

    return useMutation<
        AddTrackToPlaylistMutation,
        AddTrackToPlaylistMutationVariables
    >(mutation, {
        update(cache, _, options) {
            cache.evict({ fieldName: 'playlists' })

            const ids = options.variables?.playlistsIds as number[]
            ids.forEach(id => {
                cache.evict({ fieldName: 'playlist', args: { playlistId: id } })
            })
        },
    })
}

export function useDeleteTrackFromPlaylistsMutation() {
    const mutation = gql`
        mutation DeleteTrackFromPlaylists($playlistsIds: [Int!]!, $trackId: String!) {
            deleteTrackFromPlaylists(trackId: $trackId, playlistsIds: $playlistsIds) {
                ... on DeleteTrackFromPlaylistsResponse {
                    updatedPlaylistsIds
                }

                ... on ValidationErrorGraphQL {
                    name
                    technicalExplanation
                    explanation
                    dotSeparatedFieldLocation
                }

                ... on GraphQLApiError {
                    name
                    technicalExplanation
                    explanation
                }
            }
        }
    `

    return useMutation<
        DeleteTrackFromPlaylistsMutation,
        DeleteTrackFromPlaylistsMutationVariables
    >(mutation, {
        update(cache, _, options) {
            cache.evict({ fieldName: 'playlists' })

            const ids = options.variables?.playlistsIds as number[]
            ids.forEach(id => {
                cache.evict({
                    fieldName: 'playlist',
                    args: { playlistId: id, loadFirstTracks: true },
                })
            })
        },
    })
}
