import { useApolloClient } from '@vue/apollo-composable'

import { usePlayerStore } from '@/features/player/model/player-store'

import { queryTrackAudioFile } from '@/entities/tracks'

import { showTemporaryNotification } from '@/shared/utils/notifications'

export async function loadInitialTrackAudioFile() {
    const playerStore = usePlayerStore()
    const { client: apolloClient } = useApolloClient()

    if (playerStore.currentQueueItem) {
        const audioFileResponse = await queryTrackAudioFile(
            apolloClient,
            playerStore.currentQueueItem.track,
        )

        if (
            audioFileResponse.data.trackAudioFile?.__typename ===
            'TrackAudioFileGraphQL'
        ) {
            playerStore.audio.src = audioFileResponse.data.trackAudioFile.url
            playerStore.pause()
        } else if (
            audioFileResponse.data.trackAudioFile?.__typename === 'GraphQLApiError'
        ) {
            console.error(audioFileResponse.data.trackAudioFile.explanation)
            showTemporaryNotification(
                'error',
                'Error while loading current track data: ' +
                    audioFileResponse.data.trackAudioFile.explanation,
            )
        } else {
            console.error(
                audioFileResponse.error?.message ||
                    'Failed to load initial track audio file url',
            )
            showTemporaryNotification(
                'error',
                'Error while loading current track data',
            )
        }
    }
}
