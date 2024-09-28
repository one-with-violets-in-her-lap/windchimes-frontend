import { computed, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useApolloClient } from '@vue/apollo-composable'
import {
    usePlayerStore, // for jsdoc
    type TrackWithAudioFileUrl,
} from '@/features/player'
import {
    type PlaylistTrack,
    queryTrackAudioFile,
    queryLoadedTrack,
} from '@/entities/tracks'
import { shuffleNextQueueTracks } from '@/entities/tracks-queue/utils/shuffle-next-queue-tracks'
import { TrackReferenceGraphQl } from '@/shared/model/graphql-generated-types/graphql'

export class TrackLoadError extends Error {}
export class TracksQueueBoundsReachedError extends Error {
    constructor() {
        super(
            'tracks queue end/beginning has been reached when navigation ' +
                'to prev/next track',
        )
    }
}

// TODO: remake as enum
export const LOOP_MODES = [
    'looping disabled',
    'loop current track',
    'loop playlist/queue',
] as const
export type LoopMode = (typeof LOOP_MODES)[number]

/**
 * creates reactive tracks queue state, with play next/previous
 * functionality. **not a global player tracks queue state**, use
 * {@link usePlayerStore} for this purpose
 */
export function useTracksQueue(playTrack: (track?: TrackWithAudioFileUrl) => void) {
    const { client: apolloClient } = useApolloClient()

    const tracksQueue = ref<(PlaylistTrack | TrackReferenceGraphQl)[]>([])

    const loopMode = useLocalStorage<LoopMode>('loop', 'looping disabled')

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
     * plays next track in playlist tracks queue if the end of the
     * queue is not reached
     */
    async function playNextTrack(tracksToSkipCount = 1) {
        try {
            const currentTrackIndex = tracksQueue.value.findIndex(
                track => track.id === currentTrackId.value,
            )
            const lastIndex = tracksQueue.value.length - tracksToSkipCount
            console.log(currentTrackIndex, tracksToSkipCount)

            if (
                currentTrackIndex >= lastIndex &&
                loopMode.value === 'loop playlist/queue'
            ) {
                await playTrackFromQueue(0)
            } else if (loopMode.value === 'loop current track') {
                await playTrackFromQueue(currentTrackIndex)
            } else {
                await playTrackFromQueue(currentTrackIndex + tracksToSkipCount)
            }
        } catch (error) {
            if (!(error instanceof TracksQueueBoundsReachedError)) {
                console.error(error)
                await playNextTrack(tracksToSkipCount + 1)
            }
        }
    }

    /**
     * plays previous track in playlist tracks queue if the beginning of
     * the queue is not reached
     */
    async function playPreviousTrack(tracksToSkipCount = 1) {
        try {
            const currentTrackIndex = tracksQueue.value.findIndex(
                track => track.id === currentTrackId.value,
            )

            await playTrackFromQueue(currentTrackIndex - tracksToSkipCount)
        } catch (error) {
            if (!(error instanceof TracksQueueBoundsReachedError)) {
                console.error(error)
                await playPreviousTrack(tracksToSkipCount + 1)
            }
        }
    }

    async function playTrackFromQueue(index: number) {
        let track = tracksQueue.value[index]

        if (!track) {
            throw new TracksQueueBoundsReachedError()
        }

        try {
            if (track.__typename !== 'TrackGraphQL') {
                const loadedTrackResponse = await queryLoadedTrack(apolloClient, {
                    id: track.id,
                    platform: track.platform,
                    platformId: track.platformId,
                })

                if (!loadedTrackResponse.data.track) {
                    throw new TrackLoadError("couldn't obtain requested track data")
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
                throw new TrackLoadError("couldn't obtain audio file url of a track")
            }

            playTrack({
                ...track,
                trackAudioFileUrl: audioFileUrlQuery.data.trackAudioFile.url,
            })
        } catch (error) {
            throw new TrackLoadError(
                `failed to load track data or its audio file. more info: ${error}`,
            )
        }
    }

    function shuffleQueue() {
        tracksQueue.value = shuffleNextQueueTracks(
            tracksQueue.value,
            currentTrackId.value,
        )
    }

    return {
        tracksQueue,
        currentTrackId,
        currentTrack,
        loopMode,

        playNextTrack,
        playPreviousTrack,
        shuffleQueue,
    }
}
