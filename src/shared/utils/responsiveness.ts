import { useMediaQuery } from '@vueuse/core'

export function useHoverAvailable() {
    return useMediaQuery('(hover: hover)')
}
