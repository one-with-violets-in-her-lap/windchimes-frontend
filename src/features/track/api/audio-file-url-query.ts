import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export async function useAudioFileUrlQuery() {
    return useQuery(
        gql`
            query GetTrackAudioFileUrl($trackId: String!) {
                trackAudioFileUrl(trackId: $trackId)
            }
        `,
        {},
    )
}
