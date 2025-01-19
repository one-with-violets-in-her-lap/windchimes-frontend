import { useLocalStorage } from '@vueuse/core'
import { onMounted, readonly, watch } from 'vue'

import { usePlayerStore } from '@/features/player'

// for jsdoc

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

    function setVolume(newVolume: number) {
        if (newVolume > 1 || newVolume < 0) {
            console.warn(
                `requested volume change to "${newVolume}" was ignored because` +
                    'the value is invalid',
            )
            return
        }

        volume.value = newVolume
    }

    return { volume: readonly(volume), setVolume }
}
