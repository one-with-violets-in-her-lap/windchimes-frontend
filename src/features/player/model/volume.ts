import { onMounted, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { usePlayerStore } from '@/features/player/model/player-store' // for jsdoc

/**
 * creates reactive volume state for html audio element.
 * **not a global volume state**, use {@link usePlayerStore} to change
 * current player volume
 * @param audio html audio element to bind volume state to
 */
export function usePlayerVolume(audio: HTMLAudioElement) {
    const volume = useLocalStorage('volume', 0.5)

    onMounted(() => {
        updateAudioVolume()
    })

    watch(volume, () => {
        updateAudioVolume()
    })

    function updateAudioVolume() {
        if (isNaN(volume.value)) {
            volume.value = 0.5
        }

        audio.volume = +volume.value
    }

    return { volume }
}
