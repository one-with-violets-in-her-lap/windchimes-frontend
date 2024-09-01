import { onKeyStroke } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/features/player/model/player-store'

export function usePlayerShortcuts() {
    const playerStore = usePlayerStore()
    const { pause, play, playNextTrack, playPreviousTrack } = playerStore
    const { paused } = storeToRefs(playerStore)

    onKeyStroke(' ', (event) => {
        paused.value ? play() : pause()
        event.preventDefault()
    })

    onKeyStroke('ArrowRight', async event => {
        if (!event.shiftKey) {
            return
        }
        
        try {
            await playNextTrack()
        }
        catch(error) {
            console.error(error)
        }
    })

    onKeyStroke('ArrowLeft', async event => {
        if (!event.shiftKey) {
            return
        }
        
        try {
            await playPreviousTrack()
        }
        catch(error) {
            console.error(error)
        }
    })
}
