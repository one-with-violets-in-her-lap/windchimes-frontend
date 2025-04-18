import { onMounted, readonly, watch } from 'vue'

import { usePlayerStore } from '@/features/player'

import { useLocalStorageItem } from '@/shared/utils/local-storage'

/**
 * Creates reactive volume state bound to local storage
 * 
 * **This is not a global volume state**, use {@link usePlayerStore} to change
 * current player volume
 */
export function usePlayerVolume() {
    const volume = useLocalStorageItem('volume', 0.5)

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
    }

    function setVolume(newVolume: number) {
        if (newVolume > 1 || newVolume < 0) {
            console.warn(
                `Requested volume change to "${newVolume}" was ignored because` +
                    'the value is invalid',
            )
            return
        }

        volume.value = newVolume
    }

    return { volume: readonly(volume), setVolume }
}
