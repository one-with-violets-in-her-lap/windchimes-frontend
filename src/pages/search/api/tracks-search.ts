import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import { LOADED_TRACK_FRAGMENT } from '@/entities/tracks'

import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'
import {
    TracksSearchQuery,
    TracksSearchQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export function useTracksSearchQuery(searchQuery: string) {
    const query = gql`
        ${ERROR_FRAGMENT}
        ${LOADED_TRACK_FRAGMENT}

        query TracksSearch($searchQuery: String!) {
            loadedTracks(tracksFilter: { searchQuery: $searchQuery }) {
                ... on GraphQLApiError {
                    ...Error
                }

                ... on LoadedTracksWrapper {
                    items {
                        ...LoadedTrack
                    }
                }
            }
        }
    `

    return useQuery<TracksSearchQuery, TracksSearchQueryVariables>(query, {
        searchQuery,
    })
}
