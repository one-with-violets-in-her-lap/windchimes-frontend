import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { PlaylistTrack } from '@/features/track/model/track'
import type {
    GetTrackAudioFileUrlQuery
} from '@/shared/model/graphql-generated-types/graphql'

type TrackWithAudioFileUrl = Omit<
    PlaylistTrack & GetTrackAudioFileUrlQuery,
    '__typename'
>

export const usePlayerStore = defineStore('player', () => {
    const currentTrack = ref<TrackWithAudioFileUrl>()
    const paused = ref(false)
    const currentSeconds = ref(0)

    const audio = new Audio()
    audio.addEventListener('pause', () => (paused.value = true))
    audio.addEventListener('play', () => (paused.value = false))
    audio.addEventListener(
        'timeupdate',
        () => (currentSeconds.value = audio.currentTime),
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
            currentTrack.value = track
        }

        audio.play()
    }

    function rewind(secondsToRewindTo: number) {
        audio.currentTime = secondsToRewindTo
        play()
    }

    return {
        // returns computed properties so current track state will be readonly
        // for external components
        currentTrack: computed(() => currentTrack.value),
        paused: computed(() => paused.value),
        currentSeconds: computed(() => currentSeconds.value),

        pause,
        play,
        setCurrentSeconds: rewind,
    }
})
