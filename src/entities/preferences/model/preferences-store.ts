import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

const LOCAL_STORAGE_KEYS_PREFIX = 'windchimes'

export const usePreferencesStore = defineStore('preferences', () => {
    const hideDiscoverSectionOnHomePage = useLocalStorage(
        `${LOCAL_STORAGE_KEYS_PREFIX}-hide-discover-section-on-home-page`,
        false,
    )

    return { hideDiscoverSectionOnHomePage }
})
