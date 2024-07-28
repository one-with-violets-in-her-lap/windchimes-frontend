import { ref } from 'vue'
import { defineStore } from 'pinia'
import { AppError } from '@/shared/model/app-error'

export const useAppErrorStore = defineStore('authDialogOpened', () => {
    const error = ref<AppError>()

    function handleError(capturedError: unknown) {
        if (capturedError instanceof AppError) {
            error.value = capturedError
        } else {
            error.value = new AppError(
                'unexpected-error',
                `An unexpected error occurred: '${capturedError}'`,
            )
        }
    }

    return { error, handleError }
})
