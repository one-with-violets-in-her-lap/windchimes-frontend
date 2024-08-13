import type { GetPlaylistWithTracksQuery } from '@/shared/model/graphql-generated-types/graphql'

type PlaylistTracksList = NonNullable<
    GetPlaylistWithTracksQuery['playlist']
>['tracks']['items']

export type PlaylistTrack = NonNullable<PlaylistTracksList[0]>
