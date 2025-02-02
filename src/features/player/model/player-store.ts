import { defineStore, storeToRefs } from 'pinia'
import { onMounted, readonly, ref, toRef } from 'vue'

import { usePlayerVolume } from '@/features/player'
import { loadInitialTrackAudioFile } from '@/features/player/utils/load-initial-track'

import { LoadedQueueItem, useTracksQueueStore } from '@/entities/tracks-queue'

import { useAudio } from '@/shared/model/reactive-audio'
import { useLocalStorageItem } from '@/shared/utils/local-storage'
import { getTypedObjectKeys } from '@/shared/utils/objects'

export type QueueItemWithAudioFileUrl = LoadedQueueItem & { audioFileUrl: string }

export enum LoopMode {
    Disabled = 'Looping disabled',
    LoopCurrentTrack = 'Loop current track',
    LoopPlaylist = 'Loop playlist/queue',
}

export const usePlayerStore = defineStore('player', () => {
    const tracksQueueStore = useTracksQueueStore()
    const { playNextTrack, playPreviousTrack, playItemFromQueue } = tracksQueueStore
    const { currentQueueItem, currentQueueItemId, currentTrack } =
        storeToRefs(tracksQueueStore)

    const loopMode = useLocalStorageItem<LoopMode>('loop', LoopMode.Disabled)

    const newTrackLoading = ref(false)

    const { audio, currentSecond, pauseAudio, paused, playAudio, rewind } = useAudio(
        toRef(() => currentQueueItem.value?.track.secondsDuration),
        {
            playNext: playNextTrack,
            playPrevious: playPreviousTrack,
        },
    )

    const { volume, setVolume } = usePlayerVolume(audio)

    onMounted(() => {
        loadInitialTrackAudioFile()
    })

    /**
     * resumes the current track or plays a new one if `queueItemToPlay` param is specified
     */
    function play(queueItemToPlay?: QueueItemWithAudioFileUrl) {
        if (!queueItemToPlay) {
            playAudio()
            return
        }

        currentQueueItemId.value = queueItemToPlay.id

        playAudio(queueItemToPlay.audioFileUrl, {
            title: currentQueueItem.value?.track.name,
            artist: currentQueueItem.value?.track.owner.name,
            artwork: [{ src: currentQueueItem.value?.track.pictureUrl || '' }],
        })
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

        audio,

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
