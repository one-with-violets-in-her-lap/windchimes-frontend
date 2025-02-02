import { useApolloClient } from '@vue/apollo-composable'
import { StorageSerializers } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { computed } from 'vue'

import {
    LoopMode,
    usePlayerStore, // for jsdoc
} from '@/features/player'

import { queryLoadedTrack, queryTrackAudioFile } from '@/entities/tracks'
import { LoadedQueueItem, QueueItem } from '@/entities/tracks-queue/model/queue-item'

import {
    LoadedTrackFragment,
    TrackReferenceToReadGraphQl,
} from '@/shared/model/graphql-generated-types/graphql'
import { useLocalStorageItem } from '@/shared/utils/local-storage'

/**
 * Error that is thrown when playlist can't be added to the queue. The reason can be
 * described in the error message
 */
export class QueuePlaylistOperationError extends Error {}

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

    const tracksQueue = useLocalStorageItem<QueueItem[]>('tracks-queue', [])

    let lastCreatedQueueItemId = 0

    const currentQueueItemId = useLocalStorageItem<number | undefined>(
        'current-queue-item-id',
        undefined,
        {
            serializer: StorageSerializers.number,
        },
    )
    const currentQueueItem = computed(() => {
        const matchingQueueItem = tracksQueue.value.find(
            item => item.id === currentQueueItemId.value,
        )

        if (matchingQueueItem?.track.__typename === 'LoadedTrackGraphQL') {
            return matchingQueueItem as LoadedQueueItem
        }

        return undefined
    })
    const currentTrack = computed(() => currentQueueItem.value?.track)

    interface TrackSkipOptions {
        tracksToSkipCount?: number
        /**
         * ignore current loop mode, skip track anyways
         */
        doNotLoop?: boolean
    }

    /**
     * Plays next track in playlist tracks queue if the end of the
     * queue is not reached
     *
     * Respects track/playlist loop mode
     *
     * Handles track loading errors by **skipping to the next track on the background**
     *
     * @param options.doNotLoop ignore current loop mode, skip track anyways
     *
     * @throws {TrackLoadError} when track data failed to load because of internal
     * error
     */
    async function playNextTrack(
        options: TrackSkipOptions = { tracksToSkipCount: 1, doNotLoop: false },
    ) {
        const { tracksToSkipCount = 1, doNotLoop = false } = options

        const { loopMode } = storeToRefs(usePlayerStore())

        try {
            const currentTrackIndex = tracksQueue.value.findIndex(
                track => track.id === currentQueueItemId.value,
            )
            const lastIndex = tracksQueue.value.length - tracksToSkipCount

            if (doNotLoop) {
                await playItemFromQueue(currentTrackIndex + tracksToSkipCount)
                return
            }

            if (
                currentTrackIndex >= lastIndex &&
                loopMode.value === LoopMode.LoopPlaylist
            ) {
                await playItemFromQueue(0)
            } else if (loopMode.value === LoopMode.LoopCurrentTrack) {
                await playItemFromQueue(currentTrackIndex)
            } else {
                await playItemFromQueue(currentTrackIndex + tracksToSkipCount)
            }
        } catch (error) {
            if (!(error instanceof TracksQueueBoundsReachedError)) {
                console.error(error)
                // If track failed to load, skip to next track
                playNextTrack({ tracksToSkipCount: tracksToSkipCount + 1 })
                throw error
            }
        }
    }

    /**
     * Plays previous track in playlist tracks queue if the beginning of
     * the queue is not reached
     *
     * @throws {TrackLoadError} when track data failed to load because of internal
     * error
     */
    async function playPreviousTrack(
        options: TrackSkipOptions = { tracksToSkipCount: 1 },
    ) {
        const { tracksToSkipCount = 1 } = options

        try {
            const currentTrackIndex = tracksQueue.value.findIndex(
                track => track.id === currentQueueItemId.value,
            )

            await playItemFromQueue(currentTrackIndex - tracksToSkipCount)
        } catch (error) {
            if (!(error instanceof TracksQueueBoundsReachedError)) {
                console.error(error)
                playPreviousTrack({ tracksToSkipCount: tracksToSkipCount + 1 })
                throw error
            }
        }
    }

    /**
     * Plays queue item with specified index
     *
     * @throws {TrackLoadError} if queue item's track audio file failed to load
     *
     * @throws {TracksQueueBoundsReachedError} if queue item couldn't be found by
     * specified index
     */
    async function playItemFromQueue(queueItemIndex: number) {
        const playerStore = usePlayerStore()

        const queueItem = tracksQueue.value[queueItemIndex]

        if (!queueItem) {
            throw new TracksQueueBoundsReachedError()
        }

        let track = queueItem.track

        playerStore.newTrackLoading = true

        try {
            if (track.__typename !== 'LoadedTrackGraphQL') {
                const loadedTrackResponse = await queryLoadedTrack(apolloClient, {
                    id: track.id,
                    platform: track.platform,
                    platformId: track.platformId,
                })

                if (!loadedTrackResponse.data.loadedTrack) {
                    throw new TrackLoadError("couldn't obtain requested track data")
                }

                track = loadedTrackResponse.data.loadedTrack as LoadedTrackFragment
                tracksQueue.value[queueItemIndex] = { ...queueItem, track }
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

            playerStore.play({
                id: queueItem.id,
                track: track,
                audioFileUrl: audioFileUrlQuery.data.trackAudioFile.url,
            })
        } catch (error) {
            throw new TrackLoadError(
                `failed to load track data or its audio file. more info: ${error}`,
            )
        } finally {
            playerStore.newTrackLoading = false
        }
    }

    function addPlaylistToQueue(playlistTracks: TrackReferenceToReadGraphQl[]) {
        if (playlistTracks.length === 0) {
            throw new QueuePlaylistOperationError(
                'This playlist does not have any tracks',
            )
        }

        tracksQueue.value = tracksQueue.value.concat(
            playlistTracks.map(track => createQueueItem(track)),
        )
    }

    function replaceQueueWithPlaylist(playlistTracks: TrackReferenceToReadGraphQl[]) {
        if (playlistTracks.length === 0) {
            throw new QueuePlaylistOperationError(
                'This playlist does not have any tracks',
            )
        }

        tracksQueue.value = playlistTracks.map(track => createQueueItem(track))
    }

    function createQueueItem<
        TQueueTrack extends TrackReferenceToReadGraphQl | LoadedTrackFragment,
    >(track: TQueueTrack): { id: number; track: TQueueTrack } {
        return {
            id: ++lastCreatedQueueItemId,
            track,
        }
    }

    return {
        tracksQueue,
        currentQueueItemId,
        currentQueueItem,
        currentTrack,

        playNextTrack,
        playPreviousTrack,
        playItemFromQueue,
        addPlaylistToQueue,
        replaceQueueWithPlaylist,

        createQueueItem,
    }
})
