import { MediaSession, MetadataOptions } from '@jofr/capacitor-media-session'
import { Ref, readonly, ref } from 'vue'

export interface AudioActionHandlers {
    playNext: () => void
    playPrevious: () => void
}

export class AudioNotInitializedError extends Error {
    constructor() {
        super(
            'HTML audio element was not initialize due to some error, so the action ' +
                'cannot be performed',
        )
    }
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
    const paused = ref(true)
    const currentSecond = ref(0)

    const audioElement = ref<HTMLAudioElement>()

    function initializeAudio() {
        audioElement.value = new Audio()

        audioElement.value.addEventListener('pause', () => {
            paused.value = true
            MediaSession.setPlaybackState({ playbackState: 'paused' })
        })

        audioElement.value.addEventListener('play', () => {
            paused.value = false
            MediaSession.setPlaybackState({ playbackState: 'playing' })
        })

        audioElement.value.addEventListener('timeupdate', async () => {
            if (!audioElement.value) {
                return
            }

            currentSecond.value = audioElement.value.currentTime

            try {
                await MediaSession.setPositionState({
                    duration: secondsDuration.value,
                    position: currentSecond.value,
                })
            } catch (error) {
                console.log('end of track has been reached')
            }
        })

        audioElement.value.addEventListener('ended', () => actionHandlers.playNext())

        MediaSession.setActionHandler({ action: 'nexttrack' }, () =>
            actionHandlers.playNext(),
        )
        MediaSession.setActionHandler({ action: 'previoustrack' }, () =>
            actionHandlers.playPrevious(),
        )

        MediaSession.setActionHandler({ action: 'play' }, () => playAudio())
        MediaSession.setActionHandler({ action: 'pause' }, () => pauseAudio())

        MediaSession.setActionHandler({ action: 'seekto' }, event => {
            if (event.seekTime) {
                rewind(event.seekTime)
            }
        })
    }

    /**
     * Plays audio
     *
     * @throws {AudioNotInitializedError} if audio was not initialized
     */
    function playAudio(src?: string, metadata?: MetadataOptions) {
        if (!audioElement.value) {
            throw new AudioNotInitializedError()
        }

        if (src) {
            audioElement.value.src = src
        }

        if (metadata) {
            MediaSession.setMetadata(metadata)
        }

        audioElement.value.play()
    }

    /**
     * Pauses audio
     *
     * @throws {AudioNotInitializedError} if audio was not initialized
     */
    function pauseAudio() {
        if (!audioElement.value) {
            throw new AudioNotInitializedError()
        }

        audioElement.value.pause()
    }

    /**
     * Rewinds the audio, causing it to resume
     *
     * @throws {AudioNotInitializedError} if audio was not initialized
     */
    function rewind(secondToRewindTo: number) {
        if (!audioElement.value) {
            throw new AudioNotInitializedError()
        }

        audioElement.value.currentTime = secondToRewindTo
        playAudio()
    }

    function setMetadata(metadata: MetadataOptions) {
        MediaSession.setMetadata(metadata)
    }

    return {
        audioElement,
        initializeAudio,

        paused: readonly(paused),
        currentSecond: readonly(currentSecond),

        pauseAudio,
        playAudio,
        rewind,
        setMetadata,
    }
}
