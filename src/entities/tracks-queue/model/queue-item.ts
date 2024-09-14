import { PlaylistTrack } from '@/entities/tracks'
import { TrackReferenceGraphQl } from '@/shared/model/graphql-generated-types/graphql'

export type QueueItem = PlaylistTrack | TrackReferenceGraphQl
