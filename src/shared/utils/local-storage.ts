import { UseStorageOptions, useLocalStorage } from '@vueuse/core'

const LOCAL_STORAGE_KEYS_PREFIX = 'windchimes-'

/**
 * Creates reactive variable that is bound to a local storage item
 *
 * **Appends `windchimes-` prefix to specified key as a namespace**
 *
 * Uses {@link useLocalStorage} from vueuse under the hood
 */
export function useLocalStorageItem<TValue>(
    key: string,
    initialValue: TValue,
    options?: UseStorageOptions<TValue>,
) {
    return useLocalStorage(LOCAL_STORAGE_KEYS_PREFIX + key, initialValue, options)
}
