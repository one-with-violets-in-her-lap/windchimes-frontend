import type {
    DocumentNode,
    MutationOptions,
    OperationVariables,
} from '@apollo/client/core'
import { useMutation } from '@vue/apollo-composable'

import type { ErrorFragment } from '@/shared/model/graphql-generated-types/graphql'
import { useNotificationsStore } from '@/shared/model/notifications'

export type ExcludeGraphQLError<TResult> = Exclude<
    NonNullable<TResult>,
    ErrorFragment
>

/**
 * Ignores strict `__typename` match checking when casting two graphql generated types
 *
 * Use this **cautiously** in situations when you do not care about __typename field
 *
 * @example
 * interface GraphqlType1 {
 *     __typename: "GraphqlType1",
 *     name: string
 * }
 *
 * interface GraphqlType2 {
 *     __typename: "GraphqlType2",
 *     name: string
 * }
 *
 * const graphqlObject: GraphqlType1 = {
 *     __typename: "GraphqlType1",
 *     name: "object"
 * }
 *
 * console.log(graphqlObject as GraphqlType2) // error, type mismatch on __typename
 *
 * const graphqlObject2: IgnoreTypename<GraphqlType1> = {
 *     name: "object"
 * }
 *
 * console.log(graphqlObject as GraphqlType2) // no error
 */
export type IgnoreTypename<T> = Omit<T, '__typename'>

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
