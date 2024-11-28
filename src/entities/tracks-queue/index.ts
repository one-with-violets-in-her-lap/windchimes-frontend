import type { QueueItem, TracksQueue } from '@/entities/tracks-queue/model/queue-item'
import {
    TrackLoadError,
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
    TracksQueue,
    useTracksQueueStore,
    TrackLoadError,
    TracksQueueBoundsReachedError,
    QueueTrackNotFoundError,
    shuffleQueue,
    moveQueueTracks,
    clearQueue,
}
