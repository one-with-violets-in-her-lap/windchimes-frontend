import { readonly, toRef } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { usePlayerVolume } from '@/features/player'
import type { PlaylistTrack } from '@/entities/tracks'
import { useTracksQueueStore } from '@/entities/tracks-queue'
import { useAudio } from '@/shared/model/reactive-audio'
import { getTypedObjectKeys } from '@/shared/utils/objects'

export type TrackWithAudioFileUrl = Omit<
    PlaylistTrack & { trackAudioFileUrl: string },
    '__typename'
>

export enum LoopMode {
    Disabled = 'Looping disabled',
    LoopCurrentTrack = 'Loop current track',
    LoopPlaylist = 'Loop playlist/queue',
}

export const usePlayerStore = defineStore('player', () => {
    const tracksQueueStore = useTracksQueueStore()
    const { playNextTrack, playPreviousTrack, playTrackFromQueue } = tracksQueueStore
    const { currentTrack, currentTrackId } = storeToRefs(tracksQueueStore)

    const loopMode = useLocalStorage<LoopMode>('loop', LoopMode.Disabled)

    const { audio, currentSecond, pauseAudio, paused, playAudio, rewind } = useAudio(
        toRef(() => currentTrack.value?.secondsDuration),
        {
            playNext: playNextTrack,
            playPrevious: playPreviousTrack,
        },
    )

    const { volume, setVolume } = usePlayerVolume(audio)

    /**
     * resumes the current track or plays a new one if `track` param is specified
     */
    function play(track?: TrackWithAudioFileUrl) {
        if (!track) {
            playAudio()
            return
        }

        currentTrackId.value = track.id

        playAudio(track.trackAudioFileUrl, {
            title: currentTrack.value?.name,
            artist: currentTrack.value?.owner.name,
            artwork: [{ src: currentTrack.value?.pictureUrl || '' }],
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
        currentTrack,
        currentTrackId,

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
        playTrackFromQueue,
        toggleLoopMode,
    }
})
