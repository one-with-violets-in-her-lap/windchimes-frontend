import { watch } from 'vue'

import { usePlayerStore } from '@/features/player/model/player-store'

import { useTracksQueueStore } from '@/entities/tracks-queue'

import { showTemporaryNotification } from '@/shared/utils/notifications'

export async function initializePlayerWithErrorNotifications() {
    const playerStore = usePlayerStore()
    const tracksQueue = useTracksQueueStore()

    playerStore.initializeAudio()

    watch(
        () => playerStore.mediaLoadError,
        () => {
            if (playerStore.mediaLoadError !== null) {
                showTemporaryNotification('error', 'Failed to load the track')
            }
        },
    )

    if (playerStore.currentQueueItem) {
        try {
            await tracksQueue.playItemFromQueue(
                tracksQueue.tracksQueue.findIndex(
                    queueItem => queueItem.id === playerStore.currentQueueItemId,
                ),
            )
            playerStore.pause()
        } catch (error) {
            console.error('Failed to load initial track:', error)
            showTemporaryNotification(
                'error',
                'Error while loading current track data',
            )
        }
    }
}
