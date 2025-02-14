import type {
    PlaylistDetailedGraphQl,
    PlaylistToReadGraphQl,
} from '@/shared/model/graphql-generated-types/graphql'

export type Playlist = PlaylistToReadGraphQl
export type PlaylistWithTracks = PlaylistDetailedGraphQl
