import { onKeyStroke } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/features/player'
import { useNotificationsStore } from '@/shared/model/notifications'

export function usePlayerShortcuts() {
    const playerStore = usePlayerStore()
    const { pause, play, playNextTrack, playPreviousTrack, rewind, setVolume } =
        playerStore
    const { paused, currentSecond, volume } = storeToRefs(playerStore)

    const { showNotification } = useNotificationsStore()

    onKeyStroke(
        ' ',
        event => {
            const inputEventTarget = event.composedPath().find(target => {
                if (
                    target instanceof HTMLInputElement ||
                    target instanceof HTMLTextAreaElement
                ) {
                    return true
                }
            })

            if (inputEventTarget) {
                return
            }

            paused.value ? play() : pause()
            event.preventDefault()
        },
        { dedupe: true, target: document.body },
    )

    onKeyStroke('ArrowRight', async event => {
        if (!event.shiftKey) {
            rewind(currentSecond.value + 5)
            return
        }

        await playNextTrack()
    })

    onKeyStroke('ArrowLeft', async event => {
        if (!event.shiftKey) {
            rewind(currentSecond.value - 5)
            return
        }

        await playPreviousTrack()
    })

    onKeyStroke('ArrowUp', async event => {
        if (!event.shiftKey) {
            return
        }

        setVolume(volume.value + 0.1)

        showNotification(
            'success',
            `Volume set to ${Math.round(volume.value * 100)}%`,
        )
    })

    onKeyStroke('ArrowDown', async event => {
        if (!event.shiftKey) {
            return
        }

        setVolume(volume.value - 0.1)

        showNotification(
            'success',
            `Volume set to ${Math.round(volume.value * 100)}%`,
        )
    })
}
