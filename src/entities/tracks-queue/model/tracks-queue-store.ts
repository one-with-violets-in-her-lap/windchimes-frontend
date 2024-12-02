import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useApolloClient } from '@vue/apollo-composable'
import {
    LoopMode,
    usePlayerStore, // for jsdoc
} from '@/features/player'
import {
    type PlaylistTrack,
    queryTrackAudioFile,
    queryLoadedTrack,
} from '@/entities/tracks'
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

export const useTracksQueueStore = defineStore('tracksQueue', () => {
    const { client: apolloClient } = useApolloClient()

    const tracksQueue = ref<(PlaylistTrack | TrackReferenceGraphQl)[]>([])

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
        const { loopMode } = storeToRefs(usePlayerStore())

        try {
            const currentTrackIndex = tracksQueue.value.findIndex(
                track => track.id === currentTrackId.value,
            )
            const lastIndex = tracksQueue.value.length - tracksToSkipCount

            if (
                currentTrackIndex >= lastIndex &&
                loopMode.value === LoopMode.LoopPlaylist
            ) {
                await playTrackFromQueue(0)
            } else if (loopMode.value === LoopMode.LoopCurrentTrack) {
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
        const { play } = usePlayerStore()

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

            play({
                ...track,
                trackAudioFileUrl: audioFileUrlQuery.data.trackAudioFile.url,
            })
        } catch (error) {
            throw new TrackLoadError(
                `failed to load track data or its audio file. more info: ${error}`,
            )
        }
    }

    return {
        tracksQueue,
        currentTrackId,
        currentTrack,

        playNextTrack,
        playPreviousTrack,
        playTrackFromQueue,
    }
})
