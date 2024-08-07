import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import type { Playlist } from '@/entities/playlist/model/playlist'

export function usePlaylistsQuery(userId: string) {
    return useQuery<{
        playlists: Playlist[]
    }>(
        gql`
            query GetPlaylists($userId: String!) {
                playlists(userId: $userId) {
                    id
                    createdAt
                    name
                    pictureUrl
                    tracksCount
                }
            }
        `,
        { userId },
    )
}
