import { computed, ref, toRef } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { usePlayerVolume } from '@/features/player'
import type { PlaylistTrack } from '@/entities/tracks'
import { useTracksQueueStore } from '@/entities/tracks-queue'
import { useAudio } from '@/shared/model/reactive-audio'

export type TrackWithAudioFileUrl = Omit<
    PlaylistTrack & { trackAudioFileUrl: string },
    '__typename'
>

// TODO: remake as enum
export const LOOP_MODES = [
    'looping disabled',
    'loop current track',
    'loop playlist/queue',
] as const
export type LoopMode = (typeof LOOP_MODES)[number]

export const usePlayerStore = defineStore('player', () => {
    const tracksQueueStore = useTracksQueueStore()
    const { playNextTrack, playPreviousTrack, playTrackFromQueue } = tracksQueueStore
    const { currentTrack, currentTrackId } =
        storeToRefs(tracksQueueStore)

    const loopMode = useLocalStorage<LoopMode>('loop', 'looping disabled')

    const { audio, currentSecond, pauseAudio, paused, playAudio, rewind } = useAudio(
        toRef(() => currentTrack.value?.secondsDuration),
        {
            playNext: playNextTrack,
            playPrevious: playPreviousTrack,
        },
    )

    const { volume } = usePlayerVolume(audio)

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

    return {
        currentTrack,
        currentTrackId,

        volume,
        paused,
        currentSecond,
        loopMode,

        audio,

        pause: pauseAudio,
        play,
        rewind,
        playNextTrack,
        playPreviousTrack,
        playTrackFromQueue,
    }
})
