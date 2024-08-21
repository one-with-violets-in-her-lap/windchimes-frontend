import { computed, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useApolloClient } from '@vue/apollo-composable'
import type { PlaylistTrack } from '@/entities/track/model/track'
import {
    usePlayerStore, // for jsdoc
    type TrackWithAudioFileUrl,
} from '@/entities/player/model/player-store'
import { queryTrackAudioFile } from '@/entities/track/api/audio-file-query'
import { shuffle } from '@/entities/player/utils/shuffle'
import { TrackReferenceGraphQl } from '@/shared/model/graphql-generated-types/graphql'
import { queryLoadedTrack } from '@/entities/track/api/track-query'

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
 */
export function useTracksQueue(playTrack: (track?: TrackWithAudioFileUrl) => void) {
    const { client: apolloClient } = useApolloClient()
    const tracksQueue = ref<(PlaylistTrack | TrackReferenceGraphQl)[]>([])

    const loop = useLocalStorage('loop', false)

    const currentTrackId = ref<number>()
    const currentTrack = computed(() => {
        if (!tracksQueue.value) {
            return undefined
        }

        const matchingTrack = tracksQueue.value.find(
            track => track.id === currentTrackId.value,
        )

        if (matchingTrack?.__typename === 'TrackGraphQL') {
            return matchingTrack
        }

        return undefined
    })

    /**
     * plays next track in playlist tracks queue
     * @throws {TracksQueueNavigationError} either the end of the queue is reached
     * or next track audio file can't be loaded
     */
    async function playNextTrack() {
        const currentTrackIndex = tracksQueue.value.findIndex(
            track => track.id === currentTrackId.value,
        )

        if (currentTrackIndex >= tracksQueue.value.length - 1 && loop.value) {
            await playTrackFromQueue(0)
        } else {
            await playTrackFromQueue(currentTrackIndex + 1)
        }
    }

    /**
     * plays previous track in playlist tracks queue
     * @throws {TracksQueueNavigationError} either the beginning of the queue is
     * reached or previous track audio file can't be loaded
     */
    async function playPreviousTrack() {
        const currentTrackIndex = tracksQueue.value.findIndex(
            track => track.id === currentTrackId.value,
        )

        await playTrackFromQueue(currentTrackIndex - 1)
    }

    async function playTrackFromQueue(index: number) {
        let track = tracksQueue.value[index]

        if (!track) {
            throw new TracksQueueNavigationError(
                'end of the playlist tracks queue has been reached',
            )
        }

        if (track.__typename !== 'TrackGraphQL') {
            const loadedTrackResponse = await queryLoadedTrack(apolloClient, {
                id: track.id,
                platform: track.platform,
                platformId: track.platformId,
            })

            if (!loadedTrackResponse.data.track) {
                throw new TracksQueueNavigationError(
                    "couldn't obtain data of a track",
                )
            }

            track = loadedTrackResponse.data.track
            tracksQueue.value[index] = track
        }

        const audioFileUrlQuery = await queryTrackAudioFile(apolloClient, track)
        if (
            !audioFileUrlQuery.data.trackAudioFile ||
            audioFileUrlQuery.data.trackAudioFile.__typename !==
                'TrackAudioFileGraphQL'
        ) {
            console.error(audioFileUrlQuery.data.trackAudioFile)
            throw new TracksQueueNavigationError(
                "couldn't obtain audio file url of a track",
            )
        }

        playTrack({
            ...track,
            trackAudioFileUrl: audioFileUrlQuery.data.trackAudioFile.url,
        })
    }

    function shuffleQueue() {
        let currentTrackIndex = tracksQueue.value.findIndex(
            track => track.id === currentTrackId.value,
        )

        if (currentTrackIndex === -1) {
            currentTrackIndex = 0
        }

        const partToShuffleStartIndex = currentTrackIndex + 1

        const shuffledQueuePart = shuffle<TrackReferenceGraphQl | PlaylistTrack>(
            tracksQueue.value.slice(partToShuffleStartIndex),
        )
        shuffledQueuePart.forEach((track, shuffledQueueTrackIndex) => {
            tracksQueue.value[partToShuffleStartIndex + shuffledQueueTrackIndex] =
                track
        })
    }

    return {
        tracksQueue,
        currentTrackId,
        currentTrack,
        loop,

        playNextTrack,
        playPreviousTrack,
        shuffleQueue,
    }
}
