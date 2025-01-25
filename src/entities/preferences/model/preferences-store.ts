import { defineStore } from 'pinia'

import { useLocalStorageItem } from '@/shared/utils/local-storage'

export const usePreferencesStore = defineStore('preferences', () => {
    const hideDiscoverSectionOnHomePage = useLocalStorageItem(
        'hide-discover-section-on-home-page',
        false,
    )

    return { hideDiscoverSectionOnHomePage }
})
