import { LoadedTrackGraphQl } from '@/shared/model/graphql-generated-types/graphql'

export interface SearchState {
    /**
     * Flag that determines if the user is currently searching
     */
    enabled: boolean

    filteredTracks: (LoadedTrackGraphQl | null)[]
}

export function searchTracksInPlaylist(
    playlistLoadedTracks: (LoadedTrackGraphQl | null)[],
    searchQuery: string,
) {
    return playlistLoadedTracks.filter(track => {
        const searchQueryInUppercase = searchQuery.toUpperCase()

        if (track === null) {
            return
        }

        const nameHasMatch = track.name.toUpperCase().includes(searchQueryInUppercase)
        const ownerHasMatch = track.owner.name
            .toUpperCase()
            .includes(searchQueryInUppercase)

        return nameHasMatch || ownerHasMatch
    })
}
