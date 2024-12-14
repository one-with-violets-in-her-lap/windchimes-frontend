import { LoadedTrackFragment, TrackReferenceGraphQl } from '@/shared/model/graphql-generated-types/graphql'

export interface QueueItem {
    id: number
    track: LoadedTrackFragment | TrackReferenceGraphQl
}

export interface LoadedQueueItem {
    id: number
    track: LoadedTrackFragment
}

export type TracksQueue = QueueItem[]
