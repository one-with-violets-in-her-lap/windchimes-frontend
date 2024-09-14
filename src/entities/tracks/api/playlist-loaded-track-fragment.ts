import gql from 'graphql-tag'

export const PLAYLIST_LOADED_TRACK_FRAGMENT = gql`
    fragment PlaylistLoadedTrack on TrackGraphQL {
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
