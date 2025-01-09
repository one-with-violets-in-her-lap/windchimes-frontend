import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'
import {
    UpdatePlaylistMutation,
    UpdatePlaylistMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export function usePlaylistUpdateMutation() {
    const mutation = gql`
        ${ERROR_FRAGMENT}

        mutation UpdatePlaylist(
            $playlistId: Int!
            $newData: PlaylistUpdateGraphQL!
        ) {
            updatePlaylist(playlistToUpdateId: $playlistId, playlistDataToUpdate: $newData) {
                ...Error
            }
        }
    `

    return useMutation<UpdatePlaylistMutation, UpdatePlaylistMutationVariables>(
        mutation,
    )
}
