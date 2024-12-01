import {
    AddTrackToPlaylistMutation,
    AddTrackToPlaylistMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export function useAddTrackToPlaylistMutation() {
    const mutation = gql`
        mutation AddTrackToPlaylist($playlistsIds: [Int!]!, $trackId: Int!) {
            addTrackToPlaylists(playlistsIds: $playlistsIds, trackId: $trackId) {
                ... on ErrorGraphQL {
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
