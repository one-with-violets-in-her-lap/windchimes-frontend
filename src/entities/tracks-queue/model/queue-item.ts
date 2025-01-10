import { LoadedTrackFragment, TrackReferenceToReadGraphQl } from '@/shared/model/graphql-generated-types/graphql'

export interface QueueItem {
    id: number
    track: LoadedTrackFragment | TrackReferenceToReadGraphQl
}

export interface LoadedQueueItem {
    id: number
    track: LoadedTrackFragment
}

export type TracksQueue = QueueItem[]
