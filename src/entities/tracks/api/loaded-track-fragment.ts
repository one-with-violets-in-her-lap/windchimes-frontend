import gql from 'graphql-tag'

export const LOADED_TRACK_FRAGMENT = gql`
    fragment LoadedTrack on LoadedTrackGraphQL {
        id
        platform
        platformId
        name
        secondsDuration
        pictureUrl
        audioFileEndpointUrl

        owner {
            name
        }
    }
`
