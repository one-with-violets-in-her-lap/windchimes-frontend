import { ref } from 'vue'
import { defineStore } from 'pinia'
import { FatalError } from '@/shared/model/fatal-error'

export const useFatalErrorStore = defineStore('authDialogOpened', () => {
    const error = ref<FatalError>()

    function handleError(capturedError: unknown) {
        if (capturedError instanceof FatalError) {
            error.value = capturedError
        } else {
            console.error(capturedError)
        }
    }

    return { error, handleError }
})
