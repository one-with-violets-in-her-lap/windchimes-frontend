import type { QueueItem, TracksQueue } from '@/entities/tracks-queue/model/queue-item'
import {
    TrackLoadError,
    useTracksQueue,
    type LoopMode,
    LOOP_MODES,
    TracksQueueBoundsReachedError,
} from '@/entities/tracks-queue/model/tracks-queue'
import {
    QueueTrackNotFoundError,
    shuffleQueue,
    moveQueueTracks,
    clearQueue,
} from '@/entities/tracks-queue/model/tracks-queue-actions'
import DraggableQueueTracksList from '@/entities/tracks-queue/ui/draggable-queue-tracks-list.vue'

export {
    DraggableQueueTracksList,
    QueueItem,
    TracksQueue,
    useTracksQueue,
    TrackLoadError,
    LoopMode,
    LOOP_MODES,
    TracksQueueBoundsReachedError,
    QueueTrackNotFoundError as QueueTracksNotFoundError,
    shuffleQueue,
    moveQueueTracks,
    clearQueue,
}
