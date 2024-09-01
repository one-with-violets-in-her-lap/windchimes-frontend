import { readonly, Ref, ref } from 'vue'
import { MediaSession } from '@jofr/capacitor-media-session'

export interface AudioActionHandlers {
    playNext: () => void
    playPrevious: () => void
}

/**
 * creates reactive playback state that is bound to html audio
 * 
 * the {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaSession|media session}
 * is also synchronized
 */
export function useAudio(
    secondsDuration: Ref<number | undefined>,
    actionHandlers: AudioActionHandlers,
) {
    const paused = ref(false)
    const currentSecond = ref(0)

    const audio = new Audio()
    audio.crossOrigin = 'anonymous'

    audio.addEventListener('pause', () => {
        paused.value = true
        MediaSession.setPlaybackState({ playbackState: 'paused' })
    })

    audio.addEventListener('play', () => {
        paused.value = false
        MediaSession.setPlaybackState({ playbackState: 'playing' })
    })

    audio.addEventListener('timeupdate', () => {
        currentSecond.value = audio.currentTime
        MediaSession.setPositionState({
            duration: secondsDuration.value,
            position: currentSecond.value,
        })
    })

    audio.addEventListener('ended', actionHandlers.playNext)

    MediaSession.setActionHandler({ action: 'nexttrack' }, actionHandlers.playNext)
    MediaSession.setActionHandler(
        { action: 'previoustrack' },
        actionHandlers.playPrevious,
    )

    MediaSession.setActionHandler({ action: 'play' }, playAudio)
    MediaSession.setActionHandler({ action: 'pause' }, pauseAudio)

    MediaSession.setActionHandler({ action: 'seekto' }, event => {
        if (event.seekTime) {
            rewind(event.seekTime)
        }
    })

    function playAudio() {
        audio.play()
    }

    function pauseAudio() {
        audio.pause()
    }

    function rewind(secondToRewindTo: number) {
        audio.currentTime = secondToRewindTo
        playAudio()
    }

    return {
        audio,

        paused: readonly(paused),
        currentSecond: readonly(currentSecond),

        pauseAudio,
        playAudio,
        rewind,
    }
}
