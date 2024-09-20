import { onKeyStroke } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/features/player'

export function usePlayerShortcuts() {
    const playerStore = usePlayerStore()
    const { pause, play, playNextTrack, playPreviousTrack, rewind } = playerStore
    const { paused, currentSecond, volume } = storeToRefs(playerStore)

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

        volume.value += 0.1
    })

    onKeyStroke('ArrowDown', async event => {
        if (!event.shiftKey) {
            return
        }

        volume.value -= 0.1
    })
}
