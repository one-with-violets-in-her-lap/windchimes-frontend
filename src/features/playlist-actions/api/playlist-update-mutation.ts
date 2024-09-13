import { UpdatePlaylistMutation, UpdatePlaylistMutationVariables } from '@/shared/model/graphql-generated-types/graphql';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';

export function usePlaylistUpdateMutation() {
    const mutation = gql`
        mutation UpdatePlaylist($playlistId: Int!, $newData: UpdatePlaylistInputGraphQL!) {
            updatePlaylist(playlistId: $playlistId, newData: $newData) {
                name
                explanation
            }
        }
    `

    return useMutation<UpdatePlaylistMutation, UpdatePlaylistMutationVariables>(mutation)
}
