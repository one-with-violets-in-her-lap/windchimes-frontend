import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import {
    ImportPlaylistMutation,
    ImportPlaylistMutationVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export function usePlaylistImportMutation() {
    return useMutation<ImportPlaylistMutation, ImportPlaylistMutationVariables>(gql`
        mutation ImportPlaylist($platform: Platform!, $playlistUrl: String!) {
            importPlaylist(platform: $platform, playlistUrl: $playlistUrl) {
                ... on ErrorGraphQL {
                    name
                    explanation
                }

                ... on PlaylistGraphQL {
                    id
                }
            }
        }
    `)
}
