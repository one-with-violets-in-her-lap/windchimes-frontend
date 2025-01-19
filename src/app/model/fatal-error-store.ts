import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

import { FatalError } from '@/shared/model/errors'

export const useFatalErrorStore = defineStore('authDialogOpened', () => {
    const error = ref<FatalError>()

    function handleError(capturedError: unknown) {
        if (capturedError instanceof FatalError) {
            error.value = capturedError
        } else {
            console.error(capturedError)
        }
    }

    function clearError() {
        error.value = undefined
    }

    return { error: readonly(error), handleError, clearError }
})
