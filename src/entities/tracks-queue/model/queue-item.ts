import { PlaylistTrack } from '@/entities/track/model/track'
import { TrackReferenceGraphQl } from '@/shared/model/graphql-generated-types/graphql'

export type QueueItem = PlaylistTrack | TrackReferenceGraphQl
