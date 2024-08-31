import { readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import type { PlaylistTrack } from '@/entities/track/model/track'
import { useTracksQueue } from '@/entities/tracks-queue/model/tracks-queue'
import { usePlayerVolume } from '@/features/player/model/volume'

export type TrackWithAudioFileUrl = Omit<
    PlaylistTrack & { trackAudioFileUrl: string },
    '__typename'
>

export const usePlayerStore = defineStore('player', () => {
    const {
        currentTrack,
        currentTrackId,
        tracksQueue,
        loop,
        playNextTrack,
        playPreviousTrack,
        shuffleQueue,
    } = useTracksQueue(play)

    const paused = ref(false)
    const currentSecond = ref(0)

    const audio = new Audio()
    audio.crossOrigin = 'anonymous'

    const { volume } = usePlayerVolume(audio)

    audio.addEventListener('pause', () => (paused.value = true))
    audio.addEventListener('play', () => (paused.value = false))
    audio.addEventListener(
        'timeupdate',
        () => (currentSecond.value = audio.currentTime),
    )
    audio.addEventListener('ended', async () => {
        try {
            await playNextTrack()
        } catch (error) {
            console.error(error)
        }
    })

    audio.volume = 0.1

    function pause() {
        audio.pause()
    }

    /**
     * resumes the current track or plays a new one if `track` param is specified
     */
    function play(track?: TrackWithAudioFileUrl) {
        console.log(track)

        if (track?.trackAudioFileUrl) {
            audio.src = track.trackAudioFileUrl
            currentTrackId.value = track.id
        }

        audio.play()
    }

    function rewind(secondsToRewindTo: number) {
        audio.currentTime = secondsToRewindTo
        play()
    }

    return {
        currentTrack,
        tracksQueue,
        volume,
        loop,
        paused: readonly(paused),
        currentSecond: readonly(currentSecond),

        audio,

        pause,
        play,
        rewind,
        playNextTrack,
        playPreviousTrack,
        shuffleQueue,
    }
})
