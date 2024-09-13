import { useNotificationsStore } from '@/shared/model/notifications'
import { DocumentNode, OperationVariables, MutationOptions } from '@apollo/client/core'
import { useMutation } from '@vue/apollo-composable'

export function useMutationWithErrorNotification<
    TResult = any,
    TVariables extends OperationVariables = any,
>(document: DocumentNode, options?: Partial<MutationOptions<TResult, TVariables>>) {
    const { showNotification } = useNotificationsStore()

    const mutation = useMutation<TResult, TVariables>(document, options)
    mutation.onError(error => {
        showNotification('error', `Unexpected error: "${error.message}"`)
    })

    return mutation
}
