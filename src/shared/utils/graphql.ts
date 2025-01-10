import type {
    DocumentNode,
    MutationOptions,
    OperationVariables,
} from '@apollo/client/core'
import { useMutation } from '@vue/apollo-composable'
import type { GraphQlApiError } from '@/shared/model/graphql-generated-types/graphql'
import { useNotificationsStore } from '@/shared/model/notifications'

export type ExcludeGraphQLError<TResult> = Exclude<NonNullable<TResult>, GraphQlApiError>

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
