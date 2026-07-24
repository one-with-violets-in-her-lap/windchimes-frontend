import { watch } from 'vue'

import { usePlayerStore } from '@/features/player/model/player-store'

import { useTracksQueueStore } from '@/entities/tracks-queue'

import { showTemporaryNotification } from '@/shared/utils/notifications'

/**
 * Initializes player audio and loads last played track
 *
 * Shows notification on error
 */
export async function initializePlayer() {
    const playerStore = usePlayerStore()
    const tracksQueue = useTracksQueueStore()

    playerStore.initializeAudio()

    if (playerStore.currentQueueItem) {
        try {
            // Only load the last played track without starting the playback.
            // Calling `play()` here would throw a `NotAllowedError` because the
            // browser does not allow autoplay before the user interacts with the
            // page
            await tracksQueue.loadItemFromQueue(
                tracksQueue.tracksQueue.findIndex(
                    queueItem => queueItem.id === playerStore.currentQueueItemId,
                ),
            )
        } catch (error) {
            console.error('Failed to load initial track:', error)
            showTemporaryNotification(
                'error',
                'Error while loading current track data',
            )
        }
    }
}

export function usePlayerMediaLoadErrorNotifications() {
    const playerStore = usePlayerStore()

    watch(
        () => playerStore.mediaLoadError,
        () => {
            if (playerStore.mediaLoadError !== null) {
                showTemporaryNotification('error', 'Failed to load the track')
            }
        },
    )
}
