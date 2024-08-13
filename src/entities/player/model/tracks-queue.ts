import { computed, ref } from 'vue'
import { useApolloClient } from '@vue/apollo-composable'
import type { PlaylistTrack } from '@/entities/track/model/track'
import {
    usePlayerStore, // for jsdoc
    type TrackWithAudioFileUrl,
} from '@/entities/player/model/player-store'
import { queryTrackAudioFile } from '@/entities/track/api/audio-file-query'

/**
 * couldn't play next/previous track because the end/beginning of
 * the tracks queue (playlist) has been reached or track audio file url can't be
 * obtained
 */
export class TracksQueueNavigationError extends Error {}

/**
 * creates reactive tracks queue state, with play next/previous
 * functionality. **not a global player tracks queue state**, use
 * {@link usePlayerStore} for this purpose
 * @param playTrack
 * @returns
 */
export function useTracksQueue(
    playTrack: (track?: TrackWithAudioFileUrl) => void,
) {
    const { client: apolloClient } = useApolloClient()
    const tracksQueue = ref<PlaylistTrack[]>([])

    const currentTrackId = ref<number>()
    const currentTrack = computed(() => {
        if (!tracksQueue.value) {
            return undefined
        }

        return tracksQueue.value.find(
            track => track.id === currentTrackId.value,
        )
    })

    /**
     * plays next track in playlist tracks queue
     * @throws {TracksQueueNavigationError} either the end of the queue is reached or
     * next track audio file can't be loaded
     */
    async function playNextTrack() {
        let currentTrackIndex = tracksQueue.value.findIndex(
            track => track.id === currentTrackId.value,
        )

        if (currentTrackIndex === -1) {
            currentTrackIndex = 0
        }

        await playTrackFromQueue(currentTrackIndex + 1)
    }

    /**
     * plays previous track in playlist tracks queue
     * @throws {TracksQueueNavigationError} either the beginning of the queue is reached or
     * previous track audio file can't be loaded
     */
    async function playPreviousTrack() {
        let currentTrackIndex = tracksQueue.value.findIndex(
            track => track.id === currentTrackId.value,
        )

        if (currentTrackIndex === -1) {
            currentTrackIndex = 0
        }

        await playTrackFromQueue(currentTrackIndex - 1)
    }

    async function playTrackFromQueue(index: number) {
        const track = tracksQueue.value[index]

        if (!track) {
            throw new TracksQueueNavigationError(
                'end of the playlist tracks queue has been reached',
            )
        }

        const audioFileUrlQuery = await queryTrackAudioFile(apolloClient, track)
        if (!audioFileUrlQuery.data.trackAudioFileUrl) {
            console.error(audioFileUrlQuery.error)
            throw new TracksQueueNavigationError(
                "couldn't obtain audio file url of a track",
            )
        }

        playTrack({
            ...track,
            trackAudioFileUrl: audioFileUrlQuery.data.trackAudioFileUrl,
        })
    }

    return {
        tracksQueue,
        currentTrackId,
        currentTrack,
        playNextTrack,
        playPreviousTrack,
    }
}
