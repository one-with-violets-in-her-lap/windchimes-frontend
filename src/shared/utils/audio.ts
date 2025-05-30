import { MediaSession, MetadataOptions } from '@jofr/capacitor-media-session'
import { useEventListener } from '@vueuse/core'
import Hls from 'hls.js'
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
 * Creates a reactive playback state that is bound to html audio
 *
 * **Audio needs to be initialized with `initializeAudio` function**
 *
 * The {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaSession|media session}
 * is also synchronized
 */
export function useAudio(
    secondsDuration: Ref<number | undefined>,
    actionHandlers: AudioActionHandlers,
) {
    const paused = ref(true)
    const currentSecond = ref(0)

    const audioElement = ref<HTMLAudioElement>()
    const hlsPlayer = new Hls()
    const mediaLoadError = ref<string | null>()

    useEventListener(audioElement, 'pause', () => {
        paused.value = true
        MediaSession.setPlaybackState({ playbackState: 'paused' })
    })

    useEventListener(audioElement, 'play', () => {
        paused.value = false
        MediaSession.setPlaybackState({ playbackState: 'playing' })
    })

    useEventListener(audioElement, 'timeupdate', async () => {
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

    useEventListener(audioElement, 'ended', () => actionHandlers.playNext())

    useEventListener(
        audioElement,
        'error',
        event => (mediaLoadError.value = `${event.error}`),
    )

    function initializeAudio() {
        audioElement.value = new Audio()

        hlsPlayer.on(
            Hls.Events.ERROR,
            (_, error) =>
                (mediaLoadError.value = `HLS audio error: ${error.details}`),
        )

        MediaSession.setActionHandler(
            { action: 'nexttrack' },
            actionHandlers.playNext,
        )
        MediaSession.setActionHandler(
            { action: 'previoustrack' },
            actionHandlers.playPrevious,
        )

        MediaSession.setActionHandler({ action: 'play' }, () => playAudio())
        MediaSession.setActionHandler({ action: 'pause' }, pauseAudio)

        MediaSession.setActionHandler({ action: 'seekto' }, event => {
            if (event.seekTime) {
                rewind(event.seekTime)
            }
        })
    }

    function destroyAudio() {
        // TODO: reset playback state (e.g. paused, currentSecond)

        if (!audioElement.value) {
            throw new AudioNotInitializedError()
        }

        hlsPlayer.detachMedia()

        audioElement.value = undefined
    }

    /**
     * Plays audio and updates
     * [media session](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession)
     *
     * If `src` is not specified, it just resumes the playback
     *
     * Supports
     * [**HLS**](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Live_streaming_web_audio_and_video)
     *
     * @param metadata Track metadata to set for media session
     *
     * @throws {AudioNotInitializedError} if audio was not initialized
     */
    function playAudio(
        src?: string,
        metadata?: MetadataOptions,
        { playAsHls }: { playAsHls: boolean } = { playAsHls: false },
    ) {
        if (!audioElement.value) {
            throw new AudioNotInitializedError()
        }

        mediaLoadError.value = null

        if (src) {
            audioElement.value.currentTime = 0

            if (playAsHls) {
                hlsPlayer.attachMedia(audioElement.value)
                hlsPlayer.loadSource(src)
            } else {
                hlsPlayer.detachMedia()
                audioElement.value.src = src
            }
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
        destroyAudio,
        mediaLoadError,

        paused: readonly(paused),
        currentSecond: readonly(currentSecond),

        pauseAudio,
        playAudio,
        rewind,
        setMetadata,
    }
}
