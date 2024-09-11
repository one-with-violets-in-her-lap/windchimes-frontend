import { onKeyStroke } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/features/player/model/player-store'

export function usePlayerShortcuts() {
    const playerStore = usePlayerStore()
    const { pause, play, playNextTrack, playPreviousTrack, rewind } = playerStore
    const { paused, currentSecond } = storeToRefs(playerStore)

    onKeyStroke(' ', event => {
        paused.value ? play() : pause()
        event.preventDefault()
    })

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
}
