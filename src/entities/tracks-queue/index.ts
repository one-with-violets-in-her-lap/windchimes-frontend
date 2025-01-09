import type {
    LoadedQueueItem,
    QueueItem,
    TracksQueue,
} from '@/entities/tracks-queue/model/queue-item'
import {
    TrackLoadError,
    QueuePlaylistOperationError,
    useTracksQueueStore,
    TracksQueueBoundsReachedError,
} from '@/entities/tracks-queue/model/tracks-queue-store'
import {
    QueueTrackNotFoundError,
    shuffleQueue,
    moveQueueTracks,
    clearQueue,
} from '@/entities/tracks-queue/model/tracks-queue-actions'

export {
    QueueItem,
    LoadedQueueItem,
    TracksQueue,
    useTracksQueueStore,

    QueuePlaylistOperationError,
    TrackLoadError,
    TracksQueueBoundsReachedError,
    QueueTrackNotFoundError,

    shuffleQueue,
    moveQueueTracks,
    clearQueue,
}
