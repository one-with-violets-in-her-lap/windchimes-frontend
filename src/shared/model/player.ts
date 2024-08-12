import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { PlaylistTrack } from '@/features/track/model/track'
import type { GetTrackAudioFileUrlQuery } from '@/shared/model/graphql-generated-types/graphql'
import { useTracksQueue } from '@/shared/model/tracks-queue'

export type TrackWithAudioFileUrl = Omit<
    PlaylistTrack & GetTrackAudioFileUrlQuery,
    '__typename'
>

export const usePlayerStore = defineStore('player', () => {
    const {
        currentTrack,
        currentTrackId,
        tracksQueue,
        playNextTrack,
        playPreviousTrack
    } = useTracksQueue(play)

    const paused = ref(false)
    const currentSecond = ref(0)

    const audio = new Audio()
    audio.addEventListener('pause', () => (paused.value = true))
    audio.addEventListener('play', () => (paused.value = false))
    audio.addEventListener(
        'timeupdate',
        () => (currentSecond.value = audio.currentTime),
    )
    audio.volume = 0.1

    function pause() {
        audio.pause()
    }

    /**
     * resumes the current track or plays a new one if `track` param is specified
     */
    function play(track?: TrackWithAudioFileUrl) {
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

        /*
            returns computed properties so paused/track time state can only be
            changed with provided helper functions (`pause`, `rewind`)
        */
        paused: computed(() => paused.value),
        currentSecond: computed(() => currentSecond.value),

        pause,
        play,
        rewind,
        playNextTrack,
        playPreviousTrack
    }
})
