import { defineStore, storeToRefs } from 'pinia'
import { readonly, ref, toRef, watch } from 'vue'

import { usePlayerVolume } from '@/features/player'

import { Platform } from '@/entities/platform/model/platform'
import { LoadedQueueItem, useTracksQueueStore } from '@/entities/tracks-queue'

import { useAudio } from '@/shared/utils/audio'
import { useLocalStorageItem } from '@/shared/utils/local-storage'
import { getTypedObjectKeys } from '@/shared/utils/objects'

export type QueueItemWithAudioFileUrl = LoadedQueueItem & { audioFileUrl: string }

export enum LoopMode {
    Disabled = 'Looping disabled',
    LoopCurrentTrack = 'Loop current track',
    LoopPlaylist = 'Loop playlist/queue',
}

/**
 * List of platforms that only provide `*.m3u8` files, thus only can be played
 * using HTTP Live Streaming
 * ([**HLS**](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Live_streaming_web_audio_and_video))
 */
const PLATFORMS_TO_PLAY_AS_HLS = [Platform.Youtube.toString()]

export const usePlayerStore = defineStore('player', () => {
    const tracksQueueStore = useTracksQueueStore()
    const { playNextTrack, playPreviousTrack, playItemFromQueue } = tracksQueueStore
    const { currentQueueItem, currentQueueItemId, currentTrack } =
        storeToRefs(tracksQueueStore)

    const loopMode = useLocalStorageItem<LoopMode>('loop', LoopMode.Disabled)

    const newTrackLoading = ref(false)

    const {
        initializeAudio,
        currentSecond,
        pauseAudio,
        paused,
        playAudio,
        rewind,
        audioElement,
    } = useAudio(
        toRef(() => currentQueueItem.value?.track.secondsDuration),
        {
            playNext: playNextTrack,
            playPrevious: playPreviousTrack,
        },
    )

    const { volume, setVolume } = usePlayerVolume()
    watch(volume, () =>
        audioElement.value ? (audioElement.value.volume = volume.value) : {},
    )

    /**
     * Resumes the current track or plays a new one if `queueItemToPlay` param is specified
     *
     * @throws {AudioNotInitializedError} if audio was not initialized
     */
    function play(queueItemToPlay?: QueueItemWithAudioFileUrl) {
        if (!queueItemToPlay) {
            playAudio()
            return
        }

        console.log(queueItemToPlay.track.platform)

        currentQueueItemId.value = queueItemToPlay.id

        playAudio(
            queueItemToPlay.audioFileUrl,
            {
                title: currentQueueItem.value?.track.name,
                artist: currentQueueItem.value?.track.owner.name,
                artwork: [{ src: currentQueueItem.value?.track.pictureUrl || '' }],
            },
            {
                playAsHls: PLATFORMS_TO_PLAY_AS_HLS.includes(
                    queueItemToPlay.track.platform,
                ),
            },
        )
    }

    /**
     * toggles next looping mode in this order:
     * `LoopMode.Disabled` -> `LoopMode.LoopCurrentTrack` -> `LoopMode.LoopPlaylist`
     */
    function toggleLoopMode() {
        const loopModes = getTypedObjectKeys(LoopMode)

        const currentLoopModeIndex = loopModes.findIndex(
            mode => LoopMode[mode] === loopMode.value,
        )

        const nextLoopMode = loopModes.at(currentLoopModeIndex + 1)

        if (nextLoopMode) {
            loopMode.value = LoopMode[nextLoopMode]
        } else {
            loopMode.value = LoopMode[loopModes[0]]
        }
    }

    return {
        currentQueueItem,
        currentQueueItemId,
        currentTrack,

        volume,
        setVolume,

        paused,
        currentSecond,
        loopMode: readonly(loopMode),

        initializeAudio,
        pause: pauseAudio,
        play,
        rewind,
        playNextTrack,
        playPreviousTrack,
        playItemFromQueue,
        toggleLoopMode,

        newTrackLoading,
    }
})
